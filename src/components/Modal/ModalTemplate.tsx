import React, { useEffect, useState, useRef } from 'react';
import { FaTimes } from "react-icons/fa";

interface ModalTemplateProps {
    headerTitle: string;
    buttonLabel: string | null;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
    loading: boolean;
    cancelButtonLabel?: string;
    wight?: string;
    deleteMode?: boolean;
    buttonStyles?: string;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
                                                         headerTitle,
                                                         buttonLabel,
                                                         onClose,
                                                         onSubmit,
                                                         children,
                                                         loading,
                                                         cancelButtonLabel = 'Отмена',
                                                         wight = 'max-w-[500px]',
                                                         deleteMode = false,
                                                         buttonStyles = "px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-black transition", // дефолтные стили
                                                     }) => {
    const [showModal, setShowModal] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTimeout(() => setShowModal(true), 50);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setTimeout(onClose, 300);
    };


    const handleMouseDown = () => {
        if (!deleteMode) return;
        setHoldProgress(0);
        holdTimeout.current = setInterval(() => {
            setHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(holdTimeout.current!); // Остановить, когда достигнут 100%
                    onSubmit();
                    return prev;
                }
                return prev + 1;
            });
        }, 10); // Прогресс будет увеличиваться каждые 10ms (итого 1 секунды для 100%)
    };

    // Остановка удержания
    const handleMouseUp = () => {
        if (!deleteMode) return;
        if (holdTimeout.current) {
            clearInterval(holdTimeout.current); // Остановить таймер
            setHoldProgress(0);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div className={`relative bg-white rounded-lg shadow-lg w-full ${wight} z-10 transform transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}>
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

                <div className="flex justify-end space-x-4 p-6">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    >
                        {cancelButtonLabel}
                    </button>
                    {buttonLabel && (
                        <div
                            className="relative"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <button
                                onClick={!deleteMode ? onSubmit : undefined}
                                className={`${buttonStyles} relative overflow-hidden`}
                                disabled={loading}
                            >
                                {loading ? 'Сохранение...' : buttonLabel}
                                {deleteMode && (
                                    <div
                                        style={{ width: `${holdProgress}%` }}
                                        className="absolute top-0 left-0 h-full bg-red-600 opacity-50"
                                    />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalTemplate;
