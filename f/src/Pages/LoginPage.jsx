import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight, Loader, UserPlus } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'


const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

    const {Login, loading } = useUserStore()


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email, password);
    Login(email, password)
    
  }

  return (
    <div className="flex flex-col justify-center py-16 px-6 sm:px-8 lg:px-10 relative top-20">
      {/* Heading */}
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}>
        <h2 className="text-3xl font-extrabold text-emerald-500 tracking-tight">
          Login To Your Account
        </h2>
        <p className="mt-2 text-sm text-emerald-400">
          Welcome
        </p>
      </motion.div>


      {/* Form Container */}
      <motion.div
        className="mt-10 mx-auto w-full sm:max-w-md md:max-w-lg lg:max-w-xl
          rounded-2xl border border-emerald-300 shadow-[0_0_50px_rgba(16,185,129,0.9)]
          backdrop-blur-lg bg-gradient-to-br from-gray-900 to-black relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}>

        {/* Top sharp emerald glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>


{/* <--------------------------------------------------------------------------------------------------------------------------------------------> */}


        <div className="relative z-10 py-8 px-6 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-500">
                Email Address
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-emerald-500" aria-hidden="true"/>
                </div>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value )}
                  placeholder="you@example.com"
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600  rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)]  text-emerald-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm"/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-emerald-500">
                Password
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-500" aria-hidden="true"/>
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword( e.target.value )}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 pl-10 bg-gray-900 border border-emerald-600  rounded-md shadow-[inset_0_0_8px_rgba(16,185,129,0.8)]  text-emerald-100 placeholder-emerald-400  focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 hover:shadow-[inset_0_0_12px_rgba(16,255,129,1)] hover:bg-gradient-to-tl hover:from-gray-800 hover:to-gray-900 sm:text-sm"/>
              </div>
            </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-md font-semibold text-white bg-gradient-to-r from-emerald-800 via-emerald-300 to-emerald-400hover:from-emerald-500 hover:to-emerald-300focus:ring-4 focus:ring-emerald-100 focus:outline-nonetransition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.7)] relative overflow-hidden disabled:opacity-60group">
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Loading...
             </>
            ) : (

               <>
                <UserPlus className="mr-2 h-5 w-5" />
               Log-In
                {/* Continuous shimmer animation */}
               <span className="absolute top-0 left-[-50%] w-1/2 h-full bg-white opacity-20 transform -skew-x-12 animate-shimmer pointer-events-none"></span>
              </>
            )}
          </button>


          {/* <------------------------------------------------------------------------------------------------------------------------------------------------> */}


        <style>
        {` @keyframes shimmer { 0% { left: -50%; } 100% { left: 150%; } }.animate-shimmer { animation: shimmer 1.4s linear infinite; }
        `}
        </style>

          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-emerald-500">
            Craete New Account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-500 hover:text-emerald-400 transition"
            >
              Signup <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage