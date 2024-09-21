import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { Room } from "../../../models/Room.tsx";
import {
    fetchSectionOptions,
    fetchThermalCircuitIdOptions,
    fetchWindowOptions,
    updateRoom
} from "../../../api/roomApi.ts";

interface EditRoomModalProps {
    roomId: number;
    room: Room;
    onClose: () => void;
    onUpdate: (updatedRoom: Room) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ roomId, room, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Room>({
        ...room,
        section: room.section.label,
        thermalCircuit: room.thermalCircuit.label,
        windowOrientation: room.windowOrientation.label,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [sectionOptions, setSectionOptions] = useState<{ id: number, label: string }[]>([]);
    const [windowOrientationOptions, setWindowOrientationOptions] = useState<{ id: number, label: string }[]>([]);
    const [thermalCircuitOptions, setThermalCircuitOptions] = useState<{ id: number, label: string }[]>([]);

    useEffect(() => {
        const loadSection = async () => {
            try {
                const sectionData = await fetchSectionOptions();
                setSectionOptions(sectionData);
            } catch (error) {
                console.error('Ошибка при загрузке секций:', error);
            }
        };

        const loadWindow = async () => {
            try {
                const windowData = await fetchWindowOptions();
                setWindowOrientationOptions(windowData);
            } catch (error) {
                console.error('Ошибка при загрузке ориентаций окон:', error);
            }
        };

        const loadThermalCircuit = async () => {
            try {
                const thermalData = await fetchThermalCircuitIdOptions();
                setThermalCircuitOptions(thermalData);
            } catch (error) {
                console.error('Ошибка при загрузке тепловых контуров:', error);
            }
        };

        loadSection();
        loadThermalCircuit();
        loadWindow();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        fieldName: string
    ) => {
        const selectedLabel = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: selectedLabel,
        }));
    };

