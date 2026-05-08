// HomeAboutSec.tsx
import { motion, AnimatePresence } from "framer-motion";
import { TrophyIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const HomeAboutSec = ({ raisedShadow, insetShadow }: { 
  raisedShadow?: string; 
  insetShadow?: string;
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const highlights = [
    {
      emoji: "🎓",
      title: "Education",
      content: "Education is key to personal and professional growth. We provide hands-on training with real-world projects.",
    },
    {
      emoji: "💡",
      title: "Belief",
      content: "We believe in nurturing talent and fostering careers through innovative learning experiences.",
    },
    {
      emoji: "🚀",
      title: "Solutions",
      content: "Our tailored IT solutions ensure that your projects are delivered with excellence and efficiency.",
    },
  ];

  return (
    <>
    </>
  );
};

export default HomeAboutSec;