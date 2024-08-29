import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Home from './Home';
import About from './About';
import CreateLead from './CreateLead';
import Profile from './Profile';
import ShowLeads from './ShowLeads';
import EngineerMaster from './EngineerMaster';
import CustomerMaster from './CustomerMaster';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useSelector } from 'react-redux';
import TrackStatus from './TrackStatus';
import Sidebar from '../components/DashSidebar';

const PageLayout = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='relative w-full flex flex-col md:flex-row sm:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-opacity-50 z-10'>
      <div className='md:w-58 sm:w-30'>
        <Sidebar />
      </div>
      <main className='flex-grow p-4'>
        <Routes>
          {/* Admin and User shared routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/about' element={<About />} />
            <Route path='/track' element={<TrackStatus/>}/>
          </Route>

          {/* Admin-only routes */}
          {currentUser?.role && (
            <Route element={<PrivateRoute />}>
              <Route path='/customer' element={<CustomerMaster />} />
              <Route path='/engineer' element={<EngineerMaster />} />
              <Route path='/createlead' element={<CreateLead />} />
              <Route path='/showleads' element={<ShowLeads />} />
              <Route path='/profile' element={<Profile />} />

            </Route>
          )}

          {/* Public routes */}
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </main>
    </div>
  );
};

export default PageLayout;
