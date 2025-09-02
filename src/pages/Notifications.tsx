import React from "react";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

const socialNotifications: Notification[] = [
  {
    id: "1",
    message: "Alex liked your post: 'Building with Qolabs'.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "2",
    message: "Jamie commented: 'Great insights!' on your post.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "3",
    message: "Taylor started following you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "4",
    message: "You were mentioned by Morgan in a post.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Notifications: React.FC = () => (
  <div className="max-w-xl mx-auto py-10 px-4">
    {/* Mobile header: menu + search */}
    <div className="flex items-center gap-2 mb-4 md:hidden">
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full"
        aria-label="Open menu"
        onClick={() => window.dispatchEvent(new CustomEvent('open-sidebar'))}
      >
        <Menu className="h-6 w-6" />
      </Button>
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notifications"
          className="pl-8"
        />
      </div>
    </div>
    {/* Desktop header */}
    <h1 className="text-2xl font-semibold text-foreground mb-6 hidden md:block">Notifications</h1>
    <ul className="divide-y divide-border">
      {socialNotifications.length === 0 ? (
        <li className="text-muted-foreground text-center py-8">
          No notifications yet.
        </li>
      ) : (
        socialNotifications.map((n) => (
          <li key={n.id} className="py-4 flex flex-col">
            <span className="text-base text-foreground">{n.message}</span>
            <span className="text-xs text-muted-foreground mt-1">{formatTimeAgo(n.timestamp)}</span>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default Notifications;
