import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import {useParams} from "react-router-dom";
import {fetchMeasuringPoint} from "../../api/measuringPointApi.ts";
import {Measurement} from "../../models/Measurements.ts";
import {fetchMeasurementsMeasuringPoint} from "../../api/measurementsApi.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import ItemTable from "../../components/Tables/ItemTable.tsx";

const MeasuringPointPage = () => {
    const { measuringPointId } = useParams();
    const [measuringPoint, setMeasuringPoint] = useState<Array<{ id: number, title: string, value: string | number }>>([]);

    const [measurements, setMeasurements] = useState<Measurement[]>([]);

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

            const measurements = await fetchMeasurementsMeasuringPoint(measuringPointId);
            setMeasurements(measurements);


        };

        getData();
    }, [measuringPointId]);

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Измеренная t°': 'measured_temperature',
        'Калиброванная t°': 'calculated_humidity',
        'Измеренная h': 'measured_humidity',
        'Калиброванная h': 'calculated_humidity',
        'Измеренная h': 'measured_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о точке измерения"/>
                    <ObjectTable
                        title="Свойства точки измерения"
                        data={measuringPoint}
                        ButtonComponent={EditButton}
                        nonEditableFields={['Место установки']}
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
            <div className="mt-6 mb-4">
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center ">
                        <Label text="Рассчитанные значения"/>
                    </div>
                </div>
                <TableContainer>
                    <ItemTable
                        data={measurements}
                        headers={headers}
                    />
                </TableContainer>
            </div>
        </DefaultLayout>
    );
};

export default MeasuringPointPage;
