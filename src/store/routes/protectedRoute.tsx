import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    allowedRoles: number[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {

        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {

        return <div>Loading...</div>;
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
