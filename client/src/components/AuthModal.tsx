import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

// Yeh props lega taaki hum isse Navbar se control kar sakein
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
      onClose(); // Success par modal band kar do
      navigate('/'); // Aur user ko home page par bhej do
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {authMode === 'login' ? 'Login to access your dashboard.' : 'Sign up to get started.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-4 py-2">
          <div className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName-modal">Full Name</Label>
                <Input id="fullName-modal" type="text" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email-modal">Email</Label>
              <Input id="email-modal" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-modal">Password</Label>
              <Input id="password-modal" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full mt-6 bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold" disabled={loading}>
            {loading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Create Account')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="font-medium text-violet hover:text-pink hover:underline transition-colors"
          >
            {authMode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
