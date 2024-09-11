import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { fetchSectionOptions, fetchWindowOptions, createRoom } from '../../../api/roomApi';

interface AddRoomInThermalCircuitProps {
    thermalCircuitId: number;
    onClose: () => void;
    onSubmit: () => void;
}

const AddRoomInThermalCircuitModal: React.FC<AddRoomInThermalCircuitProps> = ({ thermalCircuitId, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        roomName: '',
        section: '',
        floor: 0,
        windowOrientation: '',
        area: 0,
        corner: false
    });
    const [sectionOptions, setSectionOptions] = useState([]);
    const [windowOptions, setWindowOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const sections = await fetchSectionOptions();
            setSectionOptions(sections);
            const windows = await fetchWindowOptions();
            setWindowOptions(windows);
        } catch (error) {
            console.error('Ошибка при загрузке опций:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});

        const { roomName, section, floor, windowOrientation, area, corner } = formData;
        const newErrors: { [key: string]: string } = {};

        if (!roomName.trim()) newErrors.roomName = 'Введите наименование';
        if (!section) newErrors.section = 'Выберите секцию';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const requestData = {
            label: roomName,
            floor,
            windowOrientation,
            square: area,
            angular: corner
        };

        try {
            await createRoom(thermalCircuitId, parseInt(section), requestData);
            onSubmit();
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавление помещения"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSave}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                        Наименование
                    </label>
                    <input
                        id="roomName"
                        name="roomName"
                        type="text"
                        value={formData.roomName}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.roomName ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите наименование"
                    />
                    {errors.roomName && <p className="text-red-500 text-sm">{errors.roomName}</p>}
                </div>

                <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                        Секция
                    </label>
                    <select
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.section ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите секцию</option>
                        {sectionOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                </div>

                <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                        Этаж
                    </label>
                    <input
                        id="floor"
                        name="floor"
                        type="number"
                        value={formData.floor}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите этаж"
                    />
                    {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
                </div>

                <div>
                    <label htmlFor="windowOrientation" className="block text-sm font-medium text-gray-700">
                        Ориентация окон
                    </label>
                    <select
                        id="windowOrientation"
                        name="windowOrientation"
                        value={formData.windowOrientation}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.windowOrientation ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите ориентацию окон</option>
                        {windowOptions.map(option => (
                            <option key={option.value} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.windowOrientation && <p className="text-red-500 text-sm">{errors.windowOrientation}</p>}
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
                        placeholder="Введите площадь"
                    />
                    {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                </div>

                <div>
                    <label htmlFor="corner" className="block text-sm font-medium text-gray-700">
                        Угловое
                    </label>
                    <select
                        id="corner"
                        name="corner"
                        value={formData.corner.toString()}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.corner ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="false">Нет</option>
                        <option value="true">Да</option>
                    </select>
                    {errors.corner && <p className="text-red-500 text-sm">{errors.corner}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddRoomInThermalCircuitModal;
