import { FaRegTrashAlt } from "react-icons/fa";

const DeleteButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
        >
            <FaRegTrashAlt className="w-4 h-4 text-white mr-0.5 ml-0.5" />
            <span className="text-white">Удалить</span>
        </button>
    );
};

export default DeleteButton;
