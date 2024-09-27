import DefaultLayout from "../../layouts/DefaultLayout";
import ControllerOptionsTable from "../../components/Tables/Controller/ControllerOptionsTable";
import React, { useEffect, useState } from "react";
import { fetchControllerLabel } from "../../api/requests/controllerApi";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice";
import Label from "../../components/Text/Label.tsx";



interface Params {
    controllerId: string;
}

const ControllerOptionsPage = () => {

    const [label, setLabel] = useState<string | null>(null);

    const { controllerId } = useParams<Params>();

    const dispatch = useDispatch();

    useEffect(() => {
        const getLabel = async () => {
            try {
                if (controllerId) {
                    const result = await fetchControllerLabel(controllerId);
                    setLabel(result);
                }
            } catch (error) {
                console.error("Ошибка получения лейбла:", error);
            }
        };

        getLabel();
    }, [controllerId]);

    useEffect(() => {
        if (label !== null) {
            dispatch(
                setBreadcrumb({
                    key: 'options',
                    label: `Параметры «${label}»`,
                    icon: 'FaSlidersH',
                })
            );
        }
    }, [label, dispatch]);

    return (
        <DefaultLayout>
            <div className="flex items-center mb-2">
                <Label text="Параметры контроллера"/>
            </div>
            <div>
                <ControllerOptionsTable/>
            </div>
        </DefaultLayout>
    );
};

export default ControllerOptionsPage;
