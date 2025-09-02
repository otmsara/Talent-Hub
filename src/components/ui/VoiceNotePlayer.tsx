import React from 'react';
import { Play, Pause } from 'lucide-react';
import SoundWaveProgress from './SoundWaveProgress';
import { decodeAudioWaveform } from '../../lib/decodeAudioWaveform';

export const VoiceNotePlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
  if (!audioUrl) return null;
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState<number>(0);
  const [waveform, setWaveform] = React.useState<number[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Decode audio for duration and waveform on mount/audioUrl change
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setWaveform(null);
    setDuration(0);
    if (!audioUrl) return;
    decodeAudioWaveform(audioUrl, 12)
      .then(({ duration, waveform }) => {
        if (!cancelled) {
          setDuration(duration);
          setWaveform(waveform);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError("Audio could not be loaded or is in an unsupported format.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  // Audio element events for playback/progress
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

  // Reset progress and playing state when audioUrl changes
  React.useEffect(() => {
    setProgress(0);
    setPlaying(false);
  }, [audioUrl]);

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        setError("Audio could not be played.");
        setPlaying(false);
      });
      setPlaying(true);
    }
  };

  const formatTime = (s: number) =>
    isNaN(s) ? "00:00" : `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // Progress for sound wave (0 to 1)
  const waveProgress = duration > 0 ? progress / duration : 0;

  return (
    <div
      className="flex items-center gap-3 bg-black/10 rounded-lg px-3 py-1.5 border border-border max-w-[320px] w-full mt-1"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="h-8 w-8 flex items-center justify-center"
        onClick={handlePlayPause}
        aria-label={playing ? "Pause" : "Play"}
        type="button"
        tabIndex={0}
        disabled={!!error || loading}
      >
        {playing ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
      </button>
      {loading ? (
        <div className="flex items-end gap-[1.5px] h-5 min-w-[48px] max-w-[120px]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 12,
                borderRadius: 2,
                background: "rgba(59,205,218,0.15)",
                animation: "pulse 1.2s infinite ease-in-out",
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <SoundWaveProgress progress={waveProgress} barHeights={waveform || undefined} />
      )}
      <span className="ml-2 font-mono text-xs text-white/80" style={{ minWidth: 48, textAlign: "right" }}>
        {formatTime(progress)} / {duration && Number.isFinite(duration) && duration > 0 ? formatTime(duration) : "00:00"}
      </span>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      {error && (
        <span className="ml-2 text-xs text-red-400">{error}</span>
      )}
    </div>
  );
};

export default VoiceNotePlayer;
