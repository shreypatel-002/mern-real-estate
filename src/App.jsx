import { BrowserRouter } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";
import Header from "./components/Header";
import PageLayout from "./Pages/PageLayout";
import './App.css';




export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
    <BrowserRouter>
      <Header />
      {currentUser && <PageLayout />} {/* Render PageLayout only if currentUser exists */}
      </BrowserRouter>
    </>
  );
}

