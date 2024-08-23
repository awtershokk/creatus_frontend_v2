import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.ts';
import App from './App.tsx';
import { refreshToken } from './store/slices/authSlice';
import './index.css';

const Main = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(refreshToken());
        }
    }, [dispatch]);

    return <App />;
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <Main />
        </Provider>
    </StrictMode>
);
