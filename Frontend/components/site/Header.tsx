import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const raisedShadow = "shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]";
const insetShadow = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]";

export default function EnquiryHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#e0e5ec] border-b border-gray-200/30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: SS GRP Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center">
            <img
              src="/ssgrp-logo.png"        // ← Put your SS GRP logo here
              alt="SS GRP Logo"
              className="w-[130px] md:w-[150px] h-auto object-contain"
            />
          </Link>
          
          {/* Current Location Indicator (Optional) */}
          {/* <div className="hidden sm:flex flex-col text-xs">
            <span className="text-gray-500">Current Location</span>
            <span className="font-semibold text-gray-700">Skill Training Center</span>
          </div> */}
        </div>

        {/* Center: Welcome Text */}
        <div className="hidden md:block text-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome to SS GRP Enquiry
          </h1>
          <p className="text-sm text-gray-600">
            Please fill the form • Your details will be forwarded to admin
          </p>
        </div>

        {/* Right: Scanner Info + Admin Dashboard Button */}
        <div className="flex items-center gap-4">
          {/* Scanner Message */}
          <div className="hidden sm:flex items-center gap-2 bg-white/70 px-4 py-2 rounded-2xl text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Scanner Active
          </div>

          {/* Admin Dashboard Button */}
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm
                bg-violet-600 hover:bg-violet-700 text-white transition-all duration-300
                ${raisedShadow}
              `}
            >
              Admin Dashboard
              <ArrowRightIcon className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Mobile Welcome Bar */}
      <div className="md:hidden bg-white/60 border-t border-gray-200/50 py-2 text-center text-sm text-gray-600">
        Welcome • SS GRP Enquiry Form
      </div>
    </header>
  );
}