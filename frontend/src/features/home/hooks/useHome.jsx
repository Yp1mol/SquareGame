import { useState, useEffect } from 'react';
import { useAuth } from "../../auth/authContext";
import { useNavigate } from 'react-router-dom';
import { addCredit } from '../../../services/api';

export function useHome() {
    const { user, setUser, token, logout, refreshUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        refreshUser();
    }, []);
    
    const handleAddCredit = async () => {
        const data = await addCredit(token);
        setUser({ ...user, credits: data.credits });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return {
        user,
        isMenuOpen,
        setIsMenuOpen,
        handleLogout,
        handleAddCredit,
    };
}