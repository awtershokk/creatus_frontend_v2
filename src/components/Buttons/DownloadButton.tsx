import React, {useState} from 'react';
import {FaRegFileExcel, FaFileCsv, FaTelegramPlane} from 'react-icons/fa';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Alert from "../Alert.tsx";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

type DownloadButtonProps = {
    headers: { [key: string]: string };
    data: Array<{ [key: string]: any }>;
};

const DownloadButton: ({headers, data}: { headers: any; data: any }) => void = ({ headers, data }) => {
    const [showNumberAlert, setShowNumberAlert] = useState(false);
    const [alertShownOnce, setAlertShownOnce] = useState(false);


    const handlePhoneClick = () => {
        if (!alertShownOnce) {
            setShowNumberAlert(true);
            setAlertShownOnce(true);
        }
    };

    const handleAlertClose = () => {
        setShowNumberAlert(false);
    };

    const exportToCSV = () => {
        if (!headers || typeof headers !== 'object' || !data) {
            setShowNumberAlert(true)
            return;
        }

        const csvRows: string[] = [];
        const headerRow = Object.keys(headers).join(',');
        csvRows.push(headerRow);

        data.forEach(row => {
            const values = Object.values(headers).map(headerKey => row[headerKey] || '');
            csvRows.push(values.join(','));
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'table-data.csv');
    };

    const exportToExcel = () => {
        if (!headers || typeof headers !== 'object' || !data) {
            setShowNumberAlert(true)
            return;
        }

        const worksheetData = [
            Object.keys(headers),
            ...data.map(row => Object.values(headers).map(headerKey => row[headerKey] || '')),
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'table-data.xlsx');
    };

    return (
        <div className="flex items-center mt-2 mb-4">
            <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer text-center flex items-center"
            >
                <FaFileCsv className="mr-2" />
                Выгрузить таблицу в CSV
            </button>

            <button
                onClick={exportToExcel}
                className="px-3 py-2 mx-4 bg-green-500 text-white rounded-lg cursor-pointer text-center flex items-center"
            >
                <FaRegFileExcel className="mr-2" />
                Выгрузить таблицу в Excel
            </button>
            <Alert
                message={
                    <>
                        <span className="text-red-600">
                            Ошибка выгрузки таблицы.
                        </span>
                    </>
                }
                isVisible={showNumberAlert}
                onClose={handleAlertClose}
            />
        </div>

    );
};

export default DownloadButton;
