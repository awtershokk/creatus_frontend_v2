import React from 'react';

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
    return (
        <div className="flex justify-start items-start flex-nowrap overflow-x-auto">
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="inline-block text-left p-1.5 border-2 border-black bg-gray-400">
                    <div className="p-1.5 text-center">
                        <p className="text-base text-white">
                            <b>{section.label}</b>
                        </p>
                    </div>
                    {section.F.map((floor, floorIndex) => (
                        <div key={floorIndex} className="block my-2.5 p-1.5 border-2 border-black bg-gray-300">
                            <div className="p-1.5 text-center bg-gray-700 text-white">
                                <p>
                                    <b>{floor.name} Этаж</b>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {floor.C.flatMap((circuit) =>
                                    circuit.R.map((room, roomIndex) => {
                                        const { backgroundColor, measuringPointIndicators } = getRoomStyle(room.tempDev, room.measuringPoints);
                                        return (
                                            <div
                                                key={roomIndex}
                                                className={`inline-block w-44 h-22 m-1.5 p-1.5 text-left border-2 border-black box-border ${backgroundColor}`}
                                            >
                                                <p className={`text-sm h-5 ${room.id === selectedRoomId ? 'font-bold' : ''}`}>
                                                    <a href="#" className="no-underline text-black hover:text-blue-500" onClick={() => onRoomClick(room.id)}>
                                                        {room.label}
                                                    </a>
                                                </p>
                                                <p className="text-black">T: {room.temp !== null ? room.temp : 'N/A'}°C</p>
                                                <p className="text-black">H: {room.hum !== null ? room.hum : 'N/A'}%</p>
                                                <p className="text-black">ТИ: {measuringPointIndicators}</p>
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
