import React from 'react';

interface Tab {
    index: number;
    label: string;
}

interface TabProps {
    tabIndex: number;
    setTabIndex: (index: number) => void;
    tabs: Tab[];
}

const TabsButton: React.FC<TabProps> = ({ tabIndex, setTabIndex,  tabs }) => {
    return (
        <div className="tabs inline-flex border-b border-gray-700 mb-4 justify-center">
            {tabs
                .map(tab => (
                    <button
                        key={tab.index}
                        className={`tab py-2 px-4 text-sm font-medium border-b-2 ${
                            tabIndex === tab.index
                                ? 'border-gray-800 text-gray-700'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                        onClick={() => setTabIndex(tab.index)}
                    >
                        {tab.label}
                    </button>
                ))}
        </div>
    );
};

export default TabsButton;
