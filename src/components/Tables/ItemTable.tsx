import { useState, useEffect } from 'react';
import moment from 'moment';
import { applyCellColor } from '../../utils/getTableCellColors';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

interface ItemTableProps {
    headers: Record<string, string>;
    data: Array<Record<string, any>>;
    sorting?: boolean;
    sortableColumns?: string[];
    headerStyles?: string;
    rowStyles?: string;
    cellStyles?: string;
}

const ItemTable = ({
                       headers,
                       data,
                       sorting = true,
                       sortableColumns = [],
                       headerStyles = 'bg-gray-800 text-white',
                       rowStyles = 'border-b border-gray-200 text-black',
                       cellStyles = 'p-1.5 border border-gray-300 whitespace-nowrap'
                   }: ItemTableProps) => {
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
        console.log(`Sorting by: ${key}, direction: ${direction}`);  // Отладка
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
        <div className="overflow-auto">
            <table className="table-auto  border-collapse">
                <thead className={headerStyles}>
                <tr>
                    {Object.keys(headers).map((header, index) => (
                        <th
                            key={index}
                            className={`p-2 border border-gray-300 text-left ${
                                sortableColumns.includes(header) ? 'cursor-pointer' : 'cursor-default'
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
                    <tr key={rowIndex} className={rowStyles}>
                        {Object.entries(item).map(([columnName, value]) => (
                            <td
                                key={columnName}
                                className={cellStyles}
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
