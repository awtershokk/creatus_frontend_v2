import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import {Controller} from "../../models/Controller.tsx";
import {fetchControllers} from "../../api/controllerApi.ts";

const ControllerPage = () => {
    const [controllers, setContollers] = useState<Controller[]>([]);
    localStorage.setItem('controllers', JSON.stringify({ label: 'Контроллеры', icon: 'FaMicrochip' }));

    useEffect(() => {
        const getData = async () => {
            try {
                const controllersData = await fetchControllers();
                setContollers(controllersData);

            } catch (error) {
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
    </DefaultLayout>
);
};

export default ControllerPage;
