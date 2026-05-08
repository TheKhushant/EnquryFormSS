import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const CircleButton = ({ icon: Icon, label, href, onClick, className = "" }) => {
  const isExternal = Boolean(href && href.startsWith("http"));

  const baseClassName =
    "pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e0e5ec] text-gray-700 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

  if (href) {
    return (
      <motion.a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={label}
        whileTap={{ scale: 0.96 }}
        className={`${baseClassName} ${className}`}
      >
        <Icon className="h-5 w-5" />
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.96 }}
      className={`${baseClassName} ${className}`}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  );
};

export default function FloatingSocialMenu() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const socialLinks = [
    {
      id: "chat",
      icon: ChatBubbleLeftRightIcon,
      label: "Chat",
      href: "https://wa.me/+918262908256",
      color: "text-sky-600",
    },
    {
      id: "instagram",
      icon: FaInstagram,
      label: "Instagram",
      href: "https://www.instagram.com/ss.infotechnagpur/?hl=en",
      color: "text-pink-600",
    },
    {
      id: "facebook",
      icon: FaFacebookF,
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61572336325640",
      color: "text-blue-600",
    },
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: "https://wa.me/+919399345989", // Replace with your number
      color: "text-green-600",
    },
    // {
    //   id: "call",
    //   icon: FaPhoneAlt,
    //   label: "Call",
    //   href: "tel:+91XXXXXXXXXX", // Replace with your number
    //   color: "text-amber-600",
    // },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.92 },
  };

  if (!isMounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
    >
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.18, delay: index * 0.05 }}
        >
          <CircleButton
            icon={social.icon}
            label={social.label}
            href={social.href}
            // className={`${social.color} h-14 w-14 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]`}
            className={`${social.color} h-14 w-14 rounded-full 
shadow-[inset_1px_1px_1px_rgba(0,0,0,0.25),inset_1px_1px_12px_rgba(255,255,255,0.7)]`}            
          />
        </motion.div>
      ))}
    </motion.div>,
    document.body,
  );
}