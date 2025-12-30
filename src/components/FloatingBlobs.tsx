import { motion } from "framer-motion";

const FloatingBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large coral blob - top right */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary/10 blur-3xl"
        animate={{
          x: [0, 20, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Lavender blob - left */}
      <motion.div
        className="absolute top-1/3 -left-20 w-60 h-60 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-secondary/20 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mint blob - bottom */}
      <motion.div
        className="absolute -bottom-10 right-1/4 w-72 h-72 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] bg-accent/15 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small accent blob */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-primary-glow/10 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingBlobs;
