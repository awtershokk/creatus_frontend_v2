import moment from "moment/moment";

export const formatDateTime = (dateTime: string | number): { date: string; time: string } => {
    return {
        date: moment(Number(dateTime)).format("DD.MM.YYYY"),
        time: moment(Number(dateTime)).format("HH:mm"),
    };
};
