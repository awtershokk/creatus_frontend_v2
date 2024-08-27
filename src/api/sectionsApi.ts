import api from './api';

export const fetchSections = async (buildingId: number) => {
    try {
        const response = await api.get(`/section/${buildingId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
