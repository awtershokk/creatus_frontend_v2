import BlueLink from "../../components/Text/BlueLink.tsx";

const NotFoundPage = () => {
    return (
        <div>
            <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                    <h2 className="text-2xl font-bold text-black">404</h2>
                    <p className="text-black text-nowrap">Такой страницы не существует.</p>
                    <BlueLink to="/user" text="Вернуться на главную."/>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
