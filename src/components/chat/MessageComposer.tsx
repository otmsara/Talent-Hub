
import React, { useState, useRef, KeyboardEvent } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, PaperclipIcon, Smile, Mic, X, StopCircle } from 'lucide-react';
import VoiceNotePlayer from '../ui/VoiceNotePlayer';

const EMOJIS = [
  "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊",
  "😋","😎","😍","😘","🥰","😗","😙","😚","🙂","🤗",
  "🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥",
  "😮","🤐","😯","😪","😫","🥱","😴","😌","😛","😜",
  "😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️"
];

const MessageComposer: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Real sound wave animation using Web Audio API
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(16).fill(12));
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const SoundWave: React.FC = () => (
    <div className="flex items-end gap-[2px] h-6">
      {waveHeights.map((h, i) => (
        <div
          key={i}
          className="w-[4px] rounded bg-white transition-all duration-75"
          style={{
            height: `${h}px`,
            minHeight: "4px",
            maxHeight: "24px",
          }}
        />
      ))}
    </div>
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, currentConversation } = useChat();

  const handleSend = () => {
    if (message.trim() && currentConversation) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newMessage =
        message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      // Move cursor after emoji
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + emoji.length;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      setMessage((prev) => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: handle file upload logic here (send or preview)
      console.log('Selected file:', file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Voice note logic
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Audio recording is not supported in this browser.');
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
      analyser.fftSize = 64;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      audioAnalyserRef.current = analyser;
      audioContextRef.current = audioContext;

      // Animate sound wave
      const animate = () => {
        if (!analyser) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        // Map frequency data to bar heights (normalize to 4-24px)
        const bars = Array.from({ length: 16 }, (_, i) => {
          const v = dataArray[i] || 0;
          return Math.max(4, Math.min(24, (v / 255) * 24));
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
      alert('Could not start audio recording.');
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
    if (audioBlob && audioUrl && currentConversation) {
      // Send the audio as a data URL
      sendMessage("", audioUrl);
      setAudioBlob(null);
      setAudioUrl(null);
      setAudioChunks([]);
    }
  };

  if (!currentConversation) {
    return null;
  }

  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2 items-center">
        {isRecording ? (
          <div className="flex items-center gap-3 bg-black/10 rounded-lg px-4 py-2 border border-border max-w-[380px] w-full">
            <SoundWave />
            <span className="text-white font-medium flex items-center gap-2 select-none" style={{ minWidth: 70 }}>
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
            >
              <StopCircle className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCancelRecording}
              aria-label="Cancel recording"
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
        ) : audioBlob && audioUrl ? (
          <div className="flex items-center gap-2 w-full">
            <VoiceNotePlayer audioUrl={audioUrl} />
            <Button
              onClick={handleSendVoiceNote}
              size="icon"
              aria-label="Send voice note"
            >
              <Send className="h-4 w-4" />
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
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              ref={textareaRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] max-h-[120px] resize-none"
            />
            <Button 
              onClick={handleSend}
              disabled={!message.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {!isRecording && !audioBlob && (
        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFileIconClick}
              aria-label="Attach file"
            >
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowEmojiPicker((v) => !v)}
                aria-label="Insert emoji"
              >
                <Smile className="h-4 w-4" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-10 bottom-10 left-0 bg-white border rounded shadow-lg p-2 w-64 max-h-60 overflow-y-auto grid grid-cols-8 gap-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-xl hover:bg-gray-100 rounded"
                      onClick={() => handleEmojiClick(emoji)}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleStartRecording}
              aria-label="Record voice note"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComposer;
