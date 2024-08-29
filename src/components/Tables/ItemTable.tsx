import { useState, useEffect } from 'react';
import moment from 'moment';
import { applyCellColor } from '../../utils/getTableCellColors';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

interface ItemTableProps {
    headers: Record<string, string>;
    data: Array<Record<string, any>>;
    sorting?: boolean;
    sortableColumns?: string[];
}

const ItemTable = ({ headers, data, sorting = true, sortableColumns = [] }: ItemTableProps) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
        key: 'date',
        direction: 'ascending',
    });

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    const handleSort = (header: string) => {
        if (!sorting || !sortableColumns.includes(header)) return;

        const key = headers[header];
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sorted = [...data].sort((a, b) => {
            if (key === 'date') {
                const dateA = moment(a[key], 'DD.MM.YYYY');
                const dateB = moment(b[key], 'DD.MM.YYYY');
                return dateA.isBefore(dateB)
                    ? direction === 'ascending' ? -1 : 1
                    : direction === 'ascending' ? 1 : -1;
            } else if (key === 'time') {
                const timeA = moment(a[key], 'HH:mm');
                const timeB = moment(b[key], 'HH:mm');
                return timeA.isBefore(timeB)
                    ? direction === 'ascending' ? -1 : 1
                    : direction === 'ascending' ? 1 : -1;
            }
            return direction === 'ascending'
                ? a[key] < b[key] ? -1 : 1
                : a[key] > b[key] ? 1 : -1;
        });

        setSortedData(sorted);
    };

    const getSortArrow = (header: string) => {
        if (sortConfig.key === headers[header]) {
            return sortConfig.direction === 'ascending' ? <TiArrowSortedUp className="inline" /> : <TiArrowSortedDown className="inline" />;
        }
        return null;
    };

    return (
        <div>
            <table className="table-auto w-auto border-collapse border border-gray-200 mt-2 mb-2">
                <thead className="bg-gray-800 text-white">
                <tr>
                    {Object.keys(headers).map((header, index) => (
                        <th
                            key={index}
                            className={`p-1.5 border border-gray-300 text-left ${
                                sortableColumns.includes(header) ? '' : 'cursor-default'
                            }`}
                            onClick={() => handleSort(header)}
                        >
                            {header} {getSortArrow(header)}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {sortedData.map((item, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-200 text-black">
                        {Object.entries(item).map(([columnName, value]) => (
                            <td
                                key={columnName}
                                className="p-1.5 border border-gray-300 whitespace-nowrap"
                                style={applyCellColor(value, columnName)}
                            >
                                {value}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