    const handleBooleanSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, fieldName: string) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value === 'true',
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.label || formData.label.trim() === '') {
            newErrors.label = 'Наименование не должно быть пустым.';
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        try {
            const newErrors = validateForm();
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            const updatedRoomData = {
                id: roomId,
                label: formData.label,
                section: formData.section,
                thermalCircuit: formData.thermalCircuit,
                floor: formData.floor,
                square: formData.square,
                windowOrientation: formData.windowOrientation,
                angular: formData.angular,
                temperatureMinimum: formData.temperatureMinimum,
                temperatureMaximum: formData.temperatureMaximum,
                temperatureActive: formData.temperatureActive,
                humidityMinimum: formData.humidityMinimum,
                humidityMaximum: formData.humidityMaximum,
                humidityActive: formData.humidityActive,
                priority: formData.priority,
            };
            console.log('updatedRoomData', updatedRoomData);
            const updatedRoom = await updateRoom(roomId, updatedRoomData);
            onUpdate(updatedRoom);
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении комнаты:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактирование комнаты"
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
                        className={"w-full p-2 border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
                </div>
                {/* Секция */}
                <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                        Секция
                    </label>
                    <select
                        id="section"
                        name="section"
                        value={formData.section || ''}
                        onChange={(e) => handleSelectChange(e, 'section')}
                        className={`w-full p-2 border ${errors.section ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        {sectionOptions.map((option) => (
                            <option key={option.id} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                </div>

                {/* Тепловой контур */}
                <div>
                    <label htmlFor="thermalCircuit" className="block text-sm font-medium text-gray-700">
                        Тепловой контур
                    </label>
                    <select
                        id="thermalCircuit"
                        name="thermalCircuit"
                        value={formData.thermalCircuit || ''}
                        onChange={(e) => handleSelectChange(e, 'thermalCircuit')}
                        className={`w-full p-2 border ${errors.thermalCircuit ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        {thermalCircuitOptions.map((option) => (
                            <option key={option.id} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.thermalCircuit && <p className="text-red-500 text-sm">{errors.thermalCircuit}</p>}
                </div>
                <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                        Этаж
                    </label>
                    <input
                        id="floor"
                        name="floor"
                        type="number"
                        value={formData.floor || ''}
                        onChange={handleChange}
                        className={"w-full p-2 border ${errors.floor ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
                </div>
                {/* Ориентация окон */}
                <div>
                    <label htmlFor="windowOrientation" className="block text-sm font-medium text-gray-700">
                        Ориентация окон
                    </label>
                    <select
                        id="windowOrientation"
                        name="windowOrientation"
                        value={formData.windowOrientation || ''}
                        onChange={(e) => handleSelectChange(e, 'windowOrientation')}
                        className={`w-full p-2 border ${errors.windowOrientation ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        {windowOrientationOptions.map((option) => (
                            <option key={option.id} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.windowOrientation && <p className="text-red-500 text-sm">{errors.windowOrientation}</p>}
                </div>
                {/* Площадь */}
                <div>
                    <label htmlFor="square" className="block text-sm font-medium text-gray-700">
                        Площадь
                    </label>
                    <input
                        id="square"
                        name="square"
                        type="number"
                        value={formData.square || ''}
                        onChange={handleChange}
                        className={"w-full p-2 border ${errors.square ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.square && <p className="text-red-500 text-sm">{errors.square}</p>}
                {/* Угловое */}
                </div>
                <div>
                    <label htmlFor="angular" className="block text-sm font-medium text-gray-700">
                        Угловое
                    </label>
                    <select
                        id="angular"
                        name="angular"
                        value={formData.angular ? 'true' : 'false'}
                        onChange={(e) => handleBooleanSelectChange(e, 'angular')}
                        className={`w-full p-2 border ${errors.angular ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                    {errors.angular && <p className="text-red-500 text-sm">{errors.angular}</p>}
                </div>
                    {/* Мин. температура */}
                <div>
                    <label htmlFor="temperatureMinimum" className="block text-sm font-medium text-gray-700">
                        Мин. температура
                    </label>
                    <input
                        id="temperatureMinimum"
                        name="temperatureMinimum"
                        type="number"
                        value={formData.temperatureMinimum || ''}
                        onChange={handleChange}
                        className={"w-full p-2 border ${errors.temperatureMinimum ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.temperatureMinimum && <p className="text-red-500 text-sm">{errors.temperatureMinimum}</p>}
                </div>

                {/* Макс. температура */}
                <div>
                    <label htmlFor="temperatureMaximum" className="block text-sm font-medium text-gray-700">
                        Макс. температура
                    </label>
                    <input
                        id="temperatureMaximum"
                        name="temperatureMaximum"
                        type="number"
                        value={formData.temperatureMaximum || ''}
                        onChange={handleChange}
                        className={"w-full p-2 border ${errors.temperatureMaximum ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.temperatureMaximum && <p className="text-red-500 text-sm">{errors.temperatureMaximum}</p>}
                </div>
                {/* Температура включена в расчёт */}
                <div>
                    <label htmlFor="temperatureActive" className="block text-sm font-medium text-gray-700">
                        Температура включена в расчёт
                    </label>
                    <select
                        id="temperatureActive"
                        name="temperatureActive"
                        value={formData.temperatureActive ? 'true' : 'false'}
                        onChange={(e) => handleBooleanSelectChange(e, 'temperatureActive')}
                        className={`w-full p-2 border ${errors.temperatureActive ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                    {errors.temperatureActive && <p className="text-red-500 text-sm">{errors.temperatureActive}</p>}
                </div>

                    {/* Мин. влажность */}
                    <div>
                        <label htmlFor="humidityMinimum" className="block text-sm font-medium text-gray-700">
                            Мин. влажность
                        </label>
                        <input
                            id="humidityMinimum"
                            name="humidityMinimum"
                            type="number"
                            value={formData.humidityMinimum || ''}
                            onChange={handleChange}
                            className={"w-full p-2 border ${errors.humidityMinimum ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                        />
                        {errors.humidityMinimum && <p className="text-red-500 text-sm">{errors.humidityMinimum}</p>}
                    </div>

                    {/* Макс. влажность */}
                    <div>
                        <label htmlFor="humidityMaximum" className="block text-sm font-medium text-gray-700">
                            Макс. влажность
                        </label>
                        <input
                            id="humidityMaximum"
                            name="humidityMaximum"
                            type="number"
                            value={formData.humidityMaximum || ''}
                            onChange={handleChange}
                            className={"w-full p-2 border ${errors.humidityMaximum ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                        />
                        {errors.humidityMaximum && <p className="text-red-500 text-sm">{errors.humidityMaximum}</p>}
                    </div>


                {/* Влажность включена в расчёт */}
                <div>
                    <label htmlFor="humidityActive" className="block text-sm font-medium text-gray-700">
                        Влажность включена в расчёт
                    </label>
                    <select
                        id="humidityActive"
                        name="humidityActive"
                        value={formData.humidityActive ? 'true' : 'false'}
                        onChange={(e) => handleBooleanSelectChange(e, 'humidityActive')}
                        className={`w-full p-2 border ${errors.humidityActive ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
                    >
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                    {errors.humidityActive && <p className="text-red-500 text-sm">{errors.humidityActive}</p>}
                </div>
                {/* Приоритет */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Приоритет
                    </label>
                    <input
                        id="priority"
                        name="priority"
                        type="number"
                        value={formData.priority || ''}
                        onChange={handleChange}
                        className={"w-full p-2 border ${errors.priority ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"}
                    />
                    {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default EditRoomModal;
