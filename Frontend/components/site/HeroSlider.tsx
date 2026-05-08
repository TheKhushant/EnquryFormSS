import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
// import Hero1 from "../../../public/image.png";
// import Hero2 from "../../../public/DA.png";
// import Hero3 from "../honeBanner/crt.jpeg";
// import hero4 from "../honeBanner/german.jpeg"
// import Hero1 from "../../../public/honeBanner/crt.jpeg";
import Hero2 from "../../../public/honeBanner/5.png";
import Hero3 from "../../../public/honeBanner/4.png";
import hero4 from "../../../public/honeBanner/3.png";
import hero5 from "../../../public/honeBanner/2.png";
// import hero6 from "../../../public/honeBanner/2.png";

const slides = [
  { image: Hero3, cta: { label: "Explore Courses", to: "/courses" } },
  { image: Hero2, cta: { label: "View Programs", to: "/courses" } },
  { image: hero4, cta: { label: "Contact Us", to: "/contact" } },
  { image: hero5, cta: { label: "Contact Us", to: "/contact" } },
  // { image: hero6, cta: { label: "Contact Us", to: "/contact" } },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const scrollTo = useCallback((index) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  // Update selected index
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    let id;
    if (playing) {
      id = window.setInterval(() => emblaApi && emblaApi.scrollNext(), 5000);
    }
    return () => id && clearInterval(id);
  }, [emblaApi, playing]);

  return (
    <div className="relative w-full max-w-[1920px] mx-auto">
      {/* Slides */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, idx) => (
            <div key={idx} className="min-w-full relative">
              <div className="w-full h-[35vh] xs:h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] xl:h-[75vh] 2xl:h-[85vh]">
                <img
                  src={s.image}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/1920x1080";
                  }}
                />
                {/* <div className="absolute inset-0 bg-black/20 xs:bg-black/25 sm:bg-black/30" /> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        className="absolute left-1 xs:left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-1 xs:p-1.5 sm:p-2 md:p-2.5 lg:p-3 xl:p-4 transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
      </button>
      <button
        aria-label="Next"
        onClick={() => emblaApi && emblaApi.scrollNext()}
        className="absolute right-1 xs:right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-1 xs:p-1.5 sm:p-2 md:p-2.5 lg:p-3 xl:p-4 transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
      </button>

      {/* Dots & Play/Pause */}
      {/* <div className="absolute left-1/2 -translate-x-1/2 bottom-2 xs:bottom-2.5 sm:bottom-3 md:bottom-4 lg:bottom-6 xl:bottom-8 flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="text-white text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-1 xs:px-1.5 sm:px-2 md:px-2.5 lg:px-3 xl:px-4 py-0.5 xs:py-0.75 sm:py-1 md:py-1.25 lg:py-1.5 xl:py-2 rounded bg-black/50 hover:bg-black/60 transition-all duration-200"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 rounded-full transition-colors duration-200 ease-in-out hover:bg-white/80 focus:bg-white/80 ${selectedIndex === i ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div> */}

      {/* CTA Buttons */}
      <div className="absolute bottom-2 xs:bottom-2.5 sm:bottom-3 md:bottom-4 lg:bottom-6 xl:bottom-8 left-1 xs:left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 right-1 xs:right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 flex justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4">
        {slides.map((s, idx) => (
          <Link
            key={idx}
            to={s.cta.to}
            className={`bg-blue-600 text-white text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-1.5 xs:px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 py-0.5 xs:py-0.75 sm:py-1 md:py-1.5 lg:py-2 xl:py-2.5 rounded-lg ${selectedIndex === idx ? 'block' : 'hidden'} transition-all duration-200 ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
          >
            {s.cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}