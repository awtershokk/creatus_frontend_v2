import api from './api';
import {Device, transformDeviceData, transformDeviceDataForSettingMode} from "../models/Device";

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

export const fetchDevicesSetiingMode = async (
): Promise<Device[]> => {
    try {
        const response = await api.get('/device');
        const devices: Device[] = response.data.data;
        return devices.map(device => transformDeviceDataForSettingMode(device));
    } catch (error) {
        throw error;
    }
};

