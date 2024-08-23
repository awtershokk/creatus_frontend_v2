import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store.ts';

interface ProtectedRouteProps {
    allowedRoles: number[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.roleId)) {
        return <Navigate to="/no-access" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
