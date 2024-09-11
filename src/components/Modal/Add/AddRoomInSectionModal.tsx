import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { fetchThermalCircuitIdOptions, fetchWindowOptions, createRoom } from '../../../api/roomApi';

const AddRoomInSectionModal = ({ sectionId, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        roomName: '',
        thermalCircuitId: '',
        floor: 0,
        windowOrientation: '',
        area: 0,
        corner: false
    });
    const [thermalCircuitIdOptions, setThermalCircuitIdOptions] = useState([]);
    const [windowOptions, setWindowOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const thermalCircuits = await fetchThermalCircuitIdOptions();
            setThermalCircuitIdOptions(thermalCircuits);
            const windows = await fetchWindowOptions();
            setWindowOptions(windows);
        } catch (error) {
            console.error('Error fetching dropdown options:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});
        const { roomName, thermalCircuitId, floor, windowOrientation, area, corner } = formData;

        const newErrors = {};
        if (!roomName.trim()) newErrors.roomName = 'Введите наименование';
        if (!thermalCircuitId) newErrors.thermalCircuitId = 'Выберите тепловой контур';
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
            await createRoom(parseInt(thermalCircuitId), parseInt(sectionId), requestData);
            onSubmit();
        } catch (error) {
            console.error('Error saving room:', error);
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
                    <label htmlFor="thermalCircuitId" className="block text-sm font-medium text-gray-700">
                        Тепловой контур
                    </label>
                    <select
                        id="thermalCircuitId"
                        name="thermalCircuitId"
                        value={formData.thermalCircuitId}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.thermalCircuitId ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите тепловой контур</option>
                        {thermalCircuitIdOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.thermalCircuitId && <p className="text-red-500 text-sm">{errors.thermalCircuitId}</p>}
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

export default AddRoomInSectionModal;
