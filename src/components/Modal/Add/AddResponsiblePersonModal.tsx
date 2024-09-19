import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ModalTemplate from '../ModalTemplate.tsx';
import CustomCheckbox from "../../Buttons/CheckBox.tsx";

interface ResponsiblePerson {
    position: string;
    type: string;
    name: string;
    phone: string;
    email: string;
}

interface Option {
    label: string;
    value: string;
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
    const [responsibleTypes, setResponsibleTypes] = useState<Option[]>([]);

    const [heatContour, setHeatContour] = useState({
        contour1: false,
        contour2: false
    });

    const [incidentTypes, setIncidentTypes] = useState({
        'Датчик': { 'Д.1': false, 'Д.2': false, 'Д.3': false },
        'Точка измерения': { 'Т.1': false, 'Т.2': false },
        'Помещение': { 'П.1': false, 'П.2': false }
    });

    const [notifyStatusChange, setNotifyStatusChange] = useState(false);

    const [openSections, setOpenSections] = useState({
        heatContours: false,
        incidentTypes: false,
        statusChange: false
    });

    const [openIncidentSubmenus, setOpenIncidentSubmenus] = useState({
        'Датчик': false,
        'Точка измерения': false,
        'Помещение': false
    });

    const [selectAllNotifications, setSelectAllNotifications] = useState(false); // Global select all notifications
    const [selectAllHeatContours, setSelectAllHeatContours] = useState(false); // Global select all heat contours
    const [selectAllIncidentTypes, setSelectAllIncidentTypes] = useState(false); // Global select all incident types

    useEffect(() => {
        fetch('http://localhost:5001/api/building/list/types')
            .then(response => response.json())
            .then(data => {
                const options = data.map((item: any) => ({
                    label: item.label,
                    value: item.id
                }));
                setResponsibleTypes(options);
            })
            .catch(error => console.error('Ошибка при загрузке типов:', error));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCheckboxChange = (section: string, field: string, parent?: string) => {
        if (parent) {
            setIncidentTypes(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [field]: !prevState[parent][field]
                }
            }));
        } else if (section === 'heatContours') {
            setHeatContour(prevState => ({
                ...prevState,
                [field]: !prevState[field]
            }));
        }
    };

    const toggleSection = (section: string) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };

    const toggleIncidentSubmenu = (type: string) => {
        setOpenIncidentSubmenus(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    };

    // Для всех уведомлений
    const handleSelectAllNotifications = () => {
        const newSelection = !selectAllNotifications;
        setSelectAllNotifications(newSelection);
        setHeatContour({
            contour1: newSelection,
            contour2: newSelection
        });
        setIncidentTypes({
            'Датчик': { 'Д.1': newSelection, 'Д.2': newSelection, 'Д.3': newSelection },
            'Точка измерения': { 'Т.1': newSelection, 'Т.2': newSelection },
            'Помещение': { 'П.1': newSelection, 'П.2': newSelection }
        });
        setNotifyStatusChange(newSelection);
        setSelectAllHeatContours(newSelection);
        setSelectAllIncidentTypes(newSelection);
    };

    // Для тепловых контуров
    const handleSelectAllHeatContours = () => {
        const newSelection = !selectAllHeatContours;
        setSelectAllHeatContours(newSelection);
        setHeatContour({
            contour1: newSelection,
            contour2: newSelection
        });
    };

    // Для всех типов
    const handleSelectAllIncidentTypes = () => {
        const newSelection = !selectAllIncidentTypes;
        setSelectAllIncidentTypes(newSelection);
        setIncidentTypes({
            'Датчик': { 'Д.1': newSelection, 'Д.2': newSelection, 'Д.3': newSelection },
            'Точка измерения': { 'Т.1': newSelection, 'Т.2': newSelection },
            'Помещение': { 'П.1': newSelection, 'П.2': newSelection }
        });
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{11}$/;
        const namePattern = /^[A-Za-zА-Яа-я\s]+$/;

        if (!formData.position) {
            newErrors.position = 'Должность обязательна.';
        }

        if (!formData.type) {
            newErrors.type = 'Выберите тип.';
        }

        if (!formData.name || !namePattern.test(formData.name)) {
            newErrors.name = 'ФИО может содержать только буквы и пробелы.';
        }

        if (!formData.phone || !phonePattern.test(formData.phone)) {
            newErrors.phone = 'Телефон должен содержать 11 цифр.';
        }

        if (!formData.email || !emailPattern.test(formData.email)) {
            newErrors.email = 'Неверный формат email.';
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

            const notificationSettings = {
                name: formData.name,
                heatContours: heatContour,
                incidentTypes: incidentTypes,
                notifyStatusChange: notifyStatusChange
            };

            console.log('Новое ответственное лицо:', formData);
            console.log('Настройки уведомлений:', notificationSettings);

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
            headerTitle="Создать ответственное лицо"
            buttonLabel="Добавить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4 text-black">
                <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-900">
                        Должность
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                        Тип
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите тип</option>
                        {responsibleTypes.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                        Телефон
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <h3 className="text-lg font-medium text-gray-900">Уведомления</h3>
                {/* Все уведомления*/}
                <div className="mt-4">
                    <CustomCheckbox
                        checked={selectAllNotifications}
                        onChange={handleSelectAllNotifications}
                        label="Выбрать все уведомления"
                        showDivider={false}
                    />
                </div>

                {/* Тепловые контура */}
                <div className="mt-4 w-full p-2 border rounded-md">
                    <h4
                        className="text-md font-medium cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSection('heatContours')}
                    >
                        Тепловые контуры
                        <FaChevronDown
                            className={`transition-transform duration-300 ${
                                openSections.heatContours ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    </h4>
                    {openSections.heatContours && (
                        <div className="ml-4 mb-2 mt-2 space-y-2">
                            <CustomCheckbox
                                checked={selectAllHeatContours}
                                onChange={handleSelectAllHeatContours}
                                label="Выбрать все контуры"
                            />
                            {['contour1', 'contour2'].map(contour => (
                                <CustomCheckbox
                                    key={contour}
                                    checked={heatContour[contour]}
                                    onChange={() => handleCheckboxChange('heatContours', contour)}
                                    label={`Контур ${contour.slice(-1)}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Типы инцидентов */}
                <div className="mt-4 w-full p-2 border rounded-md">
                    <h4
                        className="text-md font-medium cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSection('incidentTypes')}
                    >
                        Типы инцидентов
                        <FaChevronDown
                            className={`transition-transform duration-300 ${
                                openSections.incidentTypes ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    </h4>
                    {openSections.incidentTypes && (
                        <div className="ml-4 mb-2 mt-2 space-y-2">
                            <CustomCheckbox
                                checked={selectAllIncidentTypes}
                                onChange={handleSelectAllIncidentTypes}
                                label="Выбрать все типы инцидентов"
                                showDivider={false}
                            />
                            {['Датчик', 'Точка измерения', 'Помещение'].map(type => (
                                <div key={type}>
                                    <h5
                                        className="border rounded-md p-2 cursor-pointer flex justify-between items-center"
                                        onClick={() => toggleIncidentSubmenu(type)}
                                    >
                                        {type}
                                        <FaChevronDown
                                            className={`transition-transform duration-300 ${
                                                openIncidentSubmenus[type] ? 'rotate-180' : 'rotate-0'
                                            }`}
                                        />
                                    </h5>
                                    {openIncidentSubmenus[type] && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {Object.keys(incidentTypes[type]).map((incident, index) => (
                                                <CustomCheckbox
                                                    key={index}
                                                    checked={incidentTypes[type][incident]}
                                                    onChange={() => handleCheckboxChange('incidentTypes', incident, type)}
                                                    label={incident}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Обновления */}
                <div className="mt-4 w-full p-2 border rounded-md">
                    <h4
                        className="text-md font-medium cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSection('statusChange')}
                    >
                        Обновления
                        <FaChevronDown
                            className={`transition-transform duration-300 ${
                                openSections.statusChange ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    </h4>
                    {openSections.statusChange && (
                        <div className="ml-4 mb-2 mt-2">
                            <CustomCheckbox
                                checked={notifyStatusChange}
                                onChange={() => setNotifyStatusChange(prev => !prev)}
                                label="Уведомлять об обновлении ПО"
                            />
                        </div>
                    )}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddResponsiblePersonModal;
