import moment from "moment/moment";

export const formatDateTime = (dateTime: string): { date: string; time: string } => {
    return {
        date: moment(dateTime, "YYYY-MM-DD HH:mm:ss.SSS Z").format("DD.MM.YYYY"),
        time: moment(dateTime, "YYYY-MM-DD HH:mm:ss.SSS Z").format("HH:mm"),
    };
};