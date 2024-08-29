import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import BlueLink from "../components/Text/BlueLink.tsx";
import {Link} from "react-router-dom";

export interface Device {
    id: number;
    label: string;
    active: boolean;
    model: string | null;
    topic: string;
    roomId: number | null;
    roomLabel: string | null;
    sectionId: number | null;
    measuringPointId: number | null;
    measuringPointLabel: string | null;
    battery: number | null;
    linkquality: number;
    edit?: JSX.Element | null;
    delete?: JSX.Element | null;
}

export const transformDeviceData = (
    device: Device,
    handleEditDeviceClick: (item: Device) => void,
    handleDeleteDeviceClick: (item: Device) => void
): {} => {
    return {
        label: device.label,
        active: device.active ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span>,
        model: device.model === null ? 'Не указана' : device.model,
        sernom: device.topic,
        room: device.roomLabel === null ? 'Нет' : (
            <BlueLink to={`/building/sections/${device.sectionId}/rooms/${device.roomId}`} text={device.roomLabel}/>
        ),
        measuringPoint: device.measuringPointLabel === null ? 'Нет' : (
            <BlueLink to={`/building/sections/${device.sectionId}/rooms/${device.roomId}/measure/${device.measuringPointId}`} text={device.measuringPointLabel}/>
        ),
        battery: device.battery === null ? 'Неизвестно' : (`${device.battery}%`),
        linkquality: device.linkquality === null ? 'Неизвестно' : (`${device.linkquality}%`),
        edit: (
            <Link to="#" onClick={() => handleEditDeviceClick(device)} className="flex items-center justify-center">
                <FaEdit/>
            </Link>
        ),
        delete: (
            <Link to="#" onClick={() => handleDeleteDeviceClick(device)} className="flex items-center justify-center">
                <FaRegTrashAlt className='text-red-600' />
            </Link>
        ),
    };
};
