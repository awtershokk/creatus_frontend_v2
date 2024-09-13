import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import {Controller} from "../../models/Controller.tsx";
import {fetchControllers} from "../../api/controllerApi.ts";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";

const ControllerPage = () => {
    const [controllers, setContollers] = useState<Controller[]>([]);
    localStorage.setItem('controllers', JSON.stringify({ label: 'Контроллеры', icon: 'FaMicrochip' }));

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const controllersData = await fetchControllers();
                setContollers(controllersData);
                setIsLoading(false);

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
        <div className="flex items-center">
        <Label text="Контроллеры"/>
            </div>
            </div>
            <ItemTable
    data={controllers}
    headers={headers}

    />
    </div>
                )}
    </DefaultLayout>
);
};

export default ControllerPage;
