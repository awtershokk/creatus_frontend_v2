import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import LoginPage from './pages/Auth/LoginPage';
import NoAccessPage from './pages/Error/NoAccesPage';
import NotConnectionPage from './pages/Error/NotConnectionPage';
import ProtectedRoute from './store/routes/protectedRoute';
import { useAuth } from './hooks/useAuth';
import BuildingPage from "./pages/Objects/BuildingPage.tsx";
import SectionPage from "./pages/Objects/SectionPage.tsx";
import ThermalCircuitPage from "./pages/Objects/ThermalCircuitPage.tsx";
import UpdatePage from "./pages/Update/UpdatePage.tsx";
import RoomPage from "./pages/Objects/RoomPage.tsx";
import IncidentPage from "./pages/Incident/IncidentPage.tsx";
import IncidentDirectoryPage from "./pages/Incident/IncidentDirectoryPage.tsx";
import MeasuringPointPage from "./pages/Objects/MeasuringPointPage.tsx";
import UsersPage from "./pages/Admin/UsersPage.tsx";
import DevicePage from "./pages/Objects/DevicePage.tsx";
import ControllerPage from "./pages/Contoller/ControllerPage.tsx";
import UserPage from "./pages/User/UserPage.tsx";
import ControllerSchedulePage from "./pages/Contoller/ControllerSchedulePage.tsx";
import NotFoundPage from "./pages/Error/NotFoundPage.tsx";
import ControllerOptionsPage from "./pages/Contoller/ControllerOptionsPage.tsx";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import useServerStatus from './hooks/useServerStatus';
import LoadingSpinner from "./components/Menu/LoadingSpinner.tsx";

const App = () => {
    const { refresh, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const { serverConnected, checkServerConnection } = useServerStatus();

    const handleInteraction = () => {
        checkServerConnection();
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await refresh();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [refresh]);


    if (!serverConnected) {
        return <NotConnectionPage />;
    }


    return (
        <Router>
            <ToastContainer/>
            <Routes>
                <Route path="/" element={<LoginPage onClick={handleInteraction} />} />
                <Route path="/no-access" element={<NoAccessPage onClick={handleInteraction} />} />
                <Route path="/no-connection" element={<NotConnectionPage />} />
                <Route element={<ProtectedRoute allowedRoles={[2, 3]} />}>
                    <Route path="/building" element={<BuildingPage onClick={handleInteraction} />} />
                    <Route path="/building/users" element={<UsersPage onClick={handleInteraction} />} />
                    <Route path="/building/updates" element={<UpdatePage onClick={handleInteraction} />} />
                    <Route path="/building/devices" element={<DevicePage onClick={handleInteraction} />} />
                    <Route path="/building/controllers" element={<ControllerPage onClick={handleInteraction} />} />
                    <Route path="/building/controllers/options/:controllerId" element={<ControllerOptionsPage onClick={handleInteraction} />} />
                    <Route path="/building/controllers/schedule/:controllerId" element={<ControllerSchedulePage onClick={handleInteraction} />} />
                    <Route path="/building/section/:sectionId" element={<SectionPage onClick={handleInteraction} />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId" element={<ThermalCircuitPage onClick={handleInteraction} />} />
                    <Route path="/building/section/:sectionId/room/:roomId" element={<RoomPage onClick={handleInteraction} />} />
                    <Route path="/building/incidents" element={<IncidentPage onClick={handleInteraction} />} />
                    <Route path="/building/incidents/directory" element={<IncidentDirectoryPage onClick={handleInteraction} />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId" element={<RoomPage onClick={handleInteraction} />} />
                    <Route path="/building/section/:sectionId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage onClick={handleInteraction} />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage onClick={handleInteraction} />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={[1, 2, 3]} />}>
                    <Route path="user" element={<UserPage onClick={handleInteraction} />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;
