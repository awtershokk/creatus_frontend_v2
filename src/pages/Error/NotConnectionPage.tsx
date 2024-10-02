import React, { useState } from 'react';
import { VscDebugDisconnect } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


function NotConnectionPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
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
                    className={`p-2 bg-gray-700 text-white rounded-full transition ml-1 text-s ${
                        isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-900'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin text-white mr-2" />
                    ) : (
                        <VscDebugDisconnect className="text-white mr-0.5 ml-0.5" />
                    )}
                    <span className="text-white">
                        {isLoading ? 'Перезагрузка...' : 'Проверить подключение'}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default NotConnectionPage;
