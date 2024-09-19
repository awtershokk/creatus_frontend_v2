export interface ThermalCircuit {
    id: number;
    label: string;
    heatingLoad?: string;
    wiringDiagram: string;
    square?: number;
    volume?: number;
    connectionDiagram: string;
}


export const transformThermalCircuitData = (thermalCircuit: ThermalCircuit) => {
    return [
        { id: 1, title: 'Наименование', value: thermalCircuit.label },
        { id: 2, title: 'Нагрузка на отопление', value: thermalCircuit.heatingLoad === "NULL" ? "Нет данных" : thermalCircuit.heatingLoad },
        { id: 3, title: 'Схема разводки', value: thermalCircuit.wiringDiagram === "NULL" ? "Нет данных" : thermalCircuit.wiringDiagram.label },
        { id: 4, title: 'Площадь', value: thermalCircuit.square || "Нет данных" },
        { id: 5, title: 'Объем', value: thermalCircuit.volume || "Нет данных" },
        { id: 6, title: 'Схема присоединения СО', value: thermalCircuit.connectionDiagram === "NULL" ? "Нет данных" : thermalCircuit.connectionDiagram.label },
    ];
};

export const reverseTransformThermalCircuitData = (
    transformedData: { id: number; title: string; value: string | number }[],
    circuitId: number
): ThermalCircuit => {
    const thermalCircuit: Partial<ThermalCircuit> = {
        id: circuitId,
        wiringDiagram: "",
        connectionDiagram: ""
    };

    transformedData.forEach(item => {
        switch (item.title) {
            case 'Наименование':
                thermalCircuit.label = item.value as string;
                break;
            case 'Нагрузка на отопление':
                thermalCircuit.heatingLoad = item.value === "Нет данных" ? "NULL" : item.value as string;
                break;
            case 'Схема разводки':
                thermalCircuit.wiringDiagram = item.value === "Нет данных" ? "NULL" : item.value as string;
                break;
            case 'Площадь':
                thermalCircuit.square = typeof item.value === 'number' ? item.value : undefined;
                break;
            case 'Объем':
                thermalCircuit.volume = typeof item.value === 'number' ? item.value : undefined;
                break;
            case 'Схема присоединения СО':
                thermalCircuit.connectionDiagram = item.value === "Нет данных" ? "NULL" : item.value as string;
                break;
            default:
                break;
        }
    });

    return thermalCircuit as ThermalCircuit;
};
