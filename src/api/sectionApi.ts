import api from './api';
import { Section, transformSectionData } from "../models/Section.ts";


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

export const deleteSection = async (sectionId: number) => {
    try {
        await api.delete(`/section/1/${sectionId}`);
    }
    catch (error) {
        throw error;
    }
};
export const createSection = async (section: { label: string, area: number, volume: number }) => {
    try {
        const response = await api.post(`/section/1`, section);
        return response.data;

    } catch (error) {
        throw error;
    }
};
