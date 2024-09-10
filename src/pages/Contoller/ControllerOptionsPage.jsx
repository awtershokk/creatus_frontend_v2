import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import ControllerOptionsTable from "../../components/Tables/Controller/ControllerOptionsTable.jsx";

const ControllerOptionsPage = () => {
    localStorage.setItem('options', JSON.stringify({ label: 'Параметры', icon: 'FaSlidersH' }));
    return (
        <DefaultLayout>
            <div className="">
            <ControllerOptionsTable/>
            </div>
        </DefaultLayout>
    );
};

export default ControllerOptionsPage;
