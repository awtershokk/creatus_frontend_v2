import React from 'react';
import { FaRegFileExcel, FaFileCsv } from 'react-icons/fa';

const DownloadButton: React.FC = () => {
    return (
        <div className="flex items-center mt-2 mb-4">
            <button
                className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer text-center flex items-center"
            >
                <FaFileCsv className="mr-2" />
                Скачать таблицу в CSV
            </button>

            <button
                className="px-3 py-2 mx-4 bg-green-500 text-white rounded-lg cursor-pointer text-center flex items-center"
            >
                <FaRegFileExcel className="mr-2" />
                Скачать таблицу в Excel
            </button>
        </div>
    );
};

export default DownloadButton;
