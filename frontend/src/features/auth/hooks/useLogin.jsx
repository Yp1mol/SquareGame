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
      console.error("Login error details:", err);
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
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