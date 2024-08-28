import React, { useState, useEffect } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import UpdateButton from "../../components/Buttons/UpdateButton.tsx";
import Label from "../../components/Text/Label.tsx";


interface Update {
    id: number;
    version: string;
    date: string;
    changes: string[];
    description: string;
}

const UpdatePage: React.FC = () => {
    const [currentVersion] = useState<Update>({
        id: 3,
        version: '1.2.0',
        date: '03.03.2024',
        changes: ['Улучшили производительность.', 'Добавили поддержку Zigbee2MQTT 3.0.', 'Добавили графики для температуры и влажности...'],
        description: 'Включает несколько важных улучшений производительности...'
    });

    const [updates] = useState<Update[]>([
        {
            id: 1,
            version: '1.0.0',
            date: '01.05.2024',
            changes: ['Первый релиз.'],
            description: 'Первый релиз нашей программы...'
        },
        {
            id: 2,
            version: '1.1.0',
            date: '17.06.2024',
            changes: ['Добавили новые фичи.', 'Пофиксили старые баги.'],
            description: 'Мы добавили несколько новых функций, которые...'
        },
        {
            id: 3,
            version: '1.2.0',
            date: '03.03.2024',
            changes: ['Улучшили производительность.', 'Добавили поддержку Zigbee2MQTT 3.0.', 'Добавили графики для температуры и влажности...'],
            description: 'Включает несколько важных улучшений производительности...'
        },
        {
            id: 4,
            version: '1.3.0',
            date: '04.04.2024',
            changes: ['Поддержка нескольких telegram аккаунтов в системе уведомлений', 'Исправление багов'],
            description: 'Включает несколько важных улучшений производительности...'
        }
    ]);

    const [expanded, setExpanded] = useState<string | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [hasUpdates, setHasUpdates] = useState(false);

    const toggleExpand = (version: string) => {
        if (expanded === version || expanded) {
            setIsClosing(true);
            setTimeout(() => {
                setExpanded(expanded === version ? null : version);
                setIsClosing(false);
            }, 100);
        } else {
            setExpanded(version);
        }
    };

    useEffect(() => {
        const latestUpdate = updates[updates.length - 1];

        localStorage.setItem('currentVersionId', currentVersion.id.toString());
        localStorage.setItem('latestVersionId', latestUpdate.id.toString());

        localStorage.setItem('updates', JSON.stringify({ label: "Версия ПО", icon: 'FaDownload' }));

        const currentVersionId = localStorage.getItem('currentVersionId');
        const latestVersionId = localStorage.getItem('latestVersionId');

        if (currentVersionId && latestVersionId) {
            setHasUpdates(parseInt(currentVersionId, 10) < parseInt(latestVersionId, 10));
        }
    }, [currentVersion.id, updates]);
    const latestVersionForProp = updates[updates.length - 1]?.version;

    const reversedUpdates = [...updates].reverse();

    return (
        <DefaultLayout>
            <div className="max-w-3xl">
               <Label text='История обновлений'/>

                <div className="mb-6 mt-4">
                    <h2 className="text-xl font-semibold text-black">Текущая версия</h2>
                    <p className="text-lg text-black">{`Версия ${currentVersion.version} от ${currentVersion.date}`}</p>

                    {hasUpdates && (
                        <div className="mt-1">
                            <UpdateButton label={`Обновить до версии ${latestVersionForProp}`} onClick={() => {
                            }}/>
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold mb-2 text-black">История версий</h2>
                <div className="space-y-2">
                    {reversedUpdates.map((update) => (
                        <div key={update.version} className="border rounded-md border-black">
                            <button
                                className="w-full text-left px-4 py-2 flex justify-between items-center text-black"
                                onClick={() => toggleExpand(update.version)}
                            >
                                <span>{`Версия ${update.version} от ${update.date}`}</span>
                                <span>{expanded === update.version && !isClosing ? '-' : '+'}</span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    expanded === update.version && !isClosing ? 'max-h-[500px]' : 'max-h-0'
                                }`}
                            >
                                <div className="px-4 py-2 border-t border-black text-black bg-gray-100">
                                    <p>{update.description}</p>
                                    <ul className="list-disc pl-6 mt-2">
                                        {update.changes.map((change, index) => (
                                            <li key={index}>{change}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default UpdatePage;
