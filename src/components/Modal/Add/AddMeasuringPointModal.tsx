import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate';
import { createMeasuringPoint } from '../../../api/measuringPointApi';

interface AddMeasurePointModalProps {
    onClose: () => void;
    onSubmit: (measurePoint: any) => void;
    roomId: number;
}

const AddMeasuringPointModal: React.FC<AddMeasurePointModalProps> = ({ onClose, onSubmit, roomId }) => {
    const [formData, setFormData] = useState({
        measureName: '',
        height: '',
        tempMin: '',
        tempMax: '',
        humidityMin: '',
        humidityMax: '',
        tempIncluded: '',
        humidityIncluded: '',
        tempLocationCoeff: '',
        tempHeightCoeff: '',
        tempCalibCoeff: '',
        humidityCalibCoeff: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const newErrors: { [key: string]: string } = {};


        if (!measureName.trim()) newErrors.measureName = 'Название не может быть пустым.';
        if (!height.trim() || parseFloat(height) <= 0) newErrors.height = 'Высота должна быть больше нуля.';
        if (!tempMin.trim() || isNaN(Number(tempMin))) newErrors.tempMin = 'Введите корректную минимальную температуру.';
        if (!tempMax.trim() || isNaN(Number(tempMax))) newErrors.tempMax = 'Введите корректную максимальную температуру.';
        if (!humidityMin.trim() || isNaN(Number(humidityMin))) newErrors.humidityMin = 'Введите корректную минимальную влажность.';
        if (!humidityMax.trim() || isNaN(Number(humidityMax))) newErrors.humidityMax = 'Введите корректную максимальную влажность.';
        if (!tempLocationCoeff.trim() || isNaN(Number(tempLocationCoeff))) newErrors.tempLocationCoeff = 'Введите корректный коэффициент расположения.';
        if (!tempHeightCoeff.trim() || isNaN(Number(tempHeightCoeff))) newErrors.tempHeightCoeff = 'Введите корректный коэффициент высоты.';
        if (!tempCalibCoeff.trim() || isNaN(Number(tempCalibCoeff))) newErrors.tempCalibCoeff = 'Введите корректный коллибровочный коэффициент температуры.';
        if (!humidityCalibCoeff.trim() || isNaN(Number(humidityCalibCoeff))) newErrors.humidityCalibCoeff = 'Введите корректный коллибровочный коэффициент высоты.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const measurePoint = {
                ...formData,
                tempIncluded: formData.tempIncluded === 'true',
                humidityIncluded: formData.humidityIncluded === 'true',
            };

            const result = await createMeasuringPoint(roomId, measurePoint);
            onSubmit(result);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении точки измерения:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавить точку измерения"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="measureName" className="block text-sm font-medium text-gray-700">
                        Наименование
                    </label>
                    <input
                        id="measureName"
                        name="measureName"
                        type="text"
                        value={formData.measureName}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.measureName ? 'border-red-500' : 'border-gray-300'}  rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.measureName && <p className="text-red-500 text-sm">{errors.measureName}</p>}
                </div>

                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        Высота
                    </label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                </div>

                <div>
                    <label htmlFor="tempMin" className="block text-sm font-medium text-gray-700">
                        Минимальная температура
                    </label>
                    <input
                        id="tempMin"
                        name="tempMin"
                        type="number"
                        value={formData.tempMin}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempMin ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.tempMin && <p className="text-red-500 text-sm">{errors.tempMin}</p>}
                </div>

                <div>
                    <label htmlFor="tempMax" className="block text-sm font-medium text-gray-700">
                        Максимальная температура
                    </label>
                    <input
                        id="tempMax"
                        name="tempMax"
                        type="number"
                        value={formData.tempMax}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempMax ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.tempMax && <p className="text-red-500 text-sm">{errors.tempMax}</p>}
                </div>

                <div>
                    <label htmlFor="humidityMin" className="block text-sm font-medium text-gray-700">
                        Минимальная влажность
                    </label>
                    <input
                        id="humidityMin"
                        name="humidityMin"
                        type="number"
                        value={formData.humidityMin}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.humidityMin ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.humidityMin && <p className="text-red-500 text-sm">{errors.humidityMin}</p>}
                </div>

                <div>
                    <label htmlFor="humidityMax" className="block text-sm font-medium text-gray-700">
                        Максимальная влажность
                    </label>
                    <input
                        id="humidityMax"
                        name="humidityMax"
                        type="number"
                        value={formData.humidityMax}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.humidityMax ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.humidityMax && <p className="text-red-500 text-sm">{errors.humidityMax}</p>}
                </div>

                <div>
                    <label htmlFor="tempIncluded" className="block text-sm font-medium text-gray-700">
                        Температура включена в расчет
                    </label>
                    <select
                        id="tempIncluded"
                        name="tempIncluded"
                        value={formData.tempIncluded}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempIncluded ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                    {errors.tempIncluded && <p className="text-red-500 text-sm">{errors.tempIncluded}</p>}
                </div>

                <div>
                    <label htmlFor="humidityIncluded" className="block text-sm font-medium text-gray-700">
                        Влажность включена в расчет
                    </label>
                    <select
                        id="humidityIncluded"
                        name="humidityIncluded"
                        value={formData.humidityIncluded}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.humidityIncluded ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>Выберите</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                    {errors.humidityIncluded && <p className="text-red-500 text-sm">{errors.humidityIncluded}</p>}
                </div>
                <div>
                    <label htmlFor="tempLocationCoeff" className="block text-sm font-medium text-gray-700">
                        Коэффициент расположения
                    </label>
                    <input
                        id="tempLocationCoeff"
                        name="tempLocationCoeff"
                        type="number"
                        value={formData.tempLocationCoeff}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempLocationCoeff ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.tempLocationCoeff && <p className="text-red-500 text-sm">{errors.tempLocationCoeff}</p>}
                </div>

                <div>
                    <label htmlFor="tempHeightCoeff" className="block text-sm font-medium text-gray-700">
                        Коэффициент высоты
                    </label>
                    <input
                        id="tempHeightCoeff"
                        name="tempHeightCoeff"
                        type="number"
                        value={formData.tempHeightCoeff}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempHeightCoeff ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.tempHeightCoeff && <p className="text-red-500 text-sm">{errors.tempHeightCoeff}</p>}
                </div>
                <div>
                    <label htmlFor="tempCalibCoeff" className="block text-sm font-medium text-gray-700">
                        Калибровочный коэффициент для температуры
                    </label>
                    <input
                        id="tempCalibCoeff"
                        name="tempCalibCoeff"
                        type="number"
                        value={formData.tempCalibCoeff}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.tempCalibCoeff ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.tempCalibCoeff && <p className="text-red-500 text-sm">{errors.tempCalibCoeff}</p>}
                </div>
                <div>
                    <label htmlFor="humidityCalibCoeff" className="block text-sm font-medium text-gray-700">
                        Калибровочный коэффициент для влажности
                    </label>
                    <input
                        id="humidityCalibCoeff"
                        name="humidityCalibCoeff"
                        type="number"
                        value={formData.humidityCalibCoeff}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.humidityCalibCoeff ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.humidityCalibCoeff && <p className="text-red-500 text-sm">{errors.humidityCalibCoeff}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddMeasuringPointModal;
