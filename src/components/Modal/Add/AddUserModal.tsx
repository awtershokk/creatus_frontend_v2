import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface AddUserModalProps {
    onClose: () => void;
    onSubmit: (user: { username: string; password: string; role: string }) => void;
}

interface Role {
    id: string;
    label: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        fullName: '',
        role: ''
    });
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/user/list/roles');
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных с сервера');
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { username: '', password: '', fullName: '', role: '' };

        if (!formData.username) {
            newErrors.username = 'Логин обязателен';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
            isValid = false;
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Имя пользователя обязательно';
            isValid = false;
        }

        if (!formData.role) {
            newErrors.role = 'Выберите роль';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Добавленный пользователь:', formData);
            onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    return (
        <ModalTemplate
            headerTitle="Создать пользователя"
            buttonLabel="Добавить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Логин
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Имя пользователя
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Пароль
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={passwordVisible ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {passwordVisible ? <FaRegEyeSlash className="text-gray-500" /> : <FaRegEye className="text-gray-500" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Роль
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white ${errors.role ? 'border-red-500' : ''}`}
                    >
                        <option value="">Выберите роль</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddUserModal;
