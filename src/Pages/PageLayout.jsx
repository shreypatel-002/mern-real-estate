import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import CustomerMaster from './CustomerMaster';
import PrivateRoute from '../components/PrivateRoute';
import Home from './Home';
import About from './About';
import SignUp from './SignUp';
import SignIn from './SignIn';
import CreateLead from './CreateLead';
import Profile from './Profile';
import ShowLeads from './ShowLeads';
import EngineerMaster from './EngineerMaster';

const PageLayout = () => {
  return (
    <div className='min-h-screen w-full flex flex-col md:flex-row sm:flex-row'>
      <div className='md:w-58 sm:w-30'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className='flex-grow p-4'>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Home />} />
          </Route>
          <Route path='/about' element={<About />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/Showleads' element={<ShowLeads />} />
          <Route path='/Engineer' element={<EngineerMaster/>}/>
          <Route path='/CreateLead' element={<CreateLead />} />
          <Route path='/Customer' element={<CustomerMaster />} />
          <Route path='/Profile' element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default PageLayout;
