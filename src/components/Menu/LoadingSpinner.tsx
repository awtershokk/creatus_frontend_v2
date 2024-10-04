import React from 'react';

interface LoadingSpinnerProps {
    containerClassName?: string;
    spinnerClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           containerClassName = "flex items-center justify-center min-h-screen",
                                                           spinnerClassName = "w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"
                                                       }) => {
    return (
        <div className={containerClassName}>
            <div className={spinnerClassName}></div>
        </div>
    );
};

export default LoadingSpinner;
