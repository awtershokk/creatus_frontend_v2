import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { Controller } from "../../models/Controller.tsx";
import { fetchControllers } from "../../api/requests/controllerApi.ts";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice.ts";
import {formatDateTime} from "../../utils/formatDateTime.ts";

const ControllerPage = () => {
    const [controllers, setControllers] = useState<Controller[]>([]);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const checkIfOffline = (lastActive: string): boolean => {
        const currentTime = Date.now();
        const lastActiveTime = parseInt(lastActive, 10);
        const timeDifferenceInMinutes = (currentTime - lastActiveTime) / 1000 / 60;
        return timeDifferenceInMinutes > 3; // Если разница больше 3 минут, то оффлайн
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const controllersData = await fetchControllers();

                const updatedControllers = controllersData.map(controller => {
                    const isOffline = checkIfOffline(controller.url);
                    const { date, time } = formatDateTime(controller.url);
                    return {
                        ...controller,
                        url: `${date} ${time}`,
                        status: isOffline ? "Оффлайн" : "Онлайн",
                    };
                });

                setControllers(updatedControllers);
                setIsLoading(false);

            } catch (error) {
                setIsLoading(false);
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    dispatch(setBreadcrumb({
        key: 'controllers',
        label: 'Контроллеры',
        icon: 'FaMicrochip',
    }));

    const headers = {
        'Наименование': 'label',
        'Тепловой контур': 'thermalCircuit',
        'Тип ECL': 'ecl_type',
        'Параметры': 'settings',
        'Статус': 'status',
        'Последнее время записи': 'url',
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="">
                    <div className="">
                        <div className="flex items-center mb-2">
                            <Label text="Контроллеры" />
                        </div>
                    </div>
                    <ItemTable
                        data={controllers}
                        headers={headers}
                        tableStyles='table-auto border-collapse'
                    />
                </div>
            )}
        </DefaultLayout>
    );
};

export default ControllerPage;
