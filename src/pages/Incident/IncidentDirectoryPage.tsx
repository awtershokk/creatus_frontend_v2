import React from 'react';
import ItemTable from "../../components/Tables/ItemTable.tsx";
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";


interface TableData {
    code: string;
    name: string;
    objectType: string;
    criticality: string;
}

const IncidentDirectoryPage: React.FC = () => {
    localStorage.setItem('directory', JSON.stringify({ label: 'Справочник', icon: 'FaBook' }));


    const headers = {
        'Код': 'code',
        'Наименование': 'name',
        'Тип объекта': 'objectType',
        'Критичность': 'criticality',

    };
    const tableData: TableData[] = [
        { code: 'Д.1', name: 'Заряд батареи датчика ниже 20%', objectType: 'Датчик', criticality: 'Предупреждение' },
        { code: 'Д.2', name: 'Заряд батареи датчика ниже 10%', objectType: 'Датчик', criticality: 'Высокая' },
        { code: 'Д.3', name: 'Нет сигнала с датчика', objectType: 'Датчик', criticality: 'Высокая' },
        { code: 'Т.1', name: 'Температура точки измерения выше верхней границы диапазона на 10 градусов', objectType: 'Точка измерения', criticality: 'Средняя' },
        { code: 'Т.2', name: 'Температура точки измерения меньше нижней границы диапазона на 10 градусов', objectType: 'Точка измерения', criticality: 'Средняя' },
        { code: 'П.1', name: 'Температура помещения выше верхней границы диапазона на 10 градусов', objectType: 'Помещение', criticality: 'Высокая' },
        { code: 'П.2', name: 'Температура помещения меньше нижней границы диапазона на 10 градусов', objectType: 'Помещение', criticality: 'Высокая' },
    ];

    return (

        <DefaultLayout>
                <Label text="Справочник инцидентов"/>
                    <ItemTable
                        headers={headers}
                        data={tableData}
                        sorting={false}
                    />
        </DefaultLayout>

    );
};

export default IncidentDirectoryPage;
