import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../Redux/user/userSlice';
import GoogleAuth from '../components/GoogleAuth';
import User from '../../../api/model/Usermodel';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [UserType, setUserType] = useState('User');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const url = '/api/auth/signin'; // Use a single endpoint
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userType: UserType }),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h1 className="text-3xl text-center font-semibold my-7 font-serif">
          {UserType === 'Admin' ? 'Admin Login' : 'User Sign In'}
        </h1>
        <div className='flex gap-3 items-center'>
          <select
            name="UserType"
            className="border p-3 rounded-lg"
            defaultValue={"User"}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        {UserType =='User' &&
        <GoogleAuth />
}
      </form>
      <div className="flex flex-col gap-2 mt-5">
        <div className="flex gap-2">
          <p>Don't have an account?</p>
          <Link to={'/signup'}>
            <span className="text-blue-700 hover:text-orange-600">Sign Up</span>
          </Link>
        </div>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignIn;
