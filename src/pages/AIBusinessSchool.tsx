import React, { useState, useRef } from "react";

const initialFolders = [
  { id: 1, name: "New Business" },
];

const TABS = [
  "Profile Setup",
  "Idea Generation",
  "Virtual C-Suite",
  "Advanced Tools",
  "Dashboard",
];

const RISK_OPTIONS = [
  { label: "Conservative", value: "conservative" },
  { label: "Moderate", value: "moderate" },
  { label: "Aggressive", value: "aggressive" },
];

const EXPERIENCE_OPTIONS = [
  { label: "First-time entrepreneur", value: "first-time" },
  { label: "Some business experience", value: "some" },
  { label: "Serial entrepreneur", value: "serial" },
];

// Simple static chat messages for mockup
const CHAT_MESSAGES = [
  {
    from: "exa",
    text: "Hi! I'm Profile.EXA. Tell me about yourself and I'll help you get started.",
    time: "09:00",
  },
  {
    from: "user",
    text: "I'm interested in launching a fintech startup.",
    time: "09:01",
  },
  {
    from: "exa",
    text: "That's exciting! What skills or experience do you bring to the table?",
    time: "09:01",
  },
];

// Idea Generation Data
const IDEA_LIST = [
  {
    id: 1,
    icon: "🔥",
    title: "EnergyWise AI",
    subtitle: "Optimize your energy trades with AI precision",
    description:
      "A platform that leverages AI and machine learning to provide real-time analytics and predictive insights for energy trading. It helps traders make data-driven decisions by analyzing market trends and forecasting price movements.",
    targetMarket: "Independent energy traders, hedge funds, and trading firms.",
    marketOpportunity:
      "Rising demand for AI-driven solutions in the energy sector to improve trading accuracy and efficiency.",
    revenueModel: "Subscription fees for access to premium features and analytics.",
    edge: "Advanced AI algorithms specifically tailored for energy markets, providing superior predictive accuracy.",
    aiScores: {
      overall: "8.5/10 🔥",
      market: "8/10",
      skills: "9/10",
      scalability: "9/10",
      innovation: "8/10",
    },
    metrics: {
      risk: "High due to reliance on AI accuracy and market volatility.",
      capital: "$0 to $10,000",
      time: "6 months",
    },
    date: "June 21, 2025",
    highlight: true,
  },
  {
    id: 2,
    icon: "⭐",
    title: "GreenTrade Connect",
    subtitle: "Connecting sustainable energy trades worldwide",
    description:
      "A peer-to-peer platform that facilitates the trading of renewable energy credits and carbon offsets using blockchain technology, ensuring transparency and security in transactions.",
    targetMarket: "Businesses looking to offset carbon footprints, renewable energy producers.",
    marketOpportunity:
      "Growing emphasis on sustainability and the need for transparent carbon trading solutions.",
    revenueModel: "Transaction fees for each trade executed on the platform.",
    edge: "Use of blockchain for secure, transparent transactions and a focus on renewable energy credits.",
    aiScores: {
      overall: "7.5/10 ⭐",
      market: "7/10",
      skills: "8/10",
      scalability: "8/10",
      innovation: "7/10",
    },
    metrics: {
      risk: "Medium due to regulatory dependencies and technology adoption rates.",
      capital: "$0 to $15,000",
      time: "8 months",
    },
    date: "June 21, 2025",
    highlight: false,
  },
  {
    id: 3,
    icon: "⭐",
    title: "TradeBoost ML",
    subtitle: "Machine learning insights for smarter trades",
    description:
      "An app that provides personalized machine learning insights and automated trading signals for individual energy traders, enhancing decision-making processes.",
    targetMarket: "Individual traders, small trading firms.",
    marketOpportunity:
      "Increasing adoption of machine learning in financial markets, particularly in niche sectors like energy trading.",
    revenueModel: "Freemium model with paid premium features offering advanced insights.",
    edge: "User-friendly interface with customizable trading signals powered by machine learning.",
    aiScores: {
      overall: "7.0/10 ⭐",
      market: "6/10",
      skills: "9/10",
      scalability: "7/10",
      innovation: "6/10",
    },
    metrics: {
      risk: "Medium due to market competition and technology dependency.",
      capital: "$0 to $5,000",
      time: "4 months",
    },
    date: "June 21, 2025",
    highlight: false,
  },
  {
    id: 4,
    icon: "⭐",
    title: "EcoEnergy Network",
    subtitle: "Empowering communities through shared energy resources",
    description:
      "A platform that enables communities to create virtual energy networks, facilitating peer-to-peer energy trading and consumption optimization using IoT devices and data analytics.",
    targetMarket: "Residential communities, local governments, eco-conscious consumers.",
    marketOpportunity:
      "The trend towards decentralized energy systems and community-driven sustainability initiatives.",
    revenueModel: "Service fees from community network setups and ongoing management fees.",
    edge: "Focus on community empowerment and sustainable energy practices with easy-to-use tech solutions.",
    aiScores: {
      overall: "7.8/10 ⭐",
      market: "8/10",
      skills: "7/10",
      scalability: "8/10",
      innovation: "8/10",
    },
    metrics: {
      risk: "High due to infrastructure requirements and community adoption challenges.",
      capital: "$0 to $20,000",
      time: "12 months",
    },
    date: "June 21, 2025",
    highlight: false,
  },
  {
    id: 5,
    icon: "🔥",
    title: "SmartGrid Insights",
    subtitle: "Intelligent analytics for smarter grid management",
    description:
      "A B2B SaaS offering that provides utilities with advanced analytics and predictive maintenance insights for grid management using AI-driven models.",
    targetMarket: "Utility companies, smart grid operators.",
    marketOpportunity:
      "Utilities are increasingly seeking AI solutions to optimize grid operations and reduce downtime.",
    revenueModel: "Tiered subscription plans based on the size of the utility company.",
    edge: "Specialized AI models designed specifically for grid management challenges, offering actionable insights.",
    aiScores: {
      overall: "8.8/10 🔥",
      market: "9/10",
      skills: "8/10",
      scalability: "9/10",
      innovation: "9/10",
    },
    metrics: {
      risk: "High due to market entry barriers and long sales cycles in the utility sector.",
      capital: "$0 to $25,000",
      time: "10 months",
    },
    date: "June 21, 2025",
    highlight: true,
  },
];

const IDEA_CHAT_MESSAGES = [
  {
    from: "exa",
    text: "Hello! I'm idea_generation.EXA. Ready to brainstorm your next big business idea?",
    time: "09:10",
  },
  {
    from: "user",
    text: "Show me some AI-powered business ideas for the energy sector.",
    time: "09:11",
  },
  {
    from: "exa",
    text: "Here are some top opportunities based on current market analysis.",
    time: "09:11",
  },
];

