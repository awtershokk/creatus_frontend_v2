export const getRole = (roleId: number): string => {
    switch (roleId) {
        case 1:
            return 'Пользователь';
        case 2:
            return 'Администратор';
        case 3:
            return 'Суперпользователь';
        default:
            return 'Неизвестная роль';
    }
};
