import Link from "../../components/Text/Link";

const NoAccessPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                <h2 className="text-2xl font-bold  text-black">Нет доступа</h2>
                <p className="text-black">У вас нет прав на просмотр данной страницы.</p>
                <Link to="/dashboard/" text="Вернуться на главную." />
            </div>
        </div>
    );
};


export default NoAccessPage;
