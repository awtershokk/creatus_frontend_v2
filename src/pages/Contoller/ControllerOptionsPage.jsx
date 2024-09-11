import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import ControllerOptionsTable from "../../components/Tables/Controller/ControllerOptionsTable.jsx";
import {useEffect, useState} from "react";
import {fetchControllerLabel} from "../../api/vremeniy_kostil/controllerApi";
import {useParams} from "react-router-dom";

const ControllerOptionsPage = () => {
    const [label, setLabel] = useState()
    const {controllerId} = useParams()

    useEffect(() => {
        const getLabel = async () => {
            try {
                const result = await fetchControllerLabel(controllerId);
                setLabel(result);
            } catch (error) {
                console.error("Ошибка получения лейбла:", error);
            }
        };

        getLabel();

    }, [controllerId]);

    localStorage.setItem('options', JSON.stringify({ label: `Параметры «${label}»`, icon: 'FaSlidersH' }));
    return (
        <DefaultLayout>
            <div className="">
            <ControllerOptionsTable/>
            </div>
        </DefaultLayout>
    );
};

export default ControllerOptionsPage;
