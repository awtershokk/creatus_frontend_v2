import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';

import {reverseTransformSectionData, Section} from '../../../models/Section.ts';
import { updateSection } from '../../../api/sectionApi.ts';

interface EditSectionModalProps {
    sectionId: number;
    section: Section;
    onClose: () => void;
    onUpdate: (updatedDevice: { id: string; label: string; area: number; volume: number }) => (updatedSection: Section) => void;
}

const EditSectionModal: React.FC<EditSectionModalProps> = ({ sectionId, section, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Section>(section);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        console.log('formdata',formData)
        const reverse = reverseTransformSectionData(section);
        setFormData(reverse);
    }, [section]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        try {
            const newErrors: { [key: string]: string } = {};

            if (!formData.label || formData.label.trim() === '') {
                newErrors.label = 'Наименование не должно быть пустым.';
            }

            if (!formData.area || formData.area <=0 ) {
                newErrors.area = 'Площадь не должна быть пустой, быть равной нулю или иметь отрицательное значение.';
            }
            if (!formData.volume || formData.volume <=0 ) {
                newErrors.volume = 'Объем не должен быть пустым, быть равным нулю или иметь отрицательное значение.';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            const updatedSectionData = {
                id: sectionId,
                label: formData.label,
                area: formData.area,
                volume: formData.volume,
            };

            const updatedSection = await updateSection(sectionId, updatedSectionData);
            onUpdate(updatedSection);
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении секции:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактировать наименование секции"
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
                        value={formData.label || ''}
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
                        name="area"
                        type="number"
                        value={formData.area || ''}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                </div>
                <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                        Объём
                    </label>
                    <input
                        id="volume"
                        name="volume"
                        type="number"
                        value={formData.volume || ''}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.volume ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.volume && <p className="text-red-500 text-sm">{errors.volume}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default EditSectionModal;
