/**
 * Fetches and decodes an audio file, returning its duration and a sampled waveform.
 * @param url The audio file URL
 * @param bars Number of bars to sample for the waveform (default 12)
 * @returns {Promise<{ duration: number, waveform: number[] }>}
 */
export async function decodeAudioWaveform(
  url: string,
  bars: number = 12
): Promise<{ duration: number; waveform: number[] }> {
  // Fetch audio as ArrayBuffer
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch audio");
  const arrayBuffer = await response.arrayBuffer();

  // Decode audio data
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Get duration
  const duration = audioBuffer.duration;

  // Sample waveform: take the first channel, divide into N bars, get RMS for each
  const channelData = audioBuffer.getChannelData(0);
  const samplesPerBar = Math.floor(channelData.length / bars);
  const waveform: number[] = [];
  for (let i = 0; i < bars; i++) {
    let sum = 0;
    let start = i * samplesPerBar;
    let end = Math.min(start + samplesPerBar, channelData.length);
    for (let j = start; j < end; j++) {
      sum += channelData[j] * channelData[j];
    }
    const rms = Math.sqrt(sum / (end - start));
    // Scale RMS to a reasonable bar height (8-24px)
    waveform.push(8 + rms * 32);
  }

  audioCtx.close();
  return { duration, waveform };
}
