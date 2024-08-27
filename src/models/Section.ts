export interface Section {
    id: number;
    label: string;
    area?: number;
    volume?: number;
    buildingId: number;
}

export const transformSectionData = (section: Section) => {
    return [
        { id: 1, title: 'Наименование', value: section.label },
        { id: 2, title: 'Площадь', value: section.area || 'Не указана' },
        { id: 3, title: 'Объем', value: section.volume || 'Не указан' },
    ];
};
