import React from 'react';
import ModalTemplate from '../ModalTemplate';

interface StatusChangeModalProps {
    incidentId: number;
    incidentDescription: string;
    object: string;
    currentStatus: string;
    onClose: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
                                                                 incidentId,
                                                                 incidentDescription,
                                                                 object,
                                                                 currentStatus,
                                                                 onClose,
                                                                 onSubmit,
                                                                 loading,
                                                             }) => {

    const newStatus = currentStatus === 'Активный' ? 'Устранен' : 'Активный';


    const currentStatusColor = currentStatus === 'Активный' ? 'text-red-500' : 'text-green-500';
    const newStatusColor = newStatus === 'Активный' ? 'text-red-500' : 'text-green-500';

    return (
        <ModalTemplate
            headerTitle="Изменение статуса"
            buttonLabel="Подтвердить"
            onClose={onClose}
            onSubmit={onSubmit}
            loading={loading}
        >
            <p className="text-black">
                Поменять статус у инцидента <strong>{incidentDescription}</strong> на объекте <strong>{object}</strong> с{' '}
                <strong className={currentStatusColor}>{currentStatus}</strong> на{' '}
                <strong className={newStatusColor}>{newStatus}</strong>?
            </p>
        </ModalTemplate>
    );
};

export default StatusChangeModal;
