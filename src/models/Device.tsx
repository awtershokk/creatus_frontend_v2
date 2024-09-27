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
    handleDeleteDeviceClick: (item: Device) => void,
    handleUnbindDeviceClick: (deviceId: number, deviceLabel: string, measuringPointLabel: string) => void,
    handleBindDeviceClick: (deviceId: number, deviceLabel: string) => void
): {} => {
    return {
        label: device.label,
        active: device.active ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span>,
        model: device.model === null ? 'Не указана' : device.model,
        sernom: device.topic,
        room: device.roomLabel === null ? 'Нет' : (
            <BlueLink to={`/building/section/${device.sectionId}/room/${device.roomId}`} text={device.roomLabel} />
        ),
        measuringPoint: device.measuringPointLabel === null ? 'Нет' : (
            <BlueLink to={`/building/section/${device.sectionId}/room/${device.roomId}/measuringPoint/${device.measuringPointId}`} text={device.measuringPointLabel} />
        ),
        battery: device.battery === null ? 'Неизвестно' : (`${device.battery}%`),
        linkquality: device.linkquality === null ? 'Неизвестно' : (`${device.linkquality}%`),
        connect: device.measuringPointLabel === null ? (
            <BlueLink to="#"
                      text="Привязать"
                      onClick={() => handleBindDeviceClick(device.id, device.label)}
            />
        ) : (
            <>
                <BlueLink to="#"
                          text="Отвязать"
                          onClick={() => handleUnbindDeviceClick(device.id, device.label, device.measuringPointLabel || 'Нет')}
                />
            </>
        ),
        edit: (
            <Link to="#" onClick={() => handleEditDeviceClick(device)} className="flex items-center justify-center">
                <FaEdit />
            </Link>
        ),
        delete: (
            <Link to="#" onClick={() => handleDeleteDeviceClick(device)} className="flex items-center justify-center">
                <FaRegTrashAlt className='text-red-600' />
            </Link>
        ),
    };
};


export const transformDeviceDataForSettingMode = (device: Device): {} => {
    return {
        label: device.label,
        model: device.model === null ? 'Не указана' : device.model,
        sernom: device.topic,
    };
};

export const transformDeviceDataForMP = (device: Device): {} => {
    return [
        { id: 1, title: 'Наименование', value: (
                <BlueLink to={'/building/devices'} text={device.label}/>
            )},
        { id: 3, title: 'Статус', value: device.active ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span> },

    ];
};
