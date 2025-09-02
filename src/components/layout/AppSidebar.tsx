
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User as UserIcon, Bell, Briefcase, Settings, HelpCircle, LogOut, ChevronLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Qolabs",
    url: "/",
    icon: Home,
    isActive: (pathname: string) => pathname === "/",
    enabled: true,
  },
  {
    title: "Messages",
    url: "/chat",
    icon: MessageCircle,
    isActive: (pathname: string) => pathname === "/chat",
    enabled: true,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserIcon,
    isActive: (pathname: string) => pathname === "/profile",
    enabled: true,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Briefcase,
    isActive: (pathname: string) => pathname === "/projects",
    enabled: false,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    isActive: (pathname: string) => pathname === "/settings",
    enabled: false,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    isActive: (pathname: string) => pathname === "/help",
    enabled: false,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
    isActive: () => false,
    enabled: false,
    onClick: () => {
      console.log("Notifications clicked");
    }
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar className="border-r border-gray-800" collapsible="icon" style={{ backgroundColor: '#0C112A' }}>
      <SidebarHeader className="p-6" style={{ backgroundColor: '#0C112A' }}>
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">Qolabs</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4" style={{ backgroundColor: '#0C112A' }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={!item.onClick && item.enabled}
                    isActive={item.enabled && item.isActive(location.pathname)}
                    className={`w-full justify-start h-12 text-base font-medium rounded-lg transition-all duration-200 ${
                      item.enabled 
                        ? 'hover:bg-gray-800 hover:text-white cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed hover:bg-transparent'
                    }`}
                    onClick={item.onClick}
                    tooltip={item.title}
                    disabled={!item.enabled}
                  >
                    {item.onClick || !item.enabled ? (
                      <button 
                        className="flex items-center space-x-3 w-full"
                        disabled={!item.enabled}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </button>
                    ) : (
                      <Link to={item.url} className="flex items-center space-x-3 w-full">
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-800" style={{ backgroundColor: '#0C112A' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start h-10 text-sm font-medium rounded-lg transition-all duration-200 opacity-50 cursor-not-allowed hover:bg-transparent"
              tooltip="Sign Out"
              disabled={true}
            >
              <button className="flex items-center space-x-3 w-full" disabled>
                <LogOut className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {/* Custom Hide Button */}
        <div className="mt-4 border-t border-gray-800 pt-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 w-full text-gray-400 hover:text-white transition-colors duration-200 text-sm group-data-[collapsible=icon]:justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Hide</span>
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden mt-2">
          © 2024 Qolabs
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
