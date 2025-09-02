import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import PostView from "./pages/PostView";
import SearchResults from "./pages/SearchResults";
import TalentHub from "./pages/TalentHub";
import CareerGoals from "./pages/CareerGoals";
import RealTimeResume from "./pages/RealTimeResume";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import UploadLogic from "./pages/AICareerInsights";
import CareerWorkspace from "./pages/CareerWorkspace";
import AIBusinessSchool from "./pages/AIBusinessSchool";
import Layout from "./components/layout/Layout";
import { AccountProvider } from "./contexts/AccountContext";
import PostJob from "./pages/PostJob";
import { JobProvider } from "./contexts/JobContext";
import ApplyJob from "./pages/ApplyJob";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AccountProvider>
        <JobProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="projects" element={<Projects />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="chat" element={<Chat />} />
                <Route path="post/:postId" element={<PostView />} />
                <Route path="search/:topic" element={<SearchResults />} />
                <Route path="talent-hub" element={<TalentHub />} />
                <Route path="postjob" element={<PostJob />} />
                <Route path="postjob/:id" element={<PostJob />} />
                <Route path="ai-business-school" element={<AIBusinessSchool />} />
                <Route path="apply/:jobId" element={<ApplyJob />} />
                <Route path="apply/:jobId/:phaseIndex" element={<ApplyJob />} />
                <Route path="career-goals" element={<CareerGoals />} />
                <Route path="real-time-resume" element={<RealTimeResume />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
                <Route path="career-insights" element={<UploadLogic />} />
                <Route path="career-workspace" element={<CareerWorkspace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </JobProvider>
      </AccountProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
