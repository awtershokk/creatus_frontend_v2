import React from 'react';

interface TableContainerProps {
    children: React.ReactNode;
}

const TableContainer = ({ children }: TableContainerProps) => {
    return (
        <div className="inline-block max-h-[300px] overflow-y-auto border-3">
            {children}
            </div>
    );
};

export default TableContainer;
