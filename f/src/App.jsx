import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

export function App() {
  const {user, checkAuth, checkingAuth} = useUserStore()

  useEffect(()=> {
     checkAuth()
  }, [checkAuth])

  if (checkingAuth) return <LoadingSpinner/>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/*  Premium Graphite Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%]
          bg-[radial-gradient(circle_at_center,_rgba(40,40,40,0.6)_0%,_rgba(15,15,15,0.9)_40%,_rgba(0,0,0,1)_100%)]">
        </div>

        {/* Subtle curved metallic sweep */}
        <div
          className="absolute inset-0
          bg-[linear-gradient(135deg,_rgba(80,80,80,0.08)_0%,_rgba(0,0,0,0.6)_50%,_rgba(30,30,30,0.1)_100%)]
          mix-blend-overlay opacity-80">  
        </div>

        {/* Slight inner shadow for depth */}
        <div
          className="absolute inset-0
          bg-[radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.8)_0%,_transparent_70%)]">
          </div>
      </div>

      {/* App Content */}
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage />  : <Navigate to='/'/>} />
          <Route path="/login" element={!user ? <LoginPage />  : <Navigate to='/'/>} />
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}
