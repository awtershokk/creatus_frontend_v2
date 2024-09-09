import { useState, useEffect } from 'react';
import ItemTable from './ItemTable';
import {Device} from "../../models/Device.tsx";
import {fetchDevicesSetiingsMode} from "../../api/deviceApi.ts";


const SettingsModeTable = () => {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const devicesData = await fetchDevicesSetiingsMode();
                setDevices(devicesData);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    const headers = {
        'Наименование': 'label',
        'Модель': 'model',
        'Сер. номер': 'sernom',
    };
    return (
        <div className="w-full mx-auto">
            <ItemTable
                headers={headers}
                data={devices}
                tableTitle="Устройства"
                rowStyles="border-b"
                cellStyles="p-2 border text-white"
            />
        </div>
    );
};

export default SettingsModeTable;
