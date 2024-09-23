import BlueLink from "../components/Text/BlueLink.tsx";


export interface ResponsiblePerson {
    position: string;
    type: string;
    fio: string;
    phone: string;
    email: string;
    tg_id: string | null;
    tg_username: string | null;
}

export const transformResponsiblePersonData = (person: ResponsiblePerson) => {
    return {
        ...person,
        tg_username: person.tg_username ? (
            <BlueLink
                to={`https://t.me/${person.tg_username}`}
    text={`@${person.tg_username}`}
    />
) : 'Не привязан',
};
};
