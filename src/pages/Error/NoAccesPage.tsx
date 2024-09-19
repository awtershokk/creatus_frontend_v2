import BlueLink from "../../components/Text/BlueLink.tsx";

const NoAccessPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                <h2 className="text-2xl font-bold  text-black">Нет доступа</h2>
                <p className="text-black">У вас нет прав на просмотр данной страницы.</p>
                <BlueLink to="/user" text="Вернуться на главную." />
            </div>
        </div>
    );
};

export default NoAccessPage;
