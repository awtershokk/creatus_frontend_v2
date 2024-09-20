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
        corner: false,
        temperatureMinimum: 0,
        temperatureMaximum: 0,
        temperatureActive: 'false',
        humidityMinimum: 0,
        humidityMaximum: 0,
        humidityActive: 'false',
        priority: 0,
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

        const { roomName, section, floor, windowOrientation, area, corner, temperatureMinimum, temperatureMaximum, temperatureActive, humidityMinimum, humidityMaximum, humidityActive, priority } = formData;
        const newErrors: { [key: string]: string } = {};

        if (!roomName.trim()) newErrors.roomName = 'Введите наименование';

        if (!section || section === 'Выберите секцию') {
            newErrors.section = 'Выберите секцию';
        }

        if (!area || area <= 0 ) {
            newErrors.area = 'Определите площадь';
        }

        if (!windowOrientation || windowOrientation === 'Выберите ориентацию окон') {
            newErrors.windowOrientation = 'Выберите ориентацию окон';
        }

        if (!temperatureMinimum) {
            newErrors.temperatureMinimum = 'Определите минимальную температуру';
        }

        if (!temperatureMaximum) {
            newErrors.temperatureMaximum = 'Определите максимальную температуру';
        }

        if (temperatureMinimum && temperatureMaximum && parseFloat(temperatureMinimum) > parseFloat(temperatureMaximum)) {
            newErrors.temperatureMinimum = 'Минимальная температура должна быть меньше или равна максимальной';
            newErrors.temperatureMaximum = 'Максимальная температура должна быть больше или равна минимальной';
        }

        if (!humidityMinimum || humidityMinimum <= 0 || humidityMinimum > 100) {
            newErrors.humidityMinimum = 'Определите минимальную влажность, влажность должна быть больше 0 и меньше или равна 100';
        }

        if (!humidityMaximum || humidityMaximum <= 0 || humidityMaximum > 100) {
            newErrors.humidityMaximum = 'Определите максимальную влажность, влажность должна быть больше 0 и меньше или равна 100';
        }

        if (humidityMinimum && humidityMaximum && parseFloat(humidityMinimum) > parseFloat(humidityMaximum)) {
            newErrors.humidityMinimum = 'Минимальная влажность должна быть меньше или равна максимальной';
            newErrors.humidityMaximum = 'Максимальная влажность должна быть больше или равна минимальной';
        }


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
            angular: corner === 'true',
            temperatureMinimum: temperatureMinimum,
            temperatureMaximum: temperatureMaximum,
            temperatureActive: temperatureActive === 'true',
            humidityMinimum: humidityMinimum,
            humidityMaximum: humidityMaximum,
            humidityActive: humidityActive === 'true',
            priority: priority,
        };

        try {
            await createRoom(thermalCircuitId, parseInt(section), requestData);
            onSubmit();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {

                const errorMessages = error.response.data.errors;
                if (errorMessages && errorMessages.includes('Запись с таким `label` уже существует')) {
                    setErrors({ roomName: 'Комната с таким именем уже существует' });
                } else {
                    console.error('Неизвестная ошибка:', error.response.data);
                }
            } else {
                console.error('Ошибка при сохранении:', error);
            }
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
                <div>
                    <label htmlFor="temperatureMinimum" className="block text-sm font-medium text-gray-700">
                        Минимальная температура
                    </label>
                    <input
                        id="temperatureMinimum"
                        name="temperatureMinimum"
                        type="number"
                        value={formData.temperatureMinimum}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                        placeholder="Введите минимальную температуру"
                    />
                    {errors.temperatureMinimum && <p className="text-red-500 text-sm">{errors.temperatureMinimum}</p>}

                </div>

                <div>
                    <label htmlFor="temperatureMaximum" className="block text-sm font-medium text-gray-700">
                        Максимальная температура
                    </label>
                    <input
                        id="temperatureMaximum"
                        name="temperatureMaximum"
                        type="number"
                        value={formData.temperatureMaximum}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                        placeholder="Введите максимальную температуру"
                    />
                    {errors.temperatureMaximum && <p className="text-red-500 text-sm">{errors.temperatureMaximum}</p>}

                </div>

                <div>
                    <label htmlFor="temperatureActive" className="block text-sm font-medium text-gray-700">
                        Температура включена в расчёт
                    </label>
                    <select
                        id="temperatureActive"
                        name="temperatureActive"
                        value={formData.temperatureActive}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    >
                        <option value="false">Нет</option>
                        <option value="true">Да</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="humidityMinimum" className="block text-sm font-medium text-gray-700">
                        Минимальная влажность
                    </label>
                    <input
                        id="humidityMinimum"
                        name="humidityMinimum"
                        type="number"
                        value={formData.humidityMinimum}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                        placeholder="Введите минимальную влажность"
                    />
                    {errors.humidityMinimum && <p className="text-red-500 text-sm">{errors.humidityMinimum}</p>}

                </div>

                <div>
                    <label htmlFor="humidityMaximum" className="block text-sm font-medium text-gray-700">
                        Максимальная влажность
                    </label>
                    <input
                        id="humidityMaximum"
                        name="humidityMaximum"
                        type="number"
                        value={formData.humidityMaximum}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                        placeholder="Введите максимальную влажность"
                    />
                    {errors.humidityMaximum && <p className="text-red-500 text-sm">{errors.humidityMaximum}</p>}

                </div>

                <div>
                    <label htmlFor="humidityActive" className="block text-sm font-medium text-gray-700">
                        Влажность включена в расчёт
                    </label>
                    <select
                        id="humidityActive"
                        name="humidityActive"
                        value={formData.humidityActive}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                    >
                        <option value="false">Нет</option>
                        <option value="true">Да</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Приоритет
                    </label>
                    <input
                        id="priority"
                        name="priority"
                        type="number"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                        placeholder="Введите приоритет"
                    />
                    {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}

                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddRoomInThermalCircuitModal;
