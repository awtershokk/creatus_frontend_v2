import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { Device } from "../../models/Device.tsx";
import { fetchDevices } from "../../api/deviceApi.ts";
import DeleteDeviceModal from "../../components/Modal/Delete/DeleteDeviceModal.tsx";
import EditDeviceModal from "../../components/Modal/Edit/EditDeviceModal.tsx"; // Импортируем компонент модального окна для редактирования

const DevicePage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Состояние для модального окна редактирования
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    localStorage.setItem('devices', JSON.stringify({ label: 'Датчики', icon: 'FaBug' }));

    useEffect(() => {
        const getData = async () => {
            try {
                const devicesData = await fetchDevices(handleEditDeviceClick, handleDeleteDeviceClick);
                setDevices(devicesData);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    const headers = {
        'Наименование': 'label',
        'Статус': 'active',
        'Модель': 'model',
        'Сер. номер': 'sernom',
        'Помещение': 'room',
        'ТИ': 'measuringPoint',
        'Заряд': 'battery',
        'Качество сигнала': 'linkquality',
        ' ': 'edit',
        '  ': 'delete'
    };

    const handleEditDeviceClick = (item: Device) => {
        setSelectedDevice(item);
        setIsEditModalOpen(true);
    };

    const handleDeleteDeviceClick = (item: Device) => {
        setSelectedDevice(item);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedDevice(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDevice(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedDevice) {
            setDevices(prevDevices => prevDevices.filter(device => device.id !== selectedDevice.id));
            handleCloseDeleteModal();
        }
    };

    const handleSaveDevice = (updatedDevice: Device) => {
        setDevices(prevDevices =>
            prevDevices.map(device => device.id === updatedDevice.id ? updatedDevice : device)
        );
        handleCloseEditModal();
    };

    return (
        <DefaultLayout>
            <div className="">
                <div className="">
                    <div className="flex items-center">
                        <Label text="Датчики"/>
                    </div>
                </div>
                <ItemTable
                    data={devices}
                    headers={headers}
                    onEditClick={handleEditDeviceClick}
                    onDeleteClick={handleDeleteDeviceClick}
                />
            </div>

            {isDeleteModalOpen && selectedDevice && (
                <DeleteDeviceModal
                    label={selectedDevice.label}
                    onClose={handleCloseDeleteModal}
                    onSubmit={handleConfirmDelete}
                />
            )}

            {isEditModalOpen && selectedDevice && (
                <EditDeviceModal
                    device={selectedDevice}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveDevice}
                />
            )}
        </DefaultLayout>
    );
};

export default DevicePage;
