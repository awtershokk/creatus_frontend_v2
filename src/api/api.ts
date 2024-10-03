import axios from 'axios';

const API_URL = 'http://10.8.0.19:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export default api;


