import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate.tsx';

interface ResponsiblePerson {
    position: string;
    type: string;
    name: string;
    phone: string;
    email: string;
}

interface AddResponsiblePersonModalProps {
    onClose: () => void;
    onSubmit: (person: ResponsiblePerson) => void;
}

const AddResponsiblePersonModal: React.FC<AddResponsiblePersonModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState<ResponsiblePerson>({
        position: '',
        type: '',
        name: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{11}$/;
        const namePattern = /^[A-Za-zА-Яа-я\s]+$/;

        if (!formData.email || !emailPattern.test(formData.email)) {
            newErrors.email = 'Неверный формат email.';
        }

        if (!formData.phone || !phonePattern.test(formData.phone)) {
            newErrors.phone = 'Телефон должен содержать 11 цифр.';
        }

        if (!formData.name || !namePattern.test(formData.name)) {
            newErrors.name = 'ФИО может содержать только буквы и пробелы.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('Новое ответственное лицо:', formData);

            onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавление ответсвенного лица"
            buttonLabel="Добавить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Должность
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Тип
                    </label>
                    <input
                        id="type"
                        name="type"
                        type="text"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        ФИО
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Телефон
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="8XXXXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-mail
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddResponsiblePersonModal;
