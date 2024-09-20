import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import {Controller} from "../../models/Controller.tsx";
import {fetchControllers} from "../../api/controllerApi.ts";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";

const ControllerPage = () => {
    const [controllers, setContollers] = useState<Controller[]>([]);


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const controllersData = await fetchControllers();
                setContollers(controllersData);
                setIsLoading(false);

                const dispatch = useDispatch();
                dispatch(setBreadcrumb({
                    key: 'controllers',
                    label:'Контроллеры',
                    icon: 'FaMicrochip',
                }));

            } catch (error) {
                setIsLoading(false);
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    const headers = {
        'Наименование': 'label',
        'URL адрес': 'url',
        'Порт': 'port',
        'Тепловой контур': 'thermalCircuit',
        'Тип ECL': 'ecl_type',
        'Параметры': 'settings',
        'Расписание': 'schedule',
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
            <div className="">
        <div className="">
        <div className="flex items-center mb-2">
        <Label text="Контроллеры"/>
            </div>
            </div>
            <ItemTable
    data={controllers}
    headers={headers}
    tableStyles = 'table-auto border-collapse'

    />
    </div>
                )}
    </DefaultLayout>
);
};

export default ControllerPage;
