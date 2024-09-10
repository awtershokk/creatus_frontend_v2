import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate.tsx';
import { unbindDeviceFromMP } from '../../../api/deviceApi.ts';

interface UnbindDeviceModalProps {
    deviceId: number;
    deviceLabel: string;
    measuringPointLabel: string;
    onClose: () => void;
    onSuccess: () => void;
}

const UnbindDeviceModal: React.FC<UnbindDeviceModalProps> = ({ deviceId, deviceLabel, measuringPointLabel, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await unbindDeviceFromMP(deviceId);
            onSuccess();
        } catch (error) {
            console.error(`Ошибка при отвязке устройства ${deviceLabel}:`, error);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <ModalTemplate
            headerTitle="Подтвердите отвязку"
            buttonLabel="Отвязать"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <p className="text-black">
                Вы действительно хотите отвязать датчик <b>{deviceLabel}</b> от точки измерения <b>{measuringPointLabel}</b>?
            </p>
        </ModalTemplate>
    );
};

export default UnbindDeviceModal;
