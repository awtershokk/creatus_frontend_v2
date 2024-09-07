import React from 'react';

interface TabProps {
    tabIndex: number;
    setTabIndex: (index: number) => void;
}

const TabsButton: React.FC<TabProps> = ({ tabIndex, setTabIndex }) => {
    return (
        <div className="tabs inline-flex border-b border-gray-700 mb-4 justify-center">
            <button
                className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                    tabIndex === 0 ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setTabIndex(0)}
            >
                Информация о помещении
            </button>
            <button
                className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                    tabIndex === 1 ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setTabIndex(1)}
            >
                Измеренные значения
            </button>
            <button
                className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                    tabIndex === 2 ? 'border-gray-800 text-gray-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setTabIndex(2)}
            >
                График t° и h
            </button>
        </div>
    );
};

export default TabsButton;
