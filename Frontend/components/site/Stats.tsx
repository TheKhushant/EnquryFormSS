import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function useCounter(to: number, duration = 1.2) {
  const controls = useAnimation();
  const [value, setValue] = useState(0);
  useEffect(() => {
    controls.start({
      count: to,
      transition: { duration, ease: "easeOut" },
    } as any);
  }, [to]);
  return { controls, value, setValue };
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const a = useCounter(60000);
  const b = useCounter(5000);
  const c = useCounter(200);

  useEffect(() => {
    if (inView) {
      a.controls.start({ count: 60000, transition: { duration: 1.2, ease: "easeOut" } } as any);
      b.controls.start({ count: 5000, transition: { duration: 1.2, ease: "easeOut" } } as any);
      c.controls.start({ count: 200, transition: { duration: 1.2, ease: "easeOut" } } as any);
    }
  }, [inView]);

  const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
  const pressedShadow = "shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff]";

  return (
    <section ref={ref} className="container py-16 bg-[#e0e5ec]">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          <AnimatedNumber 
            controls={a.controls} 
            suffix="+" 
            label="Students Trained" 
          />
          <AnimatedNumber 
            controls={b.controls} 
            suffix="+" 
            label="Successful Placements" 
          />
          <AnimatedNumber 
            controls={c.controls} 
            suffix="+" 
            label="Courses Offered" 
          />
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ controls, suffix, label }: { 
  controls: any; 
  suffix?: string; 
  label: string 
}) {
  const [display, setDisplay] = useState(0);

  const raisedShadow = "shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]";
  const innerHighlight = "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/70 before:to-transparent before:pointer-events-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        group relative h-32 w-80 rounded-3xl bg-[#e0e5ec] p-10 
        flex flex-col items-center justify-center text-center 
        cursor-default overflow-hidden transition-all duration-300
        ${raisedShadow}
      `}
    >
      {/* Inner soft highlight */}
      <div className={`absolute inset-0 rounded-3xl ${innerHighlight}`} />

      {/* Number */}
      <motion.div
        animate={controls}
        onUpdate={(latest: any) => setDisplay(Math.floor(latest.count || 0))}
        className="relative z-10 text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-800"
      >
        {display}{suffix}
      </motion.div>

      {/* Label */}
      <div className="relative z-10 mt-6 text-lg font-medium text-gray-600 tracking-wide">
        {label}
      </div>

      {/* Subtle bottom shine */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/5 to-transparent rounded-b-3xl pointer-events-none" />
    </motion.div>
  );
}