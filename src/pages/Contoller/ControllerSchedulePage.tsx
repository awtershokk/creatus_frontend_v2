import { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";
import SaveButton from "../../components/Buttons/SaveButton.tsx";

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
    const [hasChanges, setHasChanges] = useState(false); // Track changes

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
            console.log(`Saving changes for ${selectedSystem} on ${selectedDay}`);
            schedule[selectedSystem][selectedDay].forEach((period, index) => {
                console.log(`Period ${index + 1}: Start - ${period.start.toLocaleTimeString()}, End - ${period.end.toLocaleTimeString()}`);
            });
            setHasChanges(false);
        }
    };

    localStorage.setItem("schedule", JSON.stringify({ label: "Расписание", icon: "FaCalendarAlt" }));

    return (
        <DefaultLayout>
            <div className="tabs inline-flex space-x-2 border-gray-700 mb-4 justify-center">
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
            <div></div>
            <div className="tabs inline-flex space-x-2 mt-1 mb-2 justify-center">
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
                <div className="mt-4">
                    <ul className="mb-4">
                        {schedule[selectedSystem][selectedDay].map((period, index) => (
                            <li key={index} className="mb-2 text-black flex items-center">
                                Комфортный период {index + 1}:
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
                                    className="bg-white pl-2 text-black border border-black rounded ml-2 w-[55px]"
                                />
                                -
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
                                    className="bg-white pl-2 text-black border border-black rounded w-[55px]"
                                />
                            </li>
                        ))}
                    </ul>
                    {hasChanges && (
                       <SaveButton onClick={handleSaveClick}/>
                    )}
                </div>
            )}
        </DefaultLayout>
    );
};

export default ControllerSchedulePage;
