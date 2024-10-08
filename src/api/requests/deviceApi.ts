import api from '../api.ts';
import {
    Device,
    transformDeviceData,
    transformDeviceDataForMP,
    transformDeviceDataForSettingMode, transformDeviceMeasuring, transformDeviceStatistics
} from "../../models/Device.tsx";


export const fetchDevices = async (
    handleEditDeviceClick: (item: Device) => void = () => {},
    handleDeleteDeviceClick: (item: Device) => void = () => {},
    handleUnbindDeviceClick: (deviceId: number, deviceLabel: string, measuringPointLabel: string) => void = () => {},
    handleBindDeviceClick: (deviceId: number, deviceLabel: string) => void = () => {},
    handleLabelClick: (deviceId: number, deviceLabel: string) => void = () => {}  // Добавляем handleLabelClick
): Promise<Device[]> => {
    try {
        const response = await api.get('/device');
        const devices: Device[] = response.data.data;

        // Передаем handleLabelClick в transformDeviceData
        return devices.map(device =>
            transformDeviceData(
                device,
                handleEditDeviceClick,
                handleDeleteDeviceClick,
                handleUnbindDeviceClick,
                handleBindDeviceClick,
                handleLabelClick  // Здесь передаем
            )
        );
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

export const fetchDevice = async (deviceId: number) => {
    try {
        const response = await api.get(`/device/${deviceId}`);
        const device: Device = response.data.data[0];

        return transformDeviceDataForMP(device);

    } catch (error) {
        throw error;
    }
};

export const fetchDevicesWithoutMP = async (): Promise<Device[]> => {
    try {
        const response = await api.get(`/device/without/MP`);
        const data = response.data.data;

        const transformedData: Device[] = data.map((item: any) => ({
            id: item.id,
            label: item.label
        }));

        return transformedData;

    } catch (error) {
        throw error;
    }
};

export const unbindDeviceFromMP = async (deviceId: number) => {
        const response = await api.put(`/device/untie/${deviceId}`)
        return response.data
}

export const bindDeviceFromMP = async (measuringPointId: number, deviceId: number) => {
    const response = await api.put(`/measuringPoint/tie/${measuringPointId}/${deviceId}`)
    return response.data
}



export const fetchDevicesStatistic = async (deviceId: number) => {
    try {
        const response = await api.get(`/device/measuring/${deviceId}`);
        const rawData = response.data;

        const transformedData = transformDeviceStatistics(rawData);

        return transformedData;

    } catch (error) {
        console.error('Ошибка при получении статистики устройства:', error);
        throw error;
    }
};

export const fetchDevicesLastMeasuring = async (deviceId: number) => {
    try {
        const response = await api.get(`/device/measuringLast/${deviceId}`);
        const rawData = response.data.data;

        const transformedData = transformDeviceMeasuring(rawData);

        return transformedData;

    } catch (error) {
        console.error('Ошибка при получении статистики устройства:', error);
        throw error;
    }
};
