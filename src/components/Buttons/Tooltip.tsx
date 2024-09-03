import React from 'react';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { Transition } from '@headlessui/react';

interface TooltipProps {
    message: string;
    isVisible: boolean;
    toggleVisibility: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ message, isVisible, toggleVisibility }) => {
    return (
        <div className="relative flex items-center">
            <FaRegQuestionCircle
                onClick={toggleVisibility}
                className="text-gray-500 cursor-pointer absolute right-0"
                size={16}
            />
            <Transition
                show={isVisible}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
            >
                <div className="absolute bottom-5 right-0  bg-gray-700 text-white text-sm p-2 rounded shadow-md">
                    {message}
                </div>
            </Transition>
        </div>
    );
};

export default Tooltip;
