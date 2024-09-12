import BlueLink from "../components/Text/BlueLink.tsx";

export interface Room {
    id: number;
    label: string;
    section: {
        id: number;
        label: string;
    };
    thermalCircuit: {
        id: number;
        label: string;
    };
    floor: number;
    windowOrientation: {
        label: string;
    };
    square: number;
    angular: boolean;
    temperatureMinimum: number;
    temperatureMaximum: number;
    humidityMinimum: number;
    humidityMaximum: number;
    priority: number;
    humidityActive: boolean;
}

export const transformRoomData = (room: Room) => {
    return [
        { id: 1, title: 'Наименование', value: room.label },
        { id: 2, title: 'Секция', value: (
                <BlueLink to={`/building/section/${room.section.id}`} text={room.section.label} />
)},
    { id: 3, title: 'Тепловой контур', value: (
            <BlueLink to={`/building/thermalCircuit/${room.section.id}`} text={room.thermalCircuit.label} />
    )},
    { id: 4, title: 'Этаж', value: room.floor },
    { id: 5, title: 'Ориентация окон', value: room.windowOrientation.label },
    { id: 6, title: 'Площадь', value: room.square },
    { id: 7, title: 'Угловое', value: room.angular ? 'Да' : 'Нет' },
    { id: 8, title: 'Мин. температура', value: room.temperatureMinimum },
    { id: 9, title: 'Макс. температура', value: room.temperatureMaximum },
    { id: 10, title: 'Мин. влажность', value: room.humidityMinimum },
    { id: 11, title: 'Макс. влажность', value: room.humidityMaximum },
    { id: 12, title: 'Приоритет', value: room.priority },
    { id: 13, title: 'Включен в расчет', value: room.humidityActive ? 'Да' : 'Нет' },
];
};
export const transformRoomDataForUser = (room: Room) => {
    return [
        { id: 1, title: 'Наименование', value: room.label },
        { id: 2, title: 'Секция', value: room.section.label },
        { id: 3, title: 'Тепловой контур', value: room.thermalCircuit.label },
        { id: 4, title: 'Этаж', value: room.floor },
        { id: 5, title: 'Ориентация окон', value: room.windowOrientation.label },
        { id: 6, title: 'Площадь', value: room.square },
        { id: 7, title: 'Угловое', value: room.angular ? 'Да' : 'Нет' },
        { id: 8, title: 'Мин. температура', value: room.temperatureMinimum },
        { id: 9, title: 'Макс. температура', value: room.temperatureMaximum },
        { id: 10, title: 'Мин. влажность', value: room.humidityMinimum },
        { id: 11, title: 'Макс. влажность', value: room.humidityMaximum },
        { id: 12, title: 'Приоритет', value: room.priority },
        { id: 13, title: 'Включен в расчет', value: room.humidityActive ? 'Да' : 'Нет' },
    ];
};

