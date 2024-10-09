import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store.ts';
import { loginUser, logoutUser, refreshToken } from '../store/slices/authSlice';
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const isTokenNearExpiration = (token: string | null) => {
    if (!token || typeof token !== 'string') {
        console.error('Invalid token: must be a non-null string', token);
        return false;
    }
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const expirationTime = decoded.exp;
    return expirationTime - currentTime < 300;
};

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);

    const [loading, setLoading] = useState(true);

    const login = async (username: string, password: string) => {
        await dispatch(loginUser({ username, password }));
    };

    const logout = async () => {
        await dispatch(logoutUser());
    };

    const refresh = async () => {
        const token = localStorage.getItem('token');
        if (token && isTokenNearExpiration(token)) {
            await refreshToken();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            refresh().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return {
        user,
        status,
        error,
        login,
        logout,
        refresh,
        loading,
    };
};
