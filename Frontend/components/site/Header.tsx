import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/online-training", label: "Online Training" },
  { to: "/classroom-training", label: "Classroom" },
  // { to: "/corporate-training", label: "Corporate" },
  { to: "/placements", label: "Placements" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Overseas Dropdown Component
function OverseasDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const raisedShadow = "shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]";
  const pressedShadow = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]";

  const handleOptionClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    
    <div className="relative">
      {/* Overseas Tab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-sm text-gray-700
          bg-[#e0e5ec] transition-all duration-300
          ${isOpen ? pressedShadow : raisedShadow}
          hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
          active:scale-[0.97]
        `}
      >
        Overseas
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 z-50"
          >
            <div className="bg-[#e0e5ec] rounded-3xl p-2 shadow-[8px_8px_20px_#bebebe,-8px_-8px_20px_#ffffff]">
              <button
                onClick={() => handleOptionClick("/overseas-training")}
                className="w-full text-left px-6 py-4 rounded-2xl hover:bg-white/70 active:bg-white/40 transition-all text-gray-700 font-medium"
              >
                Training
              </button>
              <button
                onClick={() => handleOptionClick("/overseas-admission")}
                className="w-full text-left px-6 py-4 rounded-2xl hover:bg-white/70 active:bg-white/40 transition-all text-gray-700 font-medium"
              >
                Admission
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header({ raisedShadow, insetShadow }: { 
  raisedShadow?: string; 
  insetShadow?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#e0e5ec]">
      <div className={`border-b border-gray-200/30 ${raisedShadow || ""}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/newlogo.png"
              alt="Skill Training Center Logo"
              className="w-[140px] h-auto md:w-[160px] lg:w-[180px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold px-5 py-2.5 rounded-2xl transition-all duration-300
                   ${isActive 
                     ? "bg-[#e0e5ec] text-violet-700 shadow-inner" 
                     : "text-gray-700 hover:text-gray-900 hover:bg-[#e0e5ec] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
                   }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Overseas Dropdown - Inserted Here */}
            <OverseasDropdown />
            
            {/* Student Portal Button */}
            <Link to="/portal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-3 rounded-2xl font-semibold text-sm bg-[#e0e5ec] 
                  ${raisedShadow} hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
                  active:${insetShadow} text-gray-800 transition-all duration-300`}
              >
                Student Portal
              </motion.button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-4 rounded-2xl bg-[#e0e5ec] ${raisedShadow || ""} active:${insetShadow || ""}`}
            aria-label="Toggle navigation"
          >
            <svg 
              className="h-6 w-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6h12v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#e0e5ec] border-t border-gray-200/30 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-6 py-4 rounded-2xl text-base font-medium transition-all
                     ${isActive 
                       ? "bg-[#d8dde6] text-violet-700 shadow-inner" 
                       : "hover:bg-[#e0e5ec] hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] text-gray-700"
                     }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Overseas Options in Mobile Menu */}
              <div className="px-6 py-3 text-gray-500 font-medium text-sm mt-4 border-t border-gray-300/30">
                OVERSEAS
              </div>
              <NavLink
                to="/overseas-training"
                onClick={() => setOpen(false)}
                className="px-6 py-4 rounded-2xl text-base font-medium text-gray-700 hover:bg-white/60"
              >
                Overseas Training
              </NavLink>
              <NavLink
                to="/overseas-admission"
                onClick={() => setOpen(false)}
                className="px-6 py-4 rounded-2xl text-base font-medium text-gray-700 hover:bg-white/60"
              >
                Overseas Admission
              </NavLink>

              {/* Student Portal in Mobile */}
              <Link to="/portal" onClick={() => setOpen(false)} className="mt-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-4 rounded-3xl font-semibold text-base bg-[#e0e5ec] 
                    ${raisedShadow || ""} active:${insetShadow || ""} text-gray-800`}
                >
                  Student Portal
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}