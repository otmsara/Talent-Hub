import React from "react";
import { useFeedType } from "./FeedTypeContext";

const FEED_TYPES = [
  { type: "all", label: "All" },
  { type: "posts", label: "Posts" },
  { type: "projects", label: "Projects" },
  { type: "aggregators", label: "News" },
] as const;

export default function FeedTypeToggle() {
  const { feedType, setFeedType } = useFeedType();

  return (
    <div className="inline-flex rounded-lg p-1">
      {FEED_TYPES.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => setFeedType(type)}
          className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all relative
            ${feedType === type
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          {label}
          {feedType === type && (
            <span
              className="absolute left-2 right-2 -bottom-1"
              style={{
                height: "1px",
                borderRadius: "1px",
                background:
                  "linear-gradient(90deg, rgba(0,255,255,0.25) 0%, rgba(0,212,255,0.35) 100%)",
                boxShadow:
                  "0 0 2px 0.5px rgba(0,255,255,0.12), 0 0 4px 1px rgba(0,212,255,0.08)",
                filter: "blur(0.1px)",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
