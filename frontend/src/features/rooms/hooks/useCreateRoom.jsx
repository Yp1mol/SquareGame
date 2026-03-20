import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useCreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  }, []);

  const handleCreate = () => {
    navigate(`/game/${roomCode}`);
  };

  return {
    roomCode,
    setRoomCode,
    handleCreate,
  };
}