import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import BlogDetail from "@/pages/blog-detail";
import NotFound from "@/pages/not-found";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import ApplyPage from "./pages/ApplyPage";
import ApplyIncubator from "./pages/ApplyIncubator";
// 🔐 Protected Route Component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return children;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogDetail} />
      <Route path="/apply" component={ApplyPage} />
      <Route path="/applyincubator">
        <ProtectedRoute>
          <ApplyIncubator />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showNavbar = !location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showNavbar && <Navbar />}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
