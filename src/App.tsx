import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import FollowStory from "./pages/FollowStory.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import RecordFlow from "./pages/RecordFlow.tsx";
import DeviceSetup from "./pages/DeviceSetup.tsx";
import CreatorHome from "./pages/CreatorHome.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/follow" element={<FollowStory />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/record" element={<RecordFlow />} />
          <Route path="/device-setup" element={<DeviceSetup />} />
          <Route path="/creator-home" element={<CreatorHome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
