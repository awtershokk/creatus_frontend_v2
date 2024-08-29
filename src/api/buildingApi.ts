import api from './api';
import { Building, transformBuildingData } from '../models/Building';
import {ResponsiblePerson} from "../models/ResponsiblePerson.ts";

export const fetchBuilding = async (buildingId: number) => {
    try {
        const response = await api.get(`/building/${buildingId}`);
        const building: Building = response.data.data;
        return transformBuildingData(building);
    } catch (error) {
        throw error;
    }
};

export const updateBuilding = async (buildingId: number, updatedBuilding: Building): Promise<Building> => {
    try {
        const response = await api.put(`/building/${buildingId}`, updatedBuilding);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchResponsiblePersons = async (buildingId: number): Promise<ResponsiblePerson[]> => {
    try {
        const response = await api.get(`/building/allResponsiblePerson/${buildingId}`);
        const data = response.data.data;

        const transformedData: ResponsiblePerson[] = data.map((item: any) => ({
            position: item.position,
            type: item.personType.label,
            fio: item.fullName,
            phone: item.phone,
            email: item.email,
        }));

        return transformedData;
    } catch (error) {
        throw error;
    }
};
