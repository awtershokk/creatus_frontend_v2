import React, { useState, useEffect } from 'react';
import {deleteRoom, fetchRoom} from "../../../api/roomApi.ts";


import DeleteRoomModal from "../Delete/Room/DeleteRoomModal.tsx";
import DeleteRoomWithMeasuringPointsModal from "../Delete/Room/DeleteRoomWithMeasuringPointsModal.tsx";
import {fetchMeasuringPoints} from "../../../api/measuringPointApi.ts";

interface RoomModalManagerProps {
    RoomId: number;
    onClose: () => void;
}

const DeleteRoomModalManager: React.FC<RoomModalManagerProps> = ({
                                                                     RoomId,
                                                                           onClose
                                                                       }) => {
    const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);
    const [isDeleteRoomWithMeasuringPointsModalOpen, setIsDeleteRoomWithMeasuringPointsModalOpen] = useState(false);
    const [selectedMeasuringPoints, setSelectedMeasuringPoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const room = await fetchRoom(RoomId);
                console.log(room);
                const nameObject = room.find(item => item.title === 'Наименование');
                if (nameObject) {
                    setRoomName(nameObject.value);
                }


                const MeasuringPoints = await fetchMeasuringPoints(RoomId);
                setSelectedMeasuringPoints(MeasuringPoints);


                if (MeasuringPoints.length === 0) {
                    setIsDeleteRoomModalOpen(true);
                } else {
                    setIsDeleteRoomWithMeasuringPointsModalOpen(true);
                }
            } catch (error) {
                console.error('Ошибка получения данных помещения или точки измерения', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [RoomId]);

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
            await deleteRoom(RoomId)
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении комнаты:', error);
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
                    MeasuringPoints={selectedMeasuringPoints}
                    onClose={handleDeleteRoomWithMeasuringPointsModalClose}
                />
            )}
        </>
    );
};

export default DeleteRoomModalManager;
