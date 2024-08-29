import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LOGO from '../assets/logo.png';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-gray-100 rounded-sm justify-center border-s-2 sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className='flex justify-between items-center p-4 gap-2 max-w-7xl ml-4'>
        <Link to='/'>
          <div className='font-bold md:text-2xl sm:text-xl justify-between gap-8 flex items-center'>
            <img className='rounded-full h-11 w-11 object-cover' src={LOGO} alt="Logo" />
            <span className='text-orange-500 font-serif'>Call Management System</span>
          </div>
        </Link>

        <ul className='flex gap-6 items-center'>
          {currentUser && (
            <Link to='/'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                Home
              </li>
            </Link>
          )}
          {currentUser && (
            <Link to='/about'>
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                About
              </li>
            </Link>
          )}
          <div className='cursor-pointer'>
            {currentUser ? (
              <img className='rounded-full h-12 w-12 object-cover' src={currentUser.avatar} alt='Profile' />
            ) : (
              <Link to='/signIn'>
                <li className='text-slate-700 hover:underline'>Sign In</li>
              </Link>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}
