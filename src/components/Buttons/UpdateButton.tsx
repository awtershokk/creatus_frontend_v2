import { FaDownload } from 'react-icons/fa';

const UpdateButton = ({ onClick, label }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-green-700 mt-3 rounded-full hover:bg-green-600 transition"
        >
            <FaDownload className="w-4 h-4 text-white mr-1 ml-0.5" />
            <span className="text-white">{label}</span>
        </button>
    );
};

export default UpdateButton;
