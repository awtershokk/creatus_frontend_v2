import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import { fetchBuilding } from '../../api/buildingApi';

const BuildingPage = () => {
    const [data, setData] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const buildingId = 1;

    const listTableData = [
        { id: 1, title: 'Секция 1', value: 'Свойства', value2: 'Удалить' },
        { id: 2, title: 'Секция 2', value: 'Свойства', value2: 'Удалить' },
    ];

    useEffect(() => {
        const getBuildingData = async () => {
            try {
                const buildingData = await fetchBuilding(buildingId);
                setData(buildingData);
                const labelItem = buildingData.find(item => item.title === 'Наименование');
                localStorage.setItem('building', JSON.stringify({ label: labelItem.value, icon: 'FaRegBuilding' }));
            } catch (error) {
                console.error('Error fetching building data:', error);
            }
        };

        getBuildingData();
    }, [buildingId]);

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о здании" />
                    <ObjectTable
                        title="Свойства здания"
                        data={data}
                        ButtonComponent={EditButton}
                    />
                </div>
                <div className="w-1/2 flex justify-end">
                    <ChildElementsTable
                        infoData={listTableData}
                        tableTitle="Секции"
                        buttonLabel="Добавить секцию"
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};


export default BuildingPage;
