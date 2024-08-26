import Header from "../components/Menu/Header.tsx";
import LeftMenu from "../components/Menu/LeftMenu.tsx";
import Breadcrumbs from "../components/Menu/Breadcrumbs.tsx";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-grow">
                <LeftMenu className="w-64" />
                <div className="flex flex-col flex-grow">
                    <Breadcrumbs className="w-full" />
                    <div className="flex-grow p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
