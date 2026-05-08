import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, PlayCircleIcon, TrophyIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import newposter6 from "../../../public/newposter6.jpg";
import newposter5 from "../../../public/newposter5.jpg";
import poster3 from "../../../public/poster3.jpg";
import poster4 from "../../../public/poster4.jpg";
// import service from "../../../public/homeUpdates/service.jpeg";
import service1 from "../../../public/homeUpdates/service1.jpeg";
import databricks from "../../../public/homeUpdates/databricks.jpeg";
import german from "../../../public/homeUpdates/german.jpeg";
import german2 from "../../../public/homeUpdates/german2.jpeg";

export default function PosterTemplates() {
  const accentColor = "#e5bcfb";
  const accentDark = "#c084fc";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Poster templates data
  const posterTemplates = [
    {
      title: "ServiceNow AI-Data Analytics",
      description: "Training",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: german2,
    },
    {
      title: "ServiceNow AI-Data Analytics",
      description: "Training",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: service1,
    },
    {
      title: "DataBricks AI-Data Analytics",
      description: "Training",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: databricks,
    },
    {
      title: "German",
      description: "Training",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-100/10 to-cyan-900/10",
      previewImage: german,
    },
    {
      title: "AI-Data Analytics",
      description: "Training & Certification",
      icon: SparklesIcon,
      gradient: `linear-gradient(135deg, ${accentColor}, ${accentDark})`,
      previewImage: newposter6,
    },
    {
      title: "AI-Data Analytics",
      description: "Training & Certification",
      icon: PlayCircleIcon,
      gradient: `linear-gradient(135deg, #a5b4fc, ${accentColor})`,
      previewImage: newposter5,
    },
    {
      title: "AI Data-Bricks Seminar",
      description: "AI Analytics Engineering On Data-Bricks Seminar",
      icon: TrophyIcon,
      gradient: `linear-gradient(135deg, ${accentColor}, #f9a8d4)`,
      previewImage: poster3,
    },
    {
      title: "Answercraft",
      description: "Professional training On communication",
      icon: TrophyIcon,
      gradient: `linear-gradient(135deg, ${accentColor}, #f472b6)`,
      previewImage: poster4,
    },
  ];

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, posterTemplates.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && maxIndex > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 3000);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, maxIndex]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    // Restart auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(Math.min(index, maxIndex));
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Touch/swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Scroll to contact
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const raisedShadow = "shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]";
  const softHover = "hover:shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] hover:-translate-y-1";

  return (
    <section id="posters" className="container py-16 bg-[#e0e5ec]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-lg text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] mb-6 mx-auto">
          <SparklesIcon className="w-5 h-5" style={{ color: accentColor }} />
          <span className="text-sm font-semibold" style={{ color: "#6b21a8" }}>Latest Updates</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Updates</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
          Latest courses, webinars, and success stories.
        </p>
      </motion.div>

      {/* Slider Container */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
        )}
        
        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
        )}

        {/* Slider Viewport */}
       <div 
          ref={sliderRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{
              x: `${-(currentIndex * (100 / itemsPerView))}%`
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {posterTemplates.map((template, index) => {
              const IconComponent = template.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  style={{ width: `${100 / itemsPerView}%`, flexShrink: 0 }}
                  className="px-2 h-full"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.03 }}
                    onClick={scrollToContact}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') scrollToContact();
                    }}
                    className={`group relative h-[360px] rounded-3xl bg-[#e0e5ec] p-5 cursor-pointer overflow-hidden transition-all duration-300 ${raisedShadow} ${softHover} w-full flex flex-col`}
                  >
                    {/* Soft Inner Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Poster Image Preview */}                      
                      <div className="relative mb-4 rounded-2xl overflow-hidden shadow-inner bg-white aspect-[16/10] flex-shrink-0">
                        <img
                          src={template.previewImage}
                          alt={`${template.title} preview`}
                          className="w-full h-full object-cover"   // ← yeh important hai
                        />
                        
                        {/* Hover Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-[2px_2px_6px_#bebebe]">
                            <EyeIcon className="w-5 h-5" style={{ color: "#6b21a8" }} />
                          </div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1 flex-1 px-4 py-2">
                        <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-1">
                          {template.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-tight line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    {/* Subtle bottom shine effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/5 to-transparent rounded-b-3xl pointer-events-none" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-[#c084fc] shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"
                    : "w-2 bg-[#e0e5ec] shadow-[2px_2px_4px_#bebebe,-2px_-2px_4px_#ffffff] hover:shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play indicator */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? "bg-[#e0e5ec] text-gray-700 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]"
                  : "bg-[#e0e5ec] text-gray-600 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]"
              }`}
            >
              {isAutoPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}