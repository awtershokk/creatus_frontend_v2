import React, { useState, useEffect } from 'react';
import ModalTemplate from '../ModalTemplate';

interface AddItemModalProps {
    onClose: () => void;
    onSubmit: (
        label: string,
        heatingLoad: number,
        selectedWiringDiagram: string,
        square: number,
        volume: number,
        selectedConnectionDiagram: string
    ) => void;
}

const AddThermalModal: React.FC<AddItemModalProps> = ({ onClose, onSubmit }) => {
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
        fetchWiringDiagrams();
        fetchConnectionDiagrams();
    }, []);

    const fetchWiringDiagrams = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/thermalCircuit/list/wiringDiagrams');
            const data = await response.json();
            setWiringDiagramOptions(data);
        } catch (error) {
            console.error('Error fetching wiring diagrams:', error);
        }
    };

    const fetchConnectionDiagrams = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/thermalCircuit/list/connectionDiagrams');
            const data = await response.json();
            setConnectionDiagramOptions(data);
        } catch (error) {
            console.error('Error fetching connection diagrams:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        const { label, heatingLoad, wiringDiagram, square, volume, connectionDiagram } = formData;
        const newErrors: { [key: string]: string } = {};

        if (!label.trim()) {
            newErrors.label = 'Название не может быть пустым.';
        }

        const heatingLoadValue = parseFloat(heatingLoad);
        const squareValue = parseFloat(square);
        const volumeValue = parseFloat(volume);

        if (!heatingLoad.trim()) {
            newErrors.heatingLoad = 'Нагрузка на отопление не может быть пустой.';
        } else if (heatingLoadValue <= 0) {
            newErrors.heatingLoad = 'Нагрузка на отопление должна быть больше нуля.';
        }

        if (!square.trim()) {
            newErrors.square = 'Площадь не может быть пустой.';
        } else if (squareValue <= 0) {
            newErrors.square = 'Площадь должна быть больше нуля.';
        }

        if (!volume.trim()) {
            newErrors.volume = 'Объем не может быть пустым.';
        } else if (volumeValue <= 0) {
            newErrors.volume = 'Объем должен быть больше нуля.';
        }

        if (!wiringDiagram) {
            newErrors.wiringDiagram = 'Выберите схему разводки.';
        }

        if (!connectionDiagram) {
            newErrors.connectionDiagram = 'Выберите схему присоединения СО.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Добавлен тепловой контур:', formData);
            onSubmit(label, heatingLoadValue, wiringDiagram, squareValue, volumeValue, connectionDiagram);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавление теплового контура"
            buttonLabel="Сохранить"
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
                        <option value="">Выберите схему</option>
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
                        <option value="">Выберите схему</option>
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

export default AddThermalModal;
