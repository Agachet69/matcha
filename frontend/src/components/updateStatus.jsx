import { useEffect } from 'react';
import { useSocket } from '../utils/PrivateRoutes'

// CREATE SOCKET EVENT
// PARAM: callback -> function that give you the id of the current user to update status
const updateStatus = (callback) => {
    const socket = useSocket()
    return useEffect(() => {
        if (socket)
            socket.on('update-status', callback);

        return () => {
            if (socket)
                socket.off('update-status', callback);
        };
    }, [socket]);
}

export default updateStatus