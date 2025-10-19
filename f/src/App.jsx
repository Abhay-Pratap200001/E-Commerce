import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import Navbar from "./components/Navbar";

export function App() {
  return (
      <div className="min-h-screen bg-[#0d0d0d] text-white relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Strong radial glow from center */}
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_rgba(0,0,0,0)_60%)]"></div>

        {/* Crisp gradient sweep (top left to bottom right) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-black opacity-90"></div>
      </div>

      {/* App Content */}
      <div className="relative z-70 pt-20">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
     </div>
  );
}
