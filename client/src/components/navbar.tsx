import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminModal } from "./admin-modal";
import { IncubatorSignupModal } from "./ui/IncubatorSignupModal";
import { Link, useLocation } from "wouter";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showIncubatorModal, setShowIncubatorModal] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const [location, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      localStorage.setItem("scrollTo", sectionId);
      navigate("/");
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };


  const navItems = [
    { name: 'Home', action: () => scrollToSection('home') },
    { name: 'Explore Grants', action: () => scrollToSection('grants') },
    { name: 'Founders Area', action: () => scrollToSection('founders-area') },
    { name: 'Incubator Area', action: () => scrollToSection('incubator-area') },
    { name: 'Premium Support', action: () => scrollToSection('premium-support') },
  ] as const;

  type NavItem = typeof navItems[number];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleIncubatorClick = () => {
    if (user && !isAdmin) {
      navigate("/applyincubator");
    } else if (!user) {
      setShowIncubatorModal(true);
    }
  };

  const renderAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button onClick={() => navigate("/admin")} className="hidden lg:block bg-primary-blue hover:bg-accent-blue text-sm">Admin Dashboard</Button>
            <Button onClick={handleLogout} variant="destructive" className="hidden lg:block text-sm">Logout</Button>
          </>
        );
      } else {
        return <Button onClick={handleLogout} variant="destructive" className="hidden lg:block text-sm">Logout</Button>;
      }
    } else {
      return <Button onClick={() => setIsAuthModalOpen(true)} className="hidden lg:block bg-primary-blue hover:bg-accent-blue">Login/Signup</Button>;
    }
  };

  const renderMobileAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button onClick={() => navigate("/admin")} className="w-full bg-primary-blue hover:bg-accent-blue text-sm">Admin Dashboard</Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-2 text-sm">Logout</Button>
          </>
        );
      } else {
        return <Button onClick={handleLogout} variant="destructive" className="w-full mt-2 text-sm">Logout</Button>;
      }
    } else {
      return <Button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-primary-blue hover:bg-accent-blue">Login/Signup</Button>;
    }
  };

  return (
    <>
      {!isAdmin && (
        <div onClick={handleIncubatorClick} className="bg-yellow-400 text-black text-xs sm:text-sm text-center py-2 cursor-pointer hover:bg-yellow-300 transition-all">
          🚀 Apply as an Incubator — Click here to get started!
        </div>
      )}

      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-primary-blue transition-colors">
              <Rocket className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-lg sm:text-xl font-bold">Get Grants</span>
            </Link>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
                {navItems.map((item) => (
                  <button 
                    key={item.name} 
                    onClick={item.action} 
                    className="text-gray-600 hover:text-primary-blue font-medium text-sm"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {renderAuthButtons()}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 sm:h-10 sm:w-10">
                  {isOpen ? <X className="h-4 w-4 sm:h-6 sm:w-6" /> : <Menu className="h-4 w-4 sm:h-6 sm:w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => { item.action(); setIsOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2 border-t mt-2 pt-3">
                {renderMobileAuthButtons()}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
      <IncubatorSignupModal isOpen={showIncubatorModal} onClose={() => setShowIncubatorModal(false)} />
    </>
  );
}