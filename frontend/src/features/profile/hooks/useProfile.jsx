import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { fetchProfile, updateUsername } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export function useProfile() {
    const { token, user, setUser, loading } = useAuth();
    const [username, setUsername] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (token) {
            fetchProfile(token)
                .then((data) => setUsername(data.username))
                .catch((err) => console.error("Load error:", err));
        }
    }, [token, loading]);

    const submit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const updated = await updateUsername(token, username);

            const newUser = { ...user, username: updated.username };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));

            alert("Nickname changed!");
            navigate("/home");
        } catch (err) {
            alert(`Error: ${err}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        token,
        loading,
        username,
        setUsername,
        isProcessing,
        submit,
    };
}