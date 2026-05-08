import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const TestimonialsSection = ({ testimonials }) => {
  // Duplicate testimonials for seamless infinite scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 bg-[#e0e5ec] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] mb-6">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">Success Stories</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-800">
            What Our Students Say
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Real stories from our alumni who transformed their careers
          </p>
        </div>

        {/* Infinite Scrolling Testimonials */}
        <div className="max-w-5xl mx-auto">
          {/* Row 1: Left to Right (cards move right) */}
          <div className="overflow-hidden py-4">
            <div className="flex gap-6 animate-scroll-left-to-right">
              {duplicatedTestimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] 
                             flex-shrink-0 w-full max-w-[320px] flex flex-col min-h-[260px]"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <blockquote className="text-[15px] leading-relaxed text-gray-700 font-light italic mb-8 flex-grow">
                    “{t.quote}”
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200/60">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-inner flex-shrink-0">
                      {t.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{t.author}</div>
                      <div className="text-xs text-gray-500">{t.role} • {t.company}</div>
                      <div className="text-violet-600 text-xs font-medium">{t.course}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left (cards move left) */}
          <div className="overflow-hidden">
            <div className="flex gap-6 animate-scroll-right-to-left py-4">
              {duplicatedTestimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] 
                             flex-shrink-0 w-full max-w-[320px] flex flex-col min-h-[260px]"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <blockquote className="text-[15px] leading-relaxed text-gray-700 font-light italic mb-8 flex-grow">
                    “{t.quote}”
                  </blockquote>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200/60">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-inner flex-shrink-0">
                      {t.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{t.author}</div>
                      <div className="text-xs text-gray-500">{t.role} • {t.company}</div>
                      <div className="text-violet-600 text-xs font-medium">{t.course}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add this CSS in your global CSS file (globals.css or tailwind.css) */}
      <style>{`
        @keyframes scrollLeftToRight {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes scrollRightToLeft {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .animate-scroll-left-to-right {
          display: flex;
          animation: scrollLeftToRight 35s linear infinite;
        }

        .animate-scroll-right-to-left {
          display: flex;
          animation: scrollRightToLeft 40s linear infinite;
        }

        /* Pause on hover */
        .animate-scroll-left-to-right:hover,
        .animate-scroll-right-to-left:hover {
          animation-play-state: paused;
        }

        /* Responsive speed adjustment */
        @media (max-width: 768px) {
          .animate-scroll-left-to-right { animation-duration: 25s; }
          .animate-scroll-right-to-left { animation-duration: 28s; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;