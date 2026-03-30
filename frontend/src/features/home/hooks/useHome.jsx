import { useEffect } from 'react';
import { useAuth } from "../../auth/authContext";

export function useHome() {
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        refreshUser();
    },);

    return {
        user,
    };
}