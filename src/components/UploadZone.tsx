import { motion } from "framer-motion";
import { useState } from "react";
import { Upload, FileAudio } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <motion.label
      className={`relative flex flex-col items-center justify-center w-full h-40 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Animated icon container */}
      <motion.div
        className="relative mb-3"
        animate={{
          y: isDragging ? -8 : isHovered ? -4 : 0,
          rotate: isDragging ? [0, -5, 5, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Blob background */}
        <motion.div
          className="absolute inset-0 w-16 h-16 -m-2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-gradient-to-br from-accent to-accent/60"
          animate={{
            borderRadius: isDragging
              ? "60%_40%_30%_70%/60%_30%_70%_40%"
              : "40%_60%_70%_30%/40%_50%_60%_50%",
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative w-12 h-12 flex items-center justify-center text-accent-foreground"
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        >
          {isDragging ? (
            <FileAudio className="w-7 h-7" />
          ) : (
            <Upload className="w-7 h-7" />
          )}
        </motion.div>

        {/* Emoji */}
        <motion.span
          className="absolute -top-1 -right-1 text-base"
          animate={{
            scale: isDragging ? 1.3 : isHovered ? 1.1 : 1,
            rotate: isDragging ? 15 : 0,
          }}
        >
          {isDragging ? "🎵" : isHovered ? "😄" : "😌"}
        </motion.span>
      </motion.div>

      <motion.p
        className="text-sm font-medium text-foreground"
        animate={{ opacity: isDragging ? 0.7 : 1 }}
      >
        {isDragging ? "Drop your audio here!" : "Upload voice note"}
      </motion.p>
      <p className="text-xs text-muted-foreground mt-1">
        Drag & drop or click to browse
      </p>
    </motion.label>
  );
};

export default UploadZone;
