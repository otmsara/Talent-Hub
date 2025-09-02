import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User as UserIcon,
  Puzzle, 
  Bell, 
  Search, 
  MessageCircle,
  X,
  Sparkles
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { users, posts, currentUser, User as UserType } from '@/data/dummyData';
import { getPromptsByCreator, dummyPrompts, Prompt } from '@/data/dummyPrompts';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState([
    { id: 'n1', userId: 'u2', type: 'follow', text: 'Alex Johnson started networking with you', time: '10m ago', read: false, targetId: 'u2' },
    { id: 'n2', userId: 'u3', type: 'like', text: 'Sophia Chen agreed with your post', time: '30m ago', read: false, targetId: 'p5' },
    { id: 'n3', userId: 'u4', type: 'comment', text: 'Marcus Green commented on your project', time: '1h ago', read: true, targetId: 'p4' },
    { id: 'n4', userId: 'u5', type: 'mention', text: 'Luna Park mentioned you in a post', time: '3h ago', read: true, targetId: 'p3' },
    { id: 'n5', userId: 'u3', type: 'project', text: 'Sophia Chen invited you to collaborate on a project', time: '5h ago', read: true, targetId: 'p2' },
  ]);
  
  const [messages, setMessages] = useState([
    { id: 'm1', userId: 'u2', text: 'Hey, what do you think about the new design system?', time: '5m ago', read: false },
    { id: 'm2', userId: 'u3', text: 'I reviewed your code, it looks great!', time: '1h ago', read: false },
    { id: 'm3', userId: 'u5', text: 'Let\'s catch up on the project tomorrow', time: '3h ago', read: true },
    { id: 'm4', userId: 'u4', text: 'Can you share the 3D model files?', time: 'Yesterday', read: true },
  ]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getSearchResults = () => {
    if (!searchQuery.trim()) return { users: [], posts: [], prompts: [] };
    
    const query = searchQuery.toLowerCase();
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.username.toLowerCase().includes(query)
    );
    
    const filteredPosts = posts.filter(post => 
      post.text.toLowerCase().includes(query)
    );
    
    const filteredPrompts = dummyPrompts.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query)
    );
    
    return { 
      users: filteredUsers.slice(0, 5), 
      posts: filteredPosts.slice(0, 5),
      prompts: filteredPrompts.slice(0, 5)
    };
  };

  const { users: searchUsers, posts: searchPosts, prompts: searchPrompts } = getSearchResults();

  const handleMarkAllRead = (type: 'notifications' | 'messages') => {
    if (type === 'notifications') {
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      toast({
        title: "Notifications",
        description: "All notifications marked as read",
      });
    } else {
      setMessages(prev => prev.map(message => ({ ...message, read: true })));
      toast({
        title: "Messages",
        description: "All messages marked as read",
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    setNotificationsOpen(false);
    
    if (notification.type === 'follow' || notification.type === 'mention') {
      navigate(`/profile/${notification.userId}`);
    } else if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'project') {
      const targetPost = posts.find(post => post.id === notification.targetId);
      if (targetPost) {
        if (targetPost.isProject) {
          navigate('/projects');
        } else {
          navigate('/');
          toast({
            title: "Navigation",
            description: `Navigated to ${targetPost.isProject ? 'project' : 'post'}`,
          });
        }
      }
    }
  };

  const getUserById = (userId: string): UserType => {
    if (userId === currentUser.id) return currentUser;
    return users.find(u => u.id === userId) || currentUser;
  };

  const goToChat = (userId?: string) => {
    setMessagesOpen(false);
    navigate('/chat');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1225]/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <span className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">S</span>
            <span className="hidden sm:inline-block">Sphere</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span className="flex items-center">
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </span>
            </Link>
            <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
              <span className="flex items-center">
                <Puzzle className="w-5 h-5 mr-1" />
                <span>Projects</span>
              </span>
            </Link>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              <span className="flex items-center">
                <Sparkles className="w-5 h-5 mr-1" />
                <span>Marketplace</span>
              </span>
            </Link>
            <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
              <span className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>Messages</span>
              </span>
            </Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              <span className="flex items-center">
                <UserIcon className="w-5 h-5 mr-1" />
                <span>Profile</span>
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <button className="icon-button" onClick={() => setSearchOpen(true)}>
              <Search className="w-5 h-5" />
            </button>
            <button className="icon-button relative" onClick={() => setNotificationsOpen(true)}>
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button className="icon-button relative" onClick={() => setMessagesOpen(true)}>
              <MessageCircle className="w-5 h-5" />
              {messages.filter(m => !m.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            <Link to="/profile">
              <img 
                src="https://i.pravatar.cc/150?img=12" 
                alt="User Avatar" 
                className="avatar w-8 h-8 hover:opacity-90 transition-opacity duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="md:hidden border-t border-border/30 bg-[#0a1225]/90 fixed bottom-0 left-0 right-0 z-40">
        <div className="flex justify-around py-2">
          <Link to="/" className={`p-2 rounded-md ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="w-6 h-6 mx-auto" />
          </Link>
          <Link to="/projects" className={`p-2 rounded-md ${isActive('/projects') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Puzzle className="w-6 h-6 mx-auto" />
          </Link>
          <Link to="/marketplace" className={`p-2 rounded-md ${isActive('/marketplace') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Sparkles className="w-6 h-6 mx-auto" />
          </Link>
          <Link to="/chat" className={`p-2 rounded-md ${isActive('/chat') ? 'text-primary' : 'text-muted-foreground'}`}>
            <MessageCircle className="w-6 h-6 mx-auto" />
          </Link>
          <Link to="/profile" className={`p-2 rounded-md ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
            <UserIcon className="w-6 h-6 mx-auto" />
          </Link>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Sphere</DialogTitle>
            <DialogDescription>
              Find people, posts, and marketplace items
            </DialogDescription>
          </DialogHeader>
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search people, posts, projects..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              
              {searchUsers.length > 0 && (
                <CommandGroup heading="People">
                  {searchUsers.map(user => (
                    <CommandItem 
                      key={user.id} 
                      onSelect={() => {
                        setSearchOpen(false);
                        window.location.href = `/profile/${user.id}`;
                      }}
                      className="flex items-center"
                    >
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">@{user.username}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {searchPosts.length > 0 && (
                <CommandGroup heading="Posts">
                  {searchPosts.map(post => (
                    <CommandItem 
                      key={post.id} 
                      onSelect={() => {
                        setSearchOpen(false);
                        toast({
                          title: "Post",
                          description: "Post view not implemented yet"
                        });
                      }}
                    >
                      <div className="truncate max-w-md">{post.text}</div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchPrompts.length > 0 && (
                <CommandGroup heading="Marketplace">
                  {searchPrompts.map(prompt => (
                    <CommandItem 
                      key={prompt.id} 
                      onSelect={() => {
                        setSearchOpen(false);
                        window.location.href = `/marketplace`;
                      }}
                    >
                      <div>
                        <div className="font-medium">{prompt.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-md">{prompt.description}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle>Notifications</DialogTitle>
            <button 
              className="text-sm text-primary hover:underline" 
              onClick={() => handleMarkAllRead('notifications')}
            >
              Mark all as read
            </button>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map(notification => {
                const user = getUserById(notification.userId);
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 ${
                      notification.read ? 'bg-card' : 'bg-primary/5'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={messagesOpen} onOpenChange={setMessagesOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle>Messages</DialogTitle>
            <div className="flex gap-2">
              <button 
                className="text-sm text-primary hover:underline" 
                onClick={() => goToChat()}
              >
                View all
              </button>
              <button 
                className="text-sm text-primary hover:underline" 
                onClick={() => handleMarkAllRead('messages')}
              >
                Mark all as read
              </button>
            </div>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages
              </div>
            ) : (
              messages.map(message => {
                const user = getUserById(message.userId);
                return (
                  <div 
                    key={message.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 ${
                      message.read ? 'bg-card' : 'bg-primary/5'
                    }`}
                    onClick={() => goToChat(user.id)}
                  >
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm truncate max-w-[280px]">{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
