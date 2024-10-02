import React, { useState, useEffect } from 'react';
import ModalTemplate from '../../ModalTemplate.tsx';
import { deleteMeasuringPoint, fetchMeasuringPoint } from "../../../../api/requests/measuringPointApi.ts";

interface DeleteMeasuringPointModalProps {
    measuringPointID: number;
    onClose: () => void;
}

const DeleteMeasuringPointModal: React.FC<DeleteMeasuringPointModalProps> = ({
                                                                                 measuringPointID,
                                                                                 onClose,
                                                                             }) => {
    const [loading, setLoading] = useState(false);
    const [measuringPointName, setMeasuringPointName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const measuringPoint = await fetchMeasuringPoint(measuringPointID);
                const nameObject = measuringPoint.find(item => item.title === 'Наименование');
                if (nameObject) {
                    setMeasuringPointName(nameObject.value);
                }
            } catch (error) {
                console.error('Ошибка при получении данных точки измерения:', error);
            }
        };

        fetchData();
    }, [measuringPointID]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteMeasuringPoint(measuringPointID);
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении точки измерения:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Удаление точки измерения"
            buttonLabel="Удалить (Удерживать)"
            onClose={onClose}
            onSubmit={handleDelete}
            loading={loading}
            deleteMode={true}
            buttonStyles="px-4 py-2 border border-red-500 bg-red-500 text-white rounded-md transition relative overflow-hidden"
        >
            <p className="text-black">
                Вы уверены, что хотите удалить точку измерения <b>{measuringPointName}</b>?
            </p>
        </ModalTemplate>
    );
};

export default DeleteMeasuringPointModal;
