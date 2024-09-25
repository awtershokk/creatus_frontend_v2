import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

interface MeasuringPoint {
    deviceActive: boolean | null;
    measuringPointLabel: string;
}

interface Room {
    id: string;
    label: string;
    tempDev: number | null;
    temp: number | null;
    hum: number | null;
    measuringPoints: MeasuringPoint[];
}

interface Circuit {
    R: Room[];
}

interface Floor {
    name: string;
    C: Circuit[];
}

interface Section {
    label: string;
    F: Floor[];
}

interface CircuitDisplayProps {
    sections: Section[];
    selectedRoomId: string | null;
    onRoomClick: (roomId: string) => void;
    getRoomStyle: (tempDev: number | null, measuringPoints: MeasuringPoint[]) => {
        backgroundColor: string;
        measuringPointIndicators: React.ReactNode;
    };
}

const CircuitDisplay: React.FC<CircuitDisplayProps> = ({ sections, selectedRoomId, onRoomClick, getRoomStyle }) => {

    const getStatusColor = (status: boolean | null) => {
        const statusColors = {
            online: 'green',
            offline: 'red',
            unknown: 'grey'
        };

        switch (status) {
            case true:
                return statusColors.online;
            case false:
                return statusColors.offline;
            default:
                return statusColors.unknown;
        }
    };

    const renderMeasuringPointIndicators = (measuringPoints: MeasuringPoint[]) => (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            {measuringPoints.map((point, index) => {
                const color = getStatusColor(point.deviceActive);
                return (
                    <OverlayTrigger
                        key={index}
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-${index}`} className="bg-black py-1 px-1 rounded">
                                {point.measuringPointLabel}
                            </Tooltip>
                        }
                        delay={{ show: 250, hide: 400 }}
                    >
                        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginRight: '2px', marginTop: '2px' }}>
                            <span style={{
                                backgroundColor: color,
                                borderRadius: '50%',
                                display: 'inline-block',
                                width: '10px',
                                height: '10px'
                            }}></span>
                        </div>
                    </OverlayTrigger>
                );
            })}
        </div>
    );

    return (
        <div className="flex justify-start items-start flex-nowrap overflow-x-auto space-x-4">
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="inline-block text-left p-1.5 border-2 border-black bg-gray-400">
                    <div className="p-1 text-center">
                        <p className="text-base  text-white">
                            <b>{section.label}</b>
                        </p>
                    </div>
                    {section.F.map((floor, floorIndex) => (
                        <div key={floorIndex} className="block my-1.5 p-1.5 border-2 border-black bg-gray-300">
                            <div className="p-1.5 text-center bg-gray-700 text-white">
                                <p>
                                    <b>{floor.name} Этаж</b>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {floor.C.flatMap((circuit) =>
                                    circuit.R.map((room, roomIndex) => {
                                        const {
                                            backgroundColor,

                                        } = getRoomStyle(room.tempDev, room.measuringPoints);

                                        return (
                                            <div
                                                key={roomIndex}
                                                className={`inline-block w-44 h-22 m-1.5 p-1.5 text-left border-2 border-black box-border ${backgroundColor}`}
                                            >
                                                <p className={`text-xs h-4 ${room.id === selectedRoomId ? 'font-bold' : ''}`}>
                                                    <a href="#" className="no-underline text-black hover:text-blue-500"
                                                       onClick={() => onRoomClick(room.id)}>
                                                        {room.label}
                                                    </a>
                                                </p>
                                                <div className="mt-1"></div>
                                                <p className="text-black text-xs">T: {room.temp !== null ? room.temp : 'N/A'}°C</p>
                                                <p className="text-black text-xs">H: {room.hum !== null ? room.hum : 'N/A'}%</p>
                                                <p className="text-black text-xs">
                                                    ТИ: {renderMeasuringPointIndicators(room.measuringPoints)}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CircuitDisplay;
