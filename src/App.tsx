import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CameraPage from "./pages/CameraPage";
import EmergencyPage from "./pages/EmergencyPage";
import AboutDevice from "./pages/AboutDevice";
import NotFound from "./pages/NotFound";
import NavigationPage from "./pages/NavigationPage";
import LocationPage from "./pages/LocationPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="iris-theme">
        <BrowserRouter>
          <TooltipProvider>
            <ThemeToggle />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/navigation" element={<NavigationPage />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/about-device" element={<AboutDevice />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
