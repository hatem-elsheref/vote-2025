import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle GitHub Pages 404.html redirects
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle query parameter routing from 404.html
    const query = new URLSearchParams(location.search);
    const redirectPath = query.get('/');
    if (redirectPath && redirectPath !== location.pathname) {
      const decodedPath = redirectPath.replace(/~and~/g, '&');
      navigate(decodedPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const App = () => {
  // Debug: Log base URL
  if (typeof window !== 'undefined') {
    console.log('BASE_URL:', import.meta.env.BASE_URL);
    console.log('Current path:', window.location.pathname);
  }

  const basename = import.meta.env.BASE_URL === '/' 
    ? undefined 
    : import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
