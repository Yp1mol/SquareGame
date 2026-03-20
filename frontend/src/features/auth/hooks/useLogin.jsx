import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
    navigate("/home");
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleSubmit
  };
}