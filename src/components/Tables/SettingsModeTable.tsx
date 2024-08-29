import React, { useState, useEffect } from 'react';
import ItemTable from './ItemTable';

interface DeviceInfo {
    id: string;
    label: string;
    model: string;
    sernom: string;
}

const SettingsModeTable: React.FC = () => {
    const [devicesInfo, setDevicesInfo] = useState<DeviceInfo[]>([]);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/device');
                console.log('Успешная отправка запроса на получение девайсов...');
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных с сервера');
                }
                const data = await response.json();

                const selectedData = data.data.map((item: any) => ({
                    id: item.id,
                    label: item.label,
                    model: item.vendor,
                    sernom: item.topic,
                }));
                setDevicesInfo(selectedData);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const interval = setInterval(fetchDevices, 1000);

        return () => clearInterval(interval);
    }, []);
    const headers = {
        '№': 'id',
        'Наименование': 'label',
        'Модель': 'model',
        'Серийный номер': 'sernom',

    };
    return (
        <div className="w-full mx-auto">
            <ItemTable
                headers={headers}
                data={devicesInfo}
                tableTitle="Устройства"
                buttonLabel="Добавить"

                rowStyles="border-b"
                cellStyles="p-2 border text-white"
            />
        </div>
    );
};

export default SettingsModeTable;
