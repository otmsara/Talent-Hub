import React from "react";

interface SoundWaveProgressProps {
  progress: number; // 0 to 1
  barHeights?: number[]; // Optional, default to 12 bars
  highlightColor?: string;
  baseColor?: string;
}

const DEFAULT_BARS = [10, 16, 8, 20, 14, 18, 12, 22, 9, 17, 13, 19];

export const SoundWaveProgress: React.FC<SoundWaveProgressProps> = ({
  progress,
  barHeights = DEFAULT_BARS,
  highlightColor = "#3BCDDA",
  baseColor = "rgba(59,205,218,0.25)",
}) => {
  const barsToHighlight = Math.round(progress * barHeights.length);

  return (
    <div className="flex items-end gap-[1.5px] h-5 select-none" style={{ minWidth: 48, maxWidth: 120 }}>
      {barHeights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 2,
            background: i < barsToHighlight ? highlightColor : baseColor,
            transition: "background 0.2s, height 0.2s",
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveProgress;
