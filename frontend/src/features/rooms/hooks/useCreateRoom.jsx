import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

export function useCreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const { token, user, setUser } = useAuth();

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  }, []);

  const handleCreate = async () => {
    if (!token) {
      return;
    }

    if (user.credits < 1) {
      return;
    }
    const data = await createRoom(roomCode, token);

    if (data.user) {
      setUser({ ...user, credits: data.user.credits });
    }
    navigate(`/game/${roomCode}`);
  };

  return {
    roomCode,
    setRoomCode,
    handleCreate,
  };
}
