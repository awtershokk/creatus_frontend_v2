import api from './api';
import {MeasuringPoint, transformMeasuringPointData} from "../models/MeasuringPoint.tsx";

export const fetchMeasuringPoints = async (roomId: number) => {
    try {
        const response = await api.get(`/measuringPoint/room/${roomId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchMeasuringPoint = async (measuringPointId: number) => {
    try {
        const response = await api.get(`/measuringPoint/${measuringPointId}`);
        const measuringPoint: MeasuringPoint = response.data.data;
        return transformMeasuringPointData(measuringPoint);
    } catch (error) {
        throw error;
    }
};

export const fetchDeviceId = async (measuringPointId: number) => {
    try {
        const response = await api.get(`/measuringPoint/${measuringPointId}`);
        const measuringPoint: MeasuringPoint = response.data.data;
        return transformMeasuringPointData(measuringPoint);
    } catch (error) {
        throw error;
    }
};

