import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../authService";

export function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await register({ username, password });
    navigate("/login");
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    handleSubmit,
  };
}