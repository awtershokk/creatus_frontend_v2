import React from 'react';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { FaRegFileExcel, FaFileCsv } from 'react-icons/fa';

type DownloadButtonProps = {
    data: Record<string, any>[];
    headers: string[];
    filename: string;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ data, headers, filename }) => {
    const headerKeyMap1 = {
        'Дата': 'date',
        'Время': 'time',
        'Температура': 'calculated_temperature',
        'Влажность': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    const headerKeyMap2 = {
        'Дата': 'date',
        'Время': 'time',
        'Измеренная t°': 'measured_temperature',
        'Калиброванная t°': 'calculated_temperature',
        'Измеренная h': 'measured_humidity',
        'Калиброванная h': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    const headerKeyMap3 = {
        'Модуль': 'module',
        'Группа': 'group',
        'Параметр': 'label',
        'Дата': 'x',
        'Значение': 'y',
    };

    const getHeaderKeyMap = (headers: string[]) => {
        if (headers.includes('Измеренная t°')) {
            return headerKeyMap2;
        } else if (headers.includes('Модуль')) {
            return headerKeyMap3;
        }
        return headerKeyMap1;
    };

    const headerKeyMap = getHeaderKeyMap(headers);

    const csvData = data.map((item) => {
        const newItem: Record<string, any> = {};
        for (const [header, key] of Object.entries(headerKeyMap)) {
            newItem[header] = item[key];
        }
        return newItem;
    });

    const csvHeaders = headers.map((header) => ({
        label: header,
        key: header,
    }));

    const downloadExcel = () => {
        const worksheetData = [headers, ...csvData.map((item) => headers.map((header) => item[header]))];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <div className="flex items-center">
            <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={`${filename}.csv`}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer text-center no-underline flex items-center"
            >
                <FaFileCsv className="mr-2" />
                Скачать таблицу в CSV
            </CSVLink>
            <div className="h-7 w-0.5 bg-gray-300 mx-2"></div>
            <button
                onClick={downloadExcel}
                className="px-3 py-2 bg-green-500 text-white rounded-lg cursor-pointer text-center flex items-center"
            >
                <FaRegFileExcel className="mr-2" />
                Скачать таблицу в Excel
            </button>
        </div>
    );
};

export default DownloadButton;
