import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate.tsx';
import { bindDeviceFromMP } from '../../../api/deviceApi.ts';
import { fetchDevicesWithoutMP } from '../../../api/deviceApi.ts'; // Используем существующую функцию

interface BindDeviceModalProps {
    measuringPointId: number;
    measuringPointLabel: string;
    onClose: () => void;
    onSuccess: () => void;
}

const BindDeviceModal: React.FC<BindDeviceModalProps> = ({ measuringPointId, measuringPointLabel, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [deviceOptions, setDeviceOptions] = useState<any[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const devices = await fetchDevicesWithoutMP();
                setDeviceOptions(devices);
            } catch (error) {
                console.error('Ошибка при получении устройств без точки измерения:', error);
            }
        };

        fetchDevices();
    }, []);

    const handleSubmit = async () => {
        if (selectedDeviceId === null) {
            return;
        }
        setLoading(true);
        try {
            await bindDeviceFromMP(selectedDeviceId, measuringPointId);
            onSuccess();
        } catch (error) {
            console.error('Ошибка при привязке устройства', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <ModalTemplate
            headerTitle="Подтвердите привязку устройства"
            buttonLabel="Привязать"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <p className="text-black">
                Привязка устройства к точке измерения <b>{measuringPointLabel}</b>
            </p>
            <p className="text-black">Выбор устройства:</p>
            <select
                value={selectedDeviceId ?? ''}
                onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
            >
                <option value="">Выберите устройство...</option>
                {deviceOptions.map(device => (
                    <option key={device.id} value={device.id}>
                        {device.label}
                    </option>
                ))}
            </select>
        </ModalTemplate>
    );
};

export default BindDeviceModal;
