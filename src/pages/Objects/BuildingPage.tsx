import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { fetchBuilding, fetchResponsiblePersons } from '../../api/buildingApi';
import { fetchSections } from '../../api/sectionsApi';
import { fetchThermalCircuits} from "../../api/thermalCircuitsApi.ts";
import { ResponsiblePerson } from '../../models/ResponsiblePerson';
import Link from "../../components/Text/Link"
import IconButton from "../../components/Buttons/IconButton.tsx";

const BuildingPage = () => {
    const [building, setBuilding] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]); // State for responsible persons
    const [sections, setSections] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);
    const [thermalCircuits, setThermalCircuits] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);
    const buildingId = 1;

    useEffect(() => {
        const getData = async () => {
            try {
                const buildingData = await fetchBuilding(buildingId);
                setBuilding(buildingData);
                const labelItem = buildingData.find(item => item.title === 'Наименование');
                localStorage.setItem('building', JSON.stringify({ label: labelItem?.value, icon: 'FaRegBuilding' }));

                const responsiblePersonsData = await fetchResponsiblePersons(buildingId);
                setResponsiblePersons(responsiblePersonsData);

                const sectionsData = await fetchSections(buildingId);
                const formattedSections = sectionsData.map(section => ({
                    id: section.id,
                    title: section.label,
                    value: 'Свойства',
                    value2: 'Удалить',
                    to: `section/${section.id}`
                }));
                setSections(formattedSections);

                const thermalcircuitsData = await fetchThermalCircuits(buildingId);
                const formattedThermalCircuits = thermalcircuitsData.map(thermalCircuit => ({
                    id: thermalCircuit.id,
                    title: thermalCircuit.label,
                    value: 'Свойства',
                    value2: 'Удалить',
                    to: `thermalCircuit/${thermalCircuit.id}`
                }));
                setThermalCircuits(formattedThermalCircuits);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
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
                        infoData={sections}
                        tableTitle="Секции"
                        ButtonComponent={AddButton}
                        LinkComponent={Link}
                    />
                    <div className='mt-3'>
                        <ChildElementsTable
                            infoData={thermalCircuits}
                            tableTitle="Тепловые контуры"
                            ButtonComponent={AddButton}
                            LinkComponent={Link}
                        />
                    </div>
                </div>

            </div>
            <div className="mt-6 mb-4">
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <Label text="Ответственные лица"/>
                        <IconButton/>
                    </div>
                </div>

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
