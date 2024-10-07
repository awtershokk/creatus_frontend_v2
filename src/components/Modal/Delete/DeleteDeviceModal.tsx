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
            buttonLabel="Удалить (Удерживать)"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            deleteMode={true}
            buttonStyles="px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md transition relative overflow-hidden"
            progressStyles="absolute top-0 left-0 h-full bg-gray-400 opacity-50"
        >
            <p className="text-black">Вы действительно хотите удалить датчик <b>{label}</b>?</p>
        </ModalTemplate>
    );
};

export default DeleteDeviceModal;
