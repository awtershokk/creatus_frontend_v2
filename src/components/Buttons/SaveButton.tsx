import { FaRegSave } from "react-icons/fa";

const SaveButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
        >
            <FaRegSave className="w-5 h-5 text-white mr-0.5 ml-0.5"/>
            <span className="text-white">Сохранить</span>
        </button>
    );
};

export default SaveButton;
