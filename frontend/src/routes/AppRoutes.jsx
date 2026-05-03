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
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/myrooms" element={<MyRoomsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/game/:code" element={<GamePage />} />
            <Route path="/createroom" element={<CreateRoomPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/history" element={<HistoryListPage />} />
            <Route path="/history/:id" element={<HistoryResultPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
