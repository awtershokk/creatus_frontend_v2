import { FaTelegramPlane } from "react-icons/fa";

const TelegramButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition ml-1 text-s"
        >
            <FaTelegramPlane className="text-white mr-0.5 ml-0.5"/>
            <span className="text-white">Проверить привязку Telegram</span>
        </button>
    );
};

export default TelegramButton;
