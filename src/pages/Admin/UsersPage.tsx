import React, { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import MiniAddButton from "../../components/Buttons/MiniAddButton.tsx";
import { User } from "../../models/User.tsx";
import { fetchUsers } from "../../api/requests/userApi.ts";
import AddUserModal from "../../components/Modal/Add/AddUserModal.tsx";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice.ts";

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const usersData = await fetchUsers(handleEditUserClick, handleDeleteUserClick);
            setUsers(usersData);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        dispatch(setBreadcrumb({
            key: 'users',
            label: `Пользователи`,
            icon: 'FaUser',
        }));

        fetchData();
    }, [dispatch]);


    const headers = {
        'Логин': 'username',
        'Имя': 'fullName',
        'Роль': 'role',
        ' ': 'edit',
        '  ': 'delete'
    };


    const handleDeleteUserClick = (item: User) => {
        console.log('Delete user:', item);
    };

    const handleEditUserClick = (item: User) => {
        console.log('Edit user:', item);
    };

    const handleAddUserModalOpen = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserModalClose = () => {
        setIsAddUserModalOpen(false);
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="">
                    <div className="">
                        <div className="flex items-center mb-2">
                            <Label text="Пользователи" />
                                <MiniAddButton onClick={handleAddUserModalOpen} />
                        </div>
                    </div>
                    <ItemTable
                        data={users}
                        headers={headers}
                        tableStyles='table-auto border-collapse'
                    />
                </div>
            )}
            {isAddUserModalOpen && (
                <AddUserModal
                    onClose={handleAddUserModalClose}
                    onSubmit={() => {
                        fetchData();
                        handleAddUserModalClose();
                    }}
                />
            )}
        </DefaultLayout>
    );
};

export default UsersPage;
