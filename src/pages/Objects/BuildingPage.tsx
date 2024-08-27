import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import { fetchBuilding } from '../../api/buildingApi';

const BuildingPage = () => {
    const [data, setData] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const buildingId = 1;

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
            <Label text="Информация о здании"/>
            <ObjectTable
                title='Свойства здания'
                data={data}
                ButtonComponent={EditButton}
            />
        </DefaultLayout>
    );
};

export default BuildingPage;
