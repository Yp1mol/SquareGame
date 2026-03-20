import NavBar from "./NavBar";
import Footer from "./Footer";
import React from "react";
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
