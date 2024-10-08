import React, { useEffect, useState } from 'react';
import ModalTemplate from './ModalTemplate';
import ItemTable from "../Tables/ItemTable.tsx";
import { fetchDevicesLastMeasuring, fetchDevicesStatistic } from "../../api/requests/deviceApi.ts";
import LoadingSpinner from "../Menu/LoadingSpinner.tsx";
import TableContainer from "../../layouts/TableContainer.tsx";
import { RiWaterPercentFill } from "react-icons/ri";
import { FaTemperatureFull } from "react-icons/fa6";

interface DeviceStatisticyModalProps {
    deviceName: string;
    deviceId: number;
    onClose: () => void;
}

const DeviceStatisticModal: React.FC<DeviceStatisticyModalProps> = ({ deviceName, deviceId, onClose }) => {
    const [deviceHistory, setDeviceHistory] = useState<any[]>([]);
    const [deviceMeasuring, setDeviceMeasuring] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Заряд батареи': 'battery',
        'Качество сигнала(LQI)': 'linkquality',
    };

    useEffect(() => {
        loadDataForStatistic();
        loadDataForMeasuring();
    }, [deviceId]);

    const loadDataForStatistic = async () => {
        try {
            const data = await fetchDevicesStatistic(deviceId);
            setDeviceHistory(data);
        } catch (err) {
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const loadDataForMeasuring = async () => {
        try {
            const data = await fetchDevicesLastMeasuring(deviceId);
            setDeviceMeasuring(data);
            console.log('data', data);
        } catch (err) {
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        onClose();
    };



    const temperature = deviceMeasuring.temperature;
    const humidity = deviceMeasuring.humidity;
    const date = deviceMeasuring.date;

    return (
        <ModalTemplate
            headerTitle={`История изменений: ${deviceName}`}
            wight='max-w-[570px]'
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-red-500">{"Ошибка"}</p>
            ) : (
                <>
                    <div>
                        <p className="text-center mb-2 text-lg text-black">Измерения от: {date ? date : 'N/A'}</p>
                        <div className="mb-4 flex justify-between">

                            {/* Temperature Square */}
                            <div className="flex flex-col items-center w-full mx-2">
                                <div className="bg-yellow-200 p-4 rounded-lg shadow-lg flex items-center justify-center w-full">
                                    <FaTemperatureFull className="text-2xl mr-2 text-gray-800" />
                                    <div className="text-center text-gray-800">
                                        <p className="font-bold">{temperature ? `${temperature} °C` : 'N/A'}</p>
                                        <p className="text-sm">Температура</p>
                                    </div>
                                </div>
                            </div>

                            {/* Humidity Square */}
                            <div className="flex flex-col items-center w-full mx-2">
                                <div className="bg-teal-200 p-4 rounded-lg shadow-lg flex items-center justify-center w-full">
                                    <RiWaterPercentFill className="text-2xl mr-2 text-gray-800" />
                                    <div className="text-center text-gray-800">
                                        <p className="font-bold">{humidity ? `${humidity} %` : 'N/A'}</p>
                                        <p className="text-sm">Влажность</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <TableContainer>
                        <ItemTable
                            headers={headers}
                            data={deviceHistory}/>
                    </TableContainer>
                </>
            )}
        </ModalTemplate>
    );
};

export default DeviceStatisticModal;
