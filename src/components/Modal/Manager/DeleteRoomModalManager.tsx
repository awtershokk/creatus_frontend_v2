import React, { useState, useEffect } from 'react';
import { deleteRoom, fetchRoom } from "../../../api/requests/roomApi.ts";
import { fetchMeasuringPoints } from "../../../api/requests/measuringPointApi.ts";

import DeleteRoomModal from "../Delete/Room/DeleteRoomModal.tsx";
import DeleteRoomWithMeasuringPointsModal from "../Delete/Room/DeleteRoomWithMeasuringPointsModal.tsx";

interface RoomModalManagerProps {
    roomId: number;
    onClose: () => void;
}

const DeleteRoomModalManager: React.FC<RoomModalManagerProps> = ({ roomId, onClose }) => {
    const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);
    const [isDeleteRoomWithMeasuringPointsModalOpen, setIsDeleteRoomWithMeasuringPointsModalOpen] = useState(false);
    const [measuringPoints, setMeasuringPoints] = useState<any[]>([]);
    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const room = await fetchRoom(roomId);
            const roomNameObj = room.find(item => item.title === 'Наименование');
            if (roomNameObj) setRoomName(roomNameObj.value);

            const fetchedMeasuringPoints = await fetchMeasuringPoints(roomId);
            setMeasuringPoints(fetchedMeasuringPoints);


            if (fetchedMeasuringPoints.length === 0) {
                setIsDeleteRoomModalOpen(true);
            } else {
                setIsDeleteRoomWithMeasuringPointsModalOpen(true);
            }
        } catch (error) {
            console.error('Ошибка получения данных помещения или точек измерения:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [roomId]);

    const handleDeleteRoomModalClose = () => {
        setIsDeleteRoomModalOpen(false);
        onClose();
    };

    const handleDeleteRoomWithMeasuringPointsModalClose = () => {
        setIsDeleteRoomWithMeasuringPointsModalOpen(false);
        onClose();
    };

    const handleDelete = async () => {
        try {
            await deleteRoom(roomId);
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении помещения:', error);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            {isDeleteRoomModalOpen && (
                <DeleteRoomModal
                    roomName={roomName}
                    onClose={handleDeleteRoomModalClose}
                    onDelete={handleDelete}
                />
            )}

            {isDeleteRoomWithMeasuringPointsModalOpen && (
                <DeleteRoomWithMeasuringPointsModal
                    roomName={roomName}
                    MeasuringPoints={measuringPoints}
                    onClose={handleDeleteRoomWithMeasuringPointsModalClose}
                />
            )}
        </>
    );
};

export default DeleteRoomModalManager;
