import React, { useState } from 'react';
import { FaCheck, FaPencilAlt } from "react-icons/fa";

interface ObjectTableProps {
    title: string;
    data: { id: number; title: string; value: string }[];
    onUpdate: (updatedData: { id: number; title: string; value: string }) => void;
    nonEditableFields?: string[];
}

const ObjectTable = ({ title, data, onUpdate, nonEditableFields = [] }: ObjectTableProps) => {
    const [editState, setEditState] = useState<{ [key: number]: boolean }>({});

    const handleEditClick = (id: number) => {
        setEditState(prevState => ({ ...prevState, [id]: true }));
    };

    const handleSaveClick = (id: number, newValue: string) => {
        const updatedItem = data.find(item => item.id === id);
        if (updatedItem) {
            onUpdate({ id, title: updatedItem.title, value: newValue });
        }
        setEditState(prevState => ({ ...prevState, [id]: false }));
    };

    return (
        <div className="flex mt-2 z-10">
            <div className="w-[550px]">
                <div className="border border-gray-300 bg-gray-100">
                    <div className="flex justify-between items-center bg-gray-200 border-b border-gray-300 p-2 text-black">
                        <span className="flex-1 text-lg font-bold">{title}</span>
                    </div>
                    <div>
                        {data.map((item) => {
                            const isEditable = !nonEditableFields.includes(item.title);
                            return (
                                <div key={item.id} className="flex items-center border-t border-gray-300">
                                    <div className="w-1/2 p-2 text-black font-bold border-r border-gray-300">{item.title}</div>
                                    <div className="w-1 px-2 border-r border-gray-300"></div> {/* полоса*/}
                                    <div className="w-1/2 p-2 text-black flex items-center">
                                        {editState[item.id] ? (
                                            <input
                                                type="text"
                                                defaultValue={item.value}
                                                className="border p-1 mr-2 bg-gray-100 border-gray-700"
                                                onBlur={(e) => handleSaveClick(item.id, e.target.value)}
                                            />
                                        ) : (
                                            <span>{item.value}</span>
                                        )}
                                        {isEditable && (
                                            <>
                                                {editState[item.id] ? (
                                                    <button
                                                        onClick={() => handleSaveClick(item.id, item.value)}
                                                        className="ml-2 text-green-500"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditClick(item.id)}
                                                        className="ml-2 text-gray-800"
                                                    >
                                                        <FaPencilAlt />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectTable;
