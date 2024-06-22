import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../Redux/user/userSlice';
import GoogleAuth from '../components/GoogleAuth';

const SignIn = () => {

  const [formData,setformData]= useState({});
  const { currentUser } = useSelector((state) => state.user);
const {loading, Error} = useSelector((state) => state.user );
  const navigate  = useNavigate();
  const dispatch = useDispatch();
  const handlechange = (e)=>{
    setformData({
      // '...' is spread operator to keep track of the data 
      ...formData,
    [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // we setup a proxy in vite.config  to avoid writing 'http:localhost:3500' instead we write '/api'
    try {
      dispatch(signInStart());
      const res= await fetch('/api/auth/signIn',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
  
        },
        body:JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if(data.success === false){
       dispatch(signInFailure(data.message));
        return;
      }
    dispatch(signInSuccess(data));
    navigate('/Pagelayout?tab=home');

    } catch (error) {
    dispatch(signInFailure(error.message));
    
  }
  useEffect(() => {
    if (currentUser) {
      navigate('/Pagelayout?tab=home');
    }
  }, [user, navigate]);

};
  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7  font-serif '>Sign In</h1>

      <form onSubmit={handleSubmit}className='flex flex-col gap-3'>
   
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handlechange}/>
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handlechange}/>

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>          {loading ? 'Loading...' : 'Sign In'}</button>
        <GoogleAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p> Does not  have an account ?</p>
        <Link to={'/signUp'}>
          <span className='text-blue-700 hover:text-orange-600'>Sign Up</span>
        </Link>
      </div>
      {Error && <p className='text-red-500 mt-5'>{Error}</p>}
    </div>
    
  );
}

export default SignIn