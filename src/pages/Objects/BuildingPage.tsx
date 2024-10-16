import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import EditButton from "../../components/Buttons/EditButton.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import ObjectTable from "../../components/Tables/ObjectTable.tsx";
import ChildElementsTable from "../../components/Tables/ChildElementsTable.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';

import { fetchBuilding, fetchResponsiblePersons } from '../../api/requests/buildingApi.ts';
import { fetchSections } from '../../api/requests/sectionApi.ts';
import { fetchThermalCircuits } from "../../api/requests/thermalCircuitApi.ts";

import { ResponsiblePerson } from '../../models/ResponsiblePerson.tsx';
import BlueLink from "../../components/Text/BlueLink.tsx";
import MiniAddButton from "../../components/Buttons/MiniAddButton.tsx";
import BuildingEditModal from '../../components/Modal/Edit/EditBuildingModal';
import AddResponsiblePersonModal from "../../components/Modal/Add/AddResponsiblePersonModal.tsx";
import AddSectionModal from "../../components/Modal/Add/AddSectionModal";
import DeleteThermalCircuitModalManager from "../../components/Modal/Manager/DeleteThermalCircuitModalManager.tsx";
import DeleteSectionModalManager from "../../components/Modal/Manager/DeleteSectionModalManager.tsx";
import AddThermalCircuitModal from "../../components/Modal/Add/AddThermalCircuitModal.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import { Building, transformBuildingData } from "../../models/Building.ts";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice.ts";
import { useDispatch } from "react-redux";

import { formatPhoneNumber } from '../../utils/formatPhoneNumber.ts';
import TelegramButton from "../../components/Buttons/TelegramButton.tsx";

import {toast, ToastContainer} from "react-toastify";


