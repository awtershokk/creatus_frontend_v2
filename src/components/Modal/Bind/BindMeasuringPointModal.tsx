import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate.tsx';
import {bindDeviceFromMP} from '../../../api/requests/deviceApi.ts';
import {fetchMeasuringPointsWithoutDevice} from "../../../api/requests/measuringPointApi.ts";


interface BindDeviceModalProps {
    deviceId: number;
    deviceLabel: string;
    measuringPointId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const BindMeasuringPointModal: React.FC<BindDeviceModalProps> = ({ deviceId, deviceLabel, measuringPointId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [measuringPoints, setMeasuringPoints] = useState<any[]>([]);
    const [selectedMeasuringPointId, setSelectedMeasuringPointId] = useState<string, number>("");

    useEffect(() => {
        const fetchMeasuringPoints = async () => {
            try {
                const points = await fetchMeasuringPointsWithoutDevice();
                setMeasuringPoints(points);
            } catch (error) {
                console.error('Ошибка при получении точек измерения:', error);
            }
        };

        fetchMeasuringPoints();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await bindDeviceFromMP(selectedMeasuringPointId, deviceId);
            onSuccess();
        } catch (error) {
            console.error(`Ошибка при привязке устройства ${deviceLabel}:`, error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <ModalTemplate
            headerTitle="Подтвердите привязку"
            buttonLabel="Привязать"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <p className="text-black">
                Привязка датчика <b>{deviceLabel}</b> к точке измерения
            </p>
            <p className="text-black">Выбор точки измерения:</p>
            <select
                value={selectedMeasuringPointId}
                onChange={(e) => setSelectedMeasuringPointId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            >
                <option value="" disabled>
                    Выберите точку измерения
                </option>
                {measuringPoints.map(point => (
                    <option key={point.id} value={point.id}>
                        {point.label} ({point.roomLabel})
                    </option>
                ))}
            </select>
        </ModalTemplate>
    );
}
export default BindMeasuringPointModal;
