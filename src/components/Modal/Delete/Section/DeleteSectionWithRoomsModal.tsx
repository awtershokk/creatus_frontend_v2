import React, {useState} from 'react';
import ModalTemplate from '../../ModalTemplate.tsx';

interface Room {
    id: number;
    label: string;
}

interface DeleteSectionWithRoomsModalProps {
    sectionName: string;
    rooms: Room[];
    onClose: () => void;
}

const DeleteSectionWithRoomsModal: React.FC<DeleteSectionWithRoomsModalProps> = ({
                                                                                     sectionName,
                                                                                                   rooms,
                                                                                                   onClose
                                                                                               }) => {
    const [loading, setLoading] = useState(false);

    const handleClose = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            onClose();
        } catch (error) {
            console.error('Ошибка при закрытии модалки:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Удаление секции"
            buttonLabel=''
            onClose={onClose}
            onSubmit={handleClose}
            loading={loading}
            otmenaDisabled={true}
        >
            <p className="text-black">
                Чтобы удалить секцию <b>{sectionName}</b>, необходимо сначала удалить следующие помещения:
            </p>
            <ul className="text-black list-disc ml-4">
                {rooms.map((room) => (
                    <li key={room.id}>{room.label}</li>
                ))}
            </ul>
        </ModalTemplate>
    );
};

export default DeleteSectionWithRoomsModal;
