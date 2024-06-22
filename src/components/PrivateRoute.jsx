// PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser  ? <Outlet /> : <Navigate to="/signIn" />;
};

export default PrivateRoute;
