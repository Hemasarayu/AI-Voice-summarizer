import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recording } from '@/hooks/useRecordings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceBlob from './VoiceBlob';
import AudioPlayer from './AudioPlayer';
import { 
  Search, 
  Filter, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Clock,
  FileText,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HistorySectionProps {
  recordings: Recording[];
  loading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

type SortOption = 'newest' | 'oldest' | 'title';
type FilterOption = 'all' | 'with-summary' | 'without-summary';

const HistorySection = ({ recordings, loading, onDelete }: HistorySectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredAndSortedRecordings = useMemo(() => {
    let result = [...recordings];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.summary?.toLowerCase().includes(query) ||
          r.transcript?.toLowerCase().includes(query)
      );
    }

    // Apply filter
    if (filterBy === 'with-summary') {
      result = result.filter(r => r.summary);
    } else if (filterBy === 'without-summary') {
      result = result.filter(r => !r.summary);
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [recordings, searchQuery, sortBy, filterBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your recordings...</p>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Recordings</h2>
        <span className="text-sm text-muted-foreground">
          {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-32 h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
            <SelectTrigger className="w-40 h-10 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="with-summary">With Summary</SelectItem>
              <SelectItem value="without-summary">No Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recordings list */}
      {filteredAndSortedRecordings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <VoiceBlob type="mic" className="mx-auto !w-20 !h-20 mb-4 opacity-50" />
          <p className="text-muted-foreground">
            {searchQuery || filterBy !== 'all'
              ? 'No recordings match your search'
              : 'No recordings yet. Start by creating one!'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAndSortedRecordings.map((recording, index) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-2xl shadow-soft overflow-hidden"
              >
                {/* Recording header */}
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === recording.id ? null : recording.id)}
                >
                  <VoiceBlob
                    type={recording.summary ? 'summary' : 'mic'}
                    className="!w-12 !h-12 flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {recording.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(recording.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(recording.duration_seconds)}
                      </span>
                      {recording.summary && (
                        <span className="flex items-center gap-1 text-primary">
                          <FileText className="w-3 h-3" />
                          Summarized
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedId === recording.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedId === recording.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        {/* Audio player */}
                        {recording.audio_url && (
                          <AudioPlayer src={recording.audio_url} />
                        )}

                        {/* Summary */}
                        {recording.summary && (
                          <div className="bg-muted/50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              Summary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {recording.summary}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                disabled={deletingId === recording.id}
                              >
                                {deletingId === recording.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recording?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{recording.title}" and its summary.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(recording.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
};

export default HistorySection;
