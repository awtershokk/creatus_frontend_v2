import React from 'react';


const HistoryTable = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return <div>Нет данных для отображения</div>;
    }

    const headers = ['Модуль', 'Группа', 'Параметр', 'Дата', 'Значение'];


    const formattedData = data.flatMap(item =>
        item.table.map(entry => ({
            'Модуль': item.head.module,
            'Группа': item.head.group,
            'Параметр': item.head.label,
            'Дата': new Date(entry.x).toLocaleString(),
            'Значение': entry.y,
        }))
    );

    return (
        <div >
            <h3 className="text-black mt-3 mb-3 text-2xl">История</h3>

            <div className="inline-block max-h-[300px] max-w-[520px] overflow-y-auto border-3 mr-1">
                <table className="table-auto border-collapse w-full">
                    <thead className="bg-gray-800 text-white whitespace-nowrap">
                    <tr>
                        {headers.map(header => (
                            <th className="p-2 border border-gray-300 text-left cursor-pointer" key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {formattedData.map((row, index) => (
                        <tr className="border-b border-gray-200 text-black" key={index}>
                            <td className="p-1.5 border border-gray-300 whitespace-nowrap">{row['Модуль']}</td>
                            <td className="p-1.5 border border-gray-300 whitespace-nowrap">{row['Группа']}</td>
                            <td className="p-1.5 border border-gray-300 whitespace-nowrap">{row['Параметр']}</td>
                            <td className="p-1.5 border border-gray-300 whitespace-nowrap">{row['Дата']}</td>
                            <td className="p-1.5 border border-gray-300 whitespace-nowrap">{row['Значение']}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTable;
