import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/Auth/LoginPage';
import NoAccessPage from './pages/Error/NoAccesPage';
import ProtectedRoute from './store/routes/protectedRoute';
import { useAuth } from './hooks/useAuth';
import LoadingPage from './pages/Error/LoadingPage.tsx';
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
import ControllerOptionsPage from "./pages/Contoller/ControllerOptionsPage.jsx";
import UserPage from "./pages/User/UserPage.tsx";
import ControllerSchedulePage from "./pages/Contoller/ControllerSchedulePage.tsx";
const App = () => {
    const { refresh, user } = useAuth();
    const [loading, setLoading] = useState(true);

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

    return (
        <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/no-access" element={<NoAccessPage />} />
                    <Route element={<ProtectedRoute allowedRoles={[2, 3]} />}>
                        <Route path="/building" element={<BuildingPage />} />
                        <Route path="/building/users" element={<UsersPage />} />
                        <Route path="/building/updates" element={<UpdatePage />} />
                        <Route path="/building/devices" element={<DevicePage />} />
                        <Route path="/building/controllers" element={<ControllerPage />} />
                        <Route path="/building/controllers/options/:controllerId" element={<ControllerOptionsPage />} />
                        <Route path="/building/controllers/schedule/:controllerId" element={<ControllerSchedulePage />} />
                        <Route path="/building/section/:sectionId" element={<SectionPage />} />
                        <Route path="/building/thermalCircuit/:thermalCircuitId" element={<ThermalCircuitPage />} />
                        <Route path="/building/section/:sectionId/room/:roomId" element={<RoomPage />} />
                        <Route path="/building/incidents" element={<IncidentPage />} />
                        <Route path="/building/incidents/directory" element={<IncidentDirectoryPage />} />
                        <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId" element={<RoomPage />} />
                        <Route path="/building/section/:sectionId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage />} />
                        <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={[1, 2, 3]} />}>
                        <Route path="user" element={<UserPage />} />
                    </Route>
                </Routes>

        </Router>
    );
};

export default App;
