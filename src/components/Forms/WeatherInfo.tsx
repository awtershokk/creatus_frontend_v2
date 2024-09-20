import React from 'react';
import { FaThermometerHalf, FaTint } from 'react-icons/fa';

interface WeatherInfoProps {
    temperature: number;
    humidity: number;
    lastUpdated: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ temperature, humidity, lastUpdated }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-auto mx-auto">
            <div className="flex items-center mb-4">
                <FaThermometerHalf className="text-gray-800 mr-2" />
                <span className="text-xl font-bold text-black">Текущая температура: {temperature}°C</span>
            </div>
            <div className="flex items-center mb-4">
                <FaTint className="text-gray-800 mr-2" />
                <span className="text-xl font-bold text-black">Текущая влажность: {humidity}%</span>
            </div>
            <div className="text-sm text-gray-600 mt-4">
                Время последнего обновления: {lastUpdated}
            </div>
        </div>
    );
};

export default WeatherInfo;
