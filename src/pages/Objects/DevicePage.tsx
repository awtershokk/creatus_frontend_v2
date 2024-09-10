import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import { Device } from "../../models/Device.tsx";
import { fetchDevices } from "../../api/deviceApi.ts";
import DeleteDeviceModal from "../../components/Modal/Delete/DeleteDeviceModal.tsx";

const DevicePage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        console.log('Edit device:', item);
    };

    const handleDeleteDeviceClick = (item: Device) => {
        setSelectedDevice(item);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedDevice(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedDevice) {
            setDevices(prevDevices => prevDevices.filter(device => device.id !== selectedDevice.id));
            handleCloseDeleteModal();
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
        </DefaultLayout>
    );
};

export default DevicePage;
