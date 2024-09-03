import { formatDateTime } from "../utils/formatDateTime.ts";

export interface MeasurementMP {
    createdAt: string;
    temperatureMeasured: number;
    temperatureCalculated: number;
    humidityMeasured: number;
    humidityCalculated: number;
    temperatureDeviation: number;
    humidityDeviation: number;
}

export const transformMeasurementMPData = (
    data: MeasurementMP
): { date: string, time: string, measured_temperature: number, calculated_temperature: number, measured_humidity: number, calculated_humidity: number, deviation_temperature: number, deviation_humidity: number } => {
    const { date, time } = formatDateTime(data.createdAt);
    return {
        date: date || 'Неверная дата',
        time: time || 'Неверное время',
        measured_temperature: data.temperatureMeasured ?? 'Нет данных',
        calculated_temperature: data.temperatureCalculated ?? 'Нет данных',
        measured_humidity: data.humidityMeasured ?? 'Нет данных',
        calculated_humidity: data.humidityCalculated ?? 'Нет данных',
        deviation_temperature: data.temperatureDeviation ?? 'Нет данных',
        deviation_humidity: data.humidityDeviation ?? 'Нет данных'
    };
};
