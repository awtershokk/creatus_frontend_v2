import api from './api';
import { Building, transformBuildingData } from '../models/Building';

export const fetchBuilding = async (buildingId: number) => {
    try {
        const response = await api.get(`/building/${buildingId}`);
        const building: Building = response.data.data;
        return transformBuildingData(building);
    } catch (error) {
        throw error;
    }
};
