import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService } from "./authService";
import React from 'react';
import PropTypes from 'prop-types';
import { fetchProfile } from "../../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    const { token, user } = await loginService(credentials);

    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem("token");
    
    if (!currentToken) {
      return;
    }
    const userData = await fetchProfile(currentToken);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, token, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node
};