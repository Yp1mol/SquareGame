import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/api";

export function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (username, password) => {
    setError("");

    try {
      await registerUser({ username, password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } 
  }

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleSubmit,
    error,
  };
}