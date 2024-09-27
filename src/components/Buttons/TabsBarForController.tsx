import React from 'react';
import { FaStar } from 'react-icons/fa';

interface TabBarForControllerProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabBarForController: React.FC<TabBarForControllerProps> = ({ activeTab, onTabChange }) => {
    return (
        <div>
            <div className="tabs-container flex space-x-2 mb-3">
                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'all' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('all')}
                >
                    Все
                </button>

                <button
                    className={`tab px-3 py-1 rounded flex items-center ${activeTab === 'favorites' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('favorites')}
                >
                    <FaStar className="mr-1"/>
                    Избранное
                </button>

                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'settings' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('settings')}
                >
                    Уставки
                </button>

                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'inputs' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('inputs')}
                >
                    Входы
                </button>

                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'outputs' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('outputs')}
                >
                    Выходы
                </button>
            </div>

            <div className="tabs-container space-x-2 flex mb-3 mt-2">
                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'control' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('control')}
                >
                    Настройки
                </button>

                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'accidents' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('accidents')}
                >
                    Аварии
                </button>
                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'values' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('values')}
                >
                    Текущие значения
                </button>

                <button
                    className={`tab px-3 py-1 rounded ${activeTab === 'input_node' ? 'bg-gray-600' : 'bg-gray-500'}`}
                    onClick={() => onTabChange('input_node')}
                >
                    Узел ввода
                </button>
            </div>
        </div>
    );
};

export default TabBarForController;
