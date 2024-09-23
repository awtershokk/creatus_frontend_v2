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
    temperatureActive: boolean;
    humidityMinimum: number;
    humidityMaximum: number;
    humidityActive: boolean;
    priority: number;
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
    { id: 10, title: 'Температура включена в расчёт', value: room.temperatureActive ? 'Да' : 'Нет' },
    { id: 11, title: 'Мин. влажность', value: room.humidityMinimum },
    { id: 12, title: 'Макс. влажность', value: room.humidityMaximum },
    { id: 14, title: 'Влажность включена в расчёт', value: room.humidityActive ? 'Да' : 'Нет' },
    { id: 14, title: 'Приоритет', value: room.priority },


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
        { id: 10, title: 'Температура включена в расчёт', value: room.temperatureActive ? 'Да' : 'Нет' },
        { id: 11, title: 'Мин. влажность', value: room.humidityMinimum },
        { id: 12, title: 'Макс. влажность', value: room.humidityMaximum },
        { id: 14, title: 'Влажность включена в расчёт', value: room.humidityActive ? 'Да' : 'Нет' },
        { id: 14, title: 'Приоритет', value: room.priority },
    ];
};

