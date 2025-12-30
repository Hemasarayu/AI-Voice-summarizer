import { motion } from "framer-motion";
import { useState } from "react";

interface VoiceBlobProps {
  type: "mic" | "summary" | "upload" | "wave";
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const VoiceBlob = ({ type, className = "", isActive = false, onClick }: VoiceBlobProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEmoji = () => {
    if (isActive) {
      return type === "mic" ? "😊" : "🤗";
    }
    if (isHovered) {
      return "😄";
    }
    return "😌";
  };

  const getBlobColor = () => {
    switch (type) {
      case "mic":
        return "from-primary/80 to-primary";
      case "summary":
        return "from-secondary/80 to-secondary";
      case "upload":
        return "from-accent/80 to-accent";
      case "wave":
        return "from-primary-glow/60 to-primary/60";
      default:
        return "from-primary/80 to-primary";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "mic":
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        );
      case "summary":
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
        );
      case "upload":
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
          </svg>
        );
      case "wave":
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main blob */}
      <motion.div
        className={`relative w-24 h-24 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br ${getBlobColor()} shadow-float flex items-center justify-center`}
        animate={{
          borderRadius: isHovered
            ? "60%_40%_30%_70%/60%_30%_70%_40%"
            : "40%_60%_70%_30%/40%_50%_60%_50%",
          rotate: isActive ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        {/* Face */}
        <motion.div
          className="absolute -top-2 right-0 text-2xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {getEmoji()}
        </motion.div>

        {/* Icon */}
        <motion.div
          className="text-primary-foreground"
          animate={{
            y: isActive ? [0, -3, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
          }}
        >
          {getIcon()}
        </motion.div>
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br ${getBlobColor()} blur-xl opacity-0`}
        animate={{
          opacity: isHovered || isActive ? 0.4 : 0,
        }}
      />
    </motion.div>
  );
};

export default VoiceBlob;
