import React, { useState } from 'react';
import { Sidebar } from "flowbite-react";
import { HiShoppingBag, HiUser } from "react-icons/hi";
import { RiCustomerService2Fill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { AiTwotoneQuestionCircle } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonPinIcon from '@mui/icons-material/PersonPin';

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('');

  const isActive = (tabName) => activeTab === tabName ? 'bg-blue-300 text-black' : '';

  return (
    <Sidebar aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/'
              icon={IoMdHome}
              className={isActive('home')}
              onClick={() => setActiveTab('home')}
            >
              Home
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/Customer'
              icon={PersonPinIcon}
              className={isActive('customer')}
              onClick={() => setActiveTab('customer')}
            >
              Customer
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/Engineer'
              icon={EngineeringIcon}
              className={isActive('engineer')}
              onClick={() => setActiveTab('engineer')}
            >
              Engineer
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/CreateLead'
              icon={RiCustomerService2Fill}
              label="Create"
              labelColor="dark"
              className={isActive('CreateLead')}
              onClick={() => setActiveTab('CreateLead')}
            >
              Create Lead
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/Showleads'
              icon={FaDatabase}
              label="Show"
              labelColor="dark"
              className={isActive('Showleads')}
              onClick={() => setActiveTab('Showleads')}
            >
              Show Leads
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/about'
              icon={AiTwotoneQuestionCircle}
              className={isActive('about')}
              onClick={() => setActiveTab('about')}
            >
              About
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item
              as={Link}
              to='/Profile'
              icon={HiUser}
              className={isActive('profile')}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </Sidebar.Item>
          )}
          {currentUser && (
            <Sidebar.Item icon={HiShoppingBag}>
              Signout
            </Sidebar.Item>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
