import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { fetchProfile, updateUsername } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { addCredit } from '../../../services/api';

export function useProfile() {
    const { token, user, setUser, logout } = useAuth();
    const [username, setUsername] = useState("");
    const [credits, setCredits] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchProfile(token)
                .then((data) => {
                    setUsername(data.username);
                    setCredits(data.credits || 0);
                })
                .catch((err) => console.error("Load error:", err));
        }
    }, [token]);

    const handleUpdateUsername = async () => {
        const updated = await updateUsername(token, username);
        const newUser = { ...user, username: updated.username };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/home");
    };

    const handleAddCredit = async (amount) => {
        amount;
        const data = await addCredit(token);
        setCredits(data.credits);
        setUser({ ...user, credits: data.credits });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return {
        token,
        username,
        credits,
        setUsername,
        handleUpdateUsername,
        handleAddCredit,
        handleLogout,
    };
}