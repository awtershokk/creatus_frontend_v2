
import { useState, useEffect } from 'react';
import { fetchBuilding } from '../api/requests/buildingApi.ts';

const useServerStatus = (onConnectionRestored) => {
    const [serverConnected, setServerConnected] = useState(true);
    const [prevServerConnected, setPrevServerConnected] = useState(true);

    const checkServerConnection = async () => {
        try {
            const building = await fetchBuilding(1);
            setServerConnected(!!building);
        } catch (error) {
            console.error('Ошибка подключения к серверу:', error);
            setServerConnected(false);
        }
    };

    useEffect(() => {

        checkServerConnection();

        const intervalId = setInterval(() => {
            checkServerConnection();
        }, 20000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {

        if (!prevServerConnected && serverConnected) {
            onConnectionRestored();
        }


        if (!serverConnected) {
            const reloadInterval = setInterval(() => {
                window.location.reload();
            }, 20000);

            return () => clearInterval(reloadInterval);
        }

        setPrevServerConnected(serverConnected);
    }, [serverConnected, prevServerConnected, onConnectionRestored]);

    return { serverConnected, checkServerConnection };
};

export default useServerStatus;
