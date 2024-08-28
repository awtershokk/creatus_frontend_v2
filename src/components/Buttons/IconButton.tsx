import { FaPlus } from "react-icons/fa6";

const IconButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="p-2 bg-transparent  text-gray-700 rounded-full mt-1 hover:bg-gray-100 transition "
        >
            <FaPlus className="w-4 h-4" />
        </button>
    );
};

export default IconButton;
