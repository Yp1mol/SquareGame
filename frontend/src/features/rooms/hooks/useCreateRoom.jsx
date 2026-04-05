import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

export function useCreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, user, setUser } = useAuth();

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setError("");
  }, []);

  const handleCreate = async (cost) => {
    setError("");

    if (!token) {
      setError("You need to be logged in");
      return;
    }

    if (!user) {
      setError("User not loaded");
      return;
    }

    if (user.credits < cost) {
      setError(`Not enough credits! Need ${cost} credits.`);
      return;
    }

    try {
      const data = await createRoom(roomCode, token, cost);

      if (data.user) {
        setUser({ ...user, credits: data.user.credits });
      }
      navigate(`/game/${roomCode}`);
    } catch (err) {
      setError(err.message);
    } 

  };

  return {
    roomCode,
    setRoomCode,
    handleCreate,
    error,
  };
}