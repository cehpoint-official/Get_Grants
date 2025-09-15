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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationConsentModal } from "@/components/ui/NotificationConsentModal";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showIncubatorModal, setShowIncubatorModal] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [location, navigate] = useLocation();
  const [activeLink, setActiveLink] = useState('Home');
  const isDashboardRoute = location.startsWith('/dashboard') || location.startsWith('/admin');

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
      setActiveLink('Explore Grants');
    } else if (location.startsWith('/premium-support')) {
      setActiveLink('Premium Support');
    } else if (location.startsWith('/blog-detail')) {
      setActiveLink('Blog');
    }
    else if (location.startsWith('/contact')) {
      setActiveLink('Contact');
    }
      else {
      setActiveLink('');
    }
  }, [location]);


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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', action: () => { navigate('/'); scrollToSection('home'); } },
    { name: 'Find Grants', action: () => handleNavigation('/grants') },
    { name: 'Pricing', action: () => handleNavigation('/premium-support') },
    { name: 'Blog', action: () => { navigate('/'); scrollToSection('blog'); } },
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
                        <Avatar className="h-10 w-10 border-2 border-violet/50">
                            { (user as any)?.avatarUrl ? (
                                <img src={(user as any).avatarUrl} alt="avatar" className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <AvatarFallback className="bg-violet/20 text-violet font-bold">
                                    {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || <UserIcon />}
                                </AvatarFallback>
                              ) }
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
              <div className="flex flex-col gap-4">
                  <p className="px-3 py-2 font-semibold text-violet">{user.fullName}</p>
                  <button onClick={() => handleNavigation('/dashboard')} className="w-full text-center font-semibold text-gray-900">My Dashboard</button>
                  <Button onClick={handleLogout} className="w-full h-auto py-3 text-white font-semibold rounded-lg bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90">Logout</Button>
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
      <nav className={`bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm ${isDashboardRoute ? 'hidden md:block' : ''}`}>
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
              {!isDashboardRoute && (
                <div className="lg:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isDashboardRoute && isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
            <aside className="relative z-50 w-72 max-w-[80%] h-full bg-white p-4 border-r shadow-lg transition-transform duration-300 ease-in-out translate-x-0">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
                <X className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2 px-2 pt-1">
                <Rocket className="h-7 w-7 text-violet" />
                <span className="text-xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">Get Grants</span>
              </div>
              <nav className="flex flex-col gap-1 mt-6 px-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={`px-3 py-2 rounded-md text-left transition-all ${activeLink === item.name ? 'bg-violet/10 text-violet font-semibold' : 'hover:bg-violet/5 text-nav-gray'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              <div className="border-t mt-4 pt-4 px-1">
                {renderMobileAuthButtons()}
              </div>
            </aside>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
      <NotificationConsentModal isOpen={showNotifyModal && !!user && !user.notificationConsentGiven && !isAdmin} onClose={() => setShowNotifyModal(false)} />
    </>
  );
}