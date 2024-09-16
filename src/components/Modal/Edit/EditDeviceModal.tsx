import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { Device } from '../../../models/Device.tsx';

interface EditDeviceModalProps {
    device: Device;
    onClose: () => void;
    onSave: (updatedDevice: { id: string; label: string }) => (updatedDevice: Device) => void;
}

const EditDeviceModal: React.FC<EditDeviceModalProps> = ({ device, onClose, onSave }) => {
    const [formData, setFormData] = useState<Device>(device);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setFormData(device);
    }, [device]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        try {
            const newErrors: { [key: string]: string } = {};

            if (!formData.label.trim()) {
                newErrors.label = 'Наименование не должно быть пустым.';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }


            await new Promise(resolve => setTimeout(resolve, 100));

            const updatedDevice = {
                id: formData.id,
                label: formData.label
            };
            console.log('Обновлен датчик:', updatedDevice);
            onSave(updatedDevice);
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении датчика:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактировать наименование датчика"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                        Наименование
                    </label>
                    <input
                        id="label"
                        name="label"
                        type="text"
                        value={formData.label}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default EditDeviceModal;
