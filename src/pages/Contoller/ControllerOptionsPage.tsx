import DefaultLayout from "../../layouts/DefaultLayout.tsx";

const ControllerOptionsPage = () => {
    localStorage.setItem('options', JSON.stringify({ label: 'Параметры', icon: 'FaSlidersH' }));
    return (
        <DefaultLayout>
            <div className="">
            </div>
        </DefaultLayout>
    );
};

export default ControllerOptionsPage;
