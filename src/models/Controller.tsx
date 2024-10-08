import BlueLink from "../components/Text/BlueLink.tsx";

export interface Controller {
    label: string;
    url: string;
    thermalCircuit: {
        id: number;
        label: string;
    } | null;
    eclType: {
        label: string;
    };
    id: number;
    status: boolean;
}


export const transformControllerData = (
    controller: Controller

): {} => {
    const temporaryStatus = true; //Всё это временно
    return {

        label: controller.label,
        url: controller.url,

        thermalCircuit: controller.thermalCircuit === null ? 'Нет' : (
            <BlueLink to={`/building/thermalCircuit/${controller.thermalCircuit.id}`} text={controller.thermalCircuit.label}/>
        ),
        ecl_type: controller.eclType.label,
        settings: (
            <BlueLink to={`/building/controllers/options/${controller.id}`} text={'Параметры'}/>
        ),
       // schedule: (
         //   <BlueLink to={`/building/controllers/schedule/${controller.id}`} text={'Расписание'}/>
        //),
        status: temporaryStatus ? (
            <span className="text-green-500">Онлайн</span>
        ) : (
            <span className="text-red-500">Оффлайн</span>
        ),

    };
};
