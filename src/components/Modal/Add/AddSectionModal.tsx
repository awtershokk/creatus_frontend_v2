import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate';

interface AddSectionModalProps {
    onClose: () => void;
    onSubmit: (section: { name: string; area: number; volume: number }) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        volume: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({}); // Clear previous errors

        const { name, area, volume } = formData;
        const newErrors: { [key: string]: string } = {};

        // Validate form data
        if (!name.trim()) {
            newErrors.name = 'Название не может быть пустым.';
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

            await new Promise(resolve => setTimeout(resolve, 100));

            const section = {
                name,
                area: areaNumber,
                volume: volumeNumber
            };

            console.log('Добавлена секция:', section);
            onSubmit(section);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении секции:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавить секцию"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Название
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Площадь
                    </label>
                    <input
                        id="area"
                        name="area"
                        type="number"
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
                        name="volume"
                        type="number"
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
