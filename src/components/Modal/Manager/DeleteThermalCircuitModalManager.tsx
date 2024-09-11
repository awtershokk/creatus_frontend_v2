import React, { useState, useEffect } from 'react';
import DeleteThermalCircuitModal from "../Delete/ThermalCircuit/DeleteThermalCircuitModal.tsx";
import DeleteThermalCircuitWithRoomsModal from '../Delete/ThermalCircuit/DeleteThermalCircuitWithRoomsModal.tsx';
import { fetchRoomsByThermalCircuit} from "../../../api/roomApi.ts";
import {deleteThermalCircuit, fetchThermalCircuit} from "../../../api/thermalCircuitApi.ts";

interface ThermalCircuitModalManagerProps {
    thermalCircuitId: number;
    onClose: () => void;
}

const DeleteThermalCircuitModalManager: React.FC<ThermalCircuitModalManagerProps> = ({
                                                                                   thermalCircuitId,
                                                                                   onClose
                                                                               }) => {
    const [isDeleteThermalCircuitModalOpen, setIsDeleteThermalCircuitModalOpen] = useState(false);
    const [isDeleteThermalCircuitWithRoomsModalOpen, setIsDeleteThermalCircuitWithRoomsModalOpen] = useState(false);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [circuitName, setCircuitName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const thermalCircuit = await fetchThermalCircuit(thermalCircuitId);
                const nameObject = thermalCircuit.find(item => item.title === 'Наименование');
                if (nameObject) {
                    setCircuitName(nameObject.value);
                }


                const rooms = await fetchRoomsByThermalCircuit(thermalCircuitId);
                setSelectedRooms(rooms);


                if (rooms.length === 0) {
                    setIsDeleteThermalCircuitModalOpen(true);
                } else {
                    setIsDeleteThermalCircuitWithRoomsModalOpen(true);
                }
            } catch (error) {
                console.error('Ошибка получения данных теплового контура или помещений:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [thermalCircuitId]);

    const handleDeleteThermalCircuitModalClose = () => {
        setIsDeleteThermalCircuitModalOpen(false);
        onClose();
    };

    const handleDeleteThermalCircuitWithRoomsModalClose = () => {
        setIsDeleteThermalCircuitWithRoomsModalOpen(false);
        onClose();
    };

    const handleDelete = async () => {
        try {
            await deleteThermalCircuit(thermalCircuitId)
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении теплового контура:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            {isDeleteThermalCircuitModalOpen && (
                <DeleteThermalCircuitModal
                    circuitName={circuitName}
                    onClose={handleDeleteThermalCircuitModalClose}
                    onDelete={handleDelete}
                />
            )}

            {isDeleteThermalCircuitWithRoomsModalOpen && (
                <DeleteThermalCircuitWithRoomsModal
                    circuitName={circuitName}
                    rooms={selectedRooms}
                    onClose={handleDeleteThermalCircuitWithRoomsModalClose}
                />
            )}
        </>
    );
};

export default DeleteThermalCircuitModalManager;
