import { FaRegTimesCircle, FaRegCheckSquare } from "react-icons/fa";

const DefaultButton = ({ onClick, deviceId }) => {
    return (
        <button
            onClick={() => onClick(deviceId)}
            className="flex items-center p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
        >
            {deviceId ? (
                <>
                    <FaRegTimesCircle className="w-5 h-5 text-white mr-0.5 ml-0.5" />
                    <span className="text-white">Отвязать</span>
                </>
            ) : (
                <>
                <FaRegCheckSquare className="w-5 h-5 text-white mr-0.5 ml-0.5" />
                <span className="text-white">Выбрать</span>
                </>
            )}
        </button>
    );
};

export default DefaultButton;
