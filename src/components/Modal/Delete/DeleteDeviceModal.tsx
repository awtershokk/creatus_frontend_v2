import React, {useState} from 'react';
import ModalTemplate from '../ModalTemplate';

interface DeleteDeviceModalProps {
    label: string;
    onClose: () => void;
    onSubmit: () => void;
}

const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = ({ label, onClose }) => {
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            onClose();
        } catch (error) {
            console.error('Ошибка при удалении датчика:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalTemplate
            headerTitle="Удаление датчика"
            buttonLabel="Удалить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <p className="text-black">Вы действительно хотите удалить датчик <b>{label}</b>?</p>
        </ModalTemplate>
    );
};

export default DeleteDeviceModal;
