import { motion } from "framer-motion";

interface WaveformVisualizerProps {
  isActive: boolean;
}

const WaveformVisualizer = ({ isActive }: WaveformVisualizerProps) => {
  const bars = 12;

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-primary to-primary-glow"
          initial={{ height: 8 }}
          animate={{
            height: isActive
              ? [8, 20 + Math.random() * 20, 8]
              : 8,
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.3,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
