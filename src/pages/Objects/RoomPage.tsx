import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";
import { useParams } from "react-router-dom";

import { fetchRoom } from "../../api/requests/roomApi.ts";
import { fetchMeasuringPoints } from "../../api/requests/measuringPointApi.ts";
import { fetchMeasurementsRoom } from "../../api/requests/measurementsApi.ts";

import { Measurement } from "../../models/Measurements.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import ItemTable from "../../components/Tables/ItemTable.tsx";
import MeasurementsFilters from '../../components/Filters/MeasurementsFilters.tsx';
import DownloadButton from "../../components/Buttons/DownloadButton.tsx";
import AddMeasuringPointModal from "../../components/Modal/Add/AddMeasuringPointModal.tsx";
import DeleteMeasuringPointModal from "../../components/Modal/Delete/MeasuringPoint/DeleteMeasuringPointModal.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";
import {useDispatch} from "react-redux";
import {transformRoomData} from "../../models/Room.tsx";
import EditRoomModal from "../../components/Modal/Edit/EditRoomModal.tsx";
import TabsButtonForAdmin from "../../components/Buttons/TabsButtonForAdmin.tsx";
import GraphModal from "../../components/Modal/GraphModal.tsx";
import {toast} from "react-toastify";
import GraphPage from "../../components/Graph/GraphPage.tsx";

