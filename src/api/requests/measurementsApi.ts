import api from "../api.ts";
import {Measurement, transformMeasurementData} from "../../models/Measurements.ts";
import {MeasurementMP, transformMeasurementMPData} from "../../models/MeasurementsMP.ts";

export const fetchMeasurementsThermalCircuit = async (thermalCircuitId: number) => {
    try {
        const response = await api.get(`/thermalCircuit/measurings/${thermalCircuitId}`);
        const measurement: Measurement[] = response.data.data;
        return measurement.map(measurement => transformMeasurementData(measurement));
    } catch (error) {
        console.error('Error fetching measurements:', error);
        throw error;
    }
};

export const fetchMeasurementsRoom = async (roomId: number) => {
    try {
        const response = await api.get(`/room/all/Measurements/${roomId}`);
        const measurement: Measurement[] = response.data.data;
        return measurement.map(measurement => transformMeasurementData(measurement));
    } catch (error) {
        throw error;
    }
};

export const fetchMeasurementsMeasuringPoint = async (measuringPointId: number) => {
    try {
        const response = await api.get(`/measuringPoint/allMeasurements/${measuringPointId}`);
        const measurement: MeasurementMP[] = response.data.data;
        return measurement.map(measurement => transformMeasurementMPData(measurement));
    } catch (error) {
        throw error;
    }
};



