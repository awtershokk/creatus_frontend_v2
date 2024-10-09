import React from 'react';
import ItemTable from './ItemTable';
import { HistoryTableProps } from "../../models/History.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import Label from "../Text/Label.tsx";
import { formatDateTime} from "../../utils/formatDateTime.ts";

const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Нет данных для отображения</div>;
    }


    const headers = {
        'Модуль': 'module',
        'Группа': 'group',
        'Параметр': 'label',
        'Дата': 'date',
        'Время': 'time',
        'Значение': 'value'
    };


    const formattedData = data.flatMap(item =>
        item.table.map(entry => {
            const { date, time } = formatDateTime(entry.x);
            return {
                'module': item.head.module,
                'group': item.head.group,
                'label': item.head.label,
                'date': date,
                'time': time,
                'value': entry.y
            };
        })
    );

    return (
        <div>
            <div className="flex items-center mb-2">
                <Label text="История"/>
            </div>
            <TableContainer>
                <ItemTable
                    headers={headers}
                    data={formattedData}
                    nonSortableColumns={['module', 'group', 'label']}
                />
            </TableContainer>
        </div>
    );
};

export default HistoryTable;