const RoomPage = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [measuringPoints, setMeasuringPoints] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [timeRange, setTimeRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [temperatureDeviation, setTemperatureDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [humidityDeviation, setHumidityDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [totalMeasurements, setTotalMeasurements] = useState<number>(0);
    const [displayedMeasurements, setDisplayedMeasurements] = useState<number>(0);
    const [isAddMeasurePointModalOpen, setIsAddMeasurePointModalOpen] = useState(false);
    const [isDeleteMeasurePointModalOpen, setIsDeleteMeasurePointModalOpen] = useState(false);
    const [deleteMeasuringPointId, setDeleteMeasuringPointId] = useState<number | null>(null);

    const [tabIndex, setTabIndex] = useState(1);
    const [roomName, setRoomName] = useState('')
    const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

    const [roomData, setRoomData] = useState<any>(null);
    const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const responseRoomData = await fetchRoom(roomId);
            setRoomData(responseRoomData);
            const requestRoomForTable = await fetchRoom(roomId);
            const roomData = transformRoomData(requestRoomForTable);
            setRoom(roomData);

            const labelItem = roomData.find(item => item.title === 'Наименование');
            setRoomName(labelItem.value);
            dispatch(setBreadcrumb({
                key: 'room',
                label: labelItem?.value,
                icon: 'FaDoorClosed',
                id: roomId
            }));

            // const sectionLabelItem = roomData.find(item => item.title === 'Секция');
            // const sectionLabel = sectionLabelItem ? sectionLabelItem.value.props.text : null;
            // dispatch(setBreadcrumb({
            //     key: 'section',
            //     label: sectionLabel,
            //     icon: 'FaBars',
            //     id: sectionLabelItem.id
            // }));
            //
            // const thermalCircuitLabelItem = roomData.find(item => item.title === 'Тепловой контур');
            // const thermalCircuitLabel = thermalCircuitLabel ? thermalCircuitLabelItem.value.props.text : null;
            // dispatch(setBreadcrumb({
            //     key: 'thermalCircuit',
            //     label: thermalCircuitLabel,
            //     icon: 'FaThermometerHalf',
            //     id: thermalCircuitLabel.id
            // }));

            const measuringPointsData = await fetchMeasuringPoints(roomId);
            const formattedMeasuringPoints = measuringPointsData.map(point => ({
                id: point.id,
                title: point.label,
                properties: 'Свойства',
                delete: 'Удалить',
                to: `measuringPoint/${point.id}`
            }));
            setMeasuringPoints(formattedMeasuringPoints);

            const measurementsData = await fetchMeasurementsRoom(roomId);
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
        fetchData();
    }, [roomId]);
    const handleUpdateRoom = async () => {
        try {
            await fetchData();
            handleEditRoomModalClose();
            toast.success('Информация о комнате успешно обновлена.');
        } catch (error) {
            console.error('Ошибка обновления здания:', error);
        }
    };
    const handleEditButtonClick = (roomItem: any) => {
        setRoomData(roomItem);
        setIsEditRoomModalOpen(true);
    };

    const handleEditRoomModalClose = () => {
        setIsEditRoomModalOpen(false);

    };
    const handleClose = () => {
        setIsGraphModalOpen(false);
        setTabIndex(1);
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
            filtered = filtered.filter(measurement => {
                const [day, month, year] = measurement.date.split('.').map(Number);
                const measurementDate = new Date(year, month - 1, day);
                const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;
                if (startDate) startDate.setHours(0, 0, 0, 0);
                if (endDate) endDate.setHours(23, 59, 59, 999);
                return (!startDate || measurementDate >= startDate) && (!endDate || measurementDate <= endDate);
            });
        }

        // Фильтрация по времени
        if (filters.timeRange?.start || filters.timeRange?.end) {
            filtered = filtered.filter(measurement => {
                const [hours, minutes] = measurement.time.split(':').map(Number);
                const measurementTime = new Date();
                measurementTime.setHours(hours, minutes, 0, 0);
                const startTime = filters.timeRange?.start ? new Date(filters.timeRange.start) : null;
                const endTime = filters.timeRange?.end ? new Date(filters.timeRange.end) : null;
                if (startTime) startTime.setSeconds(0, 0);
                if (endTime) endTime.setSeconds(59, 999);
                return (!startTime || measurementTime >= startTime) && (!endTime || measurementTime <= endTime);
            });
        }

        // Фильтрация по отклонению температуры
        if (filters.temperatureDeviation?.min !== null || filters.temperatureDeviation?.max !== null) {
            filtered = filtered.filter(measurement => {
                const deviation = measurement.deviation_temperature;
                const minDeviation = filters.temperatureDeviation?.min ?? -Infinity;
                const maxDeviation = filters.temperatureDeviation?.max ?? Infinity;
                return deviation >= minDeviation && deviation <= maxDeviation;
            });
        }

        // Фильтрация по отклонению влажности
        if (filters.humidityDeviation?.min !== null || filters.humidityDeviation?.max !== null) {
            filtered = filtered.filter(measurement => {
                const deviation = measurement.deviation_humidity;
                const minDeviation = filters.humidityDeviation?.min ?? -Infinity;
                const maxDeviation = filters.humidityDeviation?.max ?? Infinity;
                return deviation >= minDeviation && deviation <= maxDeviation;
            });
        }

        setFilteredMeasurements(filtered);
        setDisplayedMeasurements(filtered.length);
    };

    const openAddMeasurePointModal = () => setIsAddMeasurePointModalOpen(true);
    const closeAddMeasurePointModal = () => setIsAddMeasurePointModalOpen(false);
    const openDeleteMeasurePointModal = (id: number) => {
        setDeleteMeasuringPointId(id);
        setIsDeleteMeasurePointModalOpen(true);
    };
    const closeDeleteMeasurePointModal = () => {
        setDeleteMeasuringPointId(null);
        setIsDeleteMeasurePointModalOpen(false);
    };

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
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="flex justify-between">
                        <div className="w-1/2">
                            <Label text="Информация о помещении" />
                            <ObjectTable
                                title="Свойства помещения"
                                data={room}
                                ButtonComponent={() => <EditButton onClick={() => handleEditButtonClick(roomData)}/>}
                                nonEditableFields={['Секция', 'Тепловой контур']}
                            />
                        </div>

                        <div className="w-full flex flex-col items-end mt-8 mr-8">
                            <ChildElementsTable
                                infoData={measuringPoints}
                                tableTitle="Точки измерения"
                                ButtonComponent={() => <AddButton onClick={openAddMeasurePointModal} />}
                                LinkComponent={BlueLink}
                                onDelete={openDeleteMeasurePointModal}
                            />
                        </div>
                    </div>
                    <div className="mt-6 mb-4">
                        <TabsButtonForAdmin tabIndex={tabIndex} setTabIndex={setTabIndex} />
                        {tabIndex === 1 && (
                            <div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Label text="Рассчитанные значения"/>
                                        <div className="ml-4 mt-1 text-sm text-gray-600">
                                            Всего значений: {totalMeasurements}, Отображаемых
                                            значений: {displayedMeasurements}
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

                        )}
                        {tabIndex === 2 && (
                            <div className="mt-4">
                                <GraphPage selectedRoomId={roomId} />
                            </div>

                        )}

                        {isAddMeasurePointModalOpen && (
                            <AddMeasuringPointModal
                                onClose={closeAddMeasurePointModal}
                                onSubmit={() => {
                                    fetchData();
                                    closeAddMeasurePointModal();
                                    toast.success('Точка измерения успешно добавлена.');
                                }}
                                roomId={roomId}
                            />
                        )}
                        {isDeleteMeasurePointModalOpen && deleteMeasuringPointId !== null && (
                            <DeleteMeasuringPointModal
                                measuringPointID={deleteMeasuringPointId}
                                onClose={() => {
                                    fetchData();
                                    closeDeleteMeasurePointModal();
                                }}
                            />
                        )}
                        {isEditRoomModalOpen && roomData && (
                            <EditRoomModal
                                roomId={roomId}
                                room={roomData}
                                onClose={handleEditRoomModalClose}
                                onUpdate={handleUpdateRoom}
                            />
                        )}
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default RoomPage;
