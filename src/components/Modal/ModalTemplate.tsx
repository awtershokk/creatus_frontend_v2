import React from 'react';
import {FaTimes} from "react-icons/fa";

interface ModalTemplateProps {
    headerTitle: string;
    buttonLabel: string;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
    loading: boolean;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
                                                         headerTitle,
                                                         buttonLabel,
                                                         onClose,
                                                         onSubmit,
                                                         children,
                                                         loading,
                                                     }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{headerTitle}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    {children}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-black transition"
                        disabled={loading}
                    >
                        {loading ? 'Сохранение...' : buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTemplate;
