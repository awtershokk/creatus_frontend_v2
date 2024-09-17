import React from 'react';
import ModalTemplate from '../ModalTemplate';

interface StatusChangeModalProps {
    incidentId: number;
    incidentDescription: string;
    object: string;
    currentStatus: string;
    incidents: any[];
    setIncidents: (incidents: any[]) => void;
    selectedIncident: any;
    user: { fullName: string };
    onClose: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
                                                                 incidentId,
                                                                 incidentDescription,
                                                                 object,
                                                                 currentStatus,
                                                                 incidents,
                                                                 setIncidents,
                                                                 selectedIncident,
                                                                 user,
                                                                 onClose,
                                                                 loading,
                                                                 setLoading,
                                                             }) => {
    const newStatus = currentStatus === 'Активный' ? 'Устранен' : 'Активный';

    const currentStatusColor = currentStatus === 'Активный' ? 'text-red-500' : 'text-green-500';
    const newStatusColor = newStatus === 'Активный' ? 'text-red-500' : 'text-green-500';


    const changeIncidentStatus = () => {
        if (selectedIncident) {
            setLoading(true);
            setTimeout(() => {
                const updatedIncidents = incidents.map((incident) =>
                    incident.id === selectedIncident.id
                        ? { ...incident, status: newStatus }
                        : incident
                );

                console.log('Пользователь', user, 'поменял статус инцидента', selectedIncident.id, 'На', newStatus);
                setIncidents(updatedIncidents);
                setLoading(false);
                onClose();
            }, 100);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Изменение статуса"
            buttonLabel="Подтвердить"
            onClose={onClose}
            onSubmit={changeIncidentStatus}
            loading={loading}
            wight='max-w-[600px]'
        >
            <p className="text-black">
                Поменять статус у инцидента № {incidentId} <strong>{incidentDescription}</strong> на объекте{' '}
                <strong>{object}</strong> с <strong className={currentStatusColor}>{currentStatus}</strong> на{' '}
                <strong className={newStatusColor}>{newStatus}</strong>?
            </p>
        </ModalTemplate>
    );
};

export default StatusChangeModal;
