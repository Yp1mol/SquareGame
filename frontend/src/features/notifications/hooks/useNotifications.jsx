import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/authContext';
import { markNotificationAsRead } from '../../../services/api';
import { getAllNotifications, deleteNotifications} from '../../../services/api';

export function useNotifications() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const loadAll = async () => {
        if (!token) {
            return;
        }
        try {
            const data = await getAllNotifications(token);
            setNotifications([...data]);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    useEffect(() => {
        loadAll();
    }, [token]);

    const handleMarkRead = async (id) => {
        await markNotificationAsRead(id, token);
        await loadAll();
    };

    const handleDelete = async (id) => {
        await deleteNotifications(token, id);
        await loadAll();
    };

    const handleDeleteAll = async () => {
        if (confirm('Are you sure you want to delete all notifications?')) {
            await deleteNotifications(token);
            await loadAll();
        }
    };

    return { loadAll, handleMarkRead, handleDelete, handleDeleteAll, notifications };
}