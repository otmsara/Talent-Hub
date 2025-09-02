import React, { useState } from "react";
import { Link } from "react-router-dom";
import { posts } from "@/data/dummyData";

// Dummy user data
const users = [
  {
    name: "Alice Johnson",
    username: "alicejohnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    username: "michaelchen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Patel",
    username: "priyapatel",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "David Kim",
    username: "davidkim",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Sofia Rossi",
    username: "sofiarossi",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Lucas Müller",
    username: "lucasmuller",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    name: "Emma Dubois",
    username: "emmadubois",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "Mateo García",
    username: "mateogarcia",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Hiroshi Tanaka",
    username: "hiroshitanaka",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  {
    name: "Fatima Zahra",
    username: "fatimazahra",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];

const trends = [
  { label: "#AI4Good", detail: "1,200 mentions" },
  { label: "Project Atlas", detail: "800 stars" },
  { label: "#Web3", detail: "650 mentions" },
  { label: "OpenAI GPT-5", detail: "540 discussions" },
  { label: "#ClimateTech", detail: "500 mentions" },
  { label: "Neural Canvas", detail: "420 stars" },
  { label: "#QuantumLeap", detail: "390 mentions" },
  { label: "BioGenX", detail: "350 stars" },
  { label: "#RemoteWork", detail: "320 mentions" },
  { label: "Project Aurora", detail: "300 stars" },
];

const trendingTopics = trends.filter(t => t.label.startsWith("#")).slice(0, 4);
const trendingProjects = trends.filter(t => !t.label.startsWith("#")).slice(0, 4);

import { useNetwork } from "@/contexts/NetworkContext";

function UserRecommendations() {
  const { networked, setNetworked } = useNetwork();

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow border border-border p-3 mb-4">
      <h3 className="text-lg font-semibold text-foreground mb-1">Want to grow your network?</h3>
      <p className="text-sm text-muted-foreground mb-2">People you may want to connect with:</p>
      <div className="space-y-2">
        {users.slice(0, 3).map((user) => {
          const isNetworked = !!networked[user.username];
          return (
            <Link
              to={`/profile/${user.username}`}
              key={user.username}
              className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 group hover:bg-cyan-400/20 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.5)] rounded-lg px-2 py-1 transition"
              style={{ textDecoration: "none" }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div>
                <div className="font-medium text-foreground group-hover:underline">{user.name}</div>
                <div className="text-xs text-muted-foreground">@{user.username}</div>
              </div>
              <button
                type="button"
                aria-label={isNetworked ? "Networking" : "Add to network"}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200
                  ${isNetworked
                    ? "bg-cyan-400/30 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]"
                    : "bg-transparent hover:bg-cyan-400/10"}
                  w-full sm:w-8 sm:mt-0 mt-2`}
                tabIndex={-1}
                onClick={e => {
                  e.preventDefault();
                  setNetworked(user.username, !isNetworked);
                }}
              >
                {isNetworked ? (
                  // Checkmark icon (white, neon effect, no circle)
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M5.5 9.5L8 12L12.5 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"/>
                    <defs>
                      <filter id="glow" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                  </svg>
                ) : (
                  // Plus icon (cyan, neon effect, no circle)
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 6.5V11.5M6.5 9H11.5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" filter="url(#glow)"/>
                    <defs>
                      <filter id="glow" x="0" y="0" width="18" height="18" filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                  </svg>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TrendingTopics() {
  // Helper to count mentions for a topic
  const getMentionsCount = (topicLabel: string) => {
    const normalized = topicLabel.replace(/^#/, "").toLowerCase();
    return posts.filter(
      post =>
        post.text.toLowerCase().includes(`#${normalized}`) ||
        post.text.toLowerCase().includes(normalized)
    ).length;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow border border-border p-5 mb-4">
      <h3 className="text-lg font-semibold text-foreground mb-2">Trending topics</h3>
      <ul className="space-y-2">
        {trendingTopics.map((trend, idx) => (
<li key={idx} className="group rounded-lg transition hover:bg-cyan-400/20 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.5)] px-2 -mx-2 py-1">
<Link
  to={`/search/${encodeURIComponent(trend.label.replace(/^#/, ""))}`}
  className="text-white/60 hover:underline transition"
  style={{ cursor: "pointer" }}
>
  {trend.label}
</Link>
<span className="ml-2 text-xs text-white/40">
  {getMentionsCount(trend.label)} mentions
</span>
</li>
        ))}
      </ul>
    </div>
  );
}

function TrendingProjects() {
  // Helper to find project post and collaborator count
  const getProjectPost = (projectLabel: string) => {
    // Normalize: remove all non-alphanumeric, lowercase, no spaces
    const normalize = (str: string) =>
      str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const labelNorm = normalize(projectLabel);
    return posts.find(
      post =>
        post.isProject &&
        normalize(post.text).includes(labelNorm)
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow border border-border p-5">
      <h3 className="text-lg font-semibold text-foreground mb-2">Trending projects</h3>
      <ul className="space-y-2">
        {trendingProjects.map((trend, idx) => {
          const projectPost = getProjectPost(trend.label);
          const collaboratorCount = projectPost?.collaborators?.length ?? 0;
          return (
<li key={idx} className="group rounded-lg transition hover:bg-cyan-400/20 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.5)] px-2 -mx-2 py-1">
  {projectPost ? (
<Link
  to={`/post/${projectPost.id}`}
  className="text-white/60 hover:underline transition"
  style={{ cursor: "pointer" }}
>
  {projectPost.name || trend.label}
</Link>
  ) : (
<span className="text-white/60 transition">{trend.label}</span>
  )}
<span className="ml-2 text-xs text-white/40">
  {collaboratorCount} collaborator{collaboratorCount === 1 ? "" : "s"}
</span>
</li>
          );
        })}
      </ul>
    </div>
  );
}

export default function RightSidebar() {
  return (
    <aside className="hidden md:flex flex-col pt-2 w-full min-w-0 flex-shrink max-w-xs sm:max-w-sm md:max-w-[260px] lg:max-w-[220px] xl:max-w-[320px]">
      <div className="w-full min-w-0">
        <UserRecommendations />
      </div>
      <div className="w-full min-w-0">
        <TrendingTopics />
      </div>
      <div className="w-full min-w-0">
        <TrendingProjects />
      </div>
    </aside>
  );
}
