import { useState, useEffect } from 'react';
import { fetchMyRooms } from '../../../services/api';
import { useAuth } from '../../auth/authContext';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../../services/api';
import { deleteRoom, leaveRoom } from '../../../services/api';

export function useMyRooms() {
  const [rooms, setRooms] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      if (!token) {
        return;
      }

      const [data] = await Promise.all([
        fetchMyRooms(token, true),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      setRooms(data);
      setLoading(false);
    };
    loadRooms();
  }, [token]);
  
  const handleDeleteRoom = async (roomCode) => {
    try {
      await deleteRoom(roomCode, token);
      setRooms((prev) => prev.filter((room) => room.code !== roomCode));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinRoom = async (roomCode) => {
    await joinRoom(roomCode, token);
    navigate(`/game/${roomCode}`);
  };

  const handleLeaveRoom = async (roomCode) => {
    try {
      await leaveRoom(roomCode, token);
      setRooms((prev) => prev.filter((room) => room.code !== roomCode));
    } catch (err) {
      alert(err.message);
    }
  };

  return { rooms, handleJoinRoom, handleDeleteRoom, handleLeaveRoom, user, loading };
}