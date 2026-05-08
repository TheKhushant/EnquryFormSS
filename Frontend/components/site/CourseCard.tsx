import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import type { Course } from "@/data/courses";
import {
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function CourseCard({ course }: { course: Course }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const accentColor = "#e5bcfb";
  const accentDark = "#c084fc";

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
  const insetShadow = "shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]";
  const softHover = "hover:shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff]";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-[#e0e5ec] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group max-w-x mx-auto w-full h-full flex flex-col ${raisedShadow} ${softHover}`}
    >
      {/* Course Image Container - Fixed height */}
      <div className="relative overflow-hidden rounded-t-3xl flex-shrink-0">
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          src={course.image}
          alt={course.title}
          className="w-full h-52 object-cover"
        />

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge - Raised */}
        <div className="absolute top-4 left-4 z-30">
          <span
            className="px-4 py-2 text-xs font-semibold rounded-2xl bg-[#e0e5ec] text-gray-800 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]"
          >
            {course.category}
          </span>
        </div>

        {/* Quick View Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-30"
        >
          <div className="px-5 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-2xl shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] flex items-center gap-2 hover:bg-white transition-all">
            <PlayCircleIcon className="w-4 h-4" />
            Quick View
          </div>
        </motion.div>
      </div>

      {/* Card Body - Flexible to fill remaining space */}
      <div className="p-7 flex flex-col flex-grow">
        {/* Title & Short Description */}
        <div className="mb-2 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2 group-hover:text-gray-900 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {course.short}
          </p>
        </div>

        {/* Metadata - Fixed height */}
        <div className="flex gap-3 mb-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-[#e0e5ec] px-4 py-2 rounded-2xl text-sm shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]">
            <AcademicCapIcon className="w-4 h-4" style={{ color: accentColor }} />
            <span className="font-medium text-gray-700">{course.level}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#e0e5ec] px-4 py-2 rounded-2xl text-sm shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]">
            <ClockIcon className="w-4 h-4" style={{ color: accentColor }} />
            <span className="font-medium text-gray-700">{course.duration}</span>
          </div>
        </div>

        {/* Expandable Syllabus - Will push content below */}
        <div className="flex-grow">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <div className="border-t border-gray-200/70 pt-5">
                  <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-700">
                    <CheckBadgeIcon className="w-4 h-4" style={{ color: accentColor }} />
                    Key Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {course.syllabus?.slice(0, 4).map((topic, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className="px-4 py-2 bg-white text-xs font-medium text-gray-700 rounded-2xl shadow-[2px_2px_5px_#bebebe,-2px_-2px_5px_#ffffff]"
                      >
                        {topic}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-shrink-0">
          {/* Price */}
          <div className="flex items-center gap-3">
            <motion.span
              className="text-2xl font-bold tracking-tight"
              style={{ 
                background: `linear-gradient(to right, ${accentColor}, ${accentDark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {course.fees}
            </motion.span>

            {/* Expand Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-2 rounded-2xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all"
            >
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Preview Button - Raised */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/courses/${course.id}`}>
                <button className="px-2 py-3 text-sm font-medium bg-[#e0e5ec] text-gray-700 rounded-2xl shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] flex items-center gap-2 hover:text-gray-900 transition-all">
                  <PlayCircleIcon className="w- h-4" />
                  Preview
                </button>
              </Link>
            </motion.div>

            {/* Enroll Button - Accent Color */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/enroll/${course.id}`}>
                <button 
                  className="px-3 py-3 text-sm font-semibold text-white rounded-2xl flex items-center gap-2 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}, ${accentDark})` 
                  }}
                >
                  <SparklesIcon className="w-4 h-4" />
                  Enroll Now
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Hover Glow */}
      <motion.div
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ 
          boxShadow: `0 0 0 3px ${accentColor}30` 
        }}
      />
    </motion.article>
  );
}