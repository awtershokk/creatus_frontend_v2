import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx"
import {useParams} from "react-router-dom";
import {fetchRoom} from "../../api/roomApi.ts";
import {fetchMeasuringPoints} from "../../api/measuringPointApi.ts";

const RoomPage = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [measuringPoints, setMeasuringPoints] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);


    useEffect(() => {
        const getData = async () => {
            try {
                const roomData = await fetchRoom(roomId);
                setRoom(roomData);
                const labelItem = roomData.find(item => item.title === 'Наименование');
                localStorage.setItem('room', JSON.stringify({ label: labelItem?.value, icon: 'FaDoorClosed', id: parseInt(roomId) }));

                const measuringPointsData = await fetchMeasuringPoints(roomId);
                const formattedMeasuringPoints = measuringPointsData.map(measuringPoint => ({
                    id: measuringPoint.id,
                    title: measuringPoint.label,
                    properties: 'Свойства',
                    delete: 'Удалить',
                    to: `measuringPoint/${measuringPoint.id}`
                }));
                setMeasuringPoints(formattedMeasuringPoints);


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, [roomId]);

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о помещении"/>
                    <ObjectTable
                        title="Свойства помещения"
                        data={room}
                        ButtonComponent={EditButton}
                        nonEditableFields={['Секция', 'Тепловой контур']}
                    />
                </div>
                <div className="w-full flex flex-col items-end mt-8 mr-8">
                    <ChildElementsTable
                        infoData={measuringPoints}
                        tableTitle="Точки измеерения"
                        ButtonComponent={AddButton}
                        LinkComponent={BlueLink}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default RoomPage;
