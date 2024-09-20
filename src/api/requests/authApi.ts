import api from '../api.ts';
import {refreshToken} from "../../store/slices/authSlice.ts";

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await refreshToken();
                localStorage.setItem('token', data.accessToken);
                api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export const login = (credentials: { username: string; password: string }) => {
    return api.post('/user/login', credentials);
};

export const logout = () => {
    return api.post('/user/logout');
};

export const refresh = () => {
    return api.get('/user/refresh');
};
