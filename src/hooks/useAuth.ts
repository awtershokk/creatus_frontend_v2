import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store.ts';
import { loginUser, logoutUser, refreshToken } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const status = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);

    const login = async (username: string, password: string) => {
        await dispatch(loginUser({ username, password }));
    };

    const logout = async () => {
        await dispatch(logoutUser());
    };

    const refresh = async () => {
        await dispatch(refreshToken());
    };

    return {
        user,
        status,
        error,
        login,
        logout,
        refresh,
    };
};
