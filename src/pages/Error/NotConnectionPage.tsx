import React from 'react';

function NotConnectionPage() {
    const handleRefresh = () => {
        window.location.reload();
    };
    return (
        <div className="flex items-center justify-center w-screen h-screen  from-gray-800 to-gray-600">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">

                <h2 className="text-xl text-gray-800 mb-3">
                    К сожалению, возникли проблемы с подключением к серверу.
                </h2>
                <p className="text-md text-gray-600 mb-4">
                    Попробуйте позже.
                </p>
                <button
                    onClick={handleRefresh}
                    className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">
                    Перезагрузить
                </button>

            </div>
        </div>
    );
}

export default NotConnectionPage;
