import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const {user, logout} = useUserStore();
  const isAdmin = user?.role === 'admin';

  return (
    <header
      className="fixed top-0 left-0 w-full backdrop-blur-xl z-50 transition-all duration-500
      bg-transparent hover:bg-gray-900/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">

      <div className="container mx-auto px-6 py-3 transition-colors duration-500">
        <div className="flex flex-wrap justify-between items-center">
          {/*Left side Logo */} 
          <Link
            to="/"
            className="text-2xl font-semibold tracking-wide text-emerald-400 hover:text-emerald-300 transition duration-300 flex items-center space-x-2">
            E-Commerce
          </Link>

          {/*Right Side Navigation Links */}
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-gray-300 text-sm sm:text-base font-medium hover:text-emerald-400 transition duration-300 ease-in-out flex items-center">
              Home
            </Link>

            {/* Cart */}
            {user && (
              <Link
                to="/cart"
                className="relative flex items-center text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out group">
                <ShoppingCart
                  className="mr-1 text-gray-300 group-hover:text-emerald-400 transition duration-300"
                  size={20}/>
                <span className="hidden sm:inline text-sm font-medium">
                  Cart
                </span>
                <span className="absolute -top-2 -right-3 bg-emerald-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold shadow-lg group-hover:bg-emerald-500 transition duration-300">
                  2
                </span>
              </Link>
            )}

            {/* Admin Dashboard if user is login and also admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center text-gray-200 hover:text-emerald-400 border border-emerald-700/30 hover:border-emerald-500/50 px-3 py-1.5 rounded-md font-medium transition duration-300 ease-in-out shadow-sm">
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}


            {/* Auth Buttons if user is not login show this */}
            {user ? (
              <button onClick={logout} className="flex items-center text-gray-200 hover:text-emerald-400 border border-emerald-700/30 hover:border-emerald-500/40 py-2 px-4 rounded-md font-medium transition duration-300 ease-in-out shadow-sm">
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </button>) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center text-gray-200 hover:text-emerald-400 border border-emerald-700/30 hover:border-emerald-500/50 py-2 px-4 rounded-md font-medium transition duration-300 ease-in-out shadow-sm">
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  className="flex items-center text-gray-200 hover:text-emerald-400 border border-emerald-700/30 hover:border-emerald-500/50 py-2 px-4 rounded-md font-medium transition duration-300 ease-in-out shadow-sm">
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
