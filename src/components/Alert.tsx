import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AlertProps {
    message: React.ReactNode;
    onClose: () => void;
    isVisible: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, onClose, isVisible }) => {
    const [showAlert, setShowAlert] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShowAlert(true);

            const timer = setTimeout(() => {
                setShowAlert(false);
                setTimeout(onClose, 300);
            }, 4000);

            return () => clearTimeout(timer);
        } else {
            setShowAlert(false);
        }
    }, [isVisible, onClose]);

    const handleClose = () => {
        setShowAlert(false);
        setTimeout(onClose, 300);
    };

    return (
        <>
            {isVisible && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${showAlert ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
                    <div className={`relative bg-white rounded-lg shadow-lg max-w-[400px] w-full z-10 transform transition-transform duration-300 ${showAlert ? 'scale-100' : 'scale-95'}`}>
                        <div className="bg-gray-800 px-6 py-4 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-white">Уведомление</h2>
                                <button onClick={handleClose} className="text-gray-500 hover:text-gray-400">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-800">{message}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Alert;
