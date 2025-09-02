import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import FeedTypeToggle from "../feed/FeedTypeToggle";
import RightSidebar from "./RightSidebar";
import { Outlet, useLocation, Link } from "react-router-dom";
import { FeedTypeContext, FeedType } from "../feed/FeedTypeContext";
import ExaChatbot from "../projects/ExaChatbot";
import AccountSwitchModal from "../ui/AccountSwitchModal";

const DEFAULT_SIDEBAR_WIDTH = 256; // px

const MOBILE_MENU_LINKS = [
  { label: "Qolabs", to: "/" },
  { label: "My Projects", to: "/projects" },
  { label: "Messages", to: "/chat" },
  { label: "Notifications", to: "/notifications" },
  { label: "AI Career Insights", to: "/career-insights" },
  { label: "Career Workspace", to: "/career-workspace" },
  { label: "Real-Time Resume", to: "/real-time-resume" },
  { label: "Career Goals", to: "/career-goals" },
  { label: "Talent Hub", to: "/talent-hub" },
  { label: "AI Business School", to: "/ai-business-school" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
  { label: "Help", to: "/help" },
];

const HIDE_HEADER_PATHS = [
  "/career-insights",
  "/career-workspace",
  '/real-time-resume',
  '/career-goals',
  '/talent-hub',
  '/notifications',
  '/ai-business-school',
  '/help',
  '/settings',
];

const Layout: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  // Hide header and right sidebar for /postjob and /postjob/:id
  const isJobPostPage = /^\/postjob(\/[^\/]+)?$/.test(location.pathname);
  const shouldHideHeader = isJobPostPage || HIDE_HEADER_PATHS.some(path => location.pathname.startsWith(path));

  // Feed filter state (lifted up for header and feed)
  const [feedType, setFeedType] = useState<FeedType>("all");

  // Mobile menu and search state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState("");

  // Ref for mobile search input container
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Helper: is home page
  const isHome = location.pathname === "/";
  // Helper: is profile page (supports /profile and /profile/:id)
  const isProfile = location.pathname.startsWith("/profile");

  // Collapse mobile search when clicking outside
  useEffect(() => {
    if (!mobileSearchOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileSearchOpen]);

  return (
    <FeedTypeContext.Provider value={{ feedType, setFeedType }}>
      <div className="min-h-screen w-full bg-[#0C112A] flex">
        {/* Sidebar: hidden on mobile, visible md+ */}
        <div className="hidden md:flex flex-shrink-0 z-20" style={{ position: "relative" }}>
          <Sidebar onWidthChange={setSidebarWidth} />
        </div>
        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex">
            <div className="w-64 bg-[#10163a] h-full shadow-2xl flex flex-col">
              {/* Logo/Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <Link to="/" className="flex items-center gap-3">
                  <img
                    src="https://beta.iamarya.org/_next/static/media/logo.214a1457.png"
                    alt="Arya Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white">Arya</span>
                      <span className="bg-gray-700 text-xs text-white font-semibold px-2 py-0.5 rounded-md">BETA</span>
                    </div>
                  </div>
                </Link>
                <button
                  className="text-gray-400 hover:text-white"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <nav className="flex flex-col gap-1 p-4">
                  {MOBILE_MENU_LINKS.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`py-2 px-3 rounded-lg text-base font-medium transition-all relative group ${
                        location.pathname === link.to
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="relative">
                        {link.label}
                        <span
                          className={`absolute left-0 right-0 -bottom-1 h-[2px] bg-cyan-400/40 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] transition-opacity duration-200 ${
                            location.pathname === link.to
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          style={{ borderRadius: 2, pointerEvents: "none" }}
                        />
                      </span>
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  <button
                    className="w-full flex items-center justify-center py-2 px-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-cyan-400/10 transition-all"
                    onClick={() => {
                      setModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            {/* Clickable overlay to close */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
        {/* Unified layout for all pages */}
        <div className="flex-1 flex flex-col" style={{ marginLeft: `${sidebarWidth}px` }}>
            {/* Header */}
            {shouldHideHeader ? null : isProfile ? (
              <header className="sticky top-0 z-40 backdrop-blur-md h-16 md:h-20">
                {/* Mobile: menu (left) and search (right) only */}
                <div className="flex items-center justify-between w-full h-full px-2 md:hidden relative">
                  {/* Menu button: left */}
                  <div className="flex items-center">
                    <button
                      className="bg-primary/80 text-white rounded-full p-2 shadow-lg"
                      aria-label="Open menu"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {/* Search: right */}
                  <div className="flex items-center">
                    {!mobileSearchOpen ? (
                      <button
                        className="bg-background/80 text-primary rounded-full p-2 shadow"
                        aria-label="Open search"
                        onClick={() => setMobileSearchOpen(true)}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </button>
                    ) : (
                      <div className="relative flex items-center" ref={mobileSearchRef}>
                        <input
                          className="rounded-full px-3 py-1.5 text-sm bg-background/90 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary w-40 transition-all"
                          type="text"
                          placeholder="Search..."
                          value={mobileSearchValue}
                          onChange={e => setMobileSearchValue(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          aria-label="Close search"
                          onClick={() => setMobileSearchOpen(false)}
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Desktop: only search bar, centered */}
                <div className="hidden md:flex items-center w-full h-full px-4">
                  <div className="flex-1 flex items-center justify-center">
                    <SearchBar />
                  </div>
                </div>
              </header>
            ) : (
              <header className="sticky top-0 z-40 backdrop-blur-md h-16 md:h-20">
                {/* Mobile header */}
                <div className="flex items-center justify-between w-full h-full px-2 md:hidden relative">
                  {/* Menu button: left */}
                  <div className="flex items-center">
                    <button
                      className="bg-primary/80 text-white rounded-full p-2 shadow-lg"
                      aria-label="Open menu"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  {/* Center: toggles */}
                  {![
                    "/chat",
                    "/notifications",
                    "/career-insights",
                    "/real-time-resume",
                    "/career-goals",
                    "/talent-hub",
                    "/settings",
                    "/help",
                    "/career-workspace",
                    "/ai-business-school",
                    "/postjob"
                  ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith("/apply")) && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
                      <FeedTypeToggle />
                    </div>
                  )}
                  {/* Search: right */}
                  {![
                    "/career-insights",
                    "/real-time-resume",
                    "/career-goals",
                    "/talent-hub",
                    "/settings",
                    "/help",
                    "/career-workspace",
                    "/ai-business-school",
                    "/postjob"
                  ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith("/apply")) && (
                    <div className="flex items-center">
                      {!mobileSearchOpen ? (
                        <button
                          className="bg-background/80 text-primary rounded-full p-2 shadow"
                          aria-label="Open search"
                          onClick={() => setMobileSearchOpen(true)}
                        >
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </button>
                      ) : (
                        <div className="relative flex items-center" ref={mobileSearchRef}>
                          <input
                            className="rounded-full px-3 py-1.5 text-sm bg-background/90 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary w-40 transition-all"
                            type="text"
                            placeholder="Search..."
                            value={mobileSearchValue}
                            onChange={e => setMobileSearchValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label="Close search"
                            onClick={() => setMobileSearchOpen(false)}
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Desktop header */}
                <div className="hidden md:flex items-center w-full h-full px-4">
                  {["/projects", "/notifications"].includes(location.pathname) ? (
                    <div className="flex items-center justify-center w-full">
                      <SearchBar />
                    </div>
                  ) : ["/career-insights", "/career-workspace", "/career-goals", "/real-time-resume", "/settings", "/help", "/talent-hub", "/ai-business-school", "/postjob"].some(path => location.pathname.startsWith(path) || location.pathname.startsWith("/apply")) ? (
                    <div className="w-full" />
                  ) : (
                    <div className="flex items-center gap-6 mx-auto">
                      {location.pathname !== "/chat" && <FeedTypeToggle />}
                      <SearchBar />
                    </div>
                  )}
                </div>
              </header>
            )}
            <main className="flex-1 animate-fade-in" style={{ backgroundColor: "#0C112A" }}>
              <Outlet />
            </main>
          </div>
          {(
            !isJobPostPage &&
            (
              ["/", "/projects", "/notifications"].includes(location.pathname) ||
              (location.pathname.startsWith("/post") && location.pathname !== "/postjob")
            )
          ) && (
            <div
              className="hidden md:block flex-shrink-0"
              style={{
                width: 320,
                marginTop: 0,
                marginRight: "16px",
                position: "sticky",
                top: "6.5rem",
                alignSelf: "flex-start",
                height: "calc(100vh - 6.5rem)",
              }}
            >
              <RightSidebar />
            </div>
          )}
        </div>
      <ExaChatbot />
      <AccountSwitchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </FeedTypeContext.Provider>
  );
};

export default Layout;
