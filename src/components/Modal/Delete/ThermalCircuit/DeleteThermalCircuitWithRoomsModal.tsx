import React, {useState} from 'react';
import ModalTemplate from '../../ModalTemplate.tsx';

interface Room {
    id: number;
    label: string;
}

interface DeleteThermalCircuitWithRoomsModalProps {
    circuitName: string;
    rooms: Room[];
    onClose: () => void;
}

const DeleteThermalCircuitWithRoomsModal: React.FC<DeleteThermalCircuitWithRoomsModalProps> = ({
                                                                                                                 circuitName,
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
            headerTitle="Удаление теплового контура"
            buttonLabel=''
            onClose={onClose}
            onSubmit={handleClose}
            loading={loading}
        >
            <p className="text-black">
                Чтобы удалить тепловой контур <b>{circuitName}</b>, необходимо сначала удалить следующие помещения:
            </p>
            <ul className="text-black list-disc ml-4">
                {rooms.map((room) => (
                    <li key={room.id}>{room.label}</li>
                ))}
            </ul>
        </ModalTemplate>
    );
};

export default DeleteThermalCircuitWithRoomsModal;
