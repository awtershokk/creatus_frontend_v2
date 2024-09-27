import React from 'react';
import ItemTable from './ItemTable';
import {HistoryTableProps} from "../../models/History.ts";


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
            <h3 className="text-black mt-3 mb-3 text-2xl">История</h3>
            <ItemTable
                headers={headers}
                data={formattedData}
                nonSortableColumns={['module', 'group', 'label']}
                mainTableStyles="overflow-x-auto max-h-[400px]"

            />
        </div>
    );
};

export default HistoryTable;
