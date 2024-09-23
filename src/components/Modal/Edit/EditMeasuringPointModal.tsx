import React, { useState } from 'react';
import ModalTemplate from '../ModalTemplate';
import { MeasuringPoint} from "../../../models/MeasuringPoint.tsx";
import { updateMeasuringPoint } from "../../../api/requests/measuringPointApi.ts";

interface EditMeasuringPointModalProps {
    measuringPointId: number;
    measuringPoint: MeasuringPoint;
    onClose: () => void;
    onUpdate: (updatedMeasuringPoint: MeasuringPoint) => void;
}

const EditMeasuringPointModal: React.FC<EditMeasuringPointModalProps> = ({ measuringPointId, measuringPoint, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        ...measuringPoint,
    });
    console.log('formData', formData);
    console.log('measuringPoint',measuringPoint);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});



    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleBooleanChange = ({ target: { name, value } }: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prevData => ({ ...prevData, [name]: value === 'true' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.label?.trim()) newErrors.label = 'Наименование не должно быть пустым.';
        return newErrors;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});
        const newErrors = validateForm();
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }
        try {
            const updatedMeasuringPoint = await updateMeasuringPoint(measuringPointId, formData);
            onUpdate(updatedMeasuringPoint);

            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении комнаты:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (id: string, label: string, type: string = 'text') => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={id}
                name={id}
                type={type}
                value={formData[id] || ''}
                onChange={handleChange}
                className={`w-full p-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
            />
            {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
        </div>
    );



    const renderBooleanSelect = (id: string, label: string) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                name={id}
                value={formData[id] ? 'true' : 'false'}
                onChange={handleBooleanChange}
                className={`w-full p-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
            >
                <option value="true">Да</option>
                <option value="false">Нет</option>
            </select>
            {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
        </div>
    );

    return (
        <ModalTemplate
            headerTitle="Редактирование точки измерения"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                {renderInput('label', 'Наименование')}

                {renderInput('height', 'Высота', 'number')}
                {renderInput('temperatureMinimum', 'Мин. температура', 'number')}
                {renderInput('temperatureMaximum', 'Макс. температура', 'number')}
                {renderBooleanSelect('temperatureActive', 'Температура включена в расчёт')}
                {renderInput('humidityMinimum', 'Мин. влажность', 'number')}
                {renderInput('humidityMaximum', 'Макс. влажность', 'number')}
                {renderBooleanSelect('humidityActive', 'Влажность включена в расчёт')}
                {renderInput('temperatureLocation', 'Коэффициент расположения', 'number')}
                {renderInput('temperatureHeight', 'Коэффициент высоты', 'number')}
                {renderInput('temperatureCalibration', 'Калибровочный Коэффициент для температуры', 'number')}
                {renderInput('humidityCalibration', 'Калибровочный Коэффициент для влажности', 'number')}
            </div>
        </ModalTemplate>
    );
};
export default EditMeasuringPointModal;
