import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
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
    progressStyles?: string;
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
                                                         buttonStyles = "px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-black transition",
                                                         progressStyles="absolute top-0 left-0 h-full bg-red-600 opacity-50"
                                                     }) => {
    const [showModal, setShowModal] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimeout = useRef<NodeJS.Timeout | null>(null);

    const modalContentRef = useRef<HTMLDivElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null); // Реф для кнопки подтверждения

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
                    clearInterval(holdTimeout.current!);
                    onSubmit();
                    return prev;
                }
                return prev + 1;
            });
        }, 10);
    };

    const handleMouseUp = () => {
        if (!deleteMode) return;
        if (holdTimeout.current) {
            clearInterval(holdTimeout.current);
            setHoldProgress(0);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const focusableElements = modalContentRef.current?.querySelectorAll(
            'input, button, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.prototype.slice.call(focusableElements);

        const currentIndex = focusable.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % focusable.length;
            (focusable[nextIndex] as HTMLElement)?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + focusable.length) % focusable.length;
            (focusable[prevIndex] as HTMLElement)?.focus();
        }


        if (e.key === 'Enter' && submitButtonRef.current) {
            e.preventDefault();
            submitButtonRef.current.click();
        }


        if (e.key === 'Escape') {
            e.preventDefault();
            handleClose();
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div
                className={`relative bg-white rounded-lg shadow-lg w-full ${wight} z-10 transform transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
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

                <div ref={modalContentRef} className="p-6 space-y-2 max-h-[60vh] overflow-y-auto">
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
                                ref={submitButtonRef}
                                onClick={!deleteMode ? onSubmit : undefined}
                                className={`${buttonStyles} relative overflow-hidden`}
                                disabled={loading}
                            >
                                {loading ? 'Сохранение...' : buttonLabel}
                                {deleteMode && (
                                    <div
                                        style={{ width: `${holdProgress}%` }}
                                        className={progressStyles}
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
