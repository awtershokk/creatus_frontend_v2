import { useState, useEffect } from 'react';
import moment from 'moment';
import { applyCellColor } from '../../utils/getTableCellColors';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { FaSort } from 'react-icons/fa';

interface ItemTableProps {
    headers: Record<string, string>;
    data: Array<Record<string, any>>;
    nonSortableColumns?: string[];
    headerStyles?: string;
    rowStyles?: string;
    cellStyles?: string;
}

const ItemTable = ({
                       headers,
                       data,
                       nonSortableColumns = [],
                       headerStyles = 'bg-gray-800 text-white',
                       rowStyles = 'border-b border-gray-200 text-black',
                       cellStyles = 'p-1.5 border border-gray-300 whitespace-nowrap'
                   }: ItemTableProps) => {
    const [tableData, setTableData] = useState(data);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
        key: 'date',
        direction: 'ascending',
    });

    useEffect(() => {
        sortData();
    }, [data, sortConfig]);

    const sortData = () => {
        const { key, direction } = sortConfig;

        const sortedData = [...data].sort((a, b) => {
            if (key === 'date' || key === 'time') {
                const dateA = moment(`${a['date']} ${a['time']}`, 'DD.MM.YYYY HH:mm');
                const dateB = moment(`${b['date']} ${b['time']}`, 'DD.MM.YYYY HH:mm');
                return dateA.isBefore(dateB)
                    ? direction === 'ascending' ? -1 : 1
                    : direction === 'ascending' ? 1 : -1;
            } else if (['calculated_temperature', 'calculated_humidity', 'deviation_temperature', 'deviation_humidity'].includes(key)) {
                return direction === 'ascending'
                    ? a[key] - b[key]
                    : b[key] - a[key];
            } else {
                return direction === 'ascending'
                    ? a[key] < b[key] ? -1 : 1
                    : a[key] > b[key] ? 1 : -1;
            }
        });

        setTableData(sortedData);
    };

    const toggleSortDirection = () => {
        setSortConfig(prevConfig => ({
            key: prevConfig.key,
            direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    const handleSort = (key: string) => {
        if (sortConfig.key === key) {
            toggleSortDirection();
        } else {
            setSortConfig({ key, direction: 'ascending' });
        }
    };

    const getSortIcon = (header: string) => {
        if (nonSortableColumns.includes(header)) {
            return null;
        }

        if (['Дата', 'Время', 'Температура', 'Влажность', 'Отклонение t°', 'Отклонение h'].includes(header)) {
            if (sortConfig.key === headers[header]) {
                return sortConfig.direction === 'ascending' ? (
                    <TiArrowSortedUp className="inline" />
                ) : (
                    <TiArrowSortedDown className="inline" />
                );
            }
            return <FaSort className="inline text-gray-400" />;
        }
        return null;
    };

    return (
        <div className="overflow-auto">
            <table className="table-auto border-collapse">
                <thead className={headerStyles}>
                <tr>
                    {Object.keys(headers).map((header, index) => (
                        <th
                            key={index}
                            className="p-2 border border-gray-300 text-left cursor-pointer"
                            onClick={() =>
                                !nonSortableColumns.includes(header) &&
                                ['Дата', 'Время', 'Температура', 'Влажность', 'Отклонение t°', 'Отклонение h'].includes(header) &&
                                handleSort(headers[header])
                            }
                        >
                            {header} {getSortIcon(header)}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {tableData.map((item, rowIndex) => (
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