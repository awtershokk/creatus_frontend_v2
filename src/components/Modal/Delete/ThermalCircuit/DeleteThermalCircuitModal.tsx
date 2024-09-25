import React, { useState } from 'react';
import ModalTemplate from '../../ModalTemplate.tsx';

interface DeleteThermalCircuitModalProps {
    circuitName: string;
    onClose: () => void;
    onDelete: () => Promise<void>;
}

const DeleteThermalCircuitModal: React.FC<DeleteThermalCircuitModalProps> = ({
                                                                                               circuitName,
                                                                                               onClose,
                                                                                               onDelete,
                                                                                           }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении теплового контура:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Подтвердите удаление"
            buttonLabel="Удалить (Удерживать)"
            onClose={onClose}
            onSubmit={handleDelete}
            loading={loading}
            deleteMode={true}
            buttonStyles="px-4 py-2 border border-red-500 bg-red-500 text-white rounded-md transition relative overflow-hidden"
        >
            <p className="text-black">
                Вы уверены, что хотите удалить тепловой контур <b>{circuitName}</b>?
            </p>
        </ModalTemplate>
    );
};

export default DeleteThermalCircuitModal;
