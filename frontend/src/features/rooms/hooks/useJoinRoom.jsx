import { useState, useEffect } from 'react';
import { fetchRooms, joinRoom } from '../../../services/api';
import { useAuth } from '../../auth/authContext';
import { useNavigate } from 'react-router-dom';

export function useJoinRoom() {
    const [rooms, setRooms] = useState([]);
    const { token, user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
          if (!token) {
            return;
          }
          const [data] = await Promise.all([
            fetchRooms(token, true),
            new Promise(resolve => setTimeout(resolve, 1000))
          ]);
          setRooms(data);
          setLoading(false);
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

    return { rooms, handleJoinRoom, loading };
}