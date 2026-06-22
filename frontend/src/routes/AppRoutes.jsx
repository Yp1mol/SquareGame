import React from 'react';
import "../App.css";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "../features/auth/authContext";
import MainLayout from "../components/layouts/MainLayout";

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import CreateRoomPage from '../pages/CreateRoomPage';
import GamePage from '../pages/GamePage';
import RoomsPage from '../pages/JoinRoomPage';
import MyRoomsPage from '../pages/MyRoomsPage';
import HistoryListPage from '../pages/HistoryListPage';
import HistoryResultPage from '../pages/HistoryResultPage';
import ProtectedRoute from '../components/ProtectedRoute';
import NotificationsPage from '../pages/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/myrooms" element={<ProtectedRoute><MyRoomsPage /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
            <Route path="/game/:code" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
            <Route path="/createroom" element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryListPage /></ProtectedRoute>} />
            <Route path="/history/:id" element={<ProtectedRoute><HistoryResultPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
