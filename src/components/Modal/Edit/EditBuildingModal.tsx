import React, { useState } from 'react';
import { Building } from '../../../models/Building';
import { updateBuilding } from '../../../api/buildingApi';
import ModalTemplate from '../ModalTemplate';

interface BuildingEditModalProps {
    building: Building;
    buildingId: number;
    onClose: () => void;
    onUpdate: (updatedBuilding: Building) => void;
}

const BuildingEditModal: React.FC<BuildingEditModalProps> = ({
                                                                 building,
                                                                 buildingId,
                                                                 onClose,
                                                                 onUpdate,
                                                             }) => {
    const [formData, setFormData] = useState<Building>(building);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updatedBuilding = await updateBuilding(buildingId, formData);
            onUpdate(updatedBuilding);
            onClose();
        } catch (error) {
            console.error('Failed to update building:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Редактирование здания"
            buttonLabel="Сохранить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
        >
            <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                placeholder="Наименование"
            />
        </ModalTemplate>
    );
};

export default BuildingEditModal;
