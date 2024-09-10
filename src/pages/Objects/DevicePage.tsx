import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { Device } from "../../models/Device.tsx";
import { fetchDevices } from "../../api/deviceApi.ts";
import DeleteDeviceModal from "../../components/Modal/Delete/DeleteDeviceModal.tsx";
import UnbindDeviceModal from "../../components/Modal/Bind/UnbindDeviceModal.tsx";
import BindDeviceModal from "../../components/Modal/Bind/BindDeviceModal.tsx";
import EditDeviceModal from "../../components/Modal/Edit/EditDeviceModal.tsx";

const DevicePage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUnbindModalOpen, setIsUnbindModalOpen] = useState(false);
    const [isBindModalOpen, setIsBindModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const devicesData = await fetchDevices(handleEditDeviceClick, handleDeleteDeviceClick, handleUnbindDeviceClick, handleBindDeviceClick);
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
        'Привязка к ТИ': 'connect',
        ' ': 'edit',
        '  ': 'delete'
    };

    const handleEditDeviceClick = (item: Device) => {
        setSelectedDevice(item);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedDevice(null);
    };
    const handleSaveDevice = (updatedDevice: Device) => {
        setDevices(prevDevices =>
            prevDevices.map(device => device.id === updatedDevice.id ? updatedDevice : device)
        );
        handleCloseEditModal();
    };


    const handleDeleteDeviceClick = (item: Device) => {
        setSelectedDevice(item);
        setIsDeleteModalOpen(true);
    };

    const handleUnbindDeviceClick = (deviceId: number, deviceLabel: string, measuringPointLabel: string) => {
        setSelectedDevice({ id: deviceId, label: deviceLabel, measuringPointLabel });
        setIsUnbindModalOpen(true);
    };

    const handleBindDeviceClick = (deviceId: number, deviceLabel: string) => {
        setSelectedDevice({ id: deviceId, label: deviceLabel, measuringPointLabel: 'Нет' });
        setIsBindModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedDevice(null);
    };

    const handleCloseUnbindModal = () => {
        setIsUnbindModalOpen(false);
        setSelectedDevice(null);
    };

    const handleCloseBindModal = () => {
        setIsBindModalOpen(false);
        setSelectedDevice(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedDevice) {
            setDevices(prevDevices => prevDevices.filter(device => device.id !== selectedDevice.id));
            handleCloseDeleteModal();
        }
    };

    const handleConfirmUnbind = async () => {
        if (selectedDevice) {
            console.log('Отвязываем устройство:', selectedDevice.label);
            const updatedDevicesData = await fetchDevices(handleEditDeviceClick, handleDeleteDeviceClick, handleUnbindDeviceClick, handleBindDeviceClick);
            setDevices(updatedDevicesData);
            handleCloseUnbindModal();
        }
    };

    const handleConfirmBind = async () => {
        if (selectedDevice) {
            console.log('Привязываем устройство:', selectedDevice.label);
            const updatedDevicesData = await fetchDevices(handleEditDeviceClick, handleDeleteDeviceClick, handleUnbindDeviceClick, handleBindDeviceClick);
            setDevices(updatedDevicesData);
            handleCloseBindModal();
        }
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

            {isUnbindModalOpen && selectedDevice && (
                <UnbindDeviceModal
                    deviceId={selectedDevice.id}
                    deviceLabel={selectedDevice.label}
                    measuringPointLabel={selectedDevice.measuringPointLabel || 'Нет'}
                    onClose={handleCloseUnbindModal}
                    onSuccess={handleConfirmUnbind}
                />
            )}
            {isEditModalOpen && selectedDevice && (
                <EditDeviceModal
                    device={selectedDevice}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveDevice}
                />
            )}
            {isBindModalOpen && selectedDevice && (
                <BindDeviceModal
                    deviceId={selectedDevice.id}
                    deviceLabel={selectedDevice.label}
                    measuringPointLabel={selectedDevice.measuringPointLabel || 'Нет'}
                    onClose={handleCloseBindModal}
                    onSuccess={handleConfirmBind}
                />
            )}
        </DefaultLayout>
    );
};

export default DevicePage;
