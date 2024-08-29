import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from 'react';
import { useSelector } from "react-redux";
import Header from "./components/Header";
import PageLayout from "./Pages/PageLayout";
import './App.css';
import { ToastContainer } from 'react-toastify';
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";



export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <>
    <BrowserRouter>
      <Header />
      {currentUser &&  <PageLayout/>} 
      <Routes>
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/signIn' element={<SignIn />} />

      </Routes>
      <ToastContainer />
      </BrowserRouter>
    </>
  );
}

