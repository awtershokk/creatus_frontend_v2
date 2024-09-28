import React, { useState, useEffect } from 'react';
import ModalTemplate from "../ModalTemplate.tsx";

interface EditControllerParametrModalProps {
    onHide: () => void;
    parameter: string;
    parameterValue: string | number;
    parameterType: string | string[];
    onSave: (value: string | number) => void;
    parameterId: number;
}

const EditControllerParametrModal: React.FC<EditControllerParametrModalProps> = ({
                                                                                     onHide,
                                                                                     parameter,
                                                                                     parameterValue,
                                                                                     parameterType,
                                                                                     onSave
                                                                                 }) => {
    const [inputValue, setInputValue] = useState<string | number>(parameterValue);

    useEffect(() => {
        setInputValue(parameterValue);
    }, [parameterValue]);

    const handleSave = () => {
        let valueToSave: string | number = inputValue;

        if (typeof parameterType === 'string') {
            if (parameterType === 'INTEGER') {
                valueToSave = parseInt(inputValue as string, 10);
            } else if (parameterType === 'DECIMAL_1') {
                valueToSave = parseFloat(inputValue as string).toFixed(1);
            } else if (parameterType === 'DECIMAL_2') {
                valueToSave = parseFloat(inputValue as string).toFixed(2);
            }
        }

        onSave(valueToSave);
        onHide();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputValue(e.target.value);
    };

    const renderInputField = () => {
        if (Array.isArray(parameterType)) {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Значение:
                    </label>
                    <select
                        className="mt-1 block text-black w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={inputValue}
                        onChange={handleInputChange}
                    >
                        {parameterType.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Значение:
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full text-black px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>
        );
    };

    return (
        <ModalTemplate
            headerTitle="Редактирование параметра"
            buttonLabel="Сохранить"
            onClose={onHide}
            onSubmit={handleSave}
            loading={false}
            cancelButtonLabel="Отмена"
            wight="max-w-[600px]"
        >
            <div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Параметр:
                    </label>
                    <p className="text-gray-900 font-semibold">{parameter}</p>
                </div>
                {renderInputField()}
            </div>
        </ModalTemplate>
    );
};

export default EditControllerParametrModal;
