import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import { useParams } from "react-router-dom";
import {fetchDeviceId, fetchMeasuringPoint} from "../../api/requests/measuringPointApi.ts";
import { Measurement } from "../../models/Measurements.ts";
import { fetchMeasurementsMeasuringPoint } from "../../api/requests/measurementsApi.ts";
import TableContainer from "../../layouts/TableContainer.tsx";
import ItemTable from "../../components/Tables/ItemTable.tsx";
import MeasurementsFilters from '../../components/Filters/MeasurementsFilters.tsx';
import DownloadButton from "../../components/Buttons/DownloadButton.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";
import {fetchDevice} from "../../api/requests/deviceApi.ts";
import {Device} from "../../models/Device.tsx";
import DefaultButton from "../../components/Buttons/DefaultButton.tsx";
import UnbindDeviceModal from "../../components/Modal/Bind/UnbindDeviceModal.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";
import {useDispatch} from "react-redux";
import BindDeviceModal from "../../components/Modal/Bind/BindDeviceModal.tsx";
import {transformMeasuringPointData} from "../../models/MeasuringPoint.tsx";
import EditMeasuringPointModal from "../../components/Modal/Edit/EditMeasuringPointModal.tsx";

const MeasuringPointPage = () => {
    const {measuringPointId} = useParams();
    const [measuringPoint, setMeasuringPoint] = useState<Array<{
        id: number,
        title: string,
        value: string | number
    }>>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [device, setDevice] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
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

    const [deviceId, setDeviceId] = useState<number>(null)
    const [measuringPointData, setMeasuringPointData] = useState<any>(null);
    const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);
    const [isBindModalOpen, setIsBindModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState<{ deviceId: any; deviceLabel: string; measuringPointLabel: string }>({
        deviceId: null,
        deviceLabel: '',
        measuringPointLabel: '',
    });
    const [isEditMeasuringPointModalOpen, setIsEditMeasuringPointModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const request = await fetchMeasuringPoint(measuringPointId);
            const measuringPointForTable = transformMeasuringPointData(request) ;
            setMeasuringPointData(request);
            console.log('request',request)
            setMeasuringPoint(measuringPointForTable);

            const labelItem = measuringPointForTable.find(item => item.title === 'Наименование');
            dispatch(setBreadcrumb({
                key: 'measuringPoint',
                label: labelItem?.value,
                icon: 'FaMapMarkerAlt',
                id: labelItem?.id
            }));

            const roomLabelItem = measuringPointForTable.find(item => item.title === 'Место установки');
            const roomLabel = roomLabelItem ? roomLabelItem.value.props.text : null;
            console.log('room', roomLabelItem)
            dispatch(setBreadcrumb({
                key: 'room',
                label: roomLabel,
                icon: 'FaDoorClosed',
                id: roomLabelItem?.id
            }));

            const measurementsData = await fetchMeasurementsMeasuringPoint(measuringPointId);
            setMeasurements(measurementsData);
            setFilteredMeasurements(measurementsData);
            setTotalMeasurements(measurementsData.length);
            setDisplayedMeasurements(measurementsData.length);

            setIsLoading(false);

            const deviceId = await fetchDeviceId(measuringPointId);
            setDeviceId(deviceId);

            if (deviceId) {
                const deviceData = await fetchDevice(deviceId);
                setDevice(deviceData);
            }

        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    };

    useEffect(() => {
        getData();
    }, [measuringPointId]);

    useEffect(() => {
        setDisplayedMeasurements(filteredMeasurements.length);
    }, [filteredMeasurements]);
    const handleUpdateMeasuringPoint = async () => {
        try {
            await getData();
            handleEditMeasuringPointModalClose();
        } catch (error) {
            console.error('Ошибка обновления здания:', error);
        }
    };
    const handleEditButtonClick = (measuringPointItem: any) => {
        setMeasuringPointData(measuringPointItem);
        setIsEditMeasuringPointModalOpen(true);
    };

    const handleEditMeasuringPointModalClose = () => {
        setIsEditMeasuringPointModalOpen(false);

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

    const getLabelFromData = (data: Array<{ id: number, title: string, value: string | number }>, label: string) => {
        const foundItem = data.find(item => item.title === label);
        return foundItem ? foundItem.value : '';
    };

    const handleUnbindClick = () => {
        const deviceLabel = device.find(item => item.title === 'Наименование')?.value;
        const measuringPointLabel = measuringPoint.find(item => item.title === 'Наименование')?.value;

        if (deviceId) {
            setIsUnbindModalOpen(true);
            setModalProps({ deviceId, deviceLabel, measuringPointLabel });
        }
    };

    const handleBindClick = () => {
        const measuringPointLabel = measuringPoint.find(item => item.title === 'Наименование')?.value;
        setIsBindModalOpen(true);
        setModalProps({ deviceId: null, deviceLabel: '', measuringPointLabel });
    };


    const handleCloseModal = () => {
        setIsUnbindModalOpen(false);
    };


    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Измеренная t°': 'measured_temperature',
        'Калиброванная t°': 'calculated_humidity',
        'Измеренная h': 'measured_humidity',
        'Калиброванная h': 'calculated_humidity',
        'Отклонение t°': 'deviation_temperature',
        'Отклонение h': 'deviation_humidity',
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация о точке измерения"/>
                        <ObjectTable
                            title="Свойства точки измерения"
                            data={measuringPoint}
                            ButtonComponent={() => <EditButton onClick={() => handleEditButtonClick(measuringPointData)}/>}
                            nonEditableFields={['Место установки']}
                        />
                    </div>
                    <div className="w-full flex flex-col items-end mt-8 mr-8">
                        <ObjectTable
                            title="Информация о датчике"
                            data={device}
                            ButtonComponent={() => (
                                <DefaultButton
                                    onClick={deviceId ? handleUnbindClick : handleBindClick}
                                    deviceId={deviceId}
                                />
                            )}
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

            {isUnbindModalOpen && (
                <UnbindDeviceModal
                    deviceId={modalProps.deviceId}
                    deviceLabel={modalProps.deviceLabel}
                    measuringPointLabel={modalProps.measuringPointLabel}
                    onClose={() => setIsUnbindModalOpen(false)}
                    onSuccess={() => {
                        setDevice([]);
                        getData();
                        setIsUnbindModalOpen(false);
                    }}
                />
            )}

            {isBindModalOpen && (
                <BindDeviceModal
                    measuringPointId={measuringPointId}
                    measuringPointLabel={modalProps.measuringPointLabel}
                    onClose={() => setIsBindModalOpen(false)}
                    onSuccess={() => {
                        getData();
                        setIsBindModalOpen(false);
                    }}
                />
            )}
            {isEditMeasuringPointModalOpen && measuringPointData && (
                <EditMeasuringPointModal
                    measuringPointId={measuringPointId}
                    measuringPoint={measuringPointData}
                    onClose={handleEditMeasuringPointModalClose}
                    onUpdate={handleUpdateMeasuringPoint}
                />
            )}

        </DefaultLayout>
    );
}

export default MeasuringPointPage;
