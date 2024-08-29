import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import ItemTable from '../../components/Tables/ItemTable';
import Label from "../../components/Text/Label.tsx";
import BlueLink from "../../components/Text/BlueLink.tsx";

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
    history: { date: string; time: string; user: string; status: string }[];
}

const IncidentPage: React.FC = () => {
    localStorage.setItem('incidents', JSON.stringify({ label: 'Инциденты', icon: 'FaExclamationTriangle' }));

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
                { date: '12.08.2024', time: '13:30', user: 'Пользователь 3', status: 'Устранен' }
            ]
        },
        {
            id: 4,
            dateI: '15.08.2024',
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

    const incidentsDataForTable = incidents.map((incident) => ({
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
                }}
            >
                {incident.status === 'Активный' ? (
                    <>
                        <FaExclamationTriangle className="text-red-500 mr-1 inline"  /> {incident.status}
                    </>
                ) : (
                    <>
                        <FaCheckCircle className="text-green-500 mr-1 inline" /> {incident.status}
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
            <div className="w-full overflow-x-auto">
                <div className="min-w-[1000px]">
                    <ItemTable headers={headers} data={incidentsDataForTable}/>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default IncidentPage;
