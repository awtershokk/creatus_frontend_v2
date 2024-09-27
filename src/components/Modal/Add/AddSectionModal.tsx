import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate';
import { createSection } from '../../../api/requests/sectionApi.ts';

interface AddSectionModalProps {
    onClose: () => void;
    onSubmit: (section: { label: string; area: number; volume: number }) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        label: '',
        area: '',
        volume: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const { label, area, volume } = formData;
        const newErrors: { [key: string]: string } = {};

        if (!label.trim()) {
            newErrors.label = 'Название не может быть пустым.';
        }

        const areaNumber = parseFloat(area);
        const volumeNumber = parseFloat(volume);

        if (!area.trim()) {
            newErrors.area = 'Площадь не может быть пустой.';
        } else if (areaNumber <= 0) {
            newErrors.area = 'Площадь должна быть больше нуля.';
        }

        if (!volume.trim()) {
            newErrors.volume = 'Объем не может быть пустым.';
        } else if (volumeNumber <= 0) {
            newErrors.volume = 'Объем должен быть больше нуля.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const section = {
                label,
                area: areaNumber,
                volume: volumeNumber
            };

            const response = await createSection(section);


            onSubmit(response);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении секции:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Создать секцию"
            buttonLabel="Добавить"
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
                        type="text"
                        placeholder="Введите наименование"
                        value={formData.label}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
                </div>
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Площадь
                    </label>
                    <input
                        id="area"
                        type="number"
                        placeholder="Введите площадь"
                        value={formData.area}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                </div>
                <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                        Объем
                    </label>
                    <input
                        id="volume"
                        type="number"
                        placeholder="Введите объем"
                        value={formData.volume}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.volume ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.volume && <p className="text-red-500 text-sm">{errors.volume}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddSectionModal;
