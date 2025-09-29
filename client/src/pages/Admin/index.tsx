import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { AdvancedLoader } from "@/components/ui/AdvancedLoader";

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
      if (!user) navigate("/login");
    });

    return () => unsub();
  }, []);

  if (!authChecked) return <AdvancedLoader fullScreen message="Verifying admin session..." />;
  return isLoggedIn ? <AdminDashboard /> : null;
}
