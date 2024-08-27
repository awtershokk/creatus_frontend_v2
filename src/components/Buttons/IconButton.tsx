import { FaPlus } from "react-icons/fa6";

const IconButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center justify-center p-2 bg-transparent  text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
            <FaPlus className="w-4 h-4" />
        </button>
    );
};

export default IconButton;