const AIBusinessSchool: React.FC = () => {
  const [folders, setFolders] = useState(initialFolders);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profile, setProfile] = useState({
    about: "",
    skills: "",
    interests: "",
    risk: "",
    budget: "",
    experience: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Idea Generation state
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [savedIdea, setSavedIdea] = useState<number | null>(null);

  // Virtual C-Suite executive tab state
  const [selectedExecutive, setSelectedExecutive] = useState("cto");

  // Focus input when editing
  React.useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditBlur = () => {
    if (editingId !== null) {
      setFolders(folders =>
        folders.map(f =>
          f.id === editingId ? { ...f, name: editValue.trim() || "New Business" } : f
        )
      );
      setEditingId(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditBlur();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleAddFolder = () => {
    const nextId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1;
    setFolders([...folders, { id: nextId, name: "New Business" }]);
    setTimeout(() => {
      setEditingId(nextId);
      setEditValue("New Business");
    }, 0);
  };

  const handleDeleteFolder = (id: number) => {
    if (folders.length === 1) return; // Prevent deleting last folder
    setFolders(folders => folders.filter(f => f.id !== id));
    if (editingId === id) setEditingId(null);
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const handleFolderClick = (id: number) => {
    setSelectedFolderId(id);
    setActiveTab(0);
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Idea Generation handlers
  const handleIdeaSelect = (id: number) => {
    setSelectedIdea(id);
  };
  const handleIdeaSave = () => {
    if (selectedIdea !== null) setSavedIdea(selectedIdea);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-2 md:px-8 flex flex-col gap-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 drop-shadow mb-4">
          Welcome to our AI Business school,
        </h1>
        <p className="text-xl md:text-2xl text-cyan-100 font-medium">
          where we teach you business by helping you launch a real business.
        </p>
      </div>
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Start a New Business</h2>
        {selectedFolderId === null ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative flex flex-col items-center justify-center bg-background/60 border border-cyan-400/30 rounded-2xl shadow-lg p-8 transition hover:bg-cyan-400/10 hover:shadow-cyan-400/30 focus:outline-none cursor-pointer"
                  style={{ minHeight: 180 }}
                  tabIndex={-1}
                  onClick={() => handleFolderClick(folder.id)}
                >
                  {/* Delete button */}
                  {folders.length > 1 && (
                    <button
                      className="absolute top-4 left-4 text-red-400 opacity-60 hover:opacity-100 transition p-1 rounded-full hover:bg-red-400/10"
                      title="Delete folder"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      tabIndex={0}
                      aria-label="Delete folder"
                      type="button"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M6.5 7.5v6m3-6v6m3-6v6M3 5.5h14M8.5 3.5h3A1.5 1.5 0 0 1 13 5v0h-6v0a1.5 1.5 0 0 1 1.5-1.5Z"
                          stroke="#f87171"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                  <span className="absolute top-4 right-4 text-cyan-400 opacity-60 group-hover:opacity-100 transition">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        fill="#10162a"
                      />
                      <path
                        d="M3 7.5V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v.5"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="8"
                        y="13"
                        width="8"
                        height="2"
                        rx="1"
                        fill="#22d3ee"
                        opacity="0.7"
                      />
                    </svg>
                  </span>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mb-4"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="12"
                      rx="2"
                      fill="#181f3a"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 7V5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5V7"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="flex items-center gap-2 w-full justify-center">
                    {editingId === folder.id ? (
                      <input
                        ref={inputRef}
                        className="text-lg font-semibold text-cyan-200 group-hover:text-cyan-300 transition bg-transparent border-b border-cyan-400 outline-none px-1 w-36 text-center"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        onKeyDown={handleEditKeyDown}
                        maxLength={32}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <span className="text-lg font-semibold text-cyan-200 group-hover:text-cyan-300 transition select-none">
                          {folder.name}
                        </span>
                        <span
                          className="ml-2 text-cyan-400 opacity-70 hover:opacity-100 cursor-pointer"
                          title="Rename"
                          tabIndex={0}
                          onClick={e => {
                            e.stopPropagation();
                            handleEdit(folder.id, folder.name);
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleEdit(folder.id, folder.name);
                            }
                          }}
                          role="button"
                          aria-label="Rename folder"
                        >
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.25 8.25a2 2 0 0 1-.878.513l-3.25.93.93-3.25a2 2 0 0 1 .513-.878l8.25-8.25Z"
                              stroke="#22d3ee"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-cyan-100 mt-2 opacity-80">
                    Click to start your journey
                  </span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-cyan-400/20 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.2)] hover:bg-cyan-400/30 transition focus:outline-none"
              onClick={handleAddFolder}
              type="button"
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#22d3ee" strokeWidth="1.5" fill="#181f3a" />
                <path d="M10 6v8M6 10h8" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Start another business
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full flex items-center justify-between mb-6">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-muted/30 text-cyan-200 hover:bg-muted/50 transition"
                onClick={() => setSelectedFolderId(null)}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 16l-5-6 5-6" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
              <div className="text-2xl font-bold text-cyan-200">{selectedFolder?.name}</div>
              <div style={{ width: 80 }} /> {/* Spacer for symmetry */}
            </div>
            {/* Elegant Tabs */}
            <div className="w-full flex justify-center">
              <div className="flex flex-col md:flex-row bg-background/60 border border-cyan-400/20 rounded-xl md:rounded-full shadow px-0 md:px-2 py-1 gap-2 w-full max-w-full">
                {TABS.map((tab, idx) => (
                  <button
                    key={tab}
                    className={`w-full md:w-auto px-0 md:px-6 py-2 rounded-xl md:rounded-full font-semibold transition text-base ${
                      activeTab === idx
                        ? "bg-cyan-400/30 text-cyan-100 shadow-[0_0_8px_2px_rgba(34,211,238,0.3)]"
                        : "text-cyan-200 hover:bg-cyan-400/10"
                    }`}
                    onClick={() => setActiveTab(idx)}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab Content */}
            <div className="w-full mt-8 bg-background/70 border border-cyan-400/10 rounded-2xl shadow-lg p-0 min-h-[350px] flex flex-col gap-0 md:flex-row md:gap-x-8">
              {activeTab === 0 ? (
                <>
                  {/* Profile Form */}
                  <form
                    className="w-full md:w-1/2 p-8 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-cyan-400/10"
                    onSubmit={e => {
                      e.preventDefault();
                      setProfileSaved(true);
                    }}
                  >
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Tell us about yourself
                      </label>
                      <textarea
                        className="w-full rounded-lg bg-background/80 border border-cyan-400/20 text-cyan-100 p-3 focus:outline-none focus:border-cyan-400 transition"
                        rows={3}
                        name="about"
                        value={profile.about}
                        onChange={handleProfileChange}
                        placeholder="Share a brief bio..."
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Your Skills & Experience
                      </label>
                      <input
                        className="w-full rounded-lg bg-background/80 border border-cyan-400/20 text-cyan-100 p-3 focus:outline-none focus:border-cyan-400 transition"
                        name="skills"
                        value={profile.skills}
                        onChange={handleProfileChange}
                        placeholder="e.g., Python programming, digital marketing, sales..."
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Your Interests & Passions
                      </label>
                      <input
                        className="w-full rounded-lg bg-background/80 border border-cyan-400/20 text-cyan-100 p-3 focus:outline-none focus:border-cyan-400 transition"
                        name="interests"
                        value={profile.interests}
                        onChange={handleProfileChange}
                        placeholder="e.g., sustainability, education, healthcare, fintech..."
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Risk Tolerance
                      </label>
                      <div className="flex gap-4">
                        {RISK_OPTIONS.map(opt => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border border-cyan-400/20 ${
                              profile.risk === opt.value
                                ? "bg-cyan-400/20 border-cyan-400 text-cyan-100"
                                : "bg-background/80 text-cyan-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="risk"
                              value={opt.value}
                              checked={profile.risk === opt.value}
                              onChange={handleProfileChange}
                              className="accent-cyan-400"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Available Budget
                      </label>
                      <input
                        className="w-full rounded-lg bg-background/80 border border-cyan-400/20 text-cyan-100 p-3 focus:outline-none focus:border-cyan-400 transition"
                        name="budget"
                        value={profile.budget}
                        onChange={handleProfileChange}
                        placeholder="e.g., $10,000 - $50,000"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-200 font-semibold mb-2">
                        Business Experience
                      </label>
                      <div className="flex gap-4 flex-wrap">
                        {EXPERIENCE_OPTIONS.map(opt => (
                          <label
                            key={opt.value}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border border-cyan-400/20 ${
                              profile.experience === opt.value
                                ? "bg-cyan-400/20 border-cyan-400 text-cyan-100"
                                : "bg-background/80 text-cyan-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="experience"
                              value={opt.value}
                              checked={profile.experience === opt.value}
                              onChange={handleProfileChange}
                              className="accent-cyan-400"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 w-full md:w-auto self-end px-8 py-3 rounded-full font-semibold bg-cyan-400/80 text-cyan-950 shadow hover:bg-cyan-300 transition focus:outline-none"
                    >
                      Save
                    </button>
                    {profileSaved && (
                      <div className="mt-6 flex items-center gap-2 text-cyan-300 font-semibold text-base">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="9" fill="#22d3ee" fillOpacity="0.2" />
                          <path d="M6 10.5l3 3 5-5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Entries are currently saved
                      </div>
                    )}
                  </form>
                  {/* Chatbot */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-cyan-200 font-semibold text-lg">
                      <img src="/exa-logo.png" alt="EXA Logo" className="w-7 h-7 rounded-full bg-cyan-900" />
                      Profile.EXA
                    </div>
                    <div className="flex-1 min-h-[250px] bg-background/80 border border-cyan-400/20 rounded-lg shadow flex flex-col overflow-hidden">
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {CHAT_MESSAGES.map((msg, idx) =>
                          msg.from === "exa" ? (
                            <div key={idx} className="flex items-start gap-2">
                              <img src="/exa-logo.png" alt="EXA" className="w-7 h-7 rounded-full bg-cyan-900" />
                              <div>
                                <div className="bg-cyan-900/60 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                  {msg.text}
                                </div>
                                <div className="text-xs text-cyan-400 mt-1 ml-1">{msg.time}</div>
                              </div>
                            </div>
                          ) : (
                            <div key={idx} className="flex items-end gap-2 justify-end">
                              <div>
                                <div className="bg-cyan-400/30 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                  {msg.text}
                                </div>
                                <div className="text-xs text-cyan-400 mt-1 text-right">{msg.time}</div>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center text-cyan-950 font-bold">U</div>
                            </div>
                          )
                        )}
                      </div>
                      {/* Chat input (disabled) */}
                      <div className="border-t border-cyan-400/10 p-2 flex items-center gap-2 bg-background/90">
                        <input
                          type="text"
                          className="flex-1 rounded-full bg-background/70 border border-cyan-400/20 text-cyan-100 px-4 py-2 focus:outline-none"
                          placeholder="Type a message..."
                          disabled
                        />
                        <button
                          className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-100 font-semibold shadow hover:bg-cyan-400/50 transition"
                          disabled
                          type="button"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : activeTab === 1 ? (
                <>
                  {/* Idea Generation Split Layout */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-cyan-400/10">
                    <div className="mb-2 text-cyan-200 font-semibold text-lg flex items-center gap-2">
                      <span role="img" aria-label="rocket">🚀</span>
                      Your AI-Generated Business Portfolio
                    </div>
                    <div className="text-cyan-400 text-sm mb-4">
                      Generated on June 21, 2025 based on current market analysis
                    </div>
                    <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2">
                      {IDEA_LIST.map(idea => (
                        <div
                          key={idea.id}
                          className={`rounded-2xl border-2 p-4 transition cursor-pointer relative ${
                            savedIdea === idea.id
                              ? "border-cyan-400 bg-cyan-400/10 shadow-cyan-400/20"
                              : selectedIdea === idea.id
                              ? "border-cyan-300 bg-cyan-400/5 shadow-cyan-400/10"
                              : "border-cyan-400/20 bg-background/80 hover:border-cyan-400/60"
                          }`}
                          onClick={() => handleIdeaSelect(idea.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{idea.icon}</span>
                            <span className="text-lg font-bold text-cyan-100">{idea.title}</span>
                            {idea.highlight && (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-semibold">Top Pick</span>
                            )}
                            {savedIdea === idea.id && (
                              <span className="ml-2 flex items-center gap-1 text-cyan-300 text-xs font-semibold">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                  <circle cx="10" cy="10" r="9" fill="#22d3ee" fillOpacity="0.2" />
                                  <path d="M6 10.5l3 3 5-5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Saved
                              </span>
                            )}
                          </div>
                          <div className="text-cyan-200 font-medium mb-1">{idea.subtitle}</div>
                          <div className="text-cyan-100 text-sm mb-2">{idea.description}</div>
                          <div className="text-cyan-300 text-xs mb-1">
                            <b>🎯 Target Market:</b> {idea.targetMarket}
                          </div>
                          <div className="text-cyan-300 text-xs mb-1">
                            <b>💡 Market Opportunity:</b> {idea.marketOpportunity}
                          </div>
                          <div className="text-cyan-300 text-xs mb-1">
                            <b>💰 Revenue Model:</b> {idea.revenueModel}
                          </div>
                          <div className="text-cyan-300 text-xs mb-1">
                            <b>🏆 Competitive Edge:</b> {idea.edge}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-cyan-200 mt-2">
                            <span>📊 <b>AI Analysis Scores:</b></span>
                            <span>Overall: {idea.aiScores.overall}</span>
                            <span>Market: {idea.aiScores.market}</span>
                            <span>Skills Match: {idea.aiScores.skills}</span>
                            <span>Scalability: {idea.aiScores.scalability}</span>
                            <span>Innovation: {idea.aiScores.innovation}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-cyan-200 mt-1">
                            <span>📈 <b>Business Metrics:</b></span>
                            <span>Risk Level: {idea.metrics.risk}</span>
                            <span>Capital Required: {idea.metrics.capital}</span>
                            <span>Time to Market: {idea.metrics.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        className="px-8 py-3 rounded-full font-semibold bg-cyan-400/80 text-cyan-950 shadow hover:bg-cyan-300 transition focus:outline-none"
                        onClick={handleIdeaSave}
                        disabled={selectedIdea === null}
                        type="button"
                      >
                        Save Selection
                      </button>
                      {savedIdea !== null && (
                        <div className="flex items-center gap-2 text-cyan-300 font-semibold text-base">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="9" fill="#22d3ee" fillOpacity="0.2" />
                            <path d="M6 10.5l3 3 5-5" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Idea saved
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Chatbot */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-cyan-200 font-semibold text-lg">
                      <img src="/exa-logo.png" alt="EXA Logo" className="w-7 h-7 rounded-full bg-cyan-900" />
                      idea_generation.EXA
                    </div>
                    <div className="flex-1 min-h-[250px] bg-background/80 border border-cyan-400/20 rounded-lg shadow flex flex-col overflow-hidden">
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {IDEA_CHAT_MESSAGES.map((msg, idx) =>
                          msg.from === "exa" ? (
                            <div key={idx} className="flex items-start gap-2">
                              <img src="/exa-logo.png" alt="EXA" className="w-7 h-7 rounded-full bg-cyan-900" />
                              <div>
                                <div className="bg-cyan-900/60 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                  {msg.text}
                                </div>
                                <div className="text-xs text-cyan-400 mt-1 ml-1">{msg.time}</div>
                              </div>
                            </div>
                          ) : (
                            <div key={idx} className="flex items-end gap-2 justify-end">
                              <div>
                                <div className="bg-cyan-400/30 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                  {msg.text}
                                </div>
                                <div className="text-xs text-cyan-400 mt-1 text-right">{msg.time}</div>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center text-cyan-950 font-bold">U</div>
                            </div>
                          )
                        )}
                      </div>
                      {/* Chat input (disabled) */}
                      <div className="border-t border-cyan-400/10 p-2 flex items-center gap-2 bg-background/90">
                        <input
                          type="text"
                          className="flex-1 rounded-full bg-background/70 border border-cyan-400/20 text-cyan-100 px-4 py-2 focus:outline-none"
                          placeholder="Type a message..."
                          disabled
                        />
                        <button
                          className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-100 font-semibold shadow hover:bg-cyan-400/50 transition"
                          disabled
                          type="button"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : activeTab === 2 ? (
                // Virtual C-Suite Tab
                <>
                  {/* Left: Executive Tabs and Strategy Content */}
                  <div className="w-full md:w-1/2 p-0 md:p-8 flex flex-col md:flex-row gap-0 md:gap-6 border-b md:border-b-0 md:border-r border-cyan-400/10">
                    {/* Executive Tabs */}
                    <div className="flex flex-col w-full md:w-40 md:mr-0 border-b md:border-b-0 md:border-r border-cyan-400/10">
                      {[
                        { key: "cto", label: "💻 CTO", desc: "Technical Strategy" },
                        { key: "cmo", label: "📢 CMO", desc: "Marketing Strategy" },
                        { key: "cfo", label: "💰 CFO", desc: "Financial Planning" },
                        { key: "legal", label: "⚖️ Legal", desc: "Corporate Structure" },
                        { key: "hr", label: "👥 HR", desc: "People Strategy" },
                        { key: "sales", label: "💼 Sales", desc: "Revenue Strategy" },
                      ].map((exec, idx) => (
                        <button
                          key={exec.key}
                          className={`w-full px-4 py-3 md:py-2 md:px-2 text-left font-semibold text-base border-b md:border-b-0 md:border-r-0 border-cyan-400/10 transition
                            ${selectedExecutive === exec.key
                              ? "bg-cyan-400/20 text-cyan-100"
                              : "text-cyan-300 hover:bg-cyan-400/10"
                            }`}
                          style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
                          onClick={() => setSelectedExecutive(exec.key)}
                          type="button"
                        >
                          <span className="mr-2">{exec.label}</span>
                          <span className="text-xs text-cyan-400">{exec.desc}</span>
                        </button>
                      ))}
                    </div>
                    {/* Strategy Content */}
                    <div className="flex-1 p-6 md:p-0 overflow-y-auto">
                      <div className="text-cyan-200 font-semibold text-lg mb-2">
                        {(() => {
                          switch (selectedExecutive) {
                            case "cto":
                              return "💻 CTO: Technical Strategy";
                            case "cmo":
                              return "📢 CMO: Marketing Strategy";
                            case "cfo":
                              return "💰 CFO: Financial Planning";
                            case "legal":
                              return "⚖️ Legal: Corporate Structure";
                            case "hr":
                              return "👥 HR: People Strategy";
                            case "sales":
                              return "💼 Sales: Revenue Strategy";
                            default:
                              return "";
                          }
                        })()}
                      </div>
                      <div className="text-cyan-100 text-sm whitespace-pre-line max-h-[500px] overflow-y-auto pr-2">
                        {(() => {
                          switch (selectedExecutive) {
                            case "cto":
                              return `👨‍💻 CTO Bot's Technical Implementation Plan: Enhanced with real-time tech talent market research

1. TECHNOLOGY STACK RECOMMENDATIONS
Frontend Technologies
React.js: Popular for building interactive user interfaces with a strong ecosystem and community support.
Tailwind CSS: Offers utility-first CSS framework for rapid UI development, saving time on design and styling.
Backend Architecture and Database Choices
Node.js with Express.js: Suitable for building scalable network applications, and offers real-time capabilities.
PostgreSQL: An open-source relational database known for its reliability, robustness, and performance.
Cloud Infrastructure Recommendations
AWS Free Tier: Utilize AWS Free Tier services like EC2, RDS, and Lambda to minimize initial costs.
AWS Lambda: For executing backend services without server management, reducing infrastructure costs.
Third-party Integrations and APIs
Alpha Vantage or Quandl: For financial market data APIs that can be integrated for real-time analytics.
Auth0: For authentication and authorization to secure user access.
Development Tools and DevOps Pipeline
GitHub: Source code repository and version control.
GitHub Actions: For CI/CD pipelines to automate testing and deployment.
Docker: To containerize applications ensuring consistent environments across development and production.
2. TEAM BUILDING STRATEGY
Critical Technical Hires and Timeline
Phase 1 (Months 1-3): Hire a Full-stack Developer and a Data Scientist.
Phase 2 (Months 4-6): Hire a DevOps Engineer to set up automated pipelines and infrastructure.
Skill Requirements Based on Market Availability
Full-stack Developer: Proficiency in React.js, Node.js, and PostgreSQL.
Data Scientist: Expertise in machine learning models specific to financial forecasting.
DevOps Engineer: Experience with AWS, Docker, and CI/CD tools.
Compensation Benchmarks
Based on current trends, competitive salaries should be in the range of $60,000 to $80,000 annually for remote or part-time hires.
Recruitment Strategy
Leverage platforms like LinkedIn and GitHub Jobs to attract talent.
Use freelance platforms such as Upwork for short-term needs to remain within budget constraints.
3. MVP DEVELOPMENT ROADMAP
Phase 1: Core Features (Must-Have for Launch)
Real-time data visualization dashboards.
Basic predictive analytics for energy price forecasting.
User authentication and subscription management.
Estimated Timeline: 3 months

Phase 2: Enhanced Features (Nice-to-Have)
Advanced analytics with historical data comparison.
Custom alerts for market changes.
Integration with additional data sources.
Estimated Timeline: 3 months

Phase 3: Scale Features (For Growth)
Machine learning model improvements based on user feedback.
Mobile application for on-the-go access.
Scalability enhancements for increased user base.
Estimated Timeline: 3 months

4. TECHNICAL ARCHITECTURE
System Architecture Diagram Description
Frontend communicates with the backend through RESTful APIs.
Backend processes data using Node.js, stores it in PostgreSQL, and uses AWS Lambda for compute-heavy tasks.
Data Flow and User Journey Mapping
Users log in via the frontend, authenticate through Auth0, request data which the backend fetches from third-party APIs, processes it, and returns insights displayed on the frontend.
Scalability Considerations
Design microservices architecture with stateless components to easily scale horizontally.
Performance Optimization Strategies
Use caching mechanisms like Redis to reduce database load.
Implement load balancers to manage traffic efficiently.
5. SECURITY & COMPLIANCE
Data Protection and Privacy Measures
Encrypt all sensitive data in transit (TLS) and at rest (AES).
Security Best Practices Implementation
Regular security audits and penetration testing.
Compliance Requirements
Ensure compliance with GDPR by anonymizing personal data and CCPA by providing data transparency options.
Risk Mitigation Strategies
Develop a disaster recovery plan including regular backups and failover strategies.
6. DEVELOPMENT RESOURCES & MARKET INSIGHTS
Team Composition Based on Market Availability
Leverage remote work opportunities to access a global talent pool without geographical constraints.
Estimated Development Costs
Estimated at $8,000 to $10,000 for initial development considering hiring freelancers for specific tasks.
Timeline Milestones
Set bi-weekly sprint reviews to ensure alignment with MVP roadmap.
Critical Technical Decisions and Trade-offs
Opting for AWS may increase future costs but offers scalability benefits critical for growth.
7. TECHNOLOGY RISKS & MITIGATION
Potential Technical Challenges
Handling real-time data efficiently without latency issues.
Market Technology Trends to Consider
Increased adoption of AI-driven analytics platforms in financial sectors.
Backup Plans and Alternatives
Use alternative cloud providers like GCP or Azure if AWS becomes cost-prohibitive.
Talent Acquisition Risks
With limited budget, prioritize hiring versatile developers who can wear multiple hats during the startup phase.
`;
                            case "cmo":
                              return `📢 CMO Bot's Go-to-Market Strategy: Enhanced with marketing talent market insights

1. TARGET CUSTOMER ANALYSIS
Customer Personas
Independent Energy Trader:
Demographics: Age 30-45, predominantly male, bachelor's degree in finance or related field.
Psychographics: Risk-tolerant, data-driven, tech-savvy, high-income potential.
Pain Points: Need for accurate market predictions, time constraints in analyzing data, desire for competitive edge.
Hedge Fund Analyst:
Demographics: Age 25-40, advanced degree in finance or economics.
Psychographics: Detail-oriented, strategic thinker, focuses on long-term gains.
Pain Points: Requires reliable predictive tools to justify investment decisions, needs seamless integration with existing systems.
Trading Firm Executive:
Demographics: Age 35-55, extensive industry experience.
Psychographics: Decision-maker, focused on ROI, interested in innovation.
Pain Points: Needs to ensure firm’s trading strategies are cutting-edge and risk-managed.
Customer Journey Mapping
Awareness: Engage through targeted digital advertising and thought leadership articles.
Consideration: Free webinars and demos showcasing predictive accuracy.
Decision: Personalized consultations and case studies demonstrating ROI.
Retention: Regular updates on new features and exclusive insights.
Market Segmentation Strategy
Focus on traders with a minimum monthly trading volume of $1M+.
Segment by firm size (small independent vs. large hedge fund) to tailor communication.
Customer Lifetime Value Estimates
Estimated CLV per trader: $15,000 over three years based on subscription fees and potential upsells.
2. MARKETING TEAM STRATEGY
Essential Marketing Hires and Timeline
Immediate (0-3 months): Growth Marketing Specialist (focus on digital channels)
Mid-Term (3-6 months): Content Strategist (focus on thought leadership)
Long-Term (6-12 months): Customer Success Manager (focus on retention)
Skills Assessment
Prioritize skills in data analytics, performance marketing, content creation, and CRM systems.
Compensation Planning
With limited budget, offer equity or performance-based bonuses to attract top talent.
Recruitment Strategy
Use platforms like LinkedIn and niche job boards; consider freelance talent for specific projects to save costs.
3. BRAND POSITIONING & MESSAGING
Unique Value Proposition Refinement
"Empowering energy traders with unparalleled predictive insights for smarter, faster decisions."

Brand Personality and Voice
Professional yet innovative, authoritative but approachable.
Key Messaging Pillars
Predictive Accuracy
Real-time Analytics
Competitive Edge
Competitive Differentiation Strategy
Emphasize the platform's AI algorithms specifically tailored for energy markets as a unique selling point.

4. DIGITAL MARKETING STRATEGY
Primary Acquisition Channels
LinkedIn Ads: Target professionals and decision-makers in the energy sector.
Google Ads: Focus on keyword targeting around energy trading tools.
Content Marketing Plan
Publish whitepapers on market trends and case studies of successful trades using EnergyWise AI.
Social Media Strategy
Engage with industry influencers on Twitter; share insights and updates regularly.
SEO/SEM Recommendations
Optimize for keywords like "energy trading analytics," "AI trading tools," and "predictive energy markets."
Email Marketing Automation
Set up drip campaigns for lead nurturing with personalized content based on trading interests.
5. LAUNCH STRATEGY
Pre-launch Buzz Building (90 Days Before)
Host a series of webinars featuring industry experts discussing AI in energy trading.
Launch Week Execution Plan
Offer exclusive early access trials to top prospects; launch a PR campaign targeting industry publications.
Post-launch Growth Tactics
Implement a referral program offering discounts or free months for referrals that convert.
Milestone-based Marketing Calendar
Set quarterly goals for lead generation, conversions, and brand awareness activities.
6. CUSTOMER ACQUISITION
Cost per Acquisition Targets by Channel
Aim for CPA below $300 via digital channels by optimizing ad spend and targeting.
Conversion Funnel Optimization
A/B test landing pages and CTAs; use clear, value-driven messaging.
Referral and Viral Growth Strategies
Develop a referral program incentivizing current users to bring peers onto the platform.
Partnership and Collaboration Opportunities
Collaborate with fintech companies for co-branded events or content sharing.
7. BUDGET ALLOCATION & TEAM COSTS
Marketing Spend Breakdown by Channel
Allocate 40% to digital ads, 20% to content production, 20% to events/webinars, 20% for contingency/testing.
Team Salary Costs Based on Market Research
Assume $50/hour for freelance specialists, considering project-based hiring initially.
Expected ROI for Each Channel
Target a 3:1 return on ad spend through carefully optimized campaigns.
Testing and Optimization Budget
Reserve 10% of total budget for ongoing testing of ads and landing pages.
Performance Tracking KPIs
Focus on lead conversion rates, cost per lead, and customer acquisition cost.
8. GROWTH HACKING TACTICS
Creative, Low-Cost Acquisition Strategies
Leverage LinkedIn groups and Reddit communities to share valuable insights without direct selling.
Viral Mechanics and Network Effects
Introduce social sharing features within the platform for users to share insights directly to their networks.
Community Building Approaches
Create an exclusive online community where traders can exchange insights and strategies using EnergyWise AI analytics.
Influencer and Partnership Strategies
Engage with micro-influencers in the trading space for authentic reviews and testimonials.
By aligning your marketing strategy with these insights and tactics, EnergyWise AI can effectively penetrate the market with a limited budget while maximizing reach and influence.
`;
                            case "cfo":
                              return "💰 CFO Bot's Financial Model & Business Plan: Enhanced with financial talent market benchmarks\n\n[Financial planning content coming soon...]";
                            case "legal":
                              return "⚖️ Legal Bot's Corporate & Compliance Strategy: Enhanced with legal services market data\n\n[Corporate structure content coming soon...]";
                            case "hr":
                              return "👥 HR Bot's People & Culture Strategy: Enhanced with HR talent market intelligence\n\n[People strategy content coming soon...]";
                            case "sales":
                              return "💼 Sales Bot's Revenue Strategy: Enhanced with sales market insights\n\n[Revenue strategy content coming soon...]";
                            default:
                              return "";
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  {/* Right: Executive Chatbot */}
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-cyan-200 font-semibold text-lg">
                      <img src="/exa-logo.png" alt="EXA Logo" className="w-7 h-7 rounded-full bg-cyan-900" />
                      <select
                        className="bg-background/80 border border-cyan-400/20 text-cyan-100 rounded-full px-3 py-1 font-semibold focus:outline-none"
                        value={selectedExecutive}
                        onChange={e => setSelectedExecutive(e.target.value)}
                        style={{ minWidth: 120 }}
                      >
                        <option value="cto">CTO.EXA</option>
                        <option value="cmo">CMO.EXA</option>
                        <option value="cfo">CFO.EXA</option>
                        <option value="legal">Legal.EXA</option>
                        <option value="hr">HR.EXA</option>
                        <option value="sales">Sales.EXA</option>
                      </select>
                    </div>
                    <div className="flex-1 min-h-[250px] bg-background/80 border border-cyan-400/20 rounded-lg shadow flex flex-col overflow-hidden">
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {(() => {
                          // Example chat messages for each executive
                          const chatMap = {
                            cto: [
                              { from: "exa", text: "Hi, I'm CTO.EXA. Ask me about your technical roadmap!", time: "10:00" },
                              { from: "user", text: "What tech stack should I use?", time: "10:01" },
                              { from: "exa", text: "React.js and Node.js are a great start for scalable apps.", time: "10:01" },
                            ],
                            cmo: [
                              { from: "exa", text: "Hi, I'm CMO.EXA. Ready to discuss your go-to-market plan?", time: "10:00" },
                              { from: "user", text: "How do I reach energy traders?", time: "10:01" },
                              { from: "exa", text: "LinkedIn Ads and webinars are effective for this audience.", time: "10:01" },
                            ],
                            cfo: [
                              { from: "exa", text: "Hi, I'm CFO.EXA. Let's talk financial planning.", time: "10:00" },
                              { from: "user", text: "How much capital do I need?", time: "10:01" },
                              { from: "exa", text: "An initial $50,000 covers salaries, marketing, and tech.", time: "10:01" },
                            ],
                            legal: [
                              { from: "exa", text: "Hi, I'm Legal.EXA. Ask me about compliance and structure.", time: "10:00" },
                              { from: "user", text: "Where should I incorporate?", time: "10:01" },
                              { from: "exa", text: "Delaware is preferred for tech startups.", time: "10:01" },
                            ],
                            hr: [
                              { from: "exa", text: "Hi, I'm HR.EXA. Let's build your team and culture.", time: "10:00" },
                              { from: "user", text: "Who should I hire first?", time: "10:01" },
                              { from: "exa", text: "Start with a CTO, Product Manager, and Software Engineer.", time: "10:01" },
                            ],
                            sales: [
                              { from: "exa", text: "Hi, I'm Sales.EXA. Ready to boost your revenue?", time: "10:00" },
                              { from: "user", text: "How do I get my first customers?", time: "10:01" },
                              { from: "exa", text: "Leverage your network and offer early adopter incentives.", time: "10:01" },
                            ],
                          };
                          const chat = chatMap[selectedExecutive] || [];
                          return chat.map((msg, idx) =>
                            msg.from === "exa" ? (
                              <div key={idx} className="flex items-start gap-2">
                                <img src="/exa-logo.png" alt="EXA" className="w-7 h-7 rounded-full bg-cyan-900" />
                                <div>
                                  <div className="bg-cyan-900/60 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                    {msg.text}
                                  </div>
                                  <div className="text-xs text-cyan-400 mt-1 ml-1">{msg.time}</div>
                                </div>
                              </div>
                            ) : (
                              <div key={idx} className="flex items-end gap-2 justify-end">
                                <div>
                                  <div className="bg-cyan-400/30 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                    {msg.text}
                                  </div>
                                  <div className="text-xs text-cyan-400 mt-1 text-right">{msg.time}</div>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center text-cyan-950 font-bold">U</div>
                              </div>
                            )
                          );
                        })()}
                      </div>
                      {/* Chat input (disabled) */}
                      <div className="border-t border-cyan-400/10 p-2 flex items-center gap-2 bg-background/90">
                        <input
                          type="text"
                          className="flex-1 rounded-full bg-background/70 border border-cyan-400/20 text-cyan-100 px-4 py-2 focus:outline-none"
                          placeholder="Type a message..."
                          disabled
                        />
                        <button
                          className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-100 font-semibold shadow hover:bg-cyan-400/50 transition"
                          disabled
                          type="button"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : activeTab === 3 ? (
                // Advanced Tools Tab
                <>
                  {/* Split Layout */}
                  <div className="w-full flex flex-col md:flex-row gap-0 md:gap-x-8">
                    {/* Left: Business Intelligence & Research Tools */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-cyan-400/10">
                      <div className="mb-2 text-cyan-200 font-semibold text-lg flex items-center gap-2">
                        <span role="img" aria-label="rocket">🚀</span>
                        Business Intelligence & Research Tools
                      </div>
                      <div className="text-cyan-400 text-sm mb-4">
                        Advanced features for comprehensive business planning and competitive analysis enhanced with Deep Research API
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📊</span>
                          <span className="font-semibold text-cyan-100">Market Intelligence</span>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-2 pl-6 py-2 px-4 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-100 font-semibold transition border border-cyan-400/20 shadow-sm focus:outline-none"
                          style={{ width: "fit-content" }}
                        >
                          <span className="text-lg">🔍</span>
                          Get Market Research Report
                        </button>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xl">📋</span>
                          <span className="font-semibold text-cyan-100">Business Planning</span>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-2 pl-6 py-2 px-4 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-100 font-semibold transition border border-cyan-400/20 shadow-sm focus:outline-none"
                          style={{ width: "fit-content" }}
                        >
                          <span className="text-lg">📋</span>
                          Generate Executive Business Plan
                        </button>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xl">📁</span>
                          <span className="font-semibold text-cyan-100">Data Export & Integration</span>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-2 pl-6 py-2 px-4 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-100 font-semibold transition border border-cyan-400/20 shadow-sm focus:outline-none"
                          style={{ width: "fit-content" }}
                        >
                          <span className="text-lg">📁</span>
                          Export Business Data
                        </button>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xl">🔬</span>
                          <span className="font-semibold text-cyan-100">Deep Research Integration</span>
                        </div>
                        <div className="pl-6 text-cyan-100 text-sm">
                          <span className="font-semibold text-cyan-300">✅ All 7 agents enhanced with Deep Research API:</span>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><b>💻 CTO Bot</b> → Software engineer & DevOps market research</li>
                            <li><b>📢 CMO Bot</b> → Marketing talent & growth specialist insights</li>
                            <li><b>💰 CFO Bot</b> → Financial analyst & operations manager data</li>
                            <li><b>⚖️ Legal Bot</b> → Legal counsel & compliance officer market</li>
                            <li><b>👥 HR Bot</b> → HR manager & recruiter market intelligence</li>
                            <li><b>💼 Sales Bot</b> → Sales manager & biz dev market research</li>
                            <li><b>📊 Market Research</b> → Competitive analysis and market sizing</li>
                          </ul>
                        </div>
                        <div className="pl-6 text-cyan-200 text-xs mt-2">
                          Each agent automatically pulls relevant market data to enhance their strategic recommendations with real-time insights.
                        </div>
                      </div>
                    </div>
                    {/* Right: DeepSearch.EXA Chatbot */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col">
                      <div className="flex items-center gap-2 mb-2 text-cyan-200 font-semibold text-lg">
                        <img src="/exa-logo.png" alt="EXA Logo" className="w-7 h-7 rounded-full bg-cyan-900" />
                        DeepSearch.EXA
                      </div>
                      <div className="flex-1 min-h-[250px] bg-background/80 border border-cyan-400/20 rounded-lg shadow flex flex-col overflow-hidden">
                        {/* Chat messages (static example) */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                          <div className="flex items-start gap-2">
                            <img src="/exa-logo.png" alt="EXA" className="w-7 h-7 rounded-full bg-cyan-900" />
                            <div>
                              <div className="bg-cyan-900/60 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                Hi! I'm DeepSearch.EXA. Ask me for market research, business plans, or competitive analysis.
                              </div>
                              <div className="text-xs text-cyan-400 mt-1 ml-1">11:00</div>
                            </div>
                          </div>
                          <div className="flex items-end gap-2 justify-end">
                            <div>
                              <div className="bg-cyan-400/30 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                Generate a market research report for AI in energy trading.
                              </div>
                              <div className="text-xs text-cyan-400 mt-1 text-right">11:01</div>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-cyan-400 flex items-center justify-center text-cyan-950 font-bold">U</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <img src="/exa-logo.png" alt="EXA" className="w-7 h-7 rounded-full bg-cyan-900" />
                            <div>
                              <div className="bg-cyan-900/60 text-cyan-100 rounded-xl px-4 py-2 shadow">
                                Here is a summary of the latest market trends, key competitors, and growth projections for AI in energy trading...
                              </div>
                              <div className="text-xs text-cyan-400 mt-1 ml-1">11:01</div>
                            </div>
                          </div>
                        </div>
                        {/* Chat input (disabled) */}
                        <div className="border-t border-cyan-400/10 p-2 flex items-center gap-2 bg-background/90">
                          <input
                            type="text"
                            className="flex-1 rounded-full bg-background/70 border border-cyan-400/20 text-cyan-100 px-4 py-2 focus:outline-none"
                            placeholder="Type a message..."
                            disabled
                          />
                          <button
                            className="px-4 py-2 rounded-full bg-cyan-400/30 text-cyan-100 font-semibold shadow hover:bg-cyan-400/50 transition"
                            disabled
                            type="button"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : activeTab === 4 ? (
                // Dashboard Tab
                <div className="w-full flex flex-col gap-8 p-8">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2 flex items-center gap-3">
                    <span role="img" aria-label="command">🧭</span>
                    Your Complete Business Strategy Command Center
                  </div>
                  {/* Step-by-Step Process */}
                  <div className="bg-background/80 border border-cyan-400/20 rounded-2xl shadow p-6 flex flex-col gap-4">
                    <div className="text-xl font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                      <span role="img" aria-label="target">🎯</span>
                      Step-by-Step Process
                    </div>
                    <ol className="list-decimal pl-6 text-cyan-100 space-y-2">
                      <li><span className="font-semibold">👤 Profile Setup</span> <span className="text-cyan-300">→ Complete entrepreneur assessment</span></li>
                      <li><span className="font-semibold">💡 Idea Generation</span> <span className="text-cyan-300">→ AI creates 5 tailored concepts</span></li>
                      <li><span className="font-semibold">🎯 Selection</span> <span className="text-cyan-300">→ Choose your winning business idea</span></li>
                      <li><span className="font-semibold">🤖 C-Suite Consultation</span> <span className="text-cyan-300">→ Get expert guidance from 7 AI specialists</span></li>
                      <li><span className="font-semibold">📊 Advanced Analysis</span> <span className="text-cyan-300">→ Market research and business planning</span></li>
                      <li><span className="font-semibold">📁 Export & Execute</span> <span className="text-cyan-300">→ Download data and start building</span></li>
                    </ol>
                  </div>
                  {/* Virtual Executive Team */}
                  <div className="bg-background/80 border border-cyan-400/20 rounded-2xl shadow p-6 flex flex-col gap-4">
                    <div className="text-xl font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                      <span role="img" aria-label="robot">🤖</span>
                      Your Virtual Executive Team
                    </div>
                    <div className="text-cyan-300 text-sm mb-2 flex items-center gap-2">
                      <span role="img" aria-label="microscope">🔬</span>
                      Enhanced with Deep Research API Integration:
                    </div>
                    <ul className="list-none pl-0 text-cyan-100 space-y-1">
                      <li><b>💻 CTO Bot:</b> Real-time tech talent market data + architecture guidance</li>
                      <li><b>📢 CMO Bot:</b> Marketing talent insights + growth strategy</li>
                      <li><b>💰 CFO Bot:</b> Financial talent benchmarks + business modeling</li>
                      <li><b>⚖️ Legal Bot:</b> Legal service costs + compliance framework</li>
                      <li><b>👥 HR Bot:</b> HR talent market + organizational design</li>
                      <li><b>💼 Sales Bot:</b> Sales talent data + revenue strategy</li>
                      <li><b>📊 Market Research:</b> Competitive intelligence + market sizing</li>
                    </ul>
                  </div>
                  {/* Platform Capabilities */}
                  <div className="bg-background/80 border border-cyan-400/20 rounded-2xl shadow p-6 flex flex-col gap-4">
                    <div className="text-xl font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                      <span role="img" aria-label="rocket">🚀</span>
                      Platform Capabilities
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="text-cyan-300 font-semibold mb-1 flex items-center gap-2">
                          <span role="img" aria-label="check">✅</span>
                          Currently Available:
                        </div>
                        <ul className="list-disc pl-6 text-cyan-100 space-y-1">
                          <li>AI-powered business idea generation</li>
                          <li>7 specialized AI business consultants enhanced with market data</li>
                          <li>Real-time talent market research integration</li>
                          <li>Comprehensive strategic planning with competitive intelligence</li>
                          <li>Market research and competitive analysis</li>
                          <li>Executive business plan generation</li>
                          <li>Structured data export for integration</li>
                        </ul>
                      </div>
                      <div className="flex-1">
                        <div className="text-cyan-300 font-semibold mb-1 flex items-center gap-2">
                          <span role="img" aria-label="crystal-ball">🔮</span>
                          Coming Soon:
                        </div>
                        <ul className="list-disc pl-6 text-cyan-100 space-y-1">
                          <li>Real-time KPI tracking - Monitor startup metrics</li>
                          <li>AI-powered iteration - Smart pivot recommendations</li>
                          <li>Market validation tools - Landing page generators</li>
                          <li>Investor matching - Connect with funding sources</li>
                          <li>MVP prototyping - Auto-generate from technical specs</li>
                          <li>Live competitive intel - Real-time market monitoring</li>
                          <li>Success benchmarking - Compare against similar startups</li>
                          <li>Automated workflows - Task management and execution</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Success Formula */}
                  <div className="bg-background/80 border border-cyan-400/20 rounded-2xl shadow p-6 flex flex-col gap-2">
                    <div className="text-xl font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                      <span role="img" aria-label="bulb">💡</span>
                      Success Formula
                    </div>
                    <div className="text-cyan-100 text-lg font-bold">
                      Profile + Ideas + Selection + Enhanced C-Suite + Market Data = Startup Success
                    </div>
                  </div>
                  {/* Quick Start Guide */}
                  <div className="bg-background/80 border border-cyan-400/20 rounded-2xl shadow p-6 flex flex-col gap-4">
                    <div className="text-xl font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                      <span role="img" aria-label="target">🎯</span>
                      Quick Start Guide
                    </div>
                    <div className="text-cyan-300 font-semibold mb-1">For First-Time Entrepreneurs:</div>
                    <ul className="list-disc pl-6 text-cyan-100 space-y-1 mb-2">
                      <li>Start with Profile Setup → Focus on your genuine skills and interests</li>
                      <li>Review all 5 generated ideas → Look for high Skills Match scores</li>
                      <li>Consult HR Bot first → Understand team building requirements with market data</li>
                      <li>Then Legal Bot → Establish proper business structure with cost insights</li>
                    </ul>
                    <div className="text-cyan-300 font-semibold mb-1">For Experienced Entrepreneurs:</div>
                    <ul className="list-disc pl-6 text-cyan-100 space-y-1 mb-2">
                      <li>Complete Profile → Emphasize your business experience</li>
                      <li>Look for high Innovation Score ideas → Leverage your experience advantage</li>
                      <li>Start with CFO Bot → Focus on financial modeling with market benchmarks</li>
                      <li>Then CTO/CMO Bots → Optimize for market entry speed with talent insights</li>
                    </ul>
                    <div className="text-cyan-300 font-semibold mb-1">For Technical Founders:</div>
                    <ul className="list-disc pl-6 text-cyan-100 space-y-1 mb-2">
                      <li>Highlight programming/technical skills in Profile</li>
                      <li>Focus on AI/SaaS/Tech-enabled ideas from generation</li>
                      <li>Start with CTO Bot → Validate technical architecture with market data</li>
                      <li>Prioritize CMO Bot → Address typical tech founder weak spots with market insights</li>
                    </ul>
                    <div className="text-cyan-200 font-medium mt-2">
                      💡 <b>Pro Tip:</b> Each AI agent builds upon insights from others and incorporates real-time market data from your Deep Research API - the more agents you consult, the more comprehensive and market-validated your business strategy becomes.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center text-cyan-100 text-xl font-medium min-h-[200px]">
                  {TABS[activeTab]} coming soon...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBusinessSchool;
