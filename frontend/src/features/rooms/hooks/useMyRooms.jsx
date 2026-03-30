import { useState, useEffect } from 'react';
import { fetchMyRooms } from '../../../services/api';
import { useAuth } from '../../auth/authContext';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../../services/api';
import { deleteRoom } from '../../../services/api';

export function useMyRooms() {
    const [rooms, setRooms] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            if (!token) {
                return
            }
            const data = await fetchMyRooms(token);
            setRooms(data);
        };
        loadRooms();
    }, [token]);

    const handleDeleteRoom = async (roomCode) => {
        await deleteRoom(roomCode, token);
        setRooms(prev => prev.filter(room => room.code !== roomCode));
    };

    const handleJoinRoom = async (roomCode) => {
        await joinRoom(roomCode, token);
        navigate(`/game/${roomCode}`);
    };

    return { rooms, handleJoinRoom, handleDeleteRoom };
}