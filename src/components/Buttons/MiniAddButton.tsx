import { FaPlus } from "react-icons/fa6";

const MiniAddButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className=" bg-transparent text-gray-700 rounded-full  hover:bg-gray-100 transition  mt-0.5 p-2 "
        >
            <FaPlus className="w-5 h-5 " />
        </button>
    );
};

export default MiniAddButton;
