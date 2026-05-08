import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HeroSlider from "@/components/site/HeroSlider";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/30 via-accent/40 to-transparent" />
      <HeroSlider />
    </section>
  );
}
