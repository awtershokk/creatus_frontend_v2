import React, { useEffect, useState } from 'react';
import { FaTimes } from "react-icons/fa";

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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(true);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div className={`relative bg-white rounded-lg shadow-lg w-full max-w-lg z-10 transform transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}>
                <div className="bg-gray-800 px-6 py-4 rounded-t-lg w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">{headerTitle}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-400"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-2 max-h-[60vh] overflow-y-auto">
                    {children}
                </div>
                <div className="flex justify-end space-x-4 p-6  ">
                    <button
                        onClick={handleClose}
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
