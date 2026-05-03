import { useState, useEffect } from 'react';
import { getUserHistory } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

export function useHistoryList() {
    const [history, setHistory] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const loadHistory = async () => {
            if (!token) {
                return;
            }

            const data = await getUserHistory(token);
            setHistory(data || []);

        };

        loadHistory();
    }, [token]);

    return { history };
}