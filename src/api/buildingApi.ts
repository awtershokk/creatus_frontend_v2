import api from './api';
import { Building } from '../models/Building';
import {ResponsiblePerson} from "../models/ResponsiblePerson.ts";
import {BuildingInfo, BuildingResponse} from "../models/Public.ts";
import {BuildingForm} from "../components/Modal/Edit/EditBuildingModal.tsx";

export const fetchBuilding = async (buildingId: number) => {
    try {
        const response = await api.get(`/building/${buildingId}`);
        const building: Building = response.data.data;

        return building;
    } catch (error) {
        throw error;
    }
};

export const updateBuilding = async (buildingId: number, updatedBuilding: BuildingForm): Promise<Building> => {
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

export const fetchListEnergyClasses = async () => {
    try {
        const response = await api.get(`/building/list/energyClasses`);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchListTimezones = async () => {
    try {
        const response = await api.get(`building/list/timezones`);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchListHwsConnectionDiagrams = async () => {
    try {
        const response = await api.get(`building/list/hwsConnectionDiagrams`);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};



export const fetchPublicInfo = async (id: number): Promise<BuildingInfo> => {
    try {

        const response = await api.get(`/public/${id}`);

        const data: BuildingResponse = response.data;
        const officeName = data.data.label;
        const thermalCircuits = data.data.TC || [];

        return {
            officeName,
            thermalCircuits
        };
    } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        throw error;
    }
};

