import React, {useEffect, useState} from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import ItemTable from '../../components/Tables/ItemTable';
import Label from "../../components/Text/Label.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";
import IncidentFilters from "../../components/Filters/IncidentFilter.tsx";
import StatusChangeModal from "../../components/Modal/Edit/StatusChangeModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import IncidentDetailsModal from "../../components/Modal/IncidentDetailsModal.tsx";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";

interface Incident {
    id: number;
    dateI: string;
    time: string;
    type: string;
    description: string;
    link: string;
    object: string;
    criticality: string;
    status: string;
    history: { date: string | null; time: string | null; user: string | null; status: string | null }[];
}

const IncidentPage: React.FC = () => {
    const dispatch = useDispatch();
    dispatch(setBreadcrumb({
        key: 'incidents',
        label:'Инциденты',
        icon: 'FaExclamationTriangle',
    }));

    const user = useSelector((state: RootState) => state.auth.user);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [isStatusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
    const [isIncidentHistoryModalOpen, setIncidentHistoryModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);



    const [incidents, setIncidents] = useState<Incident[]>([
        {
            id: 1,
            dateI: '10.08.2024',
            time: '12:45',
            type: 'Д.1',
            description: 'Заряд батареи датчика ниже 20%',
            link: '/building/devices',
            object: 'Тестовое устройство 1',
            criticality: 'Предупреждение',
            status: 'Активный',
            history: [
                { date: '12.08.2024', time: '12:45', user: 'Пользователь 1', status: 'Активный' },
                { date: '13.08.2024', time: '14:00', user: 'Пользователь 2', status: 'Устранен' }
            ]
        },
        {
            id: 2,
            dateI: '09.08.2024',
            time: '12:45',
            type: 'Д.1',
            description: 'Заряд батареи датчика ниже 20%',
            link: '/building/devices',
            object: 'Тестовое устройство 1',
            criticality: 'Предупреждение',
            status: 'Активный',
            history: [
                { date: '12.08.2024', time: '12:45', user: 'Пользователь 1', status: 'Активный' },
                { date: '13.08.2024', time: '14:00', user: 'Пользователь 2', status: 'Устранен' }
            ]
        },
        {
            id: 3,
            dateI: '12.08.2024',
            time: '13:30',
            type: 'Т.1',
            description: 'Температура точки измерения выше верхней границы на 10',
            link: '/building/section/1/room/7/measuringPoint/8',
            object: 'У двери (Кабинет 7)',
            criticality: 'Средняя',
            status: 'Устранен',
            history: [
                { date: null, time: null, user: null, status: null }
            ]
        },
        {
            id: 4,
            dateI: '08.08.2024',
            time: '12:45',
            type: 'П.1',
            description: 'Заряд батареи датчика ниже 20%',
            link: '/building/devices',
            object: 'Тестовое устройство 1',
            criticality: 'Предупреждение',
            status: 'Устранен',
            history: [
                { date: '12.08.2024', time: '12:45', user: 'Пользователь 1', status: 'Активный' },
                { date: '13.08.2024', time: '14:00', user: 'Пользователь 2', status: 'Устранен' }
            ]
        },

    ]);
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidents);

    useEffect(() => {
        setFilteredIncidents(incidents);
    }, [incidents]);

    const openStatusModal = (incident: Incident) => {
        setSelectedIncident(incident);
        setStatusChangeModalOpen(true);
    };

    const closeStatusModal = () => {
        setStatusChangeModalOpen(false);
        setSelectedIncident(null);
    };

    const openHistoryModal = (incident: Incident) => {
        setSelectedIncident(incident);
        setIncidentHistoryModalOpen(true);
    };

    const closeHistoryModal = () => {
        setIncidentHistoryModalOpen(false);
        setSelectedIncident(null);
    };
    const [currentStatus, setCurrentStatus] = useState(incidents.status);
    const handleStatusChange = (newStatus: string) => {
        if (selectedIncident) {
            const updatedIncidents = incidents.map((inc) =>
                inc.id === selectedIncident.id ? { ...inc, status: newStatus } : inc
            );
            setIncidents(updatedIncidents);
            setCurrentStatus(newStatus);
            setStatusChangeModalOpen(false);
        }
    };


    const handleFilterChange = (filters: {
        dateRange?: { start: Date | null; end: Date | null };
        time?: string;
        type?: string;
        status?: string;
        criticality?: string;
    }) => {
        let filtered = [...incidents];

        if (filters.dateRange?.start || filters.dateRange?.end) {
            filtered = filtered.filter((incident) => {
                const [day, month, year] = incident.dateI.split('.').map(Number);
                const incidentDate = new Date(year, month - 1, day);

                const startDate = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

                if (startDate) {
                    startDate.setHours(0, 0, 0, 0);
                }

                if (endDate) {
                    endDate.setHours(23, 59, 59, 999);
                }

                return (!startDate || incidentDate >= startDate) && (!endDate || incidentDate <= endDate);
            });
        }

        if (filters.time) {
            filtered = filtered.filter((incident) => incident.time === filters.time);
        }

        if (filters.type) {
            filtered = filtered.filter((incident) => incident.type === filters.type);
        }

        if (filters.status) {
            filtered = filtered.filter((incident) => incident.status === filters.status);
        }

        if (filters.criticality) {
            filtered = filtered.filter((incident) => incident.criticality === filters.criticality);
        }

        setFilteredIncidents(filtered);
    };
    const incidentsDataForTable = filteredIncidents.map((incident) => ({
        dateI: incident.dateI,
        time: incident.time,
        type: <BlueLink to={"/building/incidents/directory"} text={incident.type}/>,
        description: incident.description,
        object: (
            <BlueLink to={incident.link} text={incident.object}/>
        ),
        status: (
            <a
                href="#"
                className={`underline p-1.5 border-none bg-transparent ${
                    incident.status === 'Активный' ? 'text-red-500' : 'text-green-500'
                }`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    openStatusModal(incident);
                }}
            >
                {incident.status === 'Активный' ? (
                    <>
                        <FaExclamationTriangle className="text-red-500 mr-1 inline"/> {incident.status}
                    </>
                ) : (
                    <>
                        <FaCheckCircle className="text-green-500 mr-1 inline"/> {incident.status}
                    </>
                )}
            </a>
        ),
        criticality: incident.criticality,
        details: (
            <a
                href="#"
                className="underline text-blue-600"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    openHistoryModal(incident);
                }}
            >
                Подробности
            </a>
        ),
    }));

    const headers = {
        'Дата': 'dateI',
        'Время': 'time',
        'Тип': 'type',
        'Описание': 'description',
        'Объект': 'object',
        'Статус': 'status',
        'Критичность': 'criticality',
        ' ': 'actions'
    };

    return (
        <DefaultLayout>
            <Label text="Инциденты"/>
            <IncidentFilters onFilterChange={handleFilterChange} />
            <div className="w-full overflow-x-auto">
                <div className="min-w-[1000px]">
                    <ItemTable headers={headers} data={incidentsDataForTable} tableStyles = 'table-auto border-collapse'/>
                </div>
            </div>
            {isStatusChangeModalOpen && selectedIncident && (
                <StatusChangeModal
                    incidentId={selectedIncident.id}
                    incidentDescription={selectedIncident.description}
                    object={selectedIncident.object}
                    currentStatus={currentStatus}
                    incidents={incidents}
                    setIncidents={setIncidents}
                    selectedIncident={selectedIncident}
                    user={user}
                    onClose={closeStatusModal}
                    onStatusChange={handleStatusChange}
                    loading={false}
                    setLoading={() => false}
                />
            )}
            {isIncidentHistoryModalOpen && selectedIncident && (
                <IncidentDetailsModal
                    loading={loading}
                    incident={selectedIncident}
                    onClose={closeHistoryModal}
                    incidents={incidents}
                    setIncidents={setIncidents}
                    selectedIncident={selectedIncident}
                    user={user.fullName}


                    setLoading={setLoading}
                />
            )}
        </DefaultLayout>
    );
};

export default IncidentPage;
