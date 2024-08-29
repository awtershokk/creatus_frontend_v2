import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import {fetchSection} from '../../api/sectionApi.ts';
import Link from "../../components/Text/Link"
import {useParams} from "react-router-dom";
import {fetchRoomsBySection} from "../../api/roomApi.ts";

const SectionPage = () => {
    const { sectionId } = useParams();
    const [section, setSection] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [rooms, setRooms] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const sectionData = await fetchSection(sectionId);
                setSection(sectionData);
                const labelItem = sectionData.find(item => item.title === 'Наименование');
                localStorage.setItem('section', JSON.stringify({ label: labelItem?.value, icon: 'FaBars', id: labelItem?.id }));

                const roomsData = await fetchRoomsBySection(sectionId);
                const formattedRooms = roomsData.map(room => ({
                    id: room.id,
                    title: room.label,
                    properties: 'Свойства',
                    delete: 'Удалить',
                    to: `room/${room.id}`
                }));
                setRooms(formattedRooms);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, [sectionId]);

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о секции"/>
                    <ObjectTable
                        title="Свойства секции"
                        data={section}
                        ButtonComponent={EditButton}
                    />
                </div>
                <div className="w-full flex flex-col items-end mt-8 mr-8">
                    <ChildElementsTable
                        infoData={rooms}
                        tableTitle="Помещения"
                        ButtonComponent={AddButton}
                        LinkComponent={Link}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SectionPage;
