import BlueLink from "../components/Text/BlueLink.tsx";

export interface Controller {
    label: string;
    url: string;
    port: number;
    thermalCircuit: {
        id: number;
        label: string;
    } | null;
    eclType: {
        label: string;
    };
    id: number;
}

export const transformControllerData = (
    controller: Controller
): {} => {
    return {
        label: controller.label,
        url: controller.url,
        port: controller.port,
        thermalCircuit: controller.thermalCircuit === null ? 'Нет' : (
            <BlueLink to={`/building/thermalCircuit/${controller.thermalCircuit.id}`} text={controller.thermalCircuit.label}/>
        ),
        ecl_type: controller.eclType.label,
        settings: (
            <BlueLink to={`/building/controllers/${controller.id}/options`} text={'Параметры'}/>
        ),
        schedule: (
            <BlueLink to={`/building/controllers/${controller.id}/schedule`} text={'Расписание'}/>
        ),

    };
};
