import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { Room } from "../../../models/Room.tsx";
import {
    fetchSectionOptions,
    fetchThermalCircuitIdOptions,
    fetchWindowOptions,
    updateRoom
} from "../../../api/requests/roomApi.ts";

interface EditRoomModalProps {
    roomId: number;
    room: Room;
    onClose: () => void;
    onUpdate: (updatedRoom: Room) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ roomId, room, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        ...room,
        section: room.section.label,
        thermalCircuit: room.thermalCircuit.label,
        windowOrientation: room.windowOrientation.label,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [options, setOptions] = useState({
        sections: [],
        windows: [],
        thermalCircuits: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sections, windows, thermalCircuits] = await Promise.all([
                    fetchSectionOptions(),
                    fetchWindowOptions(),
                    fetchThermalCircuitIdOptions()
                ]);
                setOptions({ sections, windows, thermalCircuits });
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        loadData();
    }, []);

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
            const updatedRoom = await updateRoom(roomId, formData);
            onUpdate(updatedRoom);
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

    const renderSelect = (id: string, label: string, optionsList: { id: number, label: string }[]) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                id={id}
                name={id}
                value={formData[id] || ''}
                onChange={handleChange}
                className={`w-full p-2 border ${errors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md text-black bg-white`}
            >
                {optionsList.map(({ id, label }) => <option key={id} value={label}>{label}</option>)}
            </select>
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
            headerTitle="Редактирование комнаты"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                {renderInput('label', 'Наименование')}
                {renderSelect('section', 'Секция', options.sections)}
                {renderSelect('thermalCircuit', 'Тепловой контур', options.thermalCircuits)}
                {renderInput('floor', 'Этаж', 'number')}
                {renderSelect('windowOrientation', 'Ориентация окон', options.windows)}
                {renderInput('square', 'Площадь', 'number')}
                {renderBooleanSelect('angular', 'Угловое')}
                {renderInput('temperatureMinimum', 'Мин. температура', 'number')}
                {renderInput('temperatureMaximum', 'Макс. температура', 'number')}
                {renderBooleanSelect('temperatureActive', 'Температура включена в расчёт')}
                {renderInput('humidityMinimum', 'Мин. влажность', 'number')}
                {renderInput('humidityMaximum', 'Макс. влажность', 'number')}
                {renderBooleanSelect('humidityActive', 'Влажность включена в расчёт')}
                {renderInput('priority', 'Приоритет', 'number')}
            </div>
        </ModalTemplate>
    );
};

export default EditRoomModal;
