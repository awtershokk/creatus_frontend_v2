import { Link } from "react-router-dom";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

export interface User {
    id: number;
    username: string;
    fullName: string;
    role: {
        id: number,
        label: string
    };
    edit?: JSX.Element | null;
    delete?: JSX.Element | null;
}

export const transformUserData = (
    user: User,
    handleEditUserClick: (item: User) => void,
    handleDeleteUserClick: (item: User) => void
): {} => {
    return {
        username: user.username,
        fullName: user.fullName,
        role: user.role.label,
        edit: (
            <Link to="#" onClick={() => handleEditUserClick(user)} className="flex items-center justify-center">
                <FaEdit/>
            </Link>
        ),
        delete: (
            <Link to="#" onClick={() => handleDeleteUserClick(user)} className="flex items-center justify-center">
                <FaRegTrashAlt className='text-red-600' />
            </Link>
        ),
    };
};
