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
import MeasuringPointPage from "./pages/Objects/MeasuringPointPage.tsx";
const App = () => {
    const { refresh } = useAuth();
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

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/no-access" element={<NoAccessPage />} />
                <Route element={<ProtectedRoute allowedRoles={[2, 3]} />}>
                    <Route path="/building" element={<BuildingPage />} />
                    <Route path="/building/updates" element={<UpdatePage/>}/>
                    <Route path="/building/section/:sectionId" element={<SectionPage />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId" element={<ThermalCircuitPage />} />
                    <Route path="/building/section/:sectionId/room/:roomId" element={<RoomPage />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId" element={<RoomPage />} />
                    <Route path="/building/section/:sectionId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage />} />
                    <Route path="/building/thermalCircuit/:thermalCircuitId/room/:roomId/measuringPoint/:measuringPointId" element={<MeasuringPointPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
