import api from '../api.ts';
import {MeasuringPoint, transformMeasuringPointData} from "../../models/MeasuringPoint.tsx";
import {Room} from "../../models/Room.tsx";

export const fetchMeasuringPoints = async (roomId: number) => {
    try {
        const response = await api.get(`/measuringPoint/room/${roomId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchMeasuringPointsWithoutDevice = async () => {
    try {
        const response = await api.get(`/measuringPoint/without/Device`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchMeasuringPoint = async (measuringPointId: number) => {
    try {
        const response = await api.get(`/measuringPoint/${measuringPointId}`);
        const measuringPoint: MeasuringPoint = response.data.data;
        return measuringPoint;
    } catch (error) {
        throw error;
    }
};

export const deleteMeasuringPoint = async (measuringPointId: number) => {
    try {
        await api.delete(`/measuringPoint/${measuringPointId}`);
    } catch (error) {
        throw error;
    }
};


export const createMeasuringPoint = async (roomId: number, data: any) => {

    try {
        const response = await api.post(`/measuringPoint/${roomId}`, {
            label: data.measureName,
            height: parseFloat(data.height),
            temperatureMinimum: parseFloat(data.tempMin),
            temperatureMaximum: parseFloat(data.tempMax),
            humidityMinimum: parseFloat(data.humidityMin),
            humidityMaximum: parseFloat(data.humidityMax),
            temperatureActive: data.tempIncluded === true,
            humidityActive: data.humidityIncluded === true,
            temperatureLocation: parseFloat(data.tempLocationCoeff),
            temperatureHeight: parseFloat(data.tempHeightCoeff),
            temperatureCalibration: parseFloat(data.tempCalibCoeff),
            humidityCalibration: parseFloat(data.humidityCalibCoeff)
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchDeviceId = async (measuringPointId: number) => {
    try {
        const { data: { data: { device: {id, label} } } } = await api.get(`/measuringPoint/${measuringPointId}`);
        return id;
    } catch (error) {
        throw error;
    }
};
export const updateMeasuringPoint = async (measuringPointId: number, updatedMeasuringPoint: MeasuringPoint): Promise<MeasuringPoint> => {
    try {
        const response = await api.put(`/measuringPoint/${measuringPointId}`, updatedMeasuringPoint);
        console.log('Точка измерения', updatedMeasuringPoint);
        console.log(response.data)
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