const BuildingPage = () => {
    const [building, setBuilding] = useState<Array<{ id: number, title: string, value: string | number }>>([]);
    const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]);
    const [sections, setSections] = useState<Array<{ id: number, title: string, value: string, value2: string }>>([]);
    const [thermalCircuits, setThermalCircuits] = useState<Array<{
        id: number,
        title: string,
        value: string,
        value2: string
    }>>([]);

    const [isEditBuildingModalOpen, setIsEditBuildingModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
    const [isAddResponsiblePersonModalOpen, setIsAddResponsiblePersonModalOpen] = useState(false);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isAddThermalCircuitModalOpen, setIsAddThermalCircuitModalOpen] = useState(false);

    const [modalThermalCircuitId, setModalThermalCircuitId] = useState<number | null>(null);
    const [modalSectionId, setModalSectionId] = useState<number | null>(null);
    const buildingId = 1;
    const [buildingData, setBuildingData] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const getData = async () => {
        try {
            const responsebuildingData = await fetchBuilding(buildingId);
            setBuildingData(responsebuildingData);
            const buildingData = transformBuildingData(responsebuildingData)

            setBuilding(buildingData);
            const labelItem = buildingData.find(item => item.title === 'Наименование');
            dispatch(setBreadcrumb({
                key: 'building',
                label: labelItem?.value,
                icon: 'FaRegBuilding',
                id: buildingId
            }));

            const sectionsData = await fetchSections(buildingId);
            const formattedSections = sectionsData.map(section => ({
                id: section.id,
                title: section.label,
                properties: 'Свойства',
                delete: 'Удалить',
                to: `section/${section.id}`
            }));
            setSections(formattedSections);

            const thermalcircuitsData = await fetchThermalCircuits(buildingId);
            const formattedThermalCircuits = thermalcircuitsData.map(thermalCircuit => ({
                id: thermalCircuit.id,
                title: thermalCircuit.label,
                properties: 'Свойства',
                delete: 'Удалить',
                to: `thermalCircuit/${thermalCircuit.id}`
            }));
            setThermalCircuits(formattedThermalCircuits);

            setIsLoading(false);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
            setIsLoading(false);
        }
    };

    const getResponsiblePersons = async () => {
        try {
            const responsiblePersonsData = await fetchResponsiblePersons(buildingId);
            setResponsiblePersons(responsiblePersonsData);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    };

    useEffect(() => {
        getData();
    }, [buildingId]);

    useEffect(() => {
        getResponsiblePersons();
    }, [buildingId]);

    const headers = {
        'Должность': 'position',
        'Тип': 'type',
        'ФИО': 'fio',
        'Телефон': 'phone',
        'E-mail': 'email',
        'Telegram': 'tg_username'
    };

    const handleEditButtonClick = (buildingItem: any) => {
        setSelectedBuilding(buildingItem);
        setIsEditBuildingModalOpen(true);
    };

    const handleEditBuildingModalClose = () => {
        setIsEditBuildingModalOpen(false);
        setSelectedBuilding(null);
    };

    const handleUpdateBuilding = async () => {
        try {
            await getData();
            handleEditBuildingModalClose();
            toast.success('Информация о здании успешно обновлена.');
        } catch (error) {
            toast.error('Ошибка обновления информации о здании');
        }
    };

    const handleAddResponsiblePersonClick = () => {
        setIsAddResponsiblePersonModalOpen(true);
    };

    const handleAddResponsiblePersonModalClose = () => {
        setIsAddResponsiblePersonModalOpen(false);
    };

    const handleAddSectionClick = () => {
        setIsAddSectionModalOpen(true);
    };

    const handleAddSectionModalClose = () => {
        setIsAddSectionModalOpen(false);
    };

    const handleAddThermalCircuitClick = () => {
        setIsAddThermalCircuitModalOpen(true);
    };

    const handleAddThermalCircuitModalClose = () => {
        setIsAddThermalCircuitModalOpen(false);
    };

    const handleDeleteSectionClick = (sectionId: number) => {
        setModalSectionId(sectionId);
    };

    const handleDeleteThermalCircuitClick = (thermalCircuitId: number) => {
        setModalThermalCircuitId(thermalCircuitId);
    };

    const handleModalClose = () => {
        setModalThermalCircuitId(null);
        setModalSectionId(null);
    };

    const handleAddSection = async (newSection: { label: string; area: number; volume: number }) => {
        try {
            await getData();
            toast.success('Секция успешно добавлена.');
        } catch (error) {
            toast.error('Ошибка добавления секции');
        }
    };

    const handleAddThermalCircuit = async (newThermalCircuit: {
        label: string,
        heatingLoad: number,
        wiringDiagram: string,
        square: number,
        volume: number,
        connectionDiagram: string
    }) => {
        try {
            await getData();
            toast.success('Тепловой контур успешно добавлен.');
        } catch (error) {
            toast.error('Ошибка добавления теплового контура');
        }
    };

    useEffect(() => {
    }, [building]);

    const formattedResponsiblePersons = responsiblePersons.map(person => ({
        ...person,
        phone: formatPhoneNumber(person.phone)
    }));

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="flex justify-between">
                        <div className="w-1/2">
                            <Label text="Информация о здании"/>
                            <ObjectTable
                                title="Свойства здания"
                                data={building}
                                ButtonComponent={() => <EditButton onClick={() => handleEditButtonClick(building)}/>}
                            />
                        </div>
                        <div className="w-full flex flex-col items-end mt-8 mr-8">
                            <ChildElementsTable
                                infoData={sections}
                                tableTitle="Секции"
                                ButtonComponent={() => <AddButton onClick={handleAddSectionClick}/>}
                                LinkComponent={BlueLink}
                                onDelete={handleDeleteSectionClick}
                            />
                            <div className='mt-3'>
                                <ChildElementsTable
                                    infoData={thermalCircuits}
                                    tableTitle="Тепловые контуры"
                                    ButtonComponent={() => <AddButton onClick={handleAddThermalCircuitClick}/>}
                                    LinkComponent={BlueLink}
                                    onDelete={handleDeleteThermalCircuitClick}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 mb-4">
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center ">
                                <Label text="Ответственные лица"/>
                                <MiniAddButton onClick={handleAddResponsiblePersonClick}/>
                                {/*<TelegramButton onClick={getResponsiblePersons}/>*/}
                            </div>
                        </div>
                        <ItemTable
                            data={formattedResponsiblePersons}
                            headers={headers}
                            tableStyles='table-auto border-collapse mt-2'
                        />
                    </div>

                    {isEditBuildingModalOpen && selectedBuilding && (
                        <BuildingEditModal
                            building={buildingData}
                            buildingId={buildingId}
                            onClose={handleEditBuildingModalClose}
                            onUpdate={handleUpdateBuilding}
                            headerTitle="Редактировать здание"
                            buttonLabel="Сохранить"
                        />
                    )}

                    {isAddResponsiblePersonModalOpen && (
                        <AddResponsiblePersonModal
                            buildingId={buildingId}
                            onClose={handleAddResponsiblePersonModalClose}
                            onSubmit={() => {
                                getResponsiblePersons();
                            }}
                        />
                    )}

                    {isAddSectionModalOpen && (
                        <AddSectionModal
                            onClose={handleAddSectionModalClose}
                            onSubmit={handleAddSection}
                        />
                    )}

                    {isAddThermalCircuitModalOpen && (
                        <AddThermalCircuitModal
                            onClose={handleAddThermalCircuitModalClose}
                            onSubmit={handleAddThermalCircuit}
                        />
                    )}

                    {modalThermalCircuitId !== null && (
                        <DeleteThermalCircuitModalManager
                            thermalCircuitId={modalThermalCircuitId}
                            onClose={() => {
                                getData();
                                handleModalClose();
                            }}
                        />
                    )}

                    {modalSectionId !== null && (
                        <DeleteSectionModalManager
                            SectionId={modalSectionId}
                            onClose={() => {
                                getData();
                                handleModalClose();
                            }}
                        />
                    )}
                </div>
            )}
        </DefaultLayout>
    );
}

export default BuildingPage;
