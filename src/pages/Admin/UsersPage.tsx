import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import MiniAddButton from "../../components/Buttons/MiniAddButton.tsx";
import {User} from "../../models/User.tsx";
import {fetchUsers} from "../../api/userApi.ts";

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
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

    return (
        <DefaultLayout>
            <div className="">
                <div className="">
                    <div className="flex items-center">
                        <Label text="Пользователи"/>
                        <MiniAddButton/>
                    </div>
                </div>
                <ItemTable
                    data={users}
                    headers={headers}
                    sorting={false}
                />
            </div>
        </DefaultLayout>
    );
};

export default UsersPage;
