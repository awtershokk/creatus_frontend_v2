import api from '../api.ts';
import { Building } from '../../models/Building.ts';
import {ResponsiblePerson, transformResponsiblePersonData} from "../../models/ResponsiblePerson.tsx";
import {BuildingInfo, BuildingResponse} from "../../models/Public.ts";
import {BuildingForm} from "../../components/Modal/Edit/EditBuildingModal.tsx";

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

        const transformedData: ResponsiblePerson[] = data.map((item: any) =>
            transformResponsiblePersonData({
                position: item.position,
                type: item.personType.label,
                fio: item.fullName,
                phone: item.phone,
                email: item.email,
                tg_username: item.tg_username || null,
            })
        );

        return transformedData;
    } catch (error) {
        throw error;
    }
};



export const addResponsiblePerson = async (buildingId: number, personData: ResponsiblePerson): Promise<void> => {
    try {
        await api.post(`/building/addResponsiblePerson/${buildingId}`, {
            position: personData.position,
            personType: personData.type,
            fullName: personData.name,
            phone: personData.phone,
            email: personData.email,
        });
    } catch (error) {
        console.error('Ошибка при добавлении ответственного лица:', error);
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

export const fetchBuildingTypes = async () => {
    try {
        const response = await api.get('/building/list/types');
        const data = await response.data;

        const options = data.map((item: any) => ({
            label: item.label,
            value: item.id
        }));

        return options;
    } catch (error) {
        console.error('Ошибка при загрузке типов:', error);
        throw error;
    }
};
