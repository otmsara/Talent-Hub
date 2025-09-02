import React, { useState } from "react";
import { Button } from "../ui/button";
import ApiManagementCard from "./ApiManagementCard";

const INDIVIDUAL_PLANS = [
  {
    name: "Starter",
    description: "Perfect for getting started\nExplore at your own pace with the essential tools you need.",
    price: "Free",
    features: [
      "Basic job matching engine",
      "Limited resume builder",
      "Career assessment tools",
      "Community access",
      "Up to 15 interactions/month"
    ],
    note: "Students, early explorers, and casual job seekers.",
    cta: "Get Started",
    highlight: false,
    seats: 1,
    seatBased: false,
  },
  {
    name: "Plus",
    description: "Level up your job search\nMore power, smarter tools, and your first look at our intelligent agents.",
    price: "$5.80/month",
    priceSub: "(or $59.80/year)",
    features: [
      "Everything in Starter, plus:",
      "Enhanced job matching accuracy",
      "Full access to the resume builder",
      "Career analytics and market insights",
      "Up to 215 interactions/month",
      "Agentic Suite:",
      "Cover Letter Builder Agent",
      "Skill Gap Assessment Agent",
      "Interview Preparation Agent"
    ],
    note: "Active applicants ready to sharpen their competitive edge.",
    cta: "Get Started",
    highlight: false,
    seats: 1,
    seatBased: false,
  },
  {
    name: "Pro+",
    description: "Unleash Arya's full potential\nAll tools. All agents. No limits.",
    price: "$18.80/month",
    priceSub: "(or $179.80/year)",
    features: [
      "Everything in Plus, with:",
      "Unlimited interactions",
      "Real-time salary insights and market trends",
      "Full access to the Arya Agentic Suite:",
      "Agentic Suite:",
      "Jobs board with matching scores",
      "Application Readiness Pack",
      "DeepSearch Agent",
      "CompanySearch Agent",
      "Resume Builder Agent",
      "Cover Letter Builder Agent",
      "Interview Prep Agent",
      "Skill Gap Assessment Agent"
    ],
    note: "Power users, career changers, and professionals seeking a strategic advantage.",
    cta: "Get Started",
    highlight: "most-popular",
    seats: 1,
    seatBased: false,
  },
  {
    name: "Enterprise",
    description: "Built for organizations of all sizes\nTailored AI solutions for startups, universities, career platforms, and government programs.",
    price: "$49/seat/month",
    pricePerSeat: "",
    features: [
      "Everything in Pro+, plus:",
      "Custom AI solution design",
      "Team collaboration tools",
      "Admin controls and usage analytics",
      "Dedicated account manager",
      "Training and onboarding sessions",
      "Custom integrations with internal platforms",
      "Workforce analytics and enterprise insights"
    ],
    note: "Startups, institutions, and teams ready to scale their career support capabilities.",
    cta: "Contact Us to Learn More",
    highlight: false,
    seats: 10,
    seatBased: true,
  }
];

const API_PLANS = [
  {
    name: "Developer",
    description: "Start building\nPerfect for testing and small projects.",
    price: "Free",
    features: [
      "1,000 API calls/month",
      "2 requests/second rate limit",
      "Basic job matching",
      "Resume parsing",
      "Community support"
    ],
    note: "Developers building prototypes or low-volume applications.",
    cta: "Get API Key",
    highlight: false,
    seats: 1,
    seatBased: false,
  },
  {
    name: "Professional",
    description: "Scale your application\nFor growing applications with moderate traffic.",
    price: "$49/month",
    features: [
      "50,000 API calls/month",
      "10 requests/second rate limit",
      "Advanced job matching",
      "Resume parsing & analysis",
      "Skill gap detection",
      "Email support"
    ],
    note: "Startups and businesses with production applications.",
    cta: "Subscribe Now",
    highlight: "most-popular",
    seats: 1,
    seatBased: false,
  },
  {
    name: "Business",
    description: "High-performance solution\nFor high-traffic applications requiring enhanced capabilities.",
    price: "$299/month",
    features: [
      "500,000 API calls/month",
      "25 requests/second rate limit",
      "All API endpoints",
      "Priority support",
      "Dedicated success manager",
      "SLA guarantees",
      "Custom model training available"
    ],
    note: "Businesses with high-volume requirements.",
    cta: "Subscribe Now",
    highlight: false,
    seats: 1,
    seatBased: false,
  },
  {
    name: "Enterprise API",
    description: "Custom solution\nTailored for large enterprises with specific needs.",
    price: "Custom Pricing",
    pricePerSeat: "$99/seat",
    features: [
      "Custom API call volume",
      "Custom rate limits",
      "White-label options",
      "Custom integration support",
      "On-premise deployment options",
      "24/7 priority support",
      "Custom model training included",
      "Data residency options"
    ],
    note: "Large enterprises with custom requirements and high volumes.",
    cta: "Contact Sales",
    highlight: false,
    seats: 20,
    seatBased: true,
  }
];

