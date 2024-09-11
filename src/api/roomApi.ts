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

export const createRoom = async (thermalCircuitId: number, sectionId: number, requestData: any) => {
    try {
        const response = await api.post(`/room/${thermalCircuitId}/${sectionId}`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export const fetchWindowOptions = async () => {
    try {
        const response = await api.get('/room/list/windowOrientations');
        return response.data.map((window: any) => ({
            label: window.label,
            value: window.id,
        }));
    } catch (error) {
        console.error('Error fetching window orientations:', error);
        throw error;
    }
};

export const fetchThermalCircuitIdOptions = async () => {
    try {
        const response = await api.get('/thermalCircuit/1');
        return response.data.data.map((thermalCircuit: any) => ({
            label: thermalCircuit.label,
            value: thermalCircuit.id,
        }));
    } catch (error) {
        console.error('Error fetching thermal circuits:', error);
        throw error;
    }
};

export const fetchSectionOptions = async () => {
    try {
        const response = await api.get('/section/1');
        return response.data.data.map((section: any) => ({
            label: section.label,
            value: section.id,
        }));
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};

