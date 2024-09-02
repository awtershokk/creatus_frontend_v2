import api from "./api.ts";
import {Measurement, transformMeasurementData} from "../models/Measurements.ts";


export const fetchMeasurementsThermalCircuit = async (thermalCircuitId: number) => {
    try {
        const response = await api.get(`/thermalCircuit/measurings/${thermalCircuitId}`);
        const measurement: Measurement[] = response.data.data;
        console.log('Fetched measurements:', measurement); // Добавьте это для отладки
        return measurement.map(measurement => transformMeasurementData(measurement));
    } catch (error) {
        console.error('Error fetching measurements:', error); // Добавьте это для отладки
        throw error;
    }
};
