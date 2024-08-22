import axios from 'axios';
import API_URL from '../api/api';

const api = axios.create({
    baseURL: API_URL,
});

export const login = (credentials: { username: string; password: string }) => {
    return api.post('/user/login', credentials);
};

export const logout = () => {
    return api.post('/user/logout');
};

export const refresh = () => {
    return api.get('/user/refresh');
};
