import React from 'react';
import ModalTemplate from "./ModalTemplate.tsx";
import ItemTable from "../Tables/ItemTable.tsx";
import moment from 'moment';
import { FaTelegramPlane } from "react-icons/fa";
import BlueLink from "../Text/BlueLink.tsx";

interface IncidentDetailsModalProps {
    incident: {
        id: number;
        dateI: string;
        time: string;
        description: string;
        object: string;
        status: string;
        history: Array<{ date: string; time: string; user: string; status: string }>;
    };
    loading: boolean;
    onClose: () => void;
}

const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({ incident, onClose }) => {
    const headers = {
        'Дата': 'date',
        'Время': 'time',
        'Пользователь': 'user',
        'Статус': 'status',
    };

    const isHistoryEmpty = incident.history.length === 0 ||
        incident.history.every(entry =>
            !entry.date
        );

    return (
        <ModalTemplate
            headerTitle="Подробности инцидента"
            buttonLabel=""
            loading={false}
            onClose={onClose}
            onSubmit={onClose}
            cancelButtonLabel='Закрыть'
            wight='max-w-[800px]'
        >
            <div className="text-black w-full space-y-2">
                <p>
                    <strong>Инцидент:</strong> {incident.description}
                </p>
                <p>
                    <strong>Время возникновения:</strong>{' '}
                    {moment(`${incident.dateI} ${incident.time}`, 'DD.MM.YYYY HH:mm').format('DD.MM.YYYY HH:mm')}
                </p>
                {incident.status === 'Устранен' && (
                    <p>
                        <strong>Время устранения:</strong>{' '}
                        {moment(`${incident.dateI} ${incident.time}`, 'DD.MM.YYYY HH:mm').format('DD.MM.YYYY HH:mm')}
                    </p>
                )}
                <div className="flex items-center space-x-1">
                    <p className="flex-shrink-0">
                        <strong>История изменений:</strong>
                    </p>
                    {isHistoryEmpty && (
                        <p className="">Изменений пока нет</p>
                    )}
                </div>
                {!isHistoryEmpty && (
                    <div className="flex-grow overflow-x-auto">
                        <div className="min-w-[600px]">
                            <ItemTable
                                headers={headers}
                                data={incident.history}
                                nonSortableColumns={['Пользователь']}
                                tableStyles='table-fixed w-full border-collapse'
                            />
                        </div>
                    </div>
                )}
                <div>
                    <h6 className="text-base mt-4">
                        Уведомление о инциденте успешно отправлено в
                        <span className="text-[#0088cc] font-bold ml-1 mr-1">
                            <FaTelegramPlane className="inline mr-0.5 text-blue-500" />
                            Telegram
                        </span>
                        пользователю <BlueLink to="#" text='@username' /> (Владислав Сучков)
                    </h6>
                </div>
            </div>
        </ModalTemplate>
    );
};

export default IncidentDetailsModal;

