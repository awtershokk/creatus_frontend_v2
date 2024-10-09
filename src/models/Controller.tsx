import BlueLink from "../components/Text/BlueLink.tsx";

export interface Controller {
    label: string;
    thermalCircuit: {
        id: number;
        label: string;
    } | null;
    eclType: {
        label: string;
    };
    id: number;
    status: string;
    url: string;
}


export const transformControllerData = (
    controller: Controller
): {} => {
    return {
        label: controller.label,
        thermalCircuit: controller.thermalCircuit === null ? 'Нет' : (
            <BlueLink to={`/building/thermalCircuit/${controller.thermalCircuit.id}`} text={controller.thermalCircuit.label}/>
        ),
        ecl_type: controller.eclType.label,
        settings: (
            <BlueLink to={`/building/controllers/options/${controller.id}`} text={'Параметры'}/>
        ),
        status: controller.status,
        url: controller.url,

    };
};
