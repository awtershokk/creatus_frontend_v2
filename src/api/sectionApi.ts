import api from './api';
import {Section, transformSectionData} from "../models/Section.ts";

export const fetchSections = async (buildingId: number) => {
    try {
        const response = await api.get(`/section/${buildingId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchSection = async (sectionId: number) => {
    try {
        const response = await api.get(`/section/1/${sectionId}`);
        const section: Section = response.data.data;
        return transformSectionData(section);
    } catch (error) {
        throw error;
    }
};
