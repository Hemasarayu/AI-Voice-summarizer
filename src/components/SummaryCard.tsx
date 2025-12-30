import { motion } from "framer-motion";
import { Copy, Share2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SummaryCardProps {
  summary: string;
  isLoading?: boolean;
}

const SummaryCard = ({ summary, isLoading = false }: SummaryCardProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied to clipboard! 📋");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Voice Note Summary",
        text: summary,
      });
    } else {
      handleCopy();
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6 rounded-3xl bg-card shadow-soft"
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-5 h-5 text-secondary-foreground" />
          </motion.div>
          <div>
            <p className="font-semibold text-foreground">Summarizing...</p>
            <p className="text-xs text-muted-foreground">Our AI is working its magic ✨</p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-4 rounded-full bg-muted"
              style={{ width: `${100 - i * 15}%` }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full p-6 rounded-3xl bg-card shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles className="w-5 h-5 text-secondary-foreground" />
            <motion.span
              className="absolute -top-1 -right-1 text-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.div>
          <div>
            <p className="font-semibold text-foreground">Summary</p>
            <p className="text-xs text-muted-foreground">AI-generated</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="soft"
            size="icon"
            onClick={handleCopy}
            className="rounded-xl"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="soft"
            size="icon"
            onClick={handleShare}
            className="rounded-xl"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary text */}
      <motion.p
        className="text-foreground leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {summary}
      </motion.p>
    </motion.div>
  );
};

export default SummaryCard;
