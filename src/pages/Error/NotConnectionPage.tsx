import React from 'react';
import not_connection from '../../assets/not_connection.gif';

function NotConnectionPage() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-200">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                <div className="flex flex-col items-center justify-center mb-2">
                    {/*<div className="">*/}
                    {/*    <img*/}
                    {/*        src={not_connection}*/}
                    {/*        alt=""*/}
                    {/*        className="w-[300]"*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <h2 className="text-xl text-gray-800">
                    Сбой подключения к серверу. Код ошибки: 500
                </h2>
                <p className="text-md text-gray-600 mb-2">
                    Повторите попытку позже.
                </p>
                <button
                    onClick={handleRefresh}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    Проверить подключение
                </button>
            </div>
        </div>
    );
}

export default NotConnectionPage;
