import React from 'react';

interface ObjectTableProps {
    title: string;
    data: { id: number; title: string; value: string }[];
    ButtonComponent: ({ onClick }: { onClick: (id: number) => void }) => JSX.Element;
    onRowClick: (id: number) => void;

}

const ObjectTable = ({ title, data, ButtonComponent, onRowClick}: ObjectTableProps) => {
    return (
        <div className="flex mt-2 z-10">
            <div className="w-[600px]">
                <div className="border border-gray-300 bg-gray-100">
                    <div className="flex justify-between items-center bg-gray-200 border-b border-gray-300 p-2 text-black">
                        <span className="flex-1 text-lg font-bold">{title}</span>
                        <div>
                            <ButtonComponent onClick={(id) => onRowClick(id)} />
                        </div>
                    </div>
                    <div>
                        {data.map((item) => (
                            <div key={item.id} className="flex items-center border-t border-gray-300">
                                <div className="w-1/2 p-2 text-black font-bold border-r border-gray-300">
                                    {item.title}
                                </div>
                                <div className="w-1 px-2 border-r border-gray-300"></div>
                                <div className="w-1/2 p-2 text-black">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectTable;
