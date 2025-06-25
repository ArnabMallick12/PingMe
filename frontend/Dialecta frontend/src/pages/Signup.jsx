import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'

const Signup = () => {
  const { isSigningUp, signup } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullname || !form.email || !form.password) {
      setError('All fields are required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      setError(err.response.data.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-100 tracking-tight">Sign Up</h2>
        {error && <div className="mb-4 text-red-400 text-center font-semibold">{error}</div>}
        <div className="mb-4 relative">
          <FaUser className="absolute left-3 top-3 text-primary" />
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="w-full pl-10 border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
            autoComplete="off"
          />
        </div>
        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-3 text-primary" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-10 border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your email"
            autoComplete="off"
          />
        </div>
        <div className="mb-6 relative">
          <FaLock className="absolute left-3 top-3 text-primary" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full pl-10 border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your password"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/80 transition font-bold shadow-md"
          disabled={isSigningUp}
        >
          {isSigningUp ? <span className="loading loading-dots loading-xl"></span> : 'Sign Up'}
        </button>
        <p className="text-center text-gray-300 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;