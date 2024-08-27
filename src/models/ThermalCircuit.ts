export interface ThermalCircuit {
    id: number;
    label: string;
    heatingLoad?: string;
    wiringDiagram: {
        label: string;
    };
    square?: number;
    volume?: number;
    connectionDiagram: {
        label: string;
    };
}

export const transformThermalCircuitData = (thermalCircuit: ThermalCircuit) => {
    return [
        { id: 1, title: 'Наименование', value: thermalCircuit.label },
        { id: 2, title: 'Нагрузка на отопление', value: thermalCircuit.heatingLoad === "NULL" ? "Нет данных" : thermalCircuit.heatingLoad },
        { id: 3, title: 'Схема разводки', value: thermalCircuit.wiringDiagram.label === "NULL" ? "Нет данных" : thermalCircuit.wiringDiagram.label },
        { id: 4, title: 'Площадь', value: thermalCircuit.square || "Нет данных" },
        { id: 5, title: 'Объем', value: thermalCircuit.volume || "Нет данных" },
        { id: 6, title: 'Схема присоединения СО', value: thermalCircuit.connectionDiagram.label === "NULL" ? "Нет данных" : thermalCircuit.connectionDiagram.label },
    ];
};
