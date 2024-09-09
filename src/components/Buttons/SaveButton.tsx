

const SaveButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center p-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition"
        >

            <span className="text-white">Сохранить</span>
        </button>
    );
};

export default SaveButton;
