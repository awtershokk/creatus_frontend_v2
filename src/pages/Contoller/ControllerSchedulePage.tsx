import {useEffect, useState} from "react";
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import SaveButton from "../../components/Buttons/SaveButton.tsx";
import {fetchControllerLabel} from "../../api/requests/controllerApi.ts";
import {useParams} from "react-router-dom";
import Label from "../../components/Text/Label.tsx";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "../../store/slices/breadcrumbSlice.ts";

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

type Period = {
    start: Date;
    end: Date;
};

type Schedule = {
    [day: string]: Period[];
};

const initialSchedule: { hotWater: Schedule; heatingSystem: Schedule } = {
    hotWater: {
        Понедельник: [
            { start: new Date(2024, 8, 9, 16, 0), end: new Date(2024, 8, 9, 18, 0) },
            { start: new Date(2024, 8, 9, 19, 0), end: new Date(2024, 8, 9, 22, 0) },
        ],
        Вторник: [
            { start: new Date(2024, 8, 10, 8, 0), end: new Date(2024, 8, 10, 10, 0) },
            { start: new Date(2024, 8, 10, 18, 0), end: new Date(2024, 8, 10, 20, 0) },
        ],
        Среда: [
            { start: new Date(2024, 8, 11, 10, 0), end: new Date(2024, 8, 11, 12, 0) },
            { start: new Date(2024, 8, 11, 16, 0), end: new Date(2024, 8, 11, 20, 0) },
        ],
        Четверг: [
            { start: new Date(2024, 8, 12, 9, 0), end: new Date(2024, 8, 12, 11, 0) },
            { start: new Date(2024, 8, 12, 17, 0), end: new Date(2024, 8, 12, 19, 0) },
        ],
        Пятница: [
            { start: new Date(2024, 8, 13, 8, 0), end: new Date(2024, 8, 13, 10, 0) },
            { start: new Date(2024, 8, 13, 18, 0), end: new Date(2024, 8, 13, 21, 0) },
        ],
        Суббота: [
            { start: new Date(2024, 8, 14, 10, 0), end: new Date(2024, 8, 14, 12, 0) },
            { start: new Date(2024, 8, 14, 15, 0), end: new Date(2024, 8, 14, 18, 0) },
        ],
        Воскресенье: [
            { start: new Date(2024, 8, 15, 9, 0), end: new Date(2024, 8, 15, 12, 0) },
            { start: new Date(2024, 8, 15, 16, 0), end: new Date(2024, 8, 15, 19, 0) },
        ],
    },
    heatingSystem: {
        Понедельник: [
            { start: new Date(2024, 8, 9, 6, 0), end: new Date(2024, 8, 9, 9, 0) },
            { start: new Date(2024, 8, 9, 17, 0), end: new Date(2024, 8, 9, 21, 0) },
        ],
        Вторник: [
            { start: new Date(2024, 8, 10, 7, 0), end: new Date(2024, 8, 10, 10, 0) },
            { start: new Date(2024, 8, 10, 16, 0), end: new Date(2024, 8, 10, 19, 0) },
        ],
        Среда: [
            { start: new Date(2024, 8, 11, 6, 0), end: new Date(2024, 8, 11, 9, 0) },
            { start: new Date(2024, 8, 11, 15, 0), end: new Date(2024, 8, 11, 19, 0) },
        ],
        Четверг: [
            { start: new Date(2024, 8, 12, 7, 0), end: new Date(2024, 8, 12, 10, 0) },
            { start: new Date(2024, 8, 12, 16, 0), end: new Date(2024, 8, 12, 18, 0) },
        ],
        Пятница: [
            { start: new Date(2024, 8, 13, 6, 0), end: new Date(2024, 8, 13, 9, 0) },
            { start: new Date(2024, 8, 13, 17, 0), end: new Date(2024, 8, 13, 21, 0) },
        ],
        Суббота: [
            { start: new Date(2024, 8, 14, 7, 0), end: new Date(2024, 8, 14, 10, 0) },
            { start: new Date(2024, 8, 14, 16, 0), end: new Date(2024, 8, 14, 19, 0) },
        ],
        Воскресенье: [
            { start: new Date(2024, 8, 15, 8, 0), end: new Date(2024, 8, 15, 11, 0) },
            { start: new Date(2024, 8, 15, 14, 0), end: new Date(2024, 8, 15, 17, 0) },
        ],
    },
};

