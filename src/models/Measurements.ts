import {formatDateTime} from "../utils/formatDateTime.ts";
import moment from "moment";


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

export const retransformMeasurementData = (
    transformedData: { date: string, time: string, calculated_temperature: number, calculated_humidity: number, deviation_temperature: number, deviation_humidity: number }
): Measurement => {
    const { date, time, calculated_temperature, calculated_humidity, deviation_temperature, deviation_humidity } = transformedData;


    const createdAt = moment(`${date} ${time}`, 'DD.MM.YYYY HH:mm').valueOf();

    return {
        createdAt: createdAt.toString(),
        temperature: calculated_temperature ?? 0,
        humidity: calculated_humidity ?? 0,
        temperatureDeviation: deviation_temperature ?? 0,
        humidityDeviation: deviation_humidity ?? 0
    };
};

