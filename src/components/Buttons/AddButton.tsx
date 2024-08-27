import { FaPlus } from 'react-icons/fa';

const AddButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
        >
            <FaPlus className="w-4 h-4 text-white mr-0.5 ml-0.5" />
            <span className="text-white">Добавить</span>
        </button>
    );
};

export default AddButton;
