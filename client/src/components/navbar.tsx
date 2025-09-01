import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket, User as UserIcon, LogOut, Crown, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminModal } from "./admin-modal";
import { IncubatorSignupModal } from "./ui/IncubatorSignupModal";
import { Link, useLocation } from "wouter";
import { AuthModal } from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
    { name: 'Explore Grants', action: () => navigate('/grants')},
    { name: 'Premium Support', action: () => navigate('/premium-support') },
    { name: 'Blog', action: () => scrollToSection('blog') },
  ];

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
            <Button size="lg" onClick={() => navigate("/admin")} className="hidden lg:block bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Admin Dashboard</Button>
            <Button size="lg" onClick={handleLogout} variant="destructive" className="hidden lg:block rounded-xl shadow-lg font-semibold">Logout</Button>
          </>
        );
      } else {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-violet/50">
                            <AvatarFallback className="bg-violet/20 text-violet font-bold">
                                {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || <UserIcon />}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                   
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
      }
    } else {
      return <Button size="lg" onClick={() => setIsAuthModalOpen(true)} className="hidden lg:block bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Login</Button>;
    }
  };

  const renderMobileAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button size="lg" onClick={() => navigate("/admin")} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Admin Dashboard</Button>
            <Button size="lg" onClick={handleLogout} variant="destructive" className="w-full mt-2 rounded-xl shadow-lg font-semibold">Logout</Button>
          </>
        );
      } else {
        return (
            <>
                <p className="px-3 py-2 font-semibold text-violet">{user.fullName}</p>
                <Button onClick={() => navigate('/profile')} variant="ghost" className="w-full justify-start text-violet">My Profile</Button>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600">Logout</Button>
            </>
        );
      }
    } else {
      return <Button size="lg" onClick={() => setIsAuthModalOpen(true)} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Login</Button>;
    }
  };

  return (
    <>
      {!isAdmin && (
        <div onClick={handleIncubatorClick} className="bg-rose-gold text-violet text-xs sm:text-sm text-center py-2 cursor-pointer hover:bg-pink transition-all font-semibold">
          🚀 Apply as an Incubator — Click here to get started!
        </div>
      )}

      <nav className="bg-yellowish-white shadow-lg border-b-2 border-pink sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 text-violet hover:text-pink transition-colors">
              <Rocket className="h-8 w-8 sm:h-9 sm:w-9" />
              <span className="text-xl sm:text-2xl font-bold">Get Grants</span>
            </Link>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
                {navItems.map((item) => (
                  <button key={item.name} onClick={item.action} className="text-violet hover:text-pink font-medium text-base xl:text-lg transition-colors">{item.name}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {renderAuthButtons()}
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 sm:h-10 sm:w-10 text-violet hover:text-pink hover:bg-pink/10 rounded-xl">
                  {isOpen ? <X className="h-4 w-4 sm:h-6 sm:w-6" /> : <Menu className="h-4 w-4 sm:h-6 sm:w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden border-t-2 border-pink">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-yellowish-white">
              {navItems.map((item) => (
                <button key={item.name} onClick={item.action} className="block w-full text-left px-3 py-2 text-violet hover:text-pink text-sm transition-colors">{item.name}</button>
              ))}
              <div className="px-3 py-2 border-t-2 border-pink mt-2 pt-3">
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