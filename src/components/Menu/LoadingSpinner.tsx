import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
