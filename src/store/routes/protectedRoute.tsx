import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
import LoadingPage from "../../pages/Error/LoadingPage.tsx";

interface ProtectedRouteProps {
    allowedRoles: number[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const checkAuth = () => {
            if (user) {
                setIsLoading(false);
            } else {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();
    }, [user]);

    if (isLoading) {
        return <LoadingPage/>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.roleId)) {
        return <Navigate to="/no-access" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