const ControllerSchedulePage = () => {
    const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [schedule, setSchedule] = useState(initialSchedule);
    const [hasChanges, setHasChanges] = useState(false);
    const {controllerId} = useParams()
    const [label, setLabel] = useState<string | null>(null);

    const dispatch = useDispatch();

    const handleHotWaterClick = () => setSelectedSystem("hotWater");
    const handleHeatingSystemClick = () => setSelectedSystem("heatingSystem");
    const handleDayClick = (day: string) => setSelectedDay(day);

    const handleTimeChange = (index: number, field: "start" | "end", date: Date | null) => {
        if (selectedSystem && selectedDay && date) {
            setSchedule((prevSchedule) => {
                const updatedPeriods = [...prevSchedule[selectedSystem][selectedDay]];
                updatedPeriods[index] = { ...updatedPeriods[index], [field]: date };
                setHasChanges(true);
                return {
                    ...prevSchedule,
                    [selectedSystem]: {
                        ...prevSchedule[selectedSystem],
                        [selectedDay]: updatedPeriods,
                    },
                };
            });
        }
    };

    const handleSaveClick = () => {
        if (selectedSystem && selectedDay) {
            schedule[selectedSystem][selectedDay].forEach((period, index) => {
            });
            setHasChanges(false);
        }
    };

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

    useEffect(() => {
        if (label !== null) {
            dispatch(setBreadcrumb({
                key: 'schedule',
                label: `Расписание «${label}»`,
                icon: 'FaCalendarAlt',
            }));
        }
    }, [label, dispatch]);

    return (
        <DefaultLayout>
            <div className="mt-4 ml-1">
                <Label text='Система:'/>
            </div>
            <div className="tabs inline-flex space-x-2 border-gray-700 mb-4 mt-2 justify-center">



                <button
                    className={`tab py-2 px-1 text-sm font-medium border-b-2 ${selectedSystem === "hotWater" ? "border-gray-800 text-gray-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
                    onClick={handleHotWaterClick}
                >
                    Горячее водоснабжение
                </button>
                <button
                    className={`tab py-2 px-1 text-sm font-medium border-b-2 ${selectedSystem === "heatingSystem" ? "border-gray-800 text-gray-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
                    onClick={handleHeatingSystemClick}
                >
                    Система отопления
                </button>
            </div>
            <div className="ml-1">
                <Label text='День недели:'/>
            </div>
            <div className="tabs inline-flex space-x-2 mt-2 mb-2 justify-center">
                {daysOfWeek.map((day) => (
                    <button
                        key={day}
                        className={`py-2 px-1 text-sm font-medium border-b-2 ${selectedDay === day ? "border-gray-800 text-gray-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {selectedSystem && selectedDay && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-[427px]">
                    <ul className="mb-4 space-y-4">
                        {schedule[selectedSystem][selectedDay].map((period, index) => (
                            <li key={index} className="text-gray-800 flex items-center">
                    <span className="font-semibold text-lg">
                        Комфортный период {index + 1}:
                    </span>
                                <div className="flex items-center space-x-2 ml-4">
                                    <DatePicker
                                        selected={period.start}
                                        onChange={(date) => handleTimeChange(index, "start", date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Время"
                                        placeholderText="00:00"
                                        dateFormat="HH:mm"
                                        locale={ru}
                                        className="bg-white pl-2 text-black border border-gray-300 rounded-lg w-[70px] shadow-sm focus:border-blue-500"
                                    />
                                    <span className="text-lg">-</span>
                                    <DatePicker
                                        selected={period.end}
                                        onChange={(date) => handleTimeChange(index, "end", date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Время"
                                        placeholderText="00:00"
                                        dateFormat="HH:mm"
                                        locale={ru}
                                        className="bg-white pl-2 text-black border border-gray-300 rounded-lg w-[70px] shadow-sm focus:border-blue-500"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
            {hasChanges && (
                <div className="flex justify-end mr-2">
                    <SaveButton onClick={handleSaveClick}/>
                </div>
            )}
                </div>
            )}
        </DefaultLayout>
    );
};

export default ControllerSchedulePage;
