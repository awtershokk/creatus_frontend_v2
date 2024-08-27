import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { fetchBuilding, fetchResponsiblePersons } from '../../api/buildingApi';
import { ResponsiblePerson } from '../../models/ResponsiblePerson';

const BuildingPage = () => {
    const [building, setBuilding] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]); // State for responsible persons
    const buildingId = 1;

    const listTableData = [
        { id: 1, title: 'Секция 1', value: 'Свойства', value2: 'Удалить' },
        { id: 2, title: 'Секция 2', value: 'Свойства', value2: 'Удалить' },
    ];

    const listTableData2 = [
        { id: 1, title: 'Тепловой контур 1', value: 'Свойства', value2: 'Удалить' },
        { id: 2, title: 'Тепловой контур 2', value: 'Свойства', value2: 'Удалить' },
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const buildingData = await fetchBuilding(buildingId);
                setBuilding(buildingData);
                const labelItem = buildingData.find(item => item.title === 'Наименование');
                localStorage.setItem('building', JSON.stringify({ label: labelItem?.value, icon: 'FaRegBuilding' }));

                const responsiblePersonsData = await fetchResponsiblePersons(buildingId);
                setResponsiblePersons(responsiblePersonsData);

            } catch (error) {
                console.error('Error fetching building data:', error);
            }
        };

        getData();
    }, [buildingId]);

    const headers = {
        'Должность': 'position',
        'Тип': 'type',
        'ФИО': 'fio',
        'Телефон': 'phone',
        'E-mail': 'email'
    };

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о здании"/>
                    <ObjectTable
                        title="Свойства здания"
                        data={building}
                        ButtonComponent={EditButton}
                    />
                </div>
                <div className="w-full flex flex-col items-end mt-8 mr-8">
                    <ChildElementsTable
                        infoData={listTableData}
                        tableTitle="Секции"
                        ButtonComponent={AddButton}
                    />
                    <div className='mt-3'>
                        <ChildElementsTable
                            infoData={listTableData2}
                            tableTitle="Тепловые контуры"
                            ButtonComponent={AddButton}
                        />
                    </div>
                </div>

            </div>
            <div className="mt-4">
                <Label text="Ответственные лица"/>
                <ItemTable
                    data={responsiblePersons}
                    headers={headers}
                    sorting={false}
                />
            </div>
        </DefaultLayout>
    );
};

export default BuildingPage;
