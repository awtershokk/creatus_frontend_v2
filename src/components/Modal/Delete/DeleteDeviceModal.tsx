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
            console.log('Удален датчик:', label );
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalTemplate
            headerTitle="Подтвердите удаление"
            buttonLabel="Удалить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <p className="text-black ">Вы действительно хотите удалить датчик "{label}"?</p>
        </ModalTemplate>
    );
};

export default DeleteDeviceModal;
