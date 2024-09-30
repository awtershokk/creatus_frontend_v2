import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";
import { useParams } from "react-router-dom";
import { fetchThermalCircuit } from "../../api/requests/thermalCircuitApi.ts";
import { fetchRoomsByThermalCircuit } from "../../api/requests/roomApi.ts";
import ItemTable from "../../components/Tables/ItemTable.tsx";
import { fetchMeasurementsThermalCircuit } from "../../api/requests/measurementsApi.ts";
import { Measurement } from "../../models/Measurements.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import MeasurementsFilters from '../../components/Filters/MeasurementsFilters.tsx';
import DownloadButton from "../../components/Buttons/DownloadButton.tsx";
import AddRoomInThermalCircuitModal from "../../components/Modal/Add/AddRoomInThermalCircuitModal.tsx";
import DeleteRoomModalManager from "../../components/Modal/Manager/DeleteRoomModalManager.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import EditThermalCircuitModal from "../../components/Modal/Edit/EditThermalCircuitPageModal.tsx";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";
import WeatherInfo from "../../components/Forms/WeatherInfo.tsx";
import {toast} from "react-toastify";

const ThermalCircuitPage = () => {
    const {thermalCircuitId} = useParams();
    const [thermalCircuit, setThermalCircuit] = useState<Array<{
        id: number,
        title: string,
        value: string | number
    }>>([]);
    const [rooms, setRooms] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);

    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
    const [totalMeasurements, setTotalMeasurements] = useState<number>(0);
    const [displayedMeasurements, setDisplayedMeasurements] = useState<number>(0);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({start: null, end: null});
    const [timeRange, setTimeRange] = useState<{ start: Date | null; end: Date | null }>({start: null, end: null});
    const [temperatureDeviation, setTemperatureDeviation] = useState<{
        min: number | null;
        max: number | null
    }>({min: null, max: null});
    const [humidityDeviation, setHumidityDeviation] = useState<{ min: number | null; max: number | null }>({
        min: null,
        max: null
    });

    const [isAddRoomInThermalCircuitModal, setIsAddRoomInThermalCircuitModal] = useState(false);

    const [modalRoomId, setModalRoomId] = useState<number | null>(null);
    const [isEditThermalCircuitModalOpen, setIsEditThermalCircuitModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const thermalCircuitData = await fetchThermalCircuit(thermalCircuitId);
            setThermalCircuit(thermalCircuitData);
            const labelItem = thermalCircuitData.find(item => item.title === 'Наименование');

            dispatch(setBreadcrumb({
                key: 'thermalCircuit',
                label: labelItem?.value,
                icon: 'FaThermometerHalf',
                id: labelItem?.id
            }));

            const roomsData = await fetchRoomsByThermalCircuit(thermalCircuitId);
            const formattedRooms = roomsData.map(room => ({
                id: room.id,
                title: room.label,
                properties: 'Свойства',
                delete: 'Удалить',
                to: `room/${room.id}`
            }));
            setRooms(formattedRooms);

            const measurementsData = await fetchMeasurementsThermalCircuit(thermalCircuitId);
            setMeasurements(measurementsData);
            setFilteredMeasurements(measurementsData);

            setTotalMeasurements(measurementsData.length);
            setDisplayedMeasurements(measurementsData.length);

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.error('Ошибка получения данных:', error);
        }
    };


    useEffect(() => {
        getData();
    }, [thermalCircuitId]);

    useEffect(() => {
        setDisplayedMeasurements(filteredMeasurements.length);
    }, [filteredMeasurements]);
    const handleAddRoomInThermalCircuitModalOpen = () => {
        setIsAddRoomInThermalCircuitModal(true);
    };

    const handleAddRoomInThermalCircuitModalClose = () => {
        setIsAddRoomInThermalCircuitModal(false);
    };
    const handleDeleteRoomClick = (roomId: number) => {
        setModalRoomId(roomId);
    };
    const handleModalRoomClose = () => {
        setModalRoomId(null)
    };
    const handleFilterChange = (filters: {
        dateRange?: { start: Date | null; end: Date | null },
        timeRange?: { start: Date | null; end: Date | null },
        temperatureDeviation?: { min: number | null; max: number | null },
        humidityDeviation?: { min: number | null; max: number | null }
    }) => {
        let filtered = [...measurements];

        // Фильтрация по дате
        if (filters.dateRange?.start || filters.dateRange?.end) {
            filtered = filtered.filter((measurement) => {
                const [day, month, year] = measurement.date.split('.').map(Number);
                const measurementDate = new Date(year, month - 1, day);

                const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

                if (startDate) {
                    startDate.setHours(0, 0, 0, 0);
                }

                if (endDate) {
                    endDate.setHours(23, 59, 59, 999);
                }

                return (!startDate || measurementDate >= startDate) && (!endDate || measurementDate <= endDate);
            });
        }

        // Фильтрация по времени
        if (filters.timeRange?.start || filters.timeRange?.end) {
            filtered = filtered.filter((measurement) => {
                const [hours, minutes] = measurement.time.split(':').map(Number);
                const measurementTime = new Date();
                measurementTime.setHours(hours, minutes, 0, 0);

                const startTime = filters.timeRange?.start ? new Date(filters.timeRange.start) : null;
                const endTime = filters.timeRange?.end ? new Date(filters.timeRange.end) : null;

                if (startTime) {
                    startTime.setSeconds(0, 0);
                }

                if (endTime) {
                    endTime.setSeconds(59, 999);
                }

                return (!startTime || measurementTime >= startTime) && (!endTime || measurementTime <= endTime);
            });
        }

        // Фильтрация по отклонению температуры
        if (filters.temperatureDeviation?.min !== null || filters.temperatureDeviation?.max !== null) {
            filtered = filtered.filter((measurement) => {
                const deviation = measurement.deviation_temperature;
                const minDeviation = filters.temperatureDeviation?.min !== null ? filters.temperatureDeviation.min : -Infinity;
                const maxDeviation = filters.temperatureDeviation?.max !== null ? filters.temperatureDeviation.max : Infinity;

                return deviation >= minDeviation && deviation <= maxDeviation;
            });
        }

        // Фильтрация по отклонению влажности
        if (filters.humidityDeviation?.min !== null || filters.humidityDeviation?.max !== null) {
            filtered = filtered.filter((measurement) => {
                const deviation = measurement.deviation_humidity;
                const minDeviation = filters.humidityDeviation?.min !== null ? filters.humidityDeviation.min : -Infinity;
                const maxDeviation = filters.humidityDeviation?.max !== null ? filters.humidityDeviation.max : Infinity;

                return deviation >= minDeviation && deviation <= maxDeviation;
            });
        }

        setFilteredMeasurements(filtered);
    };

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Температура': 'calculated_temperature',
        'Влажность': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };
    const handleEditButtonClick = (thermalCircuitItem: any) => {
        setThermalCircuit(thermalCircuitItem);
        setIsEditThermalCircuitModalOpen(true);
    };

    const handleEditThermalCircuitClose = () => {
        setIsEditThermalCircuitModalOpen(false);

    };
    const handleUpdateSection = async () => {
        try {
            await getData();
            handleEditThermalCircuitClose();
            toast.success('Информация о тепловом контуре успешно обновлена.');
        } catch (error) {
            console.error('Ошибка обновления здания:', error);
        }
    };
    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация о тепловом контуре"/>
                        <ObjectTable
                            title="Свойства теплового контура"
                            data={thermalCircuit}
                            ButtonComponent={() => <EditButton onClick={() => handleEditButtonClick(thermalCircuit)}/>}
                        />
                    </div>
                    <div className="w-full flex flex-col items-end mt-8 mr-8">
                        <ChildElementsTable
                            infoData={rooms}
                            tableTitle="Помещения"
                            ButtonComponent={() => (
                                <AddButton onClick={handleAddRoomInThermalCircuitModalOpen}/>
                            )}
                            LinkComponent={BlueLink}
                            onDelete={handleDeleteRoomClick}
                        />
                    </div>
                </div>
            )}
            <div className="mt-6 mb-4">
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Label text="Рассчитанные значения"/>
                        <div className="ml-4 mt-1 text-sm text-gray-600">
                            Всего значений: {totalMeasurements}, Отображаемых значений: {displayedMeasurements}
                        </div>
                    </div>
                </div>
                <DownloadButton/>
                <MeasurementsFilters
                    dateRange={dateRange}
                    timeRange={timeRange}
                    temperatureDeviation={temperatureDeviation}
                    humidityDeviation={humidityDeviation}
                    onFilterChange={handleFilterChange}
                />
                <TableContainer>
                    <ItemTable
                        data={filteredMeasurements}
                        headers={headers}
                    />
                </TableContainer>
            </div>

            {isAddRoomInThermalCircuitModal && (
                <AddRoomInThermalCircuitModal
                    thermalCircuitId={thermalCircuitId}
                    onClose={handleAddRoomInThermalCircuitModalClose}
                    onSubmit={() => {
                        getData();
                        handleAddRoomInThermalCircuitModalClose();
                        toast.success('Помещение успешно добавлено.');
                    }}
                />
            )}

            {modalRoomId !== null && (
                <DeleteRoomModalManager
                    roomId={modalRoomId}
                    onClose={() => {
                        getData();
                        handleModalRoomClose();
                    }}
                />
            )}
            {isEditThermalCircuitModalOpen && thermalCircuit && (
                <EditThermalCircuitModal
                    thermalCircuitId={thermalCircuitId}
                    thermalCircuit={thermalCircuit}
                    onClose={handleEditThermalCircuitClose}
                    onUpdate={handleUpdateSection}
                />
            )}

        </DefaultLayout>
    );
}
export default ThermalCircuitPage;
