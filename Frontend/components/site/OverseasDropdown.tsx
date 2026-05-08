import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function OverseasDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const raisedShadow = "shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]";
  const pressedShadow = "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]";

  const handleOptionClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Main Tab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // close on outside click
        className={`
          flex items-center gap-2 px-6 py-3 rounded-3xl font-medium text-gray-700
          bg-[#e0e5ec] transition-all duration-300
          ${isOpen ? pressedShadow : raisedShadow}
          hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]
          active:scale-95
        `}
      >
        Overseas
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 z-50"
          >
            <div className={`
              bg-[#e0e5ec] rounded-3xl p-2 
              shadow-[8px_8px_20px_#bebebe,-8px_-8px_20px_#ffffff]
            `}>
              <button
                onClick={() => handleOptionClick("/overseas-training")}
                className="w-full text-left px-6 py-4 rounded-2xl hover:bg-white/70 active:bg-white/40 transition-colors flex items-center gap-3 text-gray-700 font-medium"
              >
                Training
              </button>

              <button
                onClick={() => handleOptionClick("/overseas-admission")}
                className="w-full text-left px-6 py-4 rounded-2xl hover:bg-white/70 active:bg-white/40 transition-colors flex items-center gap-3 text-gray-700 font-medium"
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