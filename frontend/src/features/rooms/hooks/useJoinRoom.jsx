import { useState, useEffect } from 'react';
import { fetchRooms, joinRoom } from '../../../services/api';
import { useAuth } from '../../auth/authContext';
import { useNavigate } from 'react-router-dom';

export function useJoinRoom() {
    const [rooms, setRooms] = useState([]);
    const { token, user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            if (!token) {
                return
            }
            const data = await fetchRooms(token);
            setRooms(data);
        };
        loadRooms();
    }, [token]);

    const handleJoinRoom = async (roomCode, roomCost) => {
        if (!token) {
            return;
        }

        if (user.credits < roomCost) {
            return;
        }
        const data = await joinRoom(roomCode, token);
        
        if (data.user) {
            setUser({ ...user, credits: data.user.credits });
        }
        navigate(`/game/${roomCode}`);

    };

    return { rooms, handleJoinRoom };
}