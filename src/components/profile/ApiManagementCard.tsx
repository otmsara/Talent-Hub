import React, { useState, useRef } from "react";
import { Button } from "../ui/button";

// Mock agent names
const AGENTS = [
  "Arya α1 Chat Agent",
  "Job Matching Engine Agent",
  "DeepSearch Agent",
  "CompanySearch Agent",
  "Interview Preparation Agent",
  "Resume Builder Agent",
  "Cover Letter Agent",
  "Analytics Agent",
  "Career Intelligence Agent",
  "Project-Based Recruitment Agents",
];

// Mock API usage data (time series, per agent)
const mockUsage = AGENTS.map((agent, idx) => ({
  agent,
  data: Array.from({ length: 30 }, (_, i) => ({
    date: `2025-06-${(i + 1).toString().padStart(2, "0")}`,
    count: Math.max(0, Math.floor(Math.random() * 30 + 5 - idx * 2 + Math.sin(i / 3) * 10)),
  })),
}));

// Calculate total usage per day
const totalUsage = mockUsage[0].data.map((_, i) => ({
  date: mockUsage[0].data[i].date,
  count: mockUsage.reduce((sum, agent) => sum + agent.data[i].count, 0),
}));

// Mock API billing history
const mockApiBilling = [
  { id: "api-001", date: "2025-05-01", amount: "$12.00", status: "Paid", url: "#" },
  { id: "api-002", date: "2025-06-01", amount: "$18.00", status: "Paid", url: "#" },
  { id: "api-003", date: "2025-07-01", amount: "$9.00", status: "Paid", url: "#" },
];

// Helper to mask API key
function maskKey(key: string) {
  if (!key) return "";
  return key.slice(0, 4) + "••••••••••••" + key.slice(-4);
}

// Color palette for agents
const AGENT_COLORS = [
  "#06b6d4", // cyan
  "#f59e42", // orange
  "#a3e635", // lime
  "#22d3ee", // sky
  "#38bdf8", // blue
  "#818cf8", // indigo
  "#f472b6", // pink
  "#a78bfa", // purple
  "#fbbf24", // yellow
  "#f472b6", // pink (repeat for 10th)
];
const TOTAL_COLOR = "#fffbe0"; // gold/white for total

const CHART_HEIGHT = 160;
const PADDING = 32;
const VIEWBOX_WIDTH = 720;
const VIEWBOX_HEIGHT = CHART_HEIGHT;

const ApiManagementCard: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  // Chart agent toggles, plus total
  const [visibleAgents, setVisibleAgents] = useState(() =>
    ({
      "Total Usage": true,
      ...AGENTS.reduce((acc, agent) => ({ ...acc, [agent]: true }), {}),
    })
  );

  // Hover state for chart
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Simulate API key actions
  const handleGenerate = () => setApiKey("sk-live-1234abcd5678efgh");
  const handleRevoke = () => setApiKey(null);
  const handleRegenerate = () => setApiKey("sk-live-8765wxyz4321lmno");

  // Chart data
  const days = mockUsage[0].data.length;
  const xStep = (VIEWBOX_WIDTH - 2 * PADDING) / (days - 1);

  // Find max Y for scaling (include total if visible)
  const maxY = Math.max(
    ...mockUsage.flatMap(agent =>
      visibleAgents[agent.agent] ? agent.data.map(d => d.count) : [0]
    ),
    visibleAgents["Total Usage"] ? totalUsage.map(d => d.count).reduce((a, b) => Math.max(a, b), 0) : 0,
    10
  );

  // Build line paths for each agent
  function buildLine(agentIdx: number) {
    const agent = mockUsage[agentIdx];
    if (!visibleAgents[agent.agent]) return null;
    const points = agent.data.map((d, i) => {
      const x = PADDING + i * xStep;
      const y = CHART_HEIGHT - PADDING - (d.count / maxY) * (CHART_HEIGHT - 2 * PADDING);
      return [x, y];
    });
    const path = points.map((pt, i) => (i === 0 ? `M${pt[0]},${pt[1]}` : `L${pt[0]},${pt[1]}`)).join(" ");
    return (
      <path
        key={agent.agent}
        d={path}
        fill="none"
        stroke={AGENT_COLORS[agentIdx % AGENT_COLORS.length]}
        strokeWidth="2"
        style={{ opacity: 0.85, transition: "opacity 0.2s" }}
      />
    );
  }

  // Build total usage line
  function buildTotalLine() {
    if (!visibleAgents["Total Usage"]) return null;
    const points = totalUsage.map((d, i) => {
      const x = PADDING + i * xStep;
      const y = CHART_HEIGHT - PADDING - (d.count / maxY) * (CHART_HEIGHT - 2 * PADDING);
      return [x, y];
    });
    const path = points.map((pt, i) => (i === 0 ? `M${pt[0]},${pt[1]}` : `L${pt[0]},${pt[1]}`)).join(" ");
    return (
      <path
        key="total-usage"
        d={path}
        fill="none"
        stroke={TOTAL_COLOR}
        strokeWidth="2.5"
        style={{ opacity: 0.95, transition: "opacity 0.2s" }}
        strokeDasharray="3 2"
      />
    );
  }

  // X axis labels (dates)
  const xLabels = mockUsage[0].data.map((d, i) =>
    (i % 5 === 0 || i === days - 1) ? (
      <text
        key={i}
        x={PADDING + i * xStep}
        y={CHART_HEIGHT - PADDING + 16}
        textAnchor="middle"
        fontSize="10"
        fill="#94a3b8"
      >
        {d.date.slice(-2)}
      </text>
    ) : null
  );

  // Y axis labels
  const yLabels = [];
  for (let y = 0; y <= maxY; y += Math.ceil(maxY / 4)) {
    yLabels.push(
      <text
        key={y}
        x={PADDING - 8}
        y={CHART_HEIGHT - PADDING - (y / maxY) * (CHART_HEIGHT - 2 * PADDING) + 4}
        textAnchor="end"
        fontSize="10"
        fill="#94a3b8"
      >
        {y}
      </text>
    );
  }

  // Handle mouse move for hover
  function handleMouseMove(e: React.MouseEvent) {
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Convert x to chart index
    let idx = Math.round((x - PADDING) / xStep);
    idx = Math.max(0, Math.min(days - 1, idx));
    setHoverIdx(idx);
  }

  function handleMouseLeave() {
    setHoverIdx(null);
  }

  // Tooltip data
  let tooltip = null;
  if (hoverIdx !== null) {
    const x = PADDING + hoverIdx * xStep;
    const date = mockUsage[0].data[hoverIdx].date;
    const agentData = [
      ...(visibleAgents["Total Usage"]
        ? [{
            agent: "Total Usage",
            color: TOTAL_COLOR,
            value: totalUsage[hoverIdx].count,
            visible: true,
            isTotal: true,
          }]
        : []),
      ...mockUsage
        .map((agent, idx) => ({
          agent: agent.agent,
          color: AGENT_COLORS[idx % AGENT_COLORS.length],
          value: agent.data[hoverIdx].count,
          visible: visibleAgents[agent.agent],
          isTotal: false,
        }))
        .filter(a => a.visible)
    ];

    tooltip = (
      <div
        style={{
          position: "absolute",
          left: `calc(${((x / VIEWBOX_WIDTH) * 100).toFixed(2)}%)`,
          top: 8,
          transform: x > VIEWBOX_WIDTH / 2 ? "translate(-100%,0)" : "translate(0,0)",
          background: "rgba(20,22,40,0.98)",
          color: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 12px 0 rgba(20,20,40,0.18)",
          padding: "10px 14px",
          fontSize: 13,
          pointerEvents: "none",
          zIndex: 10,
          minWidth: 120,
          maxWidth: 220,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
          {date}
        </div>
        {agentData.map(a => (
          <div key={a.agent} style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 5,
                background: a.color,
                marginRight: 7,
                border: a.isTotal ? "2px solid #eab308" : undefined,
              }}
            />
            <span style={{ fontWeight: 500, color: a.color }}>{a.agent}</span>
            <span style={{ marginLeft: "auto", fontWeight: 600 }}>{a.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto border-2 border-transparent bg-white/5 rounded-2xl p-8 flex flex-col gap-10 shadow-2xl">
      {/* API Key Management */}
      <div className="w-full">
        <div className="text-lg font-semibold text-white mb-2">API Management</div>
        <div className="bg-white/10 rounded-lg p-5 flex flex-col gap-4 border border-white/10 w-full">
          <div className="text-xs text-white/70 mb-1">Your API Key</div>
          <div className="flex items-center gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey ? (showKey ? apiKey : maskKey(apiKey)) : ""}
              readOnly
              className="w-full bg-white/5 text-white px-3 py-2 rounded font-mono text-sm border border-white/20"
              placeholder="No API key generated"
              style={{ letterSpacing: "0.08em" }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowKey((v) => !v)}
              className="px-2"
              disabled={!apiKey}
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            {!apiKey ? (
              <Button size="sm" onClick={handleGenerate} className="bg-cyan-400/20 text-cyan-200">
                Generate API Key
              </Button>
            ) : (
              <>
                <Button size="sm" onClick={handleRegenerate} className="bg-cyan-400/20 text-cyan-200">
                  Regenerate
                </Button>
                <Button size="sm" onClick={handleRevoke} className="bg-purple-400/20 text-purple-200">
                  Revoke
                </Button>
              </>
            )}
          </div>
          <div className="text-xs text-white/40 mt-2">
            Keep your API key secret. Regenerating or revoking will immediately disable the previous key.
          </div>
        </div>
      </div>
      {/* API Usage Chart */}
      <div className="w-full">
        <div className="text-lg font-semibold text-white mb-2">API Usage - Agent Query (last 30 days)</div>
        <div className="bg-white/10 rounded-lg p-5 border border-white/10 w-full">
          <div
            className="relative w-full"
            style={{
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              margin: "0 auto",
              background: "rgba(255,255,255,0.01)",
              borderRadius: "12px",
              height: CHART_HEIGHT,
            }}
            ref={chartRef}
          >
            <svg
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              width="100%"
              height={CHART_HEIGHT}
              style={{ display: "block", background: "none", width: "100%", maxWidth: "100%", cursor: "pointer" }}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Axes */}
              <line
                x1={PADDING}
                y1={CHART_HEIGHT - PADDING}
                x2={VIEWBOX_WIDTH - PADDING}
                y2={CHART_HEIGHT - PADDING}
                stroke="#334155"
                strokeWidth="1"
              />
              <line
                x1={PADDING}
                y1={CHART_HEIGHT - PADDING}
                x2={PADDING}
                y2={PADDING}
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Y labels */}
              {yLabels}
              {/* X labels */}
              {xLabels}
              {/* Agent lines */}
              {mockUsage.map((_, idx) => buildLine(idx))}
              {/* Total usage line */}
              {buildTotalLine()}
              {/* Hover vertical line */}
              {hoverIdx !== null && (
                <line
                  x1={PADDING + hoverIdx * xStep}
                  y1={PADDING}
                  x2={PADDING + hoverIdx * xStep}
                  y2={CHART_HEIGHT - PADDING}
                  stroke="#a78bfa"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  opacity="0.7"
                />
              )}
              {/* Hover dots */}
              {hoverIdx !== null &&
                [
                  ...(visibleAgents["Total Usage"]
                    ? [
                        (() => {
                          const d = totalUsage[hoverIdx];
                          const x = PADDING + hoverIdx * xStep;
                          const y = CHART_HEIGHT - PADDING - (d.count / maxY) * (CHART_HEIGHT - 2 * PADDING);
                          return (
                            <circle
                              key="total-usage-dot"
                              cx={x}
                              cy={y}
                              r={5}
                              fill={TOTAL_COLOR}
                              stroke="#eab308"
                              strokeWidth="2"
                              opacity="0.98"
                            />
                          );
                        })(),
                      ]
                    : []),
                  ...mockUsage.map((agent, idx) => {
                    if (!visibleAgents[agent.agent]) return null;
                    const d = agent.data[hoverIdx];
                    const x = PADDING + hoverIdx * xStep;
                    const y = CHART_HEIGHT - PADDING - (d.count / maxY) * (CHART_HEIGHT - 2 * PADDING);
                    return (
                      <circle
                        key={agent.agent}
                        cx={x}
                        cy={y}
                        r={4}
                        fill={AGENT_COLORS[idx % AGENT_COLORS.length]}
                        stroke="#fff"
                        strokeWidth="1.5"
                        opacity="0.95"
                      />
                    );
                  }),
                ]}
            </svg>
            {/* Tooltip */}
            {hoverIdx !== null && tooltip}
          </div>
          <div className="flex flex-wrap gap-0.5 mt-1" style={{ fontSize: "9px" }}>
            <button
              className="flex items-center gap-0.5 px-0.5 py-0.5 rounded transition"
              style={{
                fontSize: "9px",
                background: visibleAgents["Total Usage"]
                  ? TOTAL_COLOR + "22"
                  : "rgba(255,255,255,0.03)",
                color: "#eab308",
                border: visibleAgents["Total Usage"]
                  ? "1px solid #eab308"
                  : "1px solid #334155",
                fontWeight: visibleAgents["Total Usage"] ? 700 : 400,
                opacity: visibleAgents["Total Usage"] ? 1 : 0.5,
                cursor: "pointer",
                minHeight: "14px",
                minWidth: "0",
                lineHeight: "1.1",
                padding: "1px 3px",
              }}
              onClick={() =>
                setVisibleAgents((prev) => ({
                  ...prev,
                  ["Total Usage"]: !prev["Total Usage"],
                }))
              }
              type="button"
            >
              <span
                className="inline-block"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 5,
                  background: TOTAL_COLOR,
                  border: "2px solid #eab308",
                  marginRight: 2,
                  display: "inline-block",
                }}
              />
              Total Usage
            </button>
            {AGENTS.map((agent, idx) => (
              <button
                key={agent}
                className="flex items-center gap-0.5 px-0.5 py-0.5 rounded transition"
                style={{
                  fontSize: "9px",
                  background: visibleAgents[agent]
                    ? AGENT_COLORS[idx % AGENT_COLORS.length] + "22"
                    : "rgba(255,255,255,0.03)",
                  color: visibleAgents[agent]
                    ? AGENT_COLORS[idx % AGENT_COLORS.length]
                    : "#94a3b8",
                  border: visibleAgents[agent]
                    ? `1px solid ${AGENT_COLORS[idx % AGENT_COLORS.length]}`
                    : "1px solid #334155",
                  fontWeight: visibleAgents[agent] ? 600 : 400,
                  opacity: visibleAgents[agent] ? 1 : 0.5,
                  cursor: "pointer",
                  minHeight: "14px",
                  minWidth: "0",
                  lineHeight: "1.1",
                  padding: "1px 3px",
                }}
                onClick={() =>
                  setVisibleAgents((prev) => ({
                    ...prev,
                    [agent]: !prev[agent],
                  }))
                }
                type="button"
              >
                <span
                  className="inline-block"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    background: AGENT_COLORS[idx % AGENT_COLORS.length],
                    opacity: visibleAgents[agent] ? 1 : 0.3,
                    marginRight: 2,
                  }}
                />
                {agent}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* API Billing History */}
      <div className="w-full">
        <div className="text-lg font-semibold text-white mb-2">API Billing History</div>
        <div className="bg-white/10 rounded-lg p-5 border border-white/10 w-full">
          {mockApiBilling.length === 0 ? (
            <div className="text-white/40 text-sm py-4">No API billings yet.</div>
          ) : (
<ul className="divide-y divide-white/10">
  {mockApiBilling.map((bill) => (
    <li key={bill.id} className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-sm text-white/90">{bill.date}</span>
        <span className="text-xs text-muted-foreground">{bill.id}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-cyan-300 font-semibold">{bill.amount}</span>
        <span className="text-xs text-white/60">{bill.status}</span>
        <a
          href={bill.url}
          className="text-xs text-purple-400 underline hover:text-purple-300 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      </div>
    </li>
  ))}
</ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiManagementCard;
