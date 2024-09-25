import React, { useEffect, useState } from 'react';
import { FaTimes, FaRegArrowAltCircleUp } from "react-icons/fa";
import GraphPage from "../Graph/GraphPage.tsx";

interface GraphModalProps {
    roomId: string;
    onClose: () => void;
    roomName: string;
}

const GraphModal: React.FC<GraphModalProps> = ({
                                                   roomId,
                                                   onClose,
                                                   roomName,
                                               }) => {
    const [showModal, setShowModal] = useState(false);
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);

    const modalContentRef = React.useRef<HTMLDivElement | null>(null);

    const handleScroll = () => {
        if (modalContentRef.current) {
            if (modalContentRef.current.scrollTop > 200) {
                setIsScrollButtonVisible(true);
            } else {
                setIsScrollButtonVisible(false);
            }
        }
    };

    const scrollToTop = () => {
        if (modalContentRef.current) {
            modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const currentRef = modalContentRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        setTimeout(() => setShowModal(true), 50);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setTimeout(onClose, 50);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}>
            {isScrollButtonVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition z-[60]"
                >
                    <FaRegArrowAltCircleUp size={24} />
                </button>
            )}
            <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
            <div className={`relative bg-white w-full h-full z-10 transform transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}>

                <div className="flex flex-col w-full h-full">
                    <div className="bg-gray-800 px-6 py-4 flex justify-between items-center flex-none">
                        <h2 className="text-xl font-semibold text-white">График для комнаты "{roomName}"</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-400"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>


                    <div
                        ref={modalContentRef}
                        className="p-6 w-full flex-1 overflow-y-auto"
                    >
                        <GraphPage selectedRoomId={roomId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphModal;
