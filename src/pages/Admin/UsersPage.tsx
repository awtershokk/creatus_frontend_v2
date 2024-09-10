import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import MiniAddButton from "../../components/Buttons/MiniAddButton.tsx";
import { User } from "../../models/User.tsx";
import { fetchUsers } from "../../api/userApi.ts";
import AddUserModal from "../../components/Modal/Add/AddUserModal.tsx";

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    localStorage.setItem('users', JSON.stringify({ label: 'Пользователи', icon: 'FaUser' }));

    useEffect(() => {
        const getData = async () => {
            try {
                const usersData = await fetchUsers(handleEditUserClick, handleDeleteUserClick);
                setUsers(usersData);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        getData();
    }, []);

    const headers = {
        'Логин': 'username',
        'Имя': 'fullName',
        'Роль': 'role',
        ' ': 'edit',
        '  ': 'delete'
    };

    const handleEditUserClick = (item: User) => {
        console.log('Edit user:', item);
    };

    const handleDeleteUserClick = (item: User) => {
        console.log('Delete user:', item);
    };

    const handleAddUserModalOpen = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserModalClose = () => {
        setIsAddUserModalOpen(false);
    };



    return (
        <DefaultLayout>
            <div className="">
                <div className="">
                    <div className="flex items-center">
                        <Label text="Пользователи"/>
                        <MiniAddButton onClick={handleAddUserModalOpen} />
                    </div>
                </div>
                <ItemTable
                    data={users}
                    headers={headers}
                />
            </div>

            {isAddUserModalOpen && (
                <AddUserModal
                    onClose={handleAddUserModalClose}
                    onSubmit={() => {
                    }}
                />
            )}
        </DefaultLayout>
    );
};

export default UsersPage;
