import api from './api';
import {ThermalCircuit, transformThermalCircuitData} from "../models/ThermalCircuit.ts";

export const fetchThermalCircuits = async (buildingId: number) => {
    try {
        const response = await api.get(`/thermalCircuit/${buildingId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchThermalCircuit = async (thermalCircuitId: number) => {
    try {
        const response = await api.get(`/thermalCircuit/1/${thermalCircuitId}`);
        const thermalCircuit: ThermalCircuit = response.data.data;
        return transformThermalCircuitData(thermalCircuit);
    } catch (error) {
        throw error;
    }
};
