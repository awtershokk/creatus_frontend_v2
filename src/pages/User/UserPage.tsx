import React, { useEffect, useState, useCallback, useMemo } from 'react';
import UserHeader from "../../components/Menu/UserHeader.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import TabsButton from "../../components/Buttons/TabsButton.tsx";
import CircuitDisplay from "../../components/Forms/CircuitDisplay.tsx";
import ItemTable from "../../components/Tables/ItemTable.tsx";
import TableContainer from "../../layouts/TableContainer.tsx";
import { Measurement } from "../../models/Measurements.ts";
import DownloadButton from "../../components/Buttons/DownloadButton.tsx";
import MeasurementsFilters from "../../components/Filters/MeasurementsFilters.tsx";
import GraphPage from "../../components/Graph/GraphPage.tsx";
import Label from "../../components/Text/Label.tsx";

import { fetchRoomUser } from "../../api/roomApi.ts";
import { fetchMeasurementsRoom } from "../../api/measurementsApi.ts";
import {fetchPublicInfo} from "../../api/buildingApi.ts";

interface MeasuringPoint {
    deviceActive: boolean | null;
    measuringPointLabel: string;
}

interface Room {
    id: string;
    label: string;
    tempDev: number | null;
    temp: number | null;
    hum: number | null;
    measuringPoints: MeasuringPoint[];
}

interface Circuit {
    R: Room[];
}

interface Floor {
    name: string;
    C: Circuit[];
}

interface Section {
    label: string;
    F: Floor[];
}

interface ThermalCircuit {
    label: string;
    S: Section[];
}

const UserPage: React.FC = () => {
    const [info, setInfo] = useState<ThermalCircuit[]>([]);
    const [currentCircuitIndex, setCurrentCircuitIndex] = useState(0);
    const [officeName, setOfficeName] = useState()
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [roomDataFields, setRoomDataFields] = useState([]);

    const [recordings, setRecordings] = useState<Array<Record<string, any>>>([]);
    const [totalRecordings, setTotalRecordings] = useState<number>(0);
    const [filteredRecordings, setFilteredRecordings] = useState<Measurement[]>([]);
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [timeRange, setTimeRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [temperatureDeviation, setTemperatureDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
    const [humidityDeviation, setHumidityDeviation] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });


    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await fetchPublicInfo(5);
                setOfficeName(data.officeName);
                setInfo(data.thermalCircuits);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        if (tabIndex === 0 && selectedRoomId) {
            const fetchRoomData = async () => {
                try {
                    const transformedRoomData = await fetchRoomUser(selectedRoomId);
                    setRoomDataFields(transformedRoomData);
                } catch (error) {
                    console.error('Ошибка при получении данных о комнате', error);
                }
            };

            fetchRoomData();
        }
    }, [tabIndex, selectedRoomId]);

    const handleFilterChange = (filters: {
        dateRange?: { start: Date | null; end: Date | null },
        timeRange?: { start: Date | null; end: Date | null },
        temperatureDeviation?: { min: number | null; max: number | null },
        humidityDeviation?: { min: number | null; max: number | null }
    }) => {
        let filtered = [...recordings];

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

        setFilteredRecordings(filtered);
    };

    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Температура': 'calculated_temperature',
        'Влажность': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const selectedData = await fetchMeasurementsRoom(selectedRoomId);
                setRecordings(selectedData);
                setFilteredRecordings(selectedData);
                setTotalRecordings(selectedData.length);
            } catch (error) {
                console.error('Нет доступных значений', error);
            }
        };

        if (selectedRoomId) {
            fetchRecordings();
        }
    }, [selectedRoomId]);

    const handleNextClick = useCallback(() => {
        setCurrentCircuitIndex(prevIndex => (prevIndex < info.length - 1 ? prevIndex + 1 : 0));
    }, [info.length]);

    const handlePrevClick = useCallback(() => {
        setCurrentCircuitIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : info.length - 1));
    }, [info.length]);

    const handleRoomClick = useCallback((roomId: string) => {
        setSelectedRoomId(roomId);
        setTabIndex(0);
    }, []);

    const getRoomStyle = useCallback((tempDev: number | null, measuringPoints: MeasuringPoint[]) => {
        const statusColors = {
            online: 'bg-green-500',
            offline: 'bg-red-500',
            unknown: 'bg-gray-500',
        };

        const getStatusColor = (status: boolean | null) => status === true
            ? statusColors.online
            : status === false
                ? statusColors.offline
                : statusColors.unknown;

        const measuringPointIndicators = measuringPoints.map((point, index) => (
            <div key={index} className="inline-flex justify-center items-center">
                <span className={`rounded-full inline-block w-2.5 h-2.5 mr-0.5 mt-0.5 ${getStatusColor(point.deviceActive)}`}></span>
            </div>
        ));

        let backgroundColor = 'bg-gray-200';

        if (tempDev !== null) {
            const deviation = parseFloat(tempDev.toString());
            if (!isNaN(deviation)) {
                const intensity = Math.round(Math.abs(deviation) / 10 * 500);
                const roundedIntensity = Math.round(intensity / 100) * 100;

                backgroundColor = deviation > 0
                    ? `bg-red-${Math.min(500, roundedIntensity)}`
                    : `bg-blue-${Math.min(500, roundedIntensity)}`
            }
        }

        return { backgroundColor, measuringPointIndicators };
    }, []);

    const currentCircuit = useMemo(() => info[currentCircuitIndex], [info, currentCircuitIndex]);
    const currentCircuitLabel = currentCircuit?.label || "No Circuit Available";
    const nonEditableFields = useMemo(() => roomDataFields.map(field => field.title), [roomDataFields]);

    return (
        <div className="container mx-auto p-4 w-max">
            <UserHeader
                officeName={officeName}
                currentCircuitLabel={currentCircuitLabel}
                onPrevClick={handlePrevClick}
                onNextClick={handleNextClick}
            />

            <div className="w-10 h-24 m-2.5"></div>

            <CircuitDisplay
                sections={currentCircuit?.S || []}
                selectedRoomId={selectedRoomId}
                onRoomClick={handleRoomClick}
                getRoomStyle={getRoomStyle}
            />

            {selectedRoomId && (
                <div className="mt-8">
                    <TabsButton tabIndex={tabIndex} setTabIndex={setTabIndex} />
                    <div>
                        {tabIndex === 0 && (
                            <ObjectTable
                                title="Информация о помещении"
                                data={roomDataFields}
                                ButtonComponent={'EditButton'}
                                nonEditableFields={nonEditableFields}
                            />
                        )}
                        {tabIndex === 1 && (
                            <div>
                                <DownloadButton />
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Label text="Рассчитанные значения" />
                                        <div className="ml-4 mt-1 text-sm text-gray-600">
                                            Всего значений: {totalRecordings}, Отображаемых
                                            значений: {filteredRecordings.length}
                                        </div>
                                    </div>
                                </div>

                                <MeasurementsFilters
                                    dateRange={dateRange}
                                    timeRange={timeRange}
                                    temperatureDeviation={temperatureDeviation}
                                    humidityDeviation={humidityDeviation}
                                    onFilterChange={handleFilterChange}
                                />
                                <TableContainer>
                                    <ItemTable
                                        headers={headers}
                                        data={filteredRecordings}
                                    />
                                </TableContainer>
                            </div>
                        )}
                        {tabIndex === 2 && (
                            <GraphPage selectedRoomId={selectedRoomId} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
