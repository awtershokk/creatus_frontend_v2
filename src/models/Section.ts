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
export const reverseTransformSectionData = (transformedData: { id: number; title: string; value: string | number }[], buildingId: number): Section => {
    const section: Partial<Section> = { buildingId };

    transformedData.forEach((item) => {
        switch (item.title) {
            case 'Наименование':
                section.label = item.value as string;
                break;
            case 'Площадь':
                section.area = typeof item.value === 'number' ? item.value : undefined;
                break;
            case 'Объем':
                section.volume = typeof item.value === 'number' ? item.value : undefined;
                break;
            default:
                break;
        }
    });

    return section as Section;
};