const PLAN_ICONS = {
  Starter: <span className="text-cyan-300 mr-2"><i className="fa-regular fa-book-open"></i></span>,
  Plus: <span className="text-pink-400 mr-2"><i className="fa-regular fa-calendar"></i></span>,
  "Pro+": <span className="text-purple-400 mr-2"><i className="fa-regular fa-bolt"></i></span>,
  Enterprise: <span className="text-fuchsia-400 mr-2"><i className="fa-regular fa-building"></i></span>,
  Developer: <span className="text-cyan-300 mr-2"><i className="fa-regular fa-code"></i></span>,
  Professional: <span className="text-pink-400 mr-2"><i className="fa-regular fa-rocket"></i></span>,
  Business: <span className="text-purple-400 mr-2"><i className="fa-regular fa-briefcase"></i></span>,
  "Enterprise API": <span className="text-fuchsia-400 mr-2"><i className="fa-regular fa-server"></i></span>,
};

function PlanCard({ plan, seatCount, onSeatChange }) {
  const [collapsed, setCollapsed] = useState(true);

  // Arrow icon SVG
  const ArrowIcon = ({ open }) => (
    <svg
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      style={{ opacity: 0.7 }}
    >
      <path d="M7 6l5 4-5 4" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Description header: first line is bold, rest is normal
  const [descHeader, ...descRest] = plan.description.split("\n");

  return (
    <div
      className={`flex flex-col border border-border/30 rounded-xl p-4 bg-white/5 min-w-[180px] w-full md:max-w-[220px] flex-1 relative transition-all duration-200 shadow-sm ${
        plan.highlight === "most-popular"
          ? "border border-[1.5px] border-[#14AFC0]/30 shadow-[0_0_10px_1px_rgba(20,175,192,0.10)]"
          : ""
      } ${collapsed ? "h-[270px] overflow-hidden" : ""}`}
      style={
        collapsed
          ? { minHeight: 270, maxHeight: 270 }
          : { minHeight: 0, maxHeight: "none", height: "auto" }
      }
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
        style={{ minHeight: 60 }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center text-lg font-bold text-white">
            {PLAN_ICONS[plan.name] || null}
            {plan.name}
          </div>
          <div className="text-[13px] text-white/80 font-semibold">{descHeader}</div>
          {descRest.length > 0 && (
            <div className="text-xs text-white/60">{descRest.join(" ")}</div>
          )}
          <div className="text-xs mt-1">
            <span className="font-semibold text-white/70">Pricing:</span>{" "}
            <span style={{ color: "#14AFC0" }}>{plan.price}</span>
            {plan.pricePerSeat && <span className="ml-1 text-xs" style={{ color: "#14AFC0" }}>{plan.pricePerSeat}</span>}
            {plan.priceSub && <span className="ml-1 text-xs text-white/60">{plan.priceSub}</span>}
          </div>
        </div>
        <button
          className="ml-2 rounded-full p-1 bg-transparent border-none outline-none focus:ring-0"
          tabIndex={0}
          aria-label={collapsed ? "Expand details" : "Collapse details"}
          style={{ height: 32, width: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ArrowIcon open={!collapsed} />
        </button>
      </div>
      <div className="mt-2" />
      {plan.highlight === "most-popular" && (
        <span
          className="absolute top-2 right-2"
          style={{
            background: "none",
            color: "rgba(144,74,143,0.45)",
            fontWeight: 600,
            fontSize: "0.62rem",
            borderRadius: "4px",
            padding: "1px 7px",
            textShadow: "0 0 6px rgba(144,74,143,0.13)",
            zIndex: 10,
            letterSpacing: "0.01em"
          }}
        >
          Most Popular
        </span>
      )}
      {!collapsed && (
        <>
          <div className="text-xs text-white/80 font-semibold mb-1 mt-2">What's included:</div>
          <ul className="mb-1 text-xs space-y-0.5">
            {plan.features.map((f, i) => {
              // Section headers (bold, no icon)
              if (f.startsWith("Everything") || f.endsWith(":")) {
                return (
                  <li key={i} className="font-semibold mt-1">
                    <span className="text-white/90">{f}</span>
                  </li>
                );
              }
              // Indented agent features: arrow
              if (f.includes("Agent")) {
                return (
                  <li key={i} className="flex items-start">
                    <span className="text-white/80 mr-1 mt-0.5" style={{ fontSize: "1em" }}>→</span>
                    <span className="text-white/90">{f}</span>
                  </li>
                );
              }
              // Normal features: white dot
              return (
                <li key={i} className="">
                  <span className="text-white/80 mr-1" style={{ fontSize: "0.8em" }}>●</span>
                  <span className="text-white/90">{f}</span>
                </li>
              );
            })}
          </ul>
          <div className="text-xs text-white/60 mb-2">{plan.note}</div>
          {plan.seatBased && (
            <div className="mb-2">
              <label className="block text-xs text-white/80 mb-0.5 font-semibold">Seats</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  value={seatCount}
                  onChange={e => onSeatChange && onSeatChange(Number(e.target.value))}
                  className="w-12 rounded bg-white/10 border border-white/20 px-1 py-0.5 text-white text-xs"
                  style={{ fontSize: "12px" }}
                />
                <span className="text-xs text-white/60">users</span>
              </div>
            </div>
          )}
          <div style={{ marginTop: 18 }} />
          <Button className="w-full mt-auto py-1 text-xs h-7">{plan.cta}</Button>
        </>
      )}
    </div>
  );
}

// Mock current subscription for demo
const MOCK_CURRENT = {
  individual: { ...INDIVIDUAL_PLANS[1], seats: 1, seatBased: false }, // "Plus"
  api: { ...API_PLANS[1], seats: 1, seatBased: false }, // "Professional"
  enterprise: { ...INDIVIDUAL_PLANS[3], seats: 10, seatBased: true }, // "Enterprise"
};

function getNextResetDate() {
  // For demo, always return the 1st of next month
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function CurrentSubscriptionCard({ plan, seatCount, onSeatChange, assignedSeats, onAssignSeat }) {
  const [assignEmail, setAssignEmail] = useState("");

  // Mock usage data for queries tracking bar
  // In a real app, these would come from user stats
  const usage = {
    used: 37,
    limit: plan.name === "Starter" ? 15 : plan.name === "Plus" ? 215 : plan.name === "Pro+" ? 999 : 500,
  };
  const percent = Math.min(100, Math.round((usage.used / usage.limit) * 100));

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Mock billing history
  const billingHistory = [
    {
      id: "inv-001",
      date: "2025-03-01",
      amount: "$5.80",
      status: "Paid",
      url: "#",
    },
    {
      id: "inv-002",
      date: "2025-04-01",
      amount: "$5.80",
      status: "Paid",
      url: "#",
    },
    {
      id: "inv-003",
      date: "2025-05-01",
      amount: "$5.80",
      status: "Paid",
      url: "#",
    },
  ];

  return (
    <div
      className="w-full max-w-[1800px] mx-auto border-2 border-transparent bg-white/5 rounded-2xl p-8 flex flex-col gap-10 shadow-2xl"
      style={{ minHeight: 260 }}
    >
      <div className="text-base font-semibold text-white/80 mb-3">Current Plan</div>
      {/* Elegant Frame for Plan Info, Seat Stats, Queries Tracking */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Plan Info */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="text-3xl">{PLAN_ICONS[plan.name]}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xl font-bold"
                  style={{ color: "rgba(20,175,192,0.85)" }}
                >
                  {plan.name} Plan
                </span>
                {plan.name === "Plus" && (
                  <>
                    <button
                      className="ml-2 px-3 py-1 rounded bg-white/10 text-cyan-300 text-xs font-semibold hover:bg-cyan-400/10 transition border border-cyan-400/10 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      style={{ opacity: 0.7 }}
                      onClick={() => setShowCancelDialog(true)}
                    >
                    Cancel subscription
                  </button>
                  {showCancelDialog && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                      onClick={() => setShowCancelDialog(false)}
                    >
                      <div
                        className="bg-[#10182a] rounded-xl p-6 shadow-lg border border-cyan-400/20 min-w-[320px] max-w-[90vw]"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="text-lg font-bold text-white mb-2">Cancel Subscription?</div>
                        <div className="text-sm text-white/80 mb-4">
                          Are you sure you want to cancel your Plus subscription? <br />
                          Your plan will be converted to <span className="font-semibold text-cyan-300">Starter</span> on the next reset date (<span className="font-semibold">{getNextResetDate()}</span>).
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            className="px-4 py-1 rounded bg-white/10 text-white/80 text-sm font-semibold hover:bg-white/20 transition"
                            onClick={() => setShowCancelDialog(false)}
                          >
                            No, keep Plus
                          </button>
                          <button
                            className="px-4 py-1 rounded bg-cyan-400/80 text-cyan-950 text-sm font-bold hover:bg-cyan-300 transition"
                            onClick={() => {
                              setShowCancelDialog(false);
                              // Here you would trigger the actual cancel logic
                            }}
                          >
                            Yes, cancel subscription
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
                )}
              </div>
              <div className="text-base text-white/80 font-semibold mb-1">
                {plan.price === "Free" ? "Free" : plan.price}
                {plan.pricePerSeat && (
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "rgba(20,175,192,0.7)" }}
                  >
                    {plan.pricePerSeat} <span className="text-xs text-muted-foreground">/seat</span>
                  </span>
                )}
              </div>
              <div className="text-sm text-white/60">{plan.description.split("\n")[0]}</div>
            </div>
          </div>
          {/* Seat Stats */}
          <div className="flex flex-col gap-2 min-w-[160px]">
            <div
              className="px-4 py-1 rounded-lg text-cyan-300/70 bg-cyan-400/10 border border-cyan-400/10 text-sm font-semibold text-center"
            >
              Assigned seats: {plan.seatBased ? assignedSeats.length : 1}
            </div>
            <div
              className="px-4 py-1 rounded-lg text-purple-300/80 bg-purple-400/10 border border-purple-400/10 text-sm font-semibold text-center"
            >
              Available seats: {plan.seatBased ? seatCount - assignedSeats.length : 0}
            </div>
          </div>
        </div>
        {/* Queries Tracking Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-white/80">Agent Queries Used</span>
            <span className="text-xs text-white/60">
              {usage.used} / {usage.limit} {usage.limit < 999 ? "queries" : "unlimited"}
            </span>
          </div>
          <span className="text-xs text-white/40">
            Next reset: <span className="font-semibold text-white/50">{getNextResetDate()}</span>
          </span>
        </div>
        <div
          className="w-full h-3 rounded-lg mt-2"
          style={{
            background: "rgba(20,175,192,0.10)",
            boxShadow: "0 0 8px 1px rgba(20,175,192,0.10) inset",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #14AFC0 0%, #c084fc 100%)",
              borderRadius: "inherit",
              boxShadow: percent > 90 ? "0 0 12px 2px #14AFC0" : "none",
              transition: "width 0.4s cubic-bezier(.4,2,.6,1)",
            }}
          />
        </div>
      </div>
      {/* Seat Assignment Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(20,175,192,0.45)" }}>Assign seat by email</label>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              placeholder="user@org.com"
              value={assignEmail}
              onChange={e => setAssignEmail(e.target.value)}
              className="flex-1 rounded"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(20,175,192,0.30)",
                color: "rgba(20,175,192,0.7)",
                padding: "10px 14px",
                fontWeight: 500,
                fontSize: "1rem",
                boxShadow: "0 0 10px 1px rgba(20,175,192,0.10)",
                transition: "border 0.18s, box-shadow 0.18s"
              }}
            />
            <Button
              size="sm"
              style={{ height: "40px", minHeight: "40px", display: "flex", alignItems: "center" }}
              onClick={() => { onAssignSeat(assignEmail); setAssignEmail(""); }}
              disabled={!assignEmail}
            >
              Assign
            </Button>
          </div>
          {assignedSeats.length > 0 && (
            <div className="mt-2 text-xs text-white/80">
              <div className="font-semibold mb-1">Assigned seats:</div>
              <ul className="space-y-1">
                {assignedSeats.map((email, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span style={{
                      background: "rgba(20,175,192,0.10)",
                      color: "rgba(20,175,192,0.7)",
                      borderRadius: "5px",
                      padding: "2px 8px"
                    }}>{email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAssignSeat(email, true)}
                      style={{
                        transition: "background 0.18s, color 0.18s"
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = "rgba(20,175,192,0.13)";
                        e.currentTarget.style.color = "#14AFC0";
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "";
                      }}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Billing History */}
      <div className="mt-10">
        <div className="text-base font-semibold text-white/80 mb-3">Billing History</div>
        {billingHistory.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4">No past billings.</div>
        ) : (
          <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
            {[...billingHistory]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(bill => (
                <li key={bill.id} className="flex items-center justify-between px-4 py-3">
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
  );
}

import { useAccount } from "../../contexts/AccountContext";

const SubscriptionPlans: React.FC = () => {
  const [tab, setTab] = useState<"individual" | "api">("individual");
  const plans = tab === "individual" ? INDIVIDUAL_PLANS : API_PLANS;
  const { currentUser } = useAccount();

  // Determine current plan from user subscription
  let currentCardPlan = MOCK_CURRENT.individual;
  let initialSeatCount = 1;
  if (currentUser && currentUser.subscription) {
    const match = INDIVIDUAL_PLANS.find(
      p => p.name.toLowerCase() === currentUser.subscription.type.toLowerCase()
    );
    if (match) {
      currentCardPlan = { ...match, seats: currentUser.subscription.seats, seatBased: match.seatBased };
      initialSeatCount = currentUser.subscription.seats;
    }
  }

  const [seatCount, setSeatCount] = useState(initialSeatCount);
  const [assignedSeats, setAssignedSeats] = useState(["alice@org.com", "bob@org.com"]);

  const handleSeatChange = (count) => {
    setSeatCount(count);
  };

  const handleAssignSeat = (email, remove = false) => {
    if (remove) {
      setAssignedSeats(assignedSeats.filter(e => e !== email));
    } else if (email && !assignedSeats.includes(email)) {
      setAssignedSeats([...assignedSeats, email]);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        <button
          className={`w-32 px-6 py-2 rounded-l-full font-semibold transition ${tab === "individual" ? "bg-cyan-400/20 text-cyan-200 shadow" : "bg-white/5 text-muted-foreground"}`}
          onClick={() => setTab("individual")}
        >
          Plans
        </button>
        <button
          className={`w-32 px-6 py-2 rounded-r-full font-semibold transition ${tab === "api" ? "bg-cyan-400/20 text-cyan-200 shadow" : "bg-white/5 text-muted-foreground"}`}
          onClick={() => setTab("api")}
        >
          API
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {tab === "api" ? (
          <div className="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row items-center bg-white/5 border border-border/30 rounded-xl p-8 shadow-md">
            <div className="flex-1 flex flex-col items-start">
              <div className="text-lg font-semibold text-white mb-2">
                Ideal for powering your HR tools or products
              </div>
<div className="mb-2">
  <span className="text-base font-medium text-white" style={{marginRight: 8}}>Pricing:</span>
  <span className="text-base font-medium" style={{ color: "#3BCDDA" }}>$0.02</span>
  <span className="text-base font-medium text-white/80"> / Agent Query</span>
</div>
              <div className="text-sm text-white/80 mb-4">
                Applies across all agents:
              </div>
              <ul className="text-white/90 text-sm space-y-1 pl-4 list-disc">
                <li>Arya α1 Chat Agent</li>
                <li>Job Matching Engine Agent</li>
                <li>DeepSearch Agent</li>
                <li>CompanySearch Agent</li>
                <li>Interview Preparation Agent</li>
                <li>Resume Builder Agent</li>
                <li>Cover Letter Agent</li>
                <li>Analytics Agent</li>
                <li>Career Intelligence Agent</li>
                <li>Project-Based Recruitment Agents</li>
              </ul>
            </div>
          </div>
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              seatCount={plan.seatBased ? seatCount : 1}
              onSeatChange={plan.seatBased ? handleSeatChange : undefined}
            />
          ))
        )}
      </div>
      <div className="flex justify-center mt-12">
        {tab === "api" ? (
          <div className="w-full flex justify-center">
            {/* API Management Card */}
            <ApiManagementCard />
          </div>
        ) : (
          <CurrentSubscriptionCard
            plan={currentCardPlan}
            seatCount={seatCount}
            onSeatChange={handleSeatChange}
            assignedSeats={assignedSeats}
            onAssignSeat={handleAssignSeat}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
