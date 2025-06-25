import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
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
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-100 tracking-tight">Login</h2>
        {error && <div className="mb-4 text-red-400 text-center font-semibold">{error}</div>}
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
          disabled={isLoggingIn}
        >
          {isLoggingIn ? <span className="loading loading-dots loading-xl"></span> : 'Login'}
        </button>
        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;