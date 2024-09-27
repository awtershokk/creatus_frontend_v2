import React from 'react';
import ItemTable from './ItemTable';
import {HistoryTableProps} from "../../models/History.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import Label from "../Text/Label.tsx";


const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Нет данных для отображения</div>;
    }

    const headers = {
        'Модуль': 'module',
        'Группа': 'group',
        'Параметр': 'label',
        'Дата': 'date',
        'Значение': 'value'
    };


    const formattedData = data.flatMap(item =>
        item.table.map(entry => ({
            'module': item.head.module,
            'group': item.head.group,
            'label': item.head.label,
            'date': new Date(entry.x).toLocaleString(),
            'value': entry.y
        }))
    );

    return (
        <div>
            <Label text='История'/>
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
