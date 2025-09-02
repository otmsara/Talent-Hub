
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useAccount } from '../../contexts/AccountContext';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Mic, X, StopCircle, Send } from 'lucide-react';
import VoiceNotePlayer from '../ui/VoiceNotePlayer';

interface CommentFormProps {
  postId: string;
  onCommentSubmit: (comment: string | { audioUrl: string }) => void;
  parentCommentId?: string;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentSubmit, parentCommentId, placeholder }) => {
  const { currentUser } = useAccount();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice note state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Real sound wave animation using Web Audio API
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(12).fill(10));
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const SoundWave: React.FC = () => (
    <div className="flex items-end gap-[1.5px] h-5">
      {waveHeights.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded bg-white transition-all duration-75"
          style={{
            height: `${h}px`,
            minHeight: "3px",
            maxHeight: "20px",
          }}
        />
      ))}
    </div>
  );

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Audio recording is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const localChunks: Blob[] = [];
      const recorder = new window.MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);

      // Setup Web Audio API for real sound wave
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      audioAnalyserRef.current = analyser;
      audioContextRef.current = audioContext;

      // Animate sound wave
      const animate = () => {
        if (!analyser) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        // Map frequency data to bar heights (normalize to 3-20px)
        const bars = Array.from({ length: 12 }, (_, i) => {
          const v = dataArray[i] || 0;
          return Math.max(3, Math.min(20, (v / 255) * 20));
        });
        setWaveHeights(bars);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          localChunks.push(e.data);
        }
      };
      recorder.onstop = async () => {
        const blob = new Blob(localChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        // Create a data URL for playback and sending
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        if (recordingInterval.current) {
          clearInterval(recordingInterval.current);
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        audioAnalyserRef.current = null;
      };
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      recordingInterval.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      toast.error('Could not start audio recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      audioAnalyserRef.current = null;
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setAudioChunks([]);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      audioAnalyserRef.current = null;
    }
  };

  const handleSendVoiceNote = () => {
    if (audioBlob && audioUrl) {
      setIsSubmitting(true);
      setTimeout(() => {
        onCommentSubmit({ audioUrl });
        setAudioBlob(null);
        setAudioUrl(null);
        setAudioChunks([]);
        setIsSubmitting(false);
        toast.success("Voice note posted successfully");
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onCommentSubmit(comment);
      setComment('');
      setIsSubmitting(false);
      toast.success("Comment posted successfully");
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 pt-3 border-t border-border/30"
      onClick={e => e.stopPropagation()}
      onFocus={e => e.stopPropagation()}
    >
      <div className="flex items-start gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {isRecording ? (
            <div className="flex items-center gap-3 bg-black/10 rounded-lg px-3 py-1.5 border border-border max-w-[320px] w-full">
              <SoundWave />
              <span className="text-white font-medium flex items-center gap-2 select-none" style={{ minWidth: 60 }}>
                <StopCircle className="h-5 w-5 mr-1 text-white" />
                Recording
                <span className="ml-2 font-mono text-xs text-white/80">
                  {`${String(Math.floor(recordingTime / 60)).padStart(2, "0")}:${String(recordingTime % 60).padStart(2, "0")}`}
                </span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStopRecording}
                aria-label="Stop recording"
                type="button"
              >
                <StopCircle className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCancelRecording}
                aria-label="Cancel recording"
                type="button"
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
          ) : audioBlob && audioUrl ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1">
                <VoiceNotePlayer audioUrl={audioUrl} />
              </div>
              <Button
                onClick={handleSendVoiceNote}
                size="sm"
                aria-label="Send voice note"
                disabled={isSubmitting}
                type="button"
                className="ml-2"
              >
                {isSubmitting ? "Sending..." : "Send Voice"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setAudioChunks([]);
                }}
                aria-label="Discard voice note"
                type="button"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={placeholder ? placeholder : (parentCommentId ? "Reply to this comment..." : "Add a comment...")}
                className="w-full p-2 text-sm bg-secondary/20 border border-border/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                rows={1}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStartRecording}
                aria-label="Record voice note"
                type="button"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          )}
          {!isRecording && !audioBlob && (
            <div className="flex justify-end mt-2">
              <Button 
                type="submit" 
                variant="secondary" 
                size="sm" 
                disabled={!comment.trim() || isSubmitting}
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
              >
                {isSubmitting ? 'Posting...' : parentCommentId ? 'Reply' : 'Post Comment'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
