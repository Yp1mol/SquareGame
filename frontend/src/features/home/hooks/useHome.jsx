import { useState } from 'react';
import { useAuth } from "../../auth/authContext";
import { useNavigate } from 'react-router-dom';

export function useHome() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return {
        user,
        isMenuOpen,
        setIsMenuOpen,
        handleLogout,
    };
}