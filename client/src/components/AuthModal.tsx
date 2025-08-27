import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { User, Mail, Lock } from "lucide-react";

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
      onClose(); 
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-violet mb-2 text-center">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mb-6">
            {authMode === 'login' ? 'Login to access your dashboard.' : 'Sign up to get started.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {authMode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <Input 
                  id="fullName-modal" 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <Input 
                id="email-modal" 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <Input 
                id="password-modal" 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
          </div>
          <Button type="submit" className="w-full mt-6 bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold py-3 text-lg" disabled={loading}>
            {loading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Create Account')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
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
