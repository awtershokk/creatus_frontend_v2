export interface Building {
    label: string;
    address?: string;
    energyClass: { label?: string };
    constructionVolume?: number;
    heatedArea?: number;
    timezone: { label?: string };
    allDayMode?: boolean;
    compactnessIndicator?: number;
    floor?: number;
    usableBasement?: boolean;
    hsCapacity?: string;
    hsLoad?: string;
    hwsLoad?: string;
    ventilationLoad?: string;
    hwsConnectionDiagram: { label?: string };
    balanceHolderLabel?: string;
}

export const transformBuildingData = (building: Building) => {
    return [
        { id: 1, title: 'Наименование', value: building.label },
        { id: 2, title: 'Адрес', value: building.address || 'Не указан' },
        { id: 3, title: 'Энергокласс', value: building.energyClass.label || 'Не указан' },
        { id: 4, title: 'Строительный объем', value: building.constructionVolume },
        { id: 5, title: 'Отапливаемая площадь', value: building.heatedArea },
        { id: 6, title: 'Часовой пояс', value: building.timezone.label || 'Не указан' },
        { id: 7, title: 'Круглосуточный режим', value: building.allDayMode ? 'Да' : 'Нет' },
        { id: 8, title: 'Показатель компактности', value: building.compactnessIndicator },
        { id: 9, title: 'Число этажей', value: building.floor },
        { id: 10, title: 'Эксплуатируемый подвал', value: building.usableBasement ? 'Да' : 'Нет' },
        { id: 11, title: 'Емкость системы отопления', value: building.hsCapacity || 'Не указана' },
        { id: 12, title: 'Нагрузка на отопление', value: building.hsLoad || 'Не указана' },
        { id: 13, title: 'Нагрузка на ГВС', value: building.hwsLoad || 'Не указана' },
        { id: 14, title: 'Нагрузка на вентиляцию', value: building.ventilationLoad || 'Не указана' },
        { id: 15, title: 'Схема присоединения ГВС', value: building.hwsConnectionDiagram.label || 'Не указана' },
        { id: 16, title: 'Балансодержатель', value: building.balanceHolderLabel || 'Не указан' },
    ];
};
