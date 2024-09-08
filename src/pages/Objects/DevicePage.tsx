import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import {Device} from "../../models/Device.tsx";
import {fetchDevices} from "../../api/deviceApi.ts";

const DevicePage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    localStorage.setItem('devices', JSON.stringify({ label: 'Датчики', icon: 'FaBug' }));

    useEffect(() => {
        const getData = async () => {
            try {
                const devicesData = await fetchDevices(handleEditDeviceClick, handleDeleteDeviceClick);
                setDevices(devicesData);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    const headers = {
        'Наименование': 'label',
        'Статус': 'active',
        'Модель': 'model',
        'Сер. номер': 'sernom',
        'Помещение': 'room',
        'ТИ': 'measuringPoint',
        'Заряд': 'battery',
        'Качество сигнала': 'linkquality',
        ' ': 'edit',
        '  ': 'delete'
    };

    const handleEditDeviceClick = (item: Device) => {
        console.log('Edit device:', item);
    };

    const handleDeleteDeviceClick = (item: Device) => {
        console.log('Delete device:', item);
    };

    return (
        <DefaultLayout>
            <div className="">
                <div className="">
                    <div className="flex items-center">
                        <Label text="Датчики"/>
                    </div>
                </div>
                <ItemTable
                    data={devices}
                    headers={headers}
                />
            </div>
        </DefaultLayout>
    );
};

export default DevicePage;
