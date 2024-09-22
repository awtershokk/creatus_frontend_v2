export const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');

    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `${match[1]}-${match[2]}-(${match[3]})-${match[4]}-${match[5]}`;
    }

    return phoneNumber;
};
export const formatPhoneNumberOnInput = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length <= 1) {
        return cleaned;
    } else if (cleaned.length <= 4) {
        return `${cleaned[0]}-${cleaned.slice(1)}`; // Форматируем как "8-XXX"
    } else if (cleaned.length <= 7) {
        return `${cleaned[0]}-${cleaned.slice(1, 4)}-(${cleaned.slice(4)}`; // Форматируем как "8-XXX-(XXX"
    } else if (cleaned.length <= 9) {
        return `${cleaned[0]}-${cleaned.slice(1, 4)}-(${cleaned.slice(4, 7)})-${cleaned.slice(7)}`; // "8-XXX-(XXX)-XX"
    } else if (cleaned.length <= 11) {
        return `${cleaned[0]}-${cleaned.slice(1, 4)}-(${cleaned.slice(4, 7)})-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`; // Полное форматирование "8-XXX-(XXX)-XX-XX"
    }

    return phoneNumber;
};
