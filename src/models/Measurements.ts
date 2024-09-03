import {formatDateTime} from "../utils/formatDateTime.ts";


export interface Measurement {
    createdAt: string;
    temperature: number;
    humidity: number;
    temperatureDeviation: number;
    humidityDeviation: number;
}

export const transformMeasurementData = (
    data: Measurement
): { date: string, time: string, calculated_temperature: number, calculated_humidity: number, deviation_temperature: number, deviation_humidity: number } => {
    const { date, time } = formatDateTime(data.createdAt);
    return {
        date: date || 'Неверная дата',
        time: time || 'Неверное время',
        calculated_temperature: data.temperature ?? 'Нет данных',
        calculated_humidity: data.humidity ?? 'Нет данных',
        deviation_temperature: data.temperatureDeviation ?? 'Нет данных',
        deviation_humidity: data.humidityDeviation ?? 'Нет данных'
    };
};



