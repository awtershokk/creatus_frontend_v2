import React, { useEffect, useState } from 'react';
import { Building } from '../../../models/Building';
import { updateBuilding, fetchListEnergyClasses, fetchListTimezones, fetchListHwsConnectionDiagrams } from '../../../api/requests/buildingApi.ts';
import ModalTemplate from '../ModalTemplate';

interface BuildingEditModalProps {
    building: Building;
    buildingId: number;
    onClose: () => void;
    onUpdate: (updatedBuilding: Building) => void;
}

export interface BuildingForm {
    label: string;
    address?: string;
    energyClass?: number;
    constructionVolume?: number;
    heatedArea?: number;
    timezone?: number;
    allDayMode?: boolean;
    compactnessIndicator?: number;
    floor?: number;
    usableBasement?: boolean;
    hsCapacity?: string;
    hsLoad?: string;
    hwsLoad?: string;
    ventilationLoad?: string;
    hwsConnectionDiagram?: number;
    balanceHolderLabel?: string;
}

const fieldConfig = {
    label: { type: 'text', label: 'Наименование' },
    address: { type: 'text', label: 'Адрес' },
    energyClass: { type: 'select', label: 'Энергокласс', fetch: fetchListEnergyClasses },
    constructionVolume: { type: 'number', label: 'Строительный объем' },
    heatedArea: { type: 'number', label: 'Отапливаемая площадь' },
    timezone: { type: 'select', label: 'Часовой пояс', fetch: fetchListTimezones },
    allDayMode: { type: 'boolean', label: 'Круглосуточный режим' },
    compactnessIndicator: { type: 'number', label: 'Показатель компактности' },
    floor: { type: 'number', label: 'Число этажей' },
    usableBasement: { type: 'boolean', label: 'Эксплуатируемый подвал' },
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
    const [formData, setFormData] = useState<BuildingForm>({
        label: building.label,
        address: building.address,
        energyClass: building.energyClass?.id || '',
        constructionVolume: building.constructionVolume || 0,
        heatedArea: building.heatedArea || 0,
        timezone: building.timezone?.id || '',
        allDayMode: building.allDayMode || false,
        compactnessIndicator: building.compactnessIndicator || 0,
        floor: building.floor || 1,
        usableBasement: building.usableBasement || false,
        hsCapacity: building.hsCapacity || '',
        hsLoad: building.hsLoad || '',
        hwsLoad: building.hwsLoad || '',
        ventilationLoad: building.ventilationLoad || '',
        hwsConnectionDiagram: building.hwsConnectionDiagram?.id || '',
        balanceHolderLabel: building.balanceHolderLabel || '',
    });

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ [key: string]: { id: number; label: string; value?: string }[] }>({});

    useEffect(() => {
        const loadOptions = async () => {
            const newOptions: { [key: string]: { id: number; label: string }[] } = {};
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (['energyClass', 'timezone', 'hwsConnectionDiagram'].includes(name)) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: parseInt(value),
            }));
        } else if (['allDayMode', 'usableBasement'].includes(name)) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value === 'true',
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updatedFormData = {
                ...formData,
                energyClass: options.energyClass?.find(option => option.id === formData.energyClass)?.label || formData.energyClass,
                timezone: options.timezone?.find(option => option.id === formData.timezone)?.label || formData.timezone,
                hwsConnectionDiagram: options.hwsConnectionDiagram?.find(option => option.id === formData.hwsConnectionDiagram)?.label || formData.hwsConnectionDiagram,
            };



            const updatedBuilding = await updateBuilding(buildingId, updatedFormData);
            onUpdate(updatedBuilding);
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
                                onChange={handleSelectChange}
                                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                            >
                                {optionsList.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else if (config.type === 'boolean') {
                    return (
                        <div className="mb-4" key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {config.label}
                            </label>
                            <select
                                id={key}
                                name={key}
                                value={formData[key] === true ? 'true' : 'false'}
                                onChange={handleSelectChange}
                                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                            >
                                <option value="true">Да</option>
                                <option value="false">Нет</option>
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
