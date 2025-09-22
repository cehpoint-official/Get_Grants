import { Switch, Route, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BlogDetail from "@/pages/blog-detail";
import NotFound from "@/pages/not-found";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import GrantsPage from "./pages/GrantsPage";
import GrantDetailPage from "./pages/GrantDetailPage";
import ApplyPage from "./pages/ApplyPage";
import ApplyIncubator from "./pages/ApplyIncubator";
import PremiumSupportPage from "./pages/PremiumSupportPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import ContactUs from "@/pages/ContactUs";
import About from "@/pages/About";
import { useIsMobile } from "@/hooks/use-mobile";
import { getToken } from "firebase/messaging";
import { messaging, db } from "./lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

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
      <Route path="/about" component={About} />
      <Route path="/blog-detail" component={BlogDetail} />
      <Route path="/apply" component={ApplyPage} />
      <Route path="/grants" component={GrantsPage} />
      <Route path="/grant/:id" component={GrantDetailPage} />
      <Route path="/premium-support" component={PremiumSupportPage} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/applyincubator">
        <ProtectedRoute>
          <ApplyIncubator />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registration successful, scope is:", registration.scope);
        })
        .catch((err) => {
          console.log("Service Worker registration failed:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (user && messaging) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY }).then(async (currentToken) => {
            if (currentToken) {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                fcmToken: currentToken,
              });
            }
          }).catch((err) => {
            console.error("Firebase getToken error:", err);
          });
        }
      });
    }
  }, [user]);


  useEffect(() => {
    const hasHash = typeof window !== 'undefined' && window.location.hash && window.location.hash.length > 1;
    const pendingSection = typeof window !== 'undefined' ? localStorage.getItem('scrollTo') : null;
    if (!hasHash && !pendingSection) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  const isAdminRoute = location.startsWith("/admin");
  const isMobileDashboard = location.startsWith("/dashboard") && isMobile;

  const showNavbar = !isAdminRoute && !isMobileDashboard;

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