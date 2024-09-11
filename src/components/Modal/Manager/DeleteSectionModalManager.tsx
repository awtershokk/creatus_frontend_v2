import React, { useState, useEffect } from 'react';
import {fetchRoomsBySection} from "../../../api/roomApi.ts";
import {deleteSection, fetchSection} from "../../../api/sectionApi.ts";
import DeleteSectionWithRoomsModal from "../Delete/Section/DeleteSectionWithRoomsModal.tsx";
import DeleteSectionModal from "../Delete/Section/DeleteSectionModal.tsx";

interface SectionModalManagerProps {
    SectionId: number;
    onClose: () => void;
}

const DeleteSectionModalManager: React.FC<SectionModalManagerProps> = ({
                                                                           SectionId,
                                                                                         onClose
                                                                                     }) => {
    const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] = useState(false);
    const [isDeleteSectionWithRoomsModalOpen, setIsDeleteSectionWithRoomsModalOpen] = useState(false);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectionName, setSectionName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {

                const section = await fetchSection(SectionId);
                console.log(section);
                const nameObject = section.find(item => item.title === 'Наименование');
                if (nameObject) {
                    setSectionName(nameObject.value);
                }


                const rooms = await fetchRoomsBySection(SectionId);
                setSelectedRooms(rooms);


                if (rooms.length === 0) {
                    setIsDeleteSectionModalOpen(true);
                } else {
                    setIsDeleteSectionWithRoomsModalOpen(true);
                }
            } catch (error) {
                console.error('Ошибка получения данных теплового контура или помещений:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [SectionId]);

    const handleDeleteSectionModalClose = () => {
        setIsDeleteSectionModalOpen(false);
        onClose();
    };

    const handleDeleteSectionWithRoomsModalClose = () => {
        setIsDeleteSectionWithRoomsModalOpen(false);
        onClose();
    };

    const handleDelete = async () => {
        try {
            await deleteSection(SectionId)
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
            {isDeleteSectionModalOpen && (
                <DeleteSectionModal
                    sectionName={sectionName}
                    onClose={handleDeleteSectionModalClose}
                    onDelete={handleDelete}
                />
            )}

            {isDeleteSectionWithRoomsModalOpen && (
                <DeleteSectionWithRoomsModal
                    sectionName={sectionName}
                    rooms={selectedRooms}
                    onClose={handleDeleteSectionWithRoomsModalClose}
                />
            )}
        </>
    );
};

export default DeleteSectionModalManager;
