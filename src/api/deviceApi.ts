import api from './api';
import {
    Device,
    transformDeviceData,
    transformDeviceDataForMP,
    transformDeviceDataForSettingMode
} from "../models/Device";
import {Section, transformSectionData} from "../models/Section.ts";

export const fetchDevices = async (
    handleEditDeviceClick: (item: Device) => void = () => {},
    handleDeleteDeviceClick: (item: Device) => void = () => {}
): Promise<Device[]> => {
    try {
        const response = await api.get('/device');
        const devices: Device[] = response.data.data;
        return devices.map(device => transformDeviceData(device, handleEditDeviceClick, handleDeleteDeviceClick));
    } catch (error) {
        throw error;
    }
};

export const fetchDevice = async (deviceId: number) => {
    try {
        const response = await api.get(`/section/1/${deviceId}`);
        const device: Device = response.data.data;
        return transformDeviceDataForMP(device);
    } catch (error) {
        throw error;
    }
};

export const fetchDevicesSetiingsMode = async (
): Promise<Device[]> => {
    try {
        const response = await api.get('/device');
        const devices: Device[] = response.data.data;
        return devices.map(device => transformDeviceDataForSettingMode(device));
    } catch (error) {
        throw error;
    }
};



