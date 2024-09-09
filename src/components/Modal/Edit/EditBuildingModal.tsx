import React, { useEffect, useState } from 'react';
import { Building } from '../../../models/Building';
import { updateBuilding, fetchListEnergyClasses, fetchListTimezones, fetchListHwsConnectionDiagrams } from '../../../api/buildingApi';
import ModalTemplate from '../ModalTemplate';

interface BuildingEditModalProps {
    building: Building;
    buildingId: number;
    onClose: () => void;
    onUpdate: (updatedBuilding: Building) => void;
}

const fieldConfig = {
    label: { type: 'text', label: 'Наименование' },
    address: { type: 'text', label: 'Адрес' },
    energyClass: { type: 'select', label: 'Энергокласс', fetch: fetchListEnergyClasses },
    constructionVolume: { type: 'number', label: 'Строительный объем' },
    heatedArea: { type: 'number', label: 'Отапливаемая площадь' },
    timezone: { type: 'select', label: 'Часовой пояс', fetch: fetchListTimezones },
    allDayMode: { type: 'select', label: 'Круглосуточный режим', options: [{ id: 1, label: 'Да', value: 'true' }, { id: 2, label: 'Нет', value: 'false' }] },
    compactnessIndicator: { type: 'number', label: 'Показатель компактности' },
    floor: { type: 'number', label: 'Число этажей' },
    usableBasement: { type: 'select', label: 'Эксплуатируемый подвал', options: [{ id: 1, label: 'Да', value: 'true' }, { id: 2, label: 'Нет', value: 'false' }] },
    hsCapacity: { type: 'text', label: 'Емкость системы отопления' },
    hsLoad: { type: 'text', label: 'Нагрузка на отопление' },
    hwsLoad: { type: 'text', label: 'Нагрузка на ГВС' },
    ventilationLoad: { type: 'text', label: 'Нагрузка на вентиляцию' },
    hwsConnectionDiagram: { type: 'select', label: 'Схема присоединения ГВС', fetch: fetchListHwsConnectionDiagrams },
    balanceHolderLabel: { type: 'text', label: 'Балансодержатель' },
};

const BuildingEditModal: React.FC<BuildingEditModalProps> = ({
                                                                 building,
                                                                 buildingId,
                                                                 onClose,
                                                                 onUpdate,
                                                             }) => {
    const [formData, setFormData] = useState<Building>(building);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ [key: string]: { id: number; label: string; value: string }[] }>({});

    useEffect(() => {
        setFormData(building);
    }, [building]);

    useEffect(() => {
        const loadOptions = async () => {
            const newOptions: { [key: string]: { id: number; label: string; value: string }[] } = {};
            for (const [key, config] of Object.entries(fieldConfig)) {
                if (config.fetch) {
                    try {
                        newOptions[key] = await config.fetch();
                    } catch (error) {
                        console.error(`Failed to load options for ${key}:`, error);
                    }
                } else if (config.options) {
                    newOptions[key] = config.options;
                }
            }
            setOptions(newOptions);
        };
        loadOptions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const convertedData = {
                ...formData,
                allDayMode: formData.allDayMode === 'Да',
                usableBasement: formData.usableBasement === 'Да'
            };
            const updatedBuilding = await updateBuilding(buildingId, convertedData);
            onUpdate(updatedBuilding);
            console.log(convertedData)
            onClose();
        } catch (error) {
            console.error('Failed to update building:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактирование здания"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            {Object.entries(fieldConfig).map(([key, config]) => {
                if (config.type === 'select') {
                    const optionsList = options[key] || [];
                    return (
                        <div className="mb-4" key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {config.label}
                            </label>
                            <select
                                id={key}
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                            >
                                {optionsList.map(option => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else {
                    return (
                        <div className="mb-4" key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {config.label}
                            </label>
                            <input
                                id={key}
                                type={config.type}
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                            />
                        </div>
                    );
                }
            })}

        </ModalTemplate>
    );
};

export default BuildingEditModal;
