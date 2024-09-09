import BlueLink from "../components/Text/BlueLink.tsx";

export interface MeasuringPoint {
    id: number;
    label: string;
    room: {
        id: number;
        label: string;
        thermalCircuit: {
            id: number;
            label: string;
        };
    };
    "device": {
        topic: string
        id: number
        label: string
    }
    height: number;
    temperatureMinimum: number;
    temperatureMaximum: number;
    humidityMinimum: number;
    humidityMaximum: number;
    temperatureActive: boolean;
    humidityActive: boolean;
    temperatureLocation: number;
    temperatureHeight: number;
    temperatureCalibration: number;
    humidityCalibration: number;
}

export const transformMeasuringPointData = (measuringPoint: MeasuringPoint) => {
    return [
        { id: 1, title: 'Наименование', value: measuringPoint.label },
        { id: 2, title: 'Место установки', value: (
                <BlueLink
                    to={`/building/thermalCircuit/${measuringPoint.room.thermalCircuit.id}/room/${measuringPoint.room.id}`}
                    text={measuringPoint.room.label}
                />
            )},
        { id: 4, title: 'Высота', value: measuringPoint.height },
        { id: 8, title: 'Минимальная температура', value: measuringPoint.temperatureMinimum },
        { id: 9, title: 'Максимальная температура', value: measuringPoint.temperatureMaximum },
        { id: 10, title: 'Минимальная влажность', value: measuringPoint.humidityMinimum },
        { id: 11, title: 'Максимальная влажность', value: measuringPoint.humidityMaximum },
        { id: 12, title: 'Температура включена в расчет', value: measuringPoint.temperatureActive ? 'Да' : 'Нет' },
        { id: 13, title: 'Влажность включена в расчет', value: measuringPoint.humidityActive ? 'Да' : 'Нет' },
        { id: 14, title: 'Коэффициент расположения', value: measuringPoint.temperatureLocation },
        { id: 15, title: 'Коэффициент высоты', value: measuringPoint.temperatureHeight },
        { id: 16, title: 'Калибровочный Коэффициент для температуры', value: measuringPoint.temperatureCalibration },
        { id: 17, title: 'Калибровочный Коэффициент для влажности', value: measuringPoint.humidityCalibration }
    ];
};
