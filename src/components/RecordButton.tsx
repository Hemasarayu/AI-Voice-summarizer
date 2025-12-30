import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square } from "lucide-react";

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

const RecordButton = ({ isRecording, onClick }: RecordButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer pulse rings when recording */}
      <AnimatePresence>
        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-destructive/30"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-destructive/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-float transition-colors duration-300 ${
          isRecording
            ? "bg-destructive"
            : "bg-gradient-to-br from-primary to-primary-glow"
        }`}
        animate={{
          boxShadow: isRecording
            ? "0 0 40px hsl(0 70% 60% / 0.5)"
            : "0 12px 40px -12px hsl(12 80% 65% / 0.25)",
        }}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="stop"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Square className="w-8 h-8 text-destructive-foreground fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Mic className="w-8 h-8 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji face on button */}
        <motion.span
          className="absolute -top-1 -right-1 text-lg"
          animate={{
            rotate: isRecording ? [0, 10, -10, 0] : 0,
            scale: isRecording ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isRecording ? Infinity : 0,
          }}
        >
          {isRecording ? "🎤" : "😊"}
        </motion.span>
      </motion.div>

      {/* Label */}
      <motion.p
        className="mt-3 text-sm font-medium text-muted-foreground text-center"
        animate={{ opacity: 1 }}
      >
        {isRecording ? "Recording..." : "Tap to record"}
      </motion.p>
    </motion.button>
  );
};

export default RecordButton;
