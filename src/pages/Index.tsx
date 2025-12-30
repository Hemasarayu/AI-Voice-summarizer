import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FloatingBlobs from "@/components/FloatingBlobs";
import RecordButton from "@/components/RecordButton";
import UploadZone from "@/components/UploadZone";
import SummaryCard from "@/components/SummaryCard";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import VoiceBlob from "@/components/VoiceBlob";
import HistorySection from "@/components/HistorySection";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useRecordings } from "@/hooks/useRecordings";
import { toast } from "sonner";
import { Mic, AlertCircle, History, ChevronDown } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    permissionDenied,
  } = useAudioRecorder();

  const {
    recordings,
    loading: recordingsLoading,
    createRecording,
    updateRecording,
    deleteRecording,
  } = useRecordings();

  const [hasAudio, setHasAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("New Recording");

  // Check if audio is ready from recorder
  useEffect(() => {
    if (audioBlob && audioUrl && !isRecording) {
      setHasAudio(true);
      setFileName("New Recording");
      setRecordingTitle("New Recording");
    }
  }, [audioBlob, audioUrl, isRecording]);

  const handleRecordToggle = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setSummary(null);
      setCurrentRecordingId(null);
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleFileSelect = useCallback((file: File) => {
    resetRecording();
    setUploadedFile(file);
    setHasAudio(true);
    setFileName(file.name);
    setRecordingTitle(file.name.replace(/\.[^/.]+$/, ""));
    setSummary(null);
    setCurrentRecordingId(null);
    toast.success(`"${file.name}" uploaded! 🎵`);
  }, [resetRecording]);

  const handleSummarize = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to save and summarize recordings");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      // Save recording first
      let blobToSave = audioBlob;
      
      if (uploadedFile) {
        blobToSave = uploadedFile;
      }

      if (blobToSave) {
        const recording = await createRecording(
          blobToSave,
          recordingTitle,
          recordingTime || 0
        );

        if (recording) {
          setCurrentRecordingId(recording.id);
          
          // Simulate AI processing (replace with real AI later)
          setTimeout(async () => {
            const mockSummary =
              "This voice note discusses the importance of taking breaks during work. The speaker emphasizes the 'Pomodoro Technique' — working for 25 minutes followed by a 5-minute break. They mention that regular breaks improve focus, creativity, and overall productivity. Key takeaway: Don't underestimate the power of stepping away from your desk!";
            
            setSummary(mockSummary);
            await updateRecording(recording.id, { summary: mockSummary });
            setIsProcessing(false);
            toast.success("Summary ready! ✨");
          }, 2000);
        } else {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      setIsProcessing(false);
      toast.error("Failed to process recording");
    }
  }, [user, audioBlob, uploadedFile, recordingTitle, recordingTime, createRecording, updateRecording, navigate]);

  const handleReset = useCallback(() => {
    resetRecording();
    setHasAudio(false);
    setFileName(null);
    setUploadedFile(null);
    setSummary(null);
    setIsProcessing(false);
    setCurrentRecordingId(null);
    setRecordingTitle("New Recording");
  }, [resetRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <FloatingBlobs />

      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-4">
        <Header />

        <motion.main
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Permission denied warning */}
          {permissionDenied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">
                Microphone access denied. Please enable microphone permissions in your browser settings.
              </p>
            </motion.div>
          )}

          {/* Recording/Upload Section */}
          <motion.section
            className="p-6 md:p-8 rounded-[2rem] bg-card shadow-soft"
            layout
          >
            <AnimatePresence mode="wait">
              {!hasAudio ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Record button area */}
                  <div className="flex flex-col items-center">
                    <RecordButton
                      isRecording={isRecording}
                      onClick={handleRecordToggle}
                    />

                    <AnimatePresence>
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-6"
                        >
                          <WaveformVisualizer isActive={isRecording} />
                          <p className="text-center text-2xl font-semibold text-primary mt-2">
                            {formatTime(recordingTime)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Divider */}
                  {!isRecording && (
                    <motion.div
                      className="flex items-center gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-sm text-muted-foreground font-medium">
                        or
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </motion.div>
                  )}

                  {/* Upload zone */}
                  {!isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <UploadZone onFileSelect={handleFileSelect} />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Title input */}
                  <div className="flex items-center gap-4">
                    <VoiceBlob type="mic" isActive={false} />
                    <Input
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      className="flex-1 h-12 text-lg font-medium rounded-xl"
                      placeholder="Recording title"
                    />
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Remove
                    </Button>
                  </div>

                  {/* Audio player */}
                  {(audioUrl || uploadedFile) && (
                    <AudioPlayer
                      src={audioUrl || (uploadedFile ? URL.createObjectURL(uploadedFile) : "")}
                    />
                  )}

                  {/* Sign in prompt for non-authenticated users */}
                  {!user && !authLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Sign in to save your recording and get AI summaries
                      </p>
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="hero"
                      size="lg"
                      className="flex-1"
                      onClick={handleSummarize}
                      disabled={isProcessing || !!summary}
                    >
                      <VoiceBlob type="summary" className="!w-6 !h-6 !scale-50" />
                      {isProcessing ? "Summarizing..." : "Save & Summarize"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Summary Section */}
          <AnimatePresence>
            {(isProcessing || summary) && (
              <motion.section
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <SummaryCard summary={summary || ""} isLoading={isProcessing} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* History toggle button */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="soft"
                className="w-full justify-between"
                onClick={() => setShowHistory(!showHistory)}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Your Recording History
                </span>
                <motion.div animate={{ rotate: showHistory ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          )}

          {/* History Section */}
          <AnimatePresence>
            {user && showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HistorySection
                  recordings={recordings}
                  loading={recordingsLoading}
                  onDelete={deleteRecording}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature hints - only when not logged in */}
          {!hasAudio && !isRecording && !user && (
            <motion.section
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { type: "mic" as const, label: "Record" },
                { type: "upload" as const, label: "Upload" },
                { type: "summary" as const, label: "Summarize" },
              ].map((item, i) => (
                <motion.div
                  key={item.type}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <VoiceBlob type={item.type} className="!w-16 !h-16" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.section>
          )}
        </motion.main>

        {/* Footer */}
        <motion.footer
          className="text-center py-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-muted-foreground">
            Made with 💖 for voice note enthusiasts
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
