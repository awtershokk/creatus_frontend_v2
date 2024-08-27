import api from './api';

export const fetchThermalCircuits = async (buildingId: number) => {
    try {
        const response = await api.get(`/thermalCircuit/${buildingId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
