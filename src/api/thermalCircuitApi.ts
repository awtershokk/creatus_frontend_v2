import api from './api';
import { ThermalCircuit, transformThermalCircuitData } from '../models/ThermalCircuit';

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
        console.log(thermalCircuit)
        return transformThermalCircuitData(thermalCircuit);
    } catch (error) {
        throw error;
    }
};

export const deleteThermalCircuit = async (thermalCircuitId: number) => {
    try {
        const response = await api.delete(`/thermalCircuit/1/${thermalCircuitId}`);
    }
    catch (error) {
        throw error;
    }
};

export const addThermalCircuit = async (data: {
    label: string;
    heatingLoad: number;
    wiringDiagram: string;
    square: number;
    volume: number;
    connectionDiagram: string;
}) => {
    try {
        const response = await api.post('/thermalCircuit/1', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchWiringDiagrams = async () => {
    try {
        const response = await api.get('/thermalCircuit/list/wiringDiagrams');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchConnectionDiagrams = async () => {
    try {
        const response = await api.get('/thermalCircuit/list/connectionDiagrams');
        return response.data;
    } catch (error) {
        throw error;
    }
};
