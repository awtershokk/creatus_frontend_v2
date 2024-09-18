import React from 'react';

interface ChildElementsTableProps {
    infoData: { id: number; title: string; properties: string; delete: string }[];
    tableTitle: string;
    ButtonComponent: () => JSX.Element;
    LinkComponent: (props: { to: string; text: string; className?: string; onClick?: () => void }) => JSX.Element;
    onDelete: (id: number) => void;
}

const ChildElementsTable: React.FC<ChildElementsTableProps> = ({ infoData, tableTitle, ButtonComponent, LinkComponent, onDelete }) => {
    return (
        <div className="flex mt-2 z-10">
            <div className="w-[500px]">
                <div className="border border-gray-300 bg-gray-100">
                    <div className="flex justify-between items-center bg-gray-200 border-b border-gray-300 p-2 text-black">
                        <span className="flex-1 text-lg font-bold">{tableTitle}</span>
                        <div>
                            <ButtonComponent />
                        </div>
                    </div>
                    <div>
                        {infoData.map((item) => (
                            <div key={item.id} className="flex border-t border-gray-300">
                                <div className="w-1/2 p-2 text-black font-bold">{item.title}</div>
                                <div className="border-l border-gray-300 h-auto mx-2"></div>
                                <div className="w-1/2 p-2 flex justify-between">
                                    <LinkComponent to={item.to} text={item.properties} className="text-gray-800 underline" />
                                    <LinkComponent
                                        to="#"
                                        text={item.delete}
                                        className="text-red-600 underline"
                                        onClick={() => onDelete(item.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildElementsTable;
