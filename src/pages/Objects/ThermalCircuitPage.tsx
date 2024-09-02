import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx"
import {useParams} from "react-router-dom";
import {fetchThermalCircuit} from "../../api/thermalCircuitApi.ts";
import {fetchRoomsByThermalCircuit} from "../../api/roomApi.ts";
import ItemTable from "../../components/Tables/ItemTable.tsx";
import {fetchMeasurementsThermalCircuit} from "../../api/measurementsApi.ts";
import {Measurement} from "../../models/Measurements.ts";
import TableContainer from "../../layouts/TableContainer.tsx";

const ThermalCircuitPage = () => {
    const { thermalCircuitId } = useParams();
    const [thermalCircuit, setThermalCircuit] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [rooms, setRooms] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);

    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const thermalCircuitData = await fetchThermalCircuit(thermalCircuitId);
                setThermalCircuit(thermalCircuitData);
                const labelItem = thermalCircuitData.find(item => item.title === 'Наименование');
                localStorage.setItem('thermalCircuit', JSON.stringify({ label: labelItem?.value, icon: 'FaThermometerHalf', id: labelItem?.id }));

                const roomsData = await fetchRoomsByThermalCircuit(thermalCircuitId);
                const formattedRooms = roomsData.map(room => ({
                    id: room.id,
                    title: room.label,
                    properties: 'Свойства',
                    delete: 'Удалить',
                    to: `room/${room.id}`
                }));
                setRooms(formattedRooms);

                const measurements = await fetchMeasurementsThermalCircuit(thermalCircuitId);
                console.log('Измерения:', measurements)
                setMeasurements(measurements);


            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, [thermalCircuitId]);

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Температура': 'calculated_temperature',
        'Влажность': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    return (
        <DefaultLayout>
            <div className="flex justify-between">
                <div className="w-1/2">
                    <Label text="Информация о тепловом контуре"/>
                    <ObjectTable
                        title="Свойства теплового контура"
                        data={thermalCircuit}
                        ButtonComponent={EditButton}
                    />
                </div>
                <div className="w-full flex flex-col items-end mt-8 mr-8">
                    <ChildElementsTable
                        infoData={rooms}
                        tableTitle="Помещения"
                        ButtonComponent={AddButton}
                        LinkComponent={BlueLink}
                    />
                </div>
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
                    sorting={true}
                />
                </TableContainer>
            </div>
        </DefaultLayout>
    );
};

export default ThermalCircuitPage;
