import { FaEdit } from 'react-icons/fa';

const EditButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
        >
            <FaEdit className="w-5 h-5 text-white mr-0.5 ml-0.5" />
            <span className="text-white">Редактировать</span>
        </button>
    );
};

export default EditButton;
