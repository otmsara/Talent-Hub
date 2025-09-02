/**
 * Loads an audio file and resolves with its duration in seconds.
 * Works for remote URLs, data URLs, and Blob URLs.
 */
export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new window.Audio();
    audio.preload = "metadata";
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        resolve(audio.duration);
      } else {
        reject(new Error("Could not determine audio duration"));
      }
    });
    audio.addEventListener("error", (e) => {
      reject(new Error("Failed to load audio for duration"));
    });
  });
}
