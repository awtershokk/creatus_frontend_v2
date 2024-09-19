import React from 'react';

const CustomCheckbox = ({ checked, onChange, label, showDivider = true }) => {
    return (
        <>
            <label className="block ml-1 relative cursor-pointer select-none flex items-center">
                <input
                    type="checkbox"
                    className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none transition-all duration-300"
                    checked={checked}
                    onChange={onChange}
                />

                <svg
                    className={`w-4 h-4 absolute left-0.5 text-white pointer-events-none transition-opacity duration-300 ${
                        checked ? 'opacity-100' : 'opacity-0'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414-1.414L7.5 12.086 4.707 9.293a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8-8z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="ml-2 text-gray-700">{label}</span>
            </label>
            {showDivider && <hr className="my-2 border-t border-gray-300" />}
        </>
    );
};

export default CustomCheckbox;
