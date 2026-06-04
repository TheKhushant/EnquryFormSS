import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowRightIcon } from "@heroicons/react/24/outline";

const raisedShadow =
  "shadow-[8px_8px_16px_#d8b4fe,-8px_-8px_16px_#ffffff]";

const insetShadow =
  "shadow-[inset_6px_6px_12px_#d8b4fe,inset_-6px_-6px_12px_#ffffff]";

export default function EnquiryHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#ede9fe] border-b border-violet-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo + Welcome Text in Single Row */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/ssgrp.png"
              alt="SS GRP Logo"
              className="w-[47px] md:w-[48px] h-auto object-contain"
            />
          </Link>

          {/* Welcome Text - Visible on all screens */}
          <h1 className="text-base md:text-lg font-semibold text-violet-900 leading-tight">
            Welcome to SS Group
          </h1>

          <p className="text-xs md:text-sm text-violet-700 leading-tight hidden sm:block">
            Please fill the form • Details will be forwarded to admin
          </p>

          <p className="text-xs text-violet-700 leading-tight sm:hidden">
            Fill form • Forwarded to admin
          </p>
        </div>

        {/* Right: Admin Dashboard Button */}
        {/* <div className="flex items-center">
          <Link to="/admin-login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`
                flex items-center gap-2 px-5 md:px-6 py-3 rounded-2xl font-semibold text-sm
                bg-violet-600 hover:bg-violet-700 text-white transition-all duration-300
                ${raisedShadow}
              `}
            >
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
              <ArrowRightIcon className="w-4 h-4" />
            </motion.button>
          </Link>
        </div> */}
      </div>
    </header>
  );
}

{/* Right: Admin Button */}
{/* <div className="flex items-center gap-4">
  {/* Admin Dashboard Button - Updated 
   <Link to="/admin-login">
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
</div> */} 