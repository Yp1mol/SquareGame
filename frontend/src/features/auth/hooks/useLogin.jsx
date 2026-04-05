import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ username, password });
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleSubmit,
    error,
  };
}