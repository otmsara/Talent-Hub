import React, { useEffect, useState } from "react";

interface ExaChatbotProps {}

const exaDescriptions: Record<string, string> = {
  "Genesis.EXA": "Genesis.EXA: Project initialization and ideation agent.",
  "Coordinator.EXA": "Coordinator.EXA: Task and workflow management agent.",
  "Guide.EXA": "Guide.EXA: Guidance and mentorship agent.",
  "Summarizer.EXA": "Summarizer.EXA: Summarizes project activity and discussions.",
  "Seeker.EXA": "Seeker.EXA: Finds resources and information.",
  "Record.EXA": "Record.EXA: Maintains project records and logs.",
};

const ExaChatbot: React.FC<ExaChatbotProps> = () => {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      setAgent(custom.detail.exa);
      setOpen(true);
    };
    window.addEventListener("open-exa-chat", handler as EventListener);
    return () => window.removeEventListener("open-exa-chat", handler as EventListener);
  }, []);

  if (!open || !agent) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        width: 350,
        maxWidth: "90vw",
        background: "#0C112A",
        border: "1px solid #0891b2",
        borderRadius: 12,
        boxShadow: "0 4px 32px rgba(0,0,0,0.25)",
        padding: 16,
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <img
          src="/exa-logo.png"
          alt={agent + ' logo'}
          style={{ width: 28, height: 28, objectFit: 'contain', marginRight: 8 }}
        />
        <span style={{ fontWeight: 700, fontSize: 18 }}>{agent}</span>
        <button
          onClick={() => setOpen(false)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div style={{ fontSize: 14, marginBottom: 12 }}>
        {exaDescriptions[agent] || "Interact with this EXA agent."}
      </div>
      <div
        style={{
          background: "#1e293b",
          borderRadius: 8,
          padding: 8,
          minHeight: 80,
          marginBottom: 8,
        }}
      >
        <div style={{ color: "#a5f3fc", fontSize: 13 }}>
          [Chatbot UI placeholder for {agent}]
        </div>
      </div>
      <input
        type="text"
        placeholder={`Type a message to ${agent}...`}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #334155",
          background: "#0C112A",
          color: "#fff",
        }}
        disabled
      />
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
        (Chat functionality coming soon)
      </div>
    </div>
  );
};

export default ExaChatbot;
