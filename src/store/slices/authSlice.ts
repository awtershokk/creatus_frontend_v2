import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, refresh } from '../../api/authApi';

interface User {
    id: number;
    username: string;
    fullName: string;
    roleId: number;
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось войти в систему.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await logout();
        } catch (error) {
            return rejectWithValue('Не удалось выйти из системы.');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await refresh();
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось обновить токен.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.user = action.payload.user;
            });
    },
});

export default authSlice.reducer;
