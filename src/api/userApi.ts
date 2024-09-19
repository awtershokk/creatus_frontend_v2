import api from './api';
import { User, transformUserData } from "../models/User";

export const fetchUsers = async (
    handleEditUserClick: (item: User) => void = () => {},
    handleDeleteUserClick: (item: User) => void = () => {}
): Promise<User[]> => {
    try {
        const response = await api.get('/user');
        const users: User[] = response.data;
        return users.map(user => transformUserData(user, handleEditUserClick, handleDeleteUserClick));
    } catch (error) {
        throw error;
    }
};

export const addUser = async (userData: { username: string; password: string; fullName: string; role: string }): Promise<User> => {
    try {
        const response = await api.post('/user', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};