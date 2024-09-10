import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';

interface AddRoomInThermalCircuitProps {
    onClose: () => void;
    onSubmit: (
        roomName: string,
        section: string,
        floor: number,
        windowOrientation: string,
        area: number,
        corner: boolean
    ) => void;
}

const AddRoomInThermalCircuitModal: React.FC<AddRoomInThermalCircuitProps> = ({ onClose, onSubmit }) => {
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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchThermalOptions();
        fetchWindowOptions();
    }, []);

    const fetchThermalOptions = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/section/1');
            const data = await response.json();
            setSectionOptions(data.data.map((section: any) => ({
                label: section.label,
                value: section.id
            })));
        } catch (error) {
            console.error('Ошибка при загрузке тепловых контуров:', error);
        }
    };

    const fetchWindowOptions = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/room/list/windowOrientations');
            const data = await response.json();
            setWindowOptions(data.map((window: any) => ({
                label: window.label,
                value: window.id
            })));
        } catch (error) {
            console.error('Ошибка при загрузке ориентаций окон:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});

        const { roomName, thermal, floor, windowOrientation, area, corner } = formData;
        const newErrors: { [key: string]: string } = {};

        if (!roomName.trim()) {
            newErrors.roomName = 'Пожалуйста, введите название';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            onSubmit(roomName.trim(), thermal, parseFloat(floor.toString()), windowOrientation, parseFloat(area.toString()), corner);
            console.log('Добавлена комната:', formData);
            onClose();
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
                    <label htmlFor="thermal" className="block text-sm font-medium text-gray-700">
                        Тепловой контур
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
                            <option key={option.id} value={option.value}>
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
                            <option key={option.id} value={option.value}>
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
                        <option value={false}>Нет</option>
                        <option value={true}>Да</option>
                    </select>
                    {errors.corner && <p className="text-red-500 text-sm">{errors.corner}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddRoomInThermalCircuitModal;
