export interface MeasuringPoint {
    roomId: number;
    measuringPointId: number;
    measuringPointLabel: string;
    deviceId: number | null;
    deviceLabel: string | null;
    deviceActive: boolean | null;
}

export interface Room {
    id: number;
    label: string;
    priority: number;
    temp: number;
    tempDev: number;
    hum: number;
    humDev: number;
    measuringPoints: MeasuringPoint[];
}

export interface Circuit {
    R: Room[];
}

export interface Floor {
    name: number;
    C: Circuit[];
}

export interface Section {
    id: number;
    label: string;
    F: Floor[];
}

export interface ThermalCircuit {
    id: number;
    label: string;
    S: Section[];
}

export interface BuildingInfo {
    officeName: string; // Название здания
    thermalCircuits: ThermalCircuit[];
}

export interface BuildingResponse {
    timestamp: number;
    data: BuildingInfo;
    errors: string;
}
