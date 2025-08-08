// src/components/navbar.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminModal } from "./admin-modal";
import { IncubatorSignupModal } from "./ui/IncubatorSignupModal";
import { useLocation } from "wouter";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showIncubatorModal, setShowIncubatorModal] = useState(false);
  const { user, isAdmin, userProfile, logout } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const currentPath = location;

    if (currentPath !== "/") {
      localStorage.setItem("scrollTo", sectionId);
      navigate("/");
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    setIsOpen(false);
  };

  const handleAdminClick = () => {
    if (user && isAdmin) {
      navigate("/admin");
    } else {
      setShowAdminModal(true);
    }
  };

  const handleIncubatorClick = () => {
    if (user && !isAdmin) {
      // User is logged in as incubator, go to application
      navigate("/applyincubator");
    } else if (!user) {
      // Not logged in, show signup modal
      setShowIncubatorModal(true);
    }
  };

  const renderAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button
              onClick={() => navigate("/admin")}
              className="hidden lg:block bg-primary-blue hover:bg-accent-blue text-sm"
            >
              Admin Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="hidden lg:block text-sm"
            >
              Logout
            </Button>
          </>
        );
      } else {
        // Incubator user
        return (
          <>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="hidden lg:block text-sm"
            >
              Logout
            </Button>
          </>
        );
      }
    } else {
      return (
        <>
          <Button
            onClick={handleAdminClick}
            className="hidden lg:block bg-primary-blue hover:bg-accent-blue text-sm"
          >
            Admin
          </Button>
          <Button
            onClick={handleIncubatorClick}
            className="hidden lg:block bg-green-600 hover:bg-green-700 text-sm"
          >
            Incubator Login
          </Button>
        </>
      );
    }
  };

  const renderMobileAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button
              onClick={() => navigate("/admin")}
              className="w-full bg-primary-blue hover:bg-accent-blue text-sm"
            >
              Admin Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full mt-2 text-sm"
            >
              Logout
            </Button>
          </>
        );
      } else {
        return (
          <>
            <Button
              onClick={() => navigate("/applyincubator")}
              className="w-full bg-green-600 hover:bg-green-700 text-sm"
            >
              Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full mt-2 text-sm"
            >
              Logout
            </Button>
          </>
        );
      }
    } else {
      return (
        <>
          <Button
            onClick={handleAdminClick}
            className="w-full bg-primary-blue hover:bg-accent-blue mb-2 text-sm"
          >
            Admin
          </Button>
          <Button
            onClick={handleIncubatorClick}
            className="w-full bg-green-600 hover:bg-green-700 text-sm"
          >
            Incubator Login
          </Button>
        </>
      );
    }
  };

  return (
    <>
      {/* Announcement Bar - Only show for non-admin users */}
      {!isAdmin && (
        <div
          onClick={handleIncubatorClick}
          className="bg-yellow-400 text-black text-xs sm:text-sm text-center py-2 cursor-pointer hover:bg-yellow-300 transition-all"
        >
          🚀 Apply as an Incubator — Click here to get started!
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Get Grants</h1>
              {user && isAdmin && (
                <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-blue-600 font-medium">
                  Admin
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
                <button onClick={() => scrollToSection("home")} className="text-primary-blue hover:text-accent-blue font-medium text-sm">Home</button>
                <button onClick={() => scrollToSection("grants")} className="text-gray-600 hover:text-primary-blue font-medium text-sm">Grants</button>
                <button onClick={() => scrollToSection("blog")} className="text-gray-600 hover:text-primary-blue font-medium text-sm">Blog</button>
                <button onClick={() => scrollToSection("about")} className="text-gray-600 hover:text-primary-blue font-medium text-sm">About</button>
                <button onClick={() => scrollToSection("contact")} className="text-gray-600 hover:text-primary-blue font-medium text-sm">Contact</button>
                {/* Only show Apply As Incubator for non-admin users */}
                {!isAdmin && (
                  <button onClick={handleIncubatorClick} className="text-gray-600 hover:text-primary-blue font-medium text-sm">Apply As Incubator</button>
                )}
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <button onClick={() => scrollToSection("home")} className="block w-full text-left px-3 py-2 text-primary-blue font-medium text-sm">Home</button>
              <button onClick={() => scrollToSection("grants")} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm">Grants</button>
              <button onClick={() => scrollToSection("blog")} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm">Blog</button>
              <button onClick={() => scrollToSection("about")} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm">About</button>
              <button onClick={() => scrollToSection("contact")} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm">Contact</button>
              {/* Only show Apply As Incubator for non-admin users */}
              {!isAdmin && (
                <button onClick={handleIncubatorClick} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-blue text-sm">Apply As Incubator</button>
              )}

              <div className="px-3 py-2">
                {renderMobileAuthButtons()}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
      <IncubatorSignupModal
        isOpen={showIncubatorModal}
        onClose={() => setShowIncubatorModal(false)}
      />
    </>
  );
}