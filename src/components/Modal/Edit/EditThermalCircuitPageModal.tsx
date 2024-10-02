import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { reverseTransformThermalCircuitData, ThermalCircuit } from "../../../models/ThermalCircuit.ts";
import { updateThermalCircuit, fetchWiringDiagrams, fetchConnectionDiagrams } from "../../../api/requests/thermalCircuitApi.ts";

interface EditThermalCircuitModalProps {
    thermalCircuitId: number;
    thermalCircuit: ThermalCircuit;
    onClose: () => void;
    onUpdate: (updatedThermal: ThermalCircuit) => void;
}

const EditThermalCircuitModal: React.FC<EditThermalCircuitModalProps> = ({ thermalCircuitId, thermalCircuit, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<ThermalCircuit>(thermalCircuit);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [wiringDiagrams, setWiringDiagrams] = useState<{ id: number, label: string }[]>([]);
    const [connectionDiagrams, setConnectionDiagrams] = useState<{ id: number, label: string }[]>([]);

    useEffect(() => {

        if (thermalCircuit) {
            const reverse = reverseTransformThermalCircuitData(thermalCircuit);
            setFormData(reverse);
        }


        const loadWiringDiagrams = async () => {
            try {
                const wiringData = await fetchWiringDiagrams();
                setWiringDiagrams(wiringData);
            } catch (error) {
                console.error('Ошибка при загрузке схем проводки:', error);
            }
        };


        const loadConnectionDiagrams = async () => {
            try {
                const connectionData = await fetchConnectionDiagrams();
                setConnectionDiagrams(connectionData);
            } catch (error) {
                console.error('Ошибка при загрузке схем подключения:', error);
            }
        };

        loadWiringDiagrams();
        loadConnectionDiagrams();
    }, [thermalCircuit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, diagrams: { id: number, label: string }[], fieldName: string) => {
        const selectedLabel = diagrams.find(diagram => diagram.id === parseInt(e.target.value))?.label || '';
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: selectedLabel
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.label || formData.label.trim() === '') {
            newErrors.label = 'Наименование не должно быть пустым.';
        }
        if (!formData.heatingLoad || formData.heatingLoad == 0) {
            newErrors.heatingLoad = 'Нагрузка на отопление не должна быть пустой или равна 0.';
        }
        if (!formData.square || formData.square == 0) {
            newErrors.square = 'Площадь не должна быть пустой или равна 0.';
        }
        if (!formData.volume || formData.volume == 0) {
            newErrors.volume = 'Объем не должен быть пустой или равен 0.';
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

            const updatedThermalCircuitData = {
                id: thermalCircuitId,
                label: formData.label,
                heatingLoad: formData.heatingLoad,
                square: formData.square,
                volume: formData.volume,
                wiringDiagram: formData.wiringDiagram,
                connectionDiagram: formData.connectionDiagram,
            };

            const updatedThermal = await updateThermalCircuit(thermalCircuitId, updatedThermalCircuitData);
            onUpdate(updatedThermal);
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении секции:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактирование теплового контура"
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
                        className={`w-full p-2 border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.label && <p className="text-red-500 text-sm">{errors.label}</p>}
                </div>
                <div>
                    <label htmlFor="heatingLoad" className="block text-sm font-medium text-gray-700">
                        Нагрузка на отопление
                    </label>
                    <input
                        id="heatingLoad"
                        name="heatingLoad"
                        type="number"
                        value={formData.heatingLoad || ''}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.heatingLoad ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.heatingLoad && <p className="text-red-500 text-sm">{errors.heatingLoad}</p>}
                </div>
                <div>
                    <label htmlFor="wiringDiagram" className="block text-sm font-medium text-gray-700">
                        Схема разводки
                    </label>
                    <select
                        id="wiringDiagram"
                        name="wiringDiagram"
                        value={wiringDiagrams.find(diagram => diagram.label === formData.wiringDiagram)?.id || ''}
                        onChange={(e) => handleSelectChange(e, wiringDiagrams, 'wiringDiagram')}
                        className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                    >

                        {wiringDiagrams.map((diagram) => (
                            <option key={diagram.id} value={diagram.id}>
                                {diagram.label}
                            </option>
                        ))}
                    </select>
                </div>
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
                        className={`w-full p-2 border ${errors.square ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.square && <p className="text-red-500 text-sm">{errors.square}</p>}
                </div>
                <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">
                        Объем
                    </label>
                    <input
                        id="volume"
                        name="volume"
                        type="number"
                        value={formData.volume || ''}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.volume ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    />
                    {errors.volume && <p className="text-red-500 text-sm">{errors.volume}</p>}
                </div>


                <div>
                    <label htmlFor="connectionDiagram" className="block text-sm font-medium text-gray-700">
                        Схема соединений CO
                    </label>
                    <select
                        id="connectionDiagram"
                        name="connectionDiagram"
                        value={connectionDiagrams.find(diagram => diagram.label === formData.connectionDiagram)?.id || ''}
                        onChange={(e) => handleSelectChange(e, connectionDiagrams, 'connectionDiagram')}
                        className="w-full p-2 border border-gray-300 rounded-md text-black bg-white"
                    >

                        {connectionDiagrams.map((diagram) => (
                            <option key={diagram.id} value={diagram.id}>
                                {diagram.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </ModalTemplate>
    );
};

export default EditThermalCircuitModal;
