import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import { fetchSection } from '../../api/requests/sectionApi.ts';
import BlueLink from "../../components/Text/BlueLink.tsx";
import { useParams } from "react-router-dom";
import { fetchRoomsBySection } from "../../api/requests/roomApi.ts";
import AddRoomInSectionModal from "../../components/Modal/Add/AddRoomInSectionModal.tsx";
import DeleteRoomModalManager from "../../components/Modal/Manager/DeleteRoomModalManager.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";
import {useDispatch} from "react-redux";

import EditSectionModal from "../../components/Modal/Edit/EditSectionModal.tsx";



const SectionPage = () => {
    const { sectionId } = useParams();
    const [section, setSection] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [sectionData, setSectionData] = useState<any>(null);
    const [rooms, setRooms] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);
    const [isAddRoomInSectionModal, setIsAddRoomInSectionModal] = useState(false);
    const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
    const [modalRoomId , setModalRoomId] =useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const fetchedSectionData = await fetchSection(sectionId);
            setSectionData(fetchedSectionData);
            setSection(fetchedSectionData);

            const labelItem = fetchedSectionData.find(item => item.title === 'Наименование');
            dispatch(setBreadcrumb({
                key: 'section',
                label: labelItem?.value,
                icon: 'FaBars',
                id: labelItem?.id
            }));


            const roomsData = await fetchRoomsBySection(sectionId);
            const formattedRooms = roomsData.map(room => ({
                id: room.id,
                title: room.label,
                properties: 'Свойства',
                delete: 'Удалить',
                to: `room/${room.id}`
            }));
            setRooms(formattedRooms);

            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [sectionId]);
    const handleUpdateSection = async () => {
        try {
            await getData();
            handleEditSectionModalClose();
        } catch (error) {
            console.error('Ошибка обновления здания:', error);
        }
    };
    const handleAddRoomInSectionModalOpen = () => {
        setIsAddRoomInSectionModal(true);
    };

    const handleAddRoomInSectionModalClose = () => {
        setIsAddRoomInSectionModal(false);
    };

    const handleDeleteRoomClick = (roomId: number) => {
        setModalRoomId(roomId);
    };

    const handleModalRoomClose = () => {
        setModalRoomId(null);
    };
    const handleEditButtonClick = (sectionItem: any) => {
        setSectionData(sectionItem);
        setIsEditSectionModalOpen(true);
    };

    const handleEditSectionModalClose = () => {
        setIsEditSectionModalOpen(false);
        setSectionData(null);
    };

    if (isLoading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-screen">
                    <p>Загрузка данных...</p>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация о секции"/>
                        <ObjectTable
                            title="Свойства секции"
                            data={section}
                            ButtonComponent={() => <EditButton onClick={() => handleEditButtonClick(section)}/>}
                        />
                    </div>
                    <div className="w-full flex flex-col items-end mt-8 mr-8">
                        <ChildElementsTable
                            infoData={rooms}
                            tableTitle="Помещения"
                            ButtonComponent={() => (<AddButton onClick={handleAddRoomInSectionModalOpen}/>)}
                            LinkComponent={BlueLink}
                            onDelete={handleDeleteRoomClick}
                        />
                    </div>

                    {isAddRoomInSectionModal && (
                        <AddRoomInSectionModal
                            sectionId={sectionId}
                            onClose={handleAddRoomInSectionModalClose}
                            onSubmit={() => {
                                getData();
                                handleAddRoomInSectionModalClose();
                            }}
                        />
                    )}
                    {modalRoomId !== null && (
                        <DeleteRoomModalManager
                            roomId={modalRoomId}
                            onClose={() => {
                                getData()
                                handleModalRoomClose();
                            }}
                        />
                    )}
                    {isEditSectionModalOpen && sectionData && (
                        <EditSectionModal
                            sectionId={sectionId}
                            section={section}
                            onClose={handleEditSectionModalClose}
                            onUpdate={handleUpdateSection}
                        />
                    )}

            </div>
                )}
        </DefaultLayout>
    );
};

export default SectionPage;
