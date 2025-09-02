import React, { createContext, useContext } from "react";

export type FeedType = "all" | "posts" | "projects" | "aggregators";

interface FeedTypeContextProps {
  feedType: FeedType;
  setFeedType: (type: FeedType) => void;
}

export const FeedTypeContext = createContext<FeedTypeContextProps | undefined>(undefined);

export function useFeedType() {
  const ctx = useContext(FeedTypeContext);
  if (!ctx) throw new Error("useFeedType must be used within a FeedTypeProvider");
  return ctx;
}
