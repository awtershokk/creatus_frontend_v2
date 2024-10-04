import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate.tsx';
import { unbindDeviceFromMP } from '../../../api/requests/deviceApi.ts';
import {toast} from "react-toastify";

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
            toast.success('Точка измерения успешно отвязана от датчика.');
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
            buttonLabel="Отвязать (Удерживать)"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            deleteMode={true}
            buttonStyles="px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md transition relative overflow-hidden"
            progressStyles="absolute top-0 left-0 h-full bg-gray-400 opacity-50"
        >
            <p className="text-black">
                Вы действительно хотите отвязать датчик <b>{deviceLabel}</b> от точки измерения <b>{measuringPointLabel}</b>?
            </p>
        </ModalTemplate>
    );
};

export default UnbindDeviceModal;
