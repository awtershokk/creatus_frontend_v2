import React, { useEffect, useState } from 'react';
import ModalTemplate from './ModalTemplate';
import ItemTable from "../Tables/ItemTable.tsx";
import { fetchDevicesStatistic} from "../../api/requests/deviceApi.ts";
import LoadingSpinner from "../Menu/LoadingSpinner.tsx";
import TableContainer from "../../layouts/TableContainer.tsx";

interface DeviceStatisticyModalProps {
    deviceName: string;
    deviceId: number;
    onClose: () => void;
}

const DeviceStatisticModal: React.FC<DeviceStatisticyModalProps> = ({ deviceName, deviceId, onClose }) => {
    const [deviceHistory, setDeviceHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Заряд батареи': 'battery',
        'Вольтаж': 'voltage',
        'Качество сигнала(LQI)': 'linkquality',

    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchDevicesStatistic(deviceId);
                setDeviceHistory(data);
            } catch (err) {
                setError('Не удалось загрузить данные');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [deviceId]);

    const handleSubmit = () => {

        onClose();
    };

    return (
        <ModalTemplate
            headerTitle={`История изменений: ${deviceName}`}
            wight = 'max-w-[700px]'
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            {loading ? (
                <LoadingSpinner/>
            ) : error ? (
                <p className="text-red-500">{"Ошибка"}</p>
            ) : (
                <TableContainer>
                    <ItemTable
                        headers={headers}
                        data={deviceHistory} />
                </TableContainer>

            )}
        </ModalTemplate>
    );
};

export default DeviceStatisticModal;
