import api from "./api.ts";
import {Room, transformRoomData} from "../models/Room.tsx";

export const fetchRoomsBySection = async (sectionId: number) => {
    try {
        const response = await api.get(`room/0/${sectionId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRoomsByThermalCircuit = async (thermalCircuitId: number) => {
    try {
        const response = await api.get(`room/${thermalCircuitId}/0`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRoom = async (roomId: number) => {
    try {
        const response = await api.get(`/room/${roomId}`);
        const room: Room = response.data.data;
        return transformRoomData(room);
    } catch (error) {
        throw error;
    }
};
