import React from 'react';
import { Link } from 'react-router-dom';

interface ChildElementsTableProps {
    infoData: { id: number; title: string; value: string; value2: string }[];
    tableTitle: string;
    buttonLabel: string;
    onButtonClick: () => void;
}

const ChildElementsTable: React.FC<ChildElementsTableProps> = ({ infoData, tableTitle, buttonLabel, onButtonClick }) => {
    return (
        <div className="max-w-[600px] border border-gray-300 bg-gray-100">
            <div className="flex justify-between items-center bg-gray-200 border-b border-gray-300 p-2 text-black">
                <span className="flex-1 text-lg font-bold">{tableTitle}</span>
                <button
                    className="btn btn-primary"
                    onClick={onButtonClick}
                >
                    {buttonLabel}
                </button>
            </div>
            {infoData.map((item) => (
                <div key={item.id} className="flex border-t border-gray-300">
                    <div className="w-1/2 p-2 text-black font-bold">{item.title}</div>
                    <div className="w-1/2 p-2 flex justify-between">
                        <Link to={''} className="text-black underline">
                            {item.value}
                        </Link>
                        <button
                            className="text-red-600 underline"
                            onClick={() => {/*  */}}
                        >
                            {item.value2}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChildElementsTable;
