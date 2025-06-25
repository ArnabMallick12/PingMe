import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  console.log("Online Users in App:", onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Debug logs
  console.log("Auth User in App:", authUser);
  console.log("isCheckingAuth:", isCheckingAuth);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <Homepage/> : <Navigate to ="/login/"></Navigate>} />
        <Route path="/signup"element={!authUser ? <Signup/> : <Navigate to ="/profile"></Navigate>} />
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to ="/profile"></Navigate>} />
        <Route path="/profile" element={authUser ? <Profile/> : <Navigate to ="/login/"></Navigate>} />
      </Routes>
    </>
  )
}

export default App