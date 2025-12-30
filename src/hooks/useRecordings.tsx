import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Recording {
  id: string;
  user_id: string;
  title: string;
  audio_url: string | null;
  duration_seconds: number | null;
  transcript: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export const useRecordings = () => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = useCallback(async () => {
    if (!user) {
      setRecordings([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const createRecording = async (
    audioBlob: Blob,
    title: string,
    durationSeconds: number
  ): Promise<Recording | null> => {
    if (!user) {
      toast.error('Please sign in to save recordings');
      return null;
    }

    try {
      // Upload audio to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('audio-recordings')
        .getPublicUrl(fileName);

      // Create recording entry
      const { data, error } = await supabase
        .from('recordings')
        .insert({
          user_id: user.id,
          title,
          audio_url: urlData.publicUrl,
          duration_seconds: durationSeconds,
        })
        .select()
        .single();

      if (error) throw error;

      setRecordings(prev => [data, ...prev]);
      toast.success('Recording saved!');
      return data;
    } catch (error) {
      console.error('Error creating recording:', error);
      toast.error('Failed to save recording');
      return null;
    }
  };

  const updateRecording = async (
    id: string,
    updates: Partial<Pick<Recording, 'title' | 'summary' | 'transcript'>>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('recordings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRecordings(prev =>
        prev.map(r => (r.id === id ? { ...r, ...updates } : r))
      );
      return true;
    } catch (error) {
      console.error('Error updating recording:', error);
      toast.error('Failed to update recording');
      return false;
    }
  };

  const deleteRecording = async (id: string): Promise<boolean> => {
    try {
      const recording = recordings.find(r => r.id === id);
      
      // Delete from storage if audio exists
      if (recording?.audio_url) {
        const urlParts = recording.audio_url.split('/');
        const filePath = urlParts.slice(-2).join('/');
        await supabase.storage.from('audio-recordings').remove([filePath]);
      }

      const { error } = await supabase
        .from('recordings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecordings(prev => prev.filter(r => r.id !== id));
      toast.success('Recording deleted');
      return true;
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
      return false;
    }
  };

  return {
    recordings,
    loading,
    fetchRecordings,
    createRecording,
    updateRecording,
    deleteRecording,
  };
};
