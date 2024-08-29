import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx"
import {useParams} from "react-router-dom";
import {fetchMeasuringPoint} from "../../api/measuringPointApi.ts";

const MeasuringPointPage = () => {
    const { measuringPointId } = useParams();
    const [measuringPoint, setMeasuringPoint] = useState<Array<{ id: number, title: string, value: string | number }>>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const measuringPointData = await fetchMeasuringPoint(measuringPointId);
                setMeasuringPoint(measuringPointData);
                const labelItem = measuringPointData.find(item => item.title === 'Наименование');
                localStorage.setItem('measuringPoint', JSON.stringify({ label: labelItem?.value, icon: 'FaMapMarkerAlt', id: labelItem?.id }));
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, [measuringPointId]);

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о точке измерения"/>
                    <ObjectTable
                        title="Свойства точки измерения"
                        data={measuringPoint}
                        ButtonComponent={EditButton}
                    />
                </div>
                {/*<div className="w-full flex flex-col items-end mt-8 mr-8">*/}
                {/*    <ChildElementsTable*/}
                {/*        infoData={measuringPoints}*/}
                {/*        tableTitle="Точки измеерения"*/}
                {/*        ButtonComponent={AddButton}*/}
                {/*        LinkComponent={BlueLink}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </DefaultLayout>
    );
};

export default MeasuringPointPage;
