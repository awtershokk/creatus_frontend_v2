import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';
import { fetchWiringDiagrams, fetchConnectionDiagrams, addThermalCircuit } from '../../../api/requests/thermalCircuitApi.ts';

interface AddItemModalProps {
    onClose: () => void;
    onSubmit: (thermalCircuit: { label: string, heatingLoad: number, wiringDiagram: string, square: number, volume: number, connectionDiagram: string }) => void;
}

const AddThermalCircuitModal: React.FC<AddItemModalProps> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        label: '',
        heatingLoad: '',
        wiringDiagram: '',
        square: '',
        volume: '',
        connectionDiagram: ''
    });
    const [wiringDiagramOptions, setWiringDiagramOptions] = useState([]);
    const [connectionDiagramOptions, setConnectionDiagramOptions] = useState([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWiringDiagrams().then(setWiringDiagramOptions).catch(console.error);
        fetchConnectionDiagrams().then(setConnectionDiagramOptions).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const { label, heatingLoad, wiringDiagram, square, volume, connectionDiagram } = formData;
        const newErrors: { [key: string]: string } = {};

        const heatingLoadValue = parseFloat(heatingLoad);
        const squareValue = parseFloat(square);
        const volumeValue = parseFloat(volume);

        if (!label.trim()) newErrors.label = 'Название не может быть пустым.';
        if (!heatingLoad.trim() || heatingLoadValue <= 0) newErrors.heatingLoad = 'Нагрузка должна быть больше нуля.';
        if (!square.trim() || squareValue <= 0) newErrors.square = 'Площадь должна быть больше нуля.';
        if (!volume.trim() || volumeValue <= 0) newErrors.volume = 'Объем должен быть больше нуля.';
        if (!wiringDiagram) newErrors.wiringDiagram = 'Выберите схему разводки.';
        if (!connectionDiagram) newErrors.connectionDiagram = 'Выберите схему присоединения СО.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const thermalCircuit = {
                label,
                heatingLoad: heatingLoadValue,
                wiringDiagram,
                square: squareValue,
                volume: volumeValue,
                connectionDiagram
            };

            const response = await addThermalCircuit(thermalCircuit);

            onSubmit(response);
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении теплового контура:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalTemplate
            headerTitle="Добавление теплового контура"
            buttonLabel="Добавить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                        Название
                    </label>
                    <input
                        id="label"
                        name="label"
                        type="text"
                        value={formData.label}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.label ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите наименование"
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
                        value={formData.heatingLoad}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.heatingLoad ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите нагрузку на отопление"
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
                        value={formData.wiringDiagram}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.wiringDiagram ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>
                            Выберите схему разводки
                        </option>
                        {wiringDiagramOptions.map(diagram => (
                            <option key={diagram.id} value={diagram.label}>
                                {diagram.label}
                            </option>
                        ))}
                    </select>
                    {errors.wiringDiagram && <p className="text-red-500 text-sm">{errors.wiringDiagram}</p>}
                </div>

                <div>
                    <label htmlFor="square" className="block text-sm font-medium text-gray-700">
                        Площадь
                    </label>
                    <input
                        id="square"
                        name="square"
                        type="number"
                        value={formData.square}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.square ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите площадь"
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
                        value={formData.volume}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.volume ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                        placeholder="Введите объем"
                    />
                    {errors.volume && <p className="text-red-500 text-sm">{errors.volume}</p>}
                </div>

                <div>
                    <label htmlFor="connectionDiagram" className="block text-sm font-medium text-gray-700">
                        Схема присоединения СО
                    </label>
                    <select
                        id="connectionDiagram"
                        name="connectionDiagram"
                        value={formData.connectionDiagram}
                        onChange={handleChange}
                        className={`w-full p-2 border ${errors.connectionDiagram ? 'border-red-500' : 'border-gray-300'} rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white`}
                    >
                        <option value="" disabled>
                            Выберите схему присоединения СО
                        </option>
                        {connectionDiagramOptions.map(diagram => (
                            <option key={diagram.id} value={diagram.label}>
                                {diagram.label}
                            </option>
                        ))}
                    </select>
                    {errors.connectionDiagram && <p className="text-red-500 text-sm">{errors.connectionDiagram}</p>}
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AddThermalCircuitModal;
