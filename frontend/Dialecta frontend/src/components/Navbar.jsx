import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg py-3 px-5">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-gray-100 text-2xl font-extrabold tracking-tight font-sans hover:text-primary transition-colors duration-200">
            PingMe
          </Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link to="/profile" className="text-gray-100 hover:text-primary flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary">
            <FaUser className="mr-1" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          {authUser && (
            <button
              onClick={handleLogout}
              className="text-gray-100 hover:text-primary flex items-center gap-1 px-3 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <FaSignOutAlt className="mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}