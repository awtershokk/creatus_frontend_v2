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
            buttonLabel="Удалить"
            onClose={onClose}
            onSubmit={handleDelete}
            loading={loading}
        >
            <p className="text-black">
                Вы уверены, что хотите удалить тепловой контур <b>{circuitName}</b>?
            </p>
        </ModalTemplate>
    );
};

export default DeleteThermalCircuitModal;
