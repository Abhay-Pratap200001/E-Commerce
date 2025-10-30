// src/components/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ fullScreen = true, text = "Loading..." }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen w-full" : "py-10"
      } bg-gradient-to-b from-black via-slate-950 to-black`}>
      {/* Neon Spinner */}
      <div className="relative flex items-center justify-center scale-125">
        {/* Outer Neon Halo */}
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-green-400/40 via-lime-500/25 to-emerald-400/35 blur-3xl animate-pulse"></div>

        {/* Outer Ring */}
        <div className="w-48 h-48 rounded-full border-[8px] border-t-transparent border-b-transparent border-l-green-400 border-r-emerald-500 animate-spin shadow-[0_0_60px_12px_rgba(16,185,129,0.45)]"></div>

        {/* Middle Gloss Ring */}
        <div className="absolute w-36 h-36 rounded-full border-[7px] border-t-transparent border-b-transparent border-l-lime-400 border-r-green-600 animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_40px_10px_rgba(34,197,94,0.55)] blur-[0.5px]"></div>

        {/* Inner Ring (slow rotation) */}
        <div className="absolute w-24 h-24 rounded-full border-[5px] border-t-transparent border-b-transparent border-l-emerald-400 border-r-green-500 animate-[spin_3.5s_linear_infinite] opacity-80"></div>

        {/* Pulsing Core Glow */}
        <div className="absolute w-12 h-12 bg-gradient-to-br from-green-400 via-lime-500 to-emerald-400 rounded-full animate-pulse shadow-[0_0_70px_rgba(16,185,129,0.9)]"></div>

        {/* Central Static Core */}
        <div className="absolute w-6 h-6 bg-green-300 rounded-full shadow-[0_0_35px_rgba(16,185,129,1)]"></div>
      </div>

      {/* Text Section */}
      <p className="mt-12 text-green-400 text-3xl font-bold tracking-[0.25em] animate-pulse drop-shadow-[0_0_25px_rgba(16,185,129,0.85)]">
        {text}
      </p>

      {/* Subtle shimmer line effect */}
      <div className="mt-4 w-56 h-[2px] bg-gradient-to-r from-transparent via-green-400/80 to-transparent animate-[pulse_2s_infinite] blur-[0.5px]" />
    </div>
  );
};

export default LoadingSpinner;
