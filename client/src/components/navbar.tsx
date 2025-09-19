import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminModal } from "./admin-modal";
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
import { NotificationConsentModal } from "@/components/ui/NotificationConsentModal";
import { scrollToSectionWithOffset } from "@/lib/scrollUtils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const { user, isAdmin, logout } = useAuth();
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [location, navigate] = useLocation();
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    if (user && !user.notificationConsentGiven && !isAdmin) {
      setShowNotifyModal(true);
    } else {
      setShowNotifyModal(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (location === '/') {
      setActiveLink('Home');
    } else if (location.startsWith('/grants')) {
      setActiveLink('Find Grants');
    } else if (location.startsWith('/premium-support')) {
      setActiveLink('Pricing');
    } else if (location.startsWith('/blog-detail')) {
      setActiveLink('Blog');
    } else if (location.startsWith('/about')) {
      setActiveLink('About');
    } else if (location.startsWith('/contact')) {
      setActiveLink('Contact');
    } else {
      setActiveLink('');
    }
  }, [location]);

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && sectionId) {
      if (location === '/') {
        scrollToSectionWithOffset(sectionId);
      } else {
        navigate(`/#${sectionId}`);
      }
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', action: () => handleNavigation('/', 'home') },
    { name: 'Find Grants', action: () => handleNavigation('/grants') },
    { name: 'Pricing', action: () => handleNavigation('/premium-support') },
    { name: 'Blog', action: () => handleNavigation('/', 'blog') },
    { name: 'About', action: () => handleNavigation('/about') },
    { name: 'Contact', action: () => handleNavigation('/contact') },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    setAuthInitialMode('login');
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };
  
  const handleSignupClick = () => {
    setAuthInitialMode('signup');
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };
  
  const renderAuthButtons = () => {
    if (user) {
      if (isAdmin) {
        return (
          <>
            <Button variant="ghost" onClick={() => navigate("/admin")} className="hidden lg:inline-flex text-nav-dark font-semibold">Admin Dashboard</Button>
            <Button onClick={handleLogout} className="hidden lg:inline-flex text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 transition-opacity">
              Logout
            </Button>
          </>
        );
      } else {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-violet/50 overflow-hidden">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
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
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>My Dashboard</span>
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
      return (
        <>
            <Button variant="ghost" onClick={handleLoginClick} className="hidden lg:inline-flex text-nav-dark font-semibold ">Login</Button>
            <Button onClick={handleSignupClick} className="hidden lg:inline-flex text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 transition-opacity">
              Sign Up
            </Button>
        </>
      );
    }
  };

  const renderMobileAuthButtons = () => {
    if (user) {
        if (isAdmin) {
          return (
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleNavigation("/admin")} variant="ghost" className="w-full font-semibold text-nav-dark">Admin Dashboard</Button>
              <Button onClick={handleLogout} className="w-full text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)]">Logout</Button>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col gap-2">
                <Button onClick={() => handleNavigation('/dashboard')} variant="ghost" className="w-full font-semibold text-nav-dark">My Dashboard</Button>
                <Button onClick={handleLogout} className="w-full text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)]">Logout</Button>
            </div>
          );
        }
      } else {
        return (
          <div className="flex flex-col gap-2">
            <Button onClick={handleLoginClick} variant="ghost" className="w-full font-semibold text-nav-dark">Login</Button>
            <Button onClick={handleSignupClick} className="w-full text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)]">Sign Up</Button>
          </div>
        );
      }
  };

  return (
    <>
      <nav className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-violet" />
              <span className="text-2xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">Get Grants</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button 
                  key={item.name} 
                  onClick={item.action} 
                  className={`font-medium text-base transition-colors relative ${
                    activeLink === item.name 
                    ? 'text-nav-pink-accent' 
                    : 'text-nav-gray hover:text-nav-dark'
                  }`}
                >
                  {item.name}
                  {activeLink === item.name && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-nav-pink-accent rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center gap-2">
                {renderAuthButtons()}
              </div>
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <button 
                  key={item.name} 
                  onClick={item.action} 
                  className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeLink === item.name ? 'text-nav-pink-accent bg-pink-50' : 'text-nav-gray'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t pt-4 mt-4">
                {renderMobileAuthButtons()}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
      <AdminModal isOpen={false} onClose={() => {}} />
      <NotificationConsentModal isOpen={showNotifyModal && !!user && !user.notificationConsentGiven && !isAdmin} onClose={() => setShowNotifyModal(false)} />
    </>
  );
}