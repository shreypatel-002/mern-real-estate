import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import GoogleAuth from '../components/GoogleAuth';
export default function SignUp  ()  {

  const [formData, setFormData] = useState({});
  const [Error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signIn');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7  font-mono'>Sign Up</h1>

      <form onSubmit={handleSubmit}className='flex flex-col gap-3'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handlechange}/>
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handlechange}/>
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handlechange}/>

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>          {loading ? 'Loading...' : 'Sign Up'}</button>
        <GoogleAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signIn'}>
          <span className='text-blue-700 hover:text-orange-600'>Sign In</span>
        </Link>
      </div>
      {Error && <p className='text-red-500 mt-5'>{Error}</p>}
    </div>
    
  );
}

