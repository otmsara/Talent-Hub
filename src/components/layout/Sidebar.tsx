// Responsive icon size hook
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageCircle,
  User as UserIcon,
  Bell,
  Briefcase,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Target,
  ClipboardList,
  FileText,
  Home,
  LayoutGrid,
  GraduationCap
} from "lucide-react";
import AccountSwitchModal from "../ui/AccountSwitchModal";

function useSidebarIconSize() {
  const [iconSize, setIconSize] = useState(window.innerWidth < 768 ? 16 : 22);
  useEffect(() => {
    function handleResize() {
      setIconSize(window.innerWidth < 768 ? 16 : 22);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return iconSize;
}

const SIDEBAR_WIDTH = 256; // 16rem
const SIDEBAR_COLLAPSED_WIDTH = 64; // 4rem

export default function Sidebar({ onWidthChange }: { onWidthChange?: (w: number) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const iconSize = useSidebarIconSize();

  const menuItems = [
    {
      title: "Qolabs",
      url: "/",
      icon: <Home size={iconSize} />,
    },
    {
      title: "My Projects",
      url: "/projects",
      icon: <Briefcase size={iconSize} />,
    },
    {
      title: "Messages",
      url: "/chat",
      icon: <MessageCircle size={iconSize} />,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: <Bell size={iconSize} />,
    },
    {
      title: "AI Career Insights",
      url: "/career-insights",
      icon: <BarChart2 size={iconSize} />,
    },
    {
      title: "Career Workspace",
      url: "/career-workspace",
      icon: <LayoutGrid size={iconSize} />,
    },
    {
      title: "Real-Time Resume",
      url: "/real-time-resume",
      icon: <FileText size={iconSize} />,
    },
    {
      title: "Career Goals",
      url: "/career-goals",
      icon: <Target size={iconSize} />,
    },
    {
      title: "Talent Hub",
      url: "/talent-hub",
      icon: <ClipboardList size={iconSize} />,
    },
    {
      title: "AI Business School",
      url: "/ai-business-school",
      icon: <GraduationCap size={iconSize} />,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <UserIcon size={iconSize} />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings size={iconSize} />,
    },
    {
      title: "Help",
      url: "/help",
      icon: <HelpCircle size={iconSize} />,
    },
  ];

  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH);
    }
  }, [collapsed, onWidthChange]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen md:h-screen bg-[#0C112A] border-r border-gray-800 flex flex-col transition-all duration-200 z-40`}
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        minWidth: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        maxWidth: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        height: "100vh",
      }}
    >
      {/* Logo/Header - align with top bar */}
      <div className="border-b border-gray-800 px-4 pt-4 pb-3" style={{ minHeight: "4.5rem" }}>
        <Link to="/" className="flex items-start w-full gap-3">
          <img
            src="https://beta.iamarya.org/_next/static/media/logo.214a1457.png"
            alt="Arya Logo"
            className="w-10 h-10 mt-1 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">Arya</span>
                <span className="bg-gray-700 text-xs text-white font-semibold px-2 py-0.5 rounded-md">BETA</span>
              </div>
              <span className="text-sm text-gray-400" style={{ marginTop: 2 }}>Powered by Valhko</span>
            </div>
          )}
        </Link>
      </div>

      {/* Menu and Footer (scrollable together) */}
      <div className="flex-1 flex flex-col items-stretch min-h-0 overflow-y-auto">
        <nav className="flex flex-col items-stretch mt-4 gap-1">
          {menuItems.map((item) => {
            // Qolabs should be active for "/" and "/post/:id"
            let isActive = location.pathname === item.url;
            if (item.title === "Qolabs" && (location.pathname === "/" || /^\/post\/\w+/.test(location.pathname))) {
              isActive = true;
            }
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`
                  flex items-center h-12 px-3 rounded-lg transition-all duration-150 relative
                  ${isActive
                    ? "font-bold text-white"
                    : "text-gray-400/60 hover:bg-[#0891b2]/30 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.35)] hover:text-white/90"} 
                  ${collapsed ? "justify-center w-11 mx-auto" : "w-full"}
                `}
                title={item.title}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-4 text-base relative">
                    {item.title}
                    {isActive && (
                      <span
                        className="absolute left-0 right-0 -bottom-1"
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
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider above footer */}
        <div className="px-4">
          <div className="border-t border-gray-800 my-4" />
        </div>

        {/* Footer (always visible, now scrolls with menu) */}
        <div className="flex flex-col items-stretch px-2 mb-4 gap-2">
        {/* flex-1 flex flex-col items-stretch min-h-0 overflow-y-auto */}
          {/* Sign Out Button */}
          <button
            className={`flex items-center h-11 rounded-lg text-gray-400 hover:text-white hover:bg-[#0891b2]/30 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.35)] transition-all duration-150 ${
              collapsed ? "justify-center px-0 w-11" : "justify-start px-3 w-full"
            }`}
            title="Sign Out"
            onClick={() => setModalOpen(true)}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-4 text-sm whitespace-nowrap">Sign Out</span>}
          </button>

          {/* Collapse/Expand Button */}
          <button
            className={`flex items-center justify-center h-11 rounded-lg text-gray-400 hover:text-white hover:bg-[#0891b2]/30 hover:shadow-[0_0_12px_2px_rgba(34,211,238,0.35)] transition-all duration-150 ${
              collapsed ? "w-11 px-0" : "w-full px-3"
                      }`}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>
      <AccountSwitchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  );
}
