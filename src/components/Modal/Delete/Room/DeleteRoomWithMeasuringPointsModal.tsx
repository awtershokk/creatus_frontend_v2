import React, {useState} from 'react';
import ModalTemplate from '../../ModalTemplate.tsx';

interface MeasuringPoint {
    id: number;
    label: string;
}

interface DeleteRoomWithMeasuringPointsModalProps {
    roomName: string;
    MeasuringPoints: MeasuringPoint[];
    onClose: () => void;
}

const DeleteRoomWithMeasuringPointsModal: React.FC<DeleteRoomWithMeasuringPointsModalProps> = ({
                                                                                     roomName,
                                                                                     MeasuringPoints,
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
            headerTitle="Удаление помещения"
            buttonLabel=''
            onClose={onClose}
            onSubmit={handleClose}
            loading={loading}
        >
            <p className="text-black">
                Чтобы удалить помещение <b>{roomName}</b>, необходимо сначала удалить следующие точки измерения:
            </p>
            <ul className="text-black list-disc ml-4">
                {MeasuringPoints.map((MeasuringPoint) => (
                    <li key={MeasuringPoint.id}>{MeasuringPoint.label}</li>
                ))}
            </ul>
        </ModalTemplate>
    );
};

export default DeleteRoomWithMeasuringPointsModal;
