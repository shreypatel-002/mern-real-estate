// PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
const PrivateRoute = () => {
  
  const { currentUser } = useSelector((state) => state.user);
  
  return currentUser  ? <Outlet/> : navigate('/signIn');
 
};

export default PrivateRoute;
