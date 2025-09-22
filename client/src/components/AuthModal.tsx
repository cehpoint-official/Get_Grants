import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { User, Mail, Lock, Eye, EyeOff, Phone, LoaderCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { getFirebaseErrorMessage, isNetworkError, shouldRetry } from "@/lib/errorUtils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccessRedirectTo?: string;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccessRedirectTo = '/' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  const { login, signup, signInWithGoogle } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
        setAuthMode(initialMode);
        setError('');
        setRetryCount(0);
    }
  }, [isOpen, initialMode]);

 
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if user is offline
    if (!isOnline) {
      setError("You appear to be offline. Please check your internet connection and try again.");
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);

    try {
      if (authMode === 'login') {
        const userCredential = await login(email, password);

        if (userCredential && !userCredential.user.emailVerified) {
          setError("Please verify your email before logging in.");
          toast({
            title: "Email Not Verified",
            description: "A new verification link has been sent to your email.",
            variant: "destructive",
          });
          await sendEmailVerification(userCredential.user);
          setLoading(false);
          return;
        }
        
        onClose(); 
        navigate(onSuccessRedirectTo);
        toast({ title: "Login Successful!", description: "Welcome back." });

      } else {
        const userCredential = await signup(email, password, fullName, mobile);
        
        if (userCredential && userCredential.user) {
            await sendEmailVerification(userCredential.user);
        }
        
        toast({
          title: "Account Created Successfully!",
          description: "We've sent a verification link to your email. Please verify to log in.",
        });
        
        setFullName('');
        setEmail(''); 
        setMobile('');
        setPassword('');
        setConfirmPassword('');
        setAuthMode('login');
      }
      setRetryCount(0); 
    } catch (err: any) {
      const friendlyError = getFirebaseErrorMessage(err);
      setError(friendlyError.message);
      
     
      if (isNetworkError(err)) {
        toast({
          title: "Connection Problem",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (shouldRetry(err)) {
        setRetryCount(prev => prev + 1);
        toast({
          title: friendlyError.title,
          description: friendlyError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: friendlyError.title,
          description: friendlyError.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    // Check if user is offline
    if (!isOnline) {
      setError("You appear to be offline. Please check your internet connection and try again.");
      setLoading(false);
      return;
    }
    
    try {
        await signInWithGoogle();
        onClose();
        navigate(onSuccessRedirectTo);
        toast({ title: "Signed In With Google!", description: "Welcome to Get Grants." });
    } catch (error: any) {
        const friendlyError = getFirebaseErrorMessage(error);
        setError(friendlyError.message);
        
        if (isNetworkError(error)) {
          toast({
            title: "Connection Problem",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: friendlyError.title,
            description: friendlyError.message,
            variant: "destructive",
          });
        }
    } finally {
        setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#F8F5FA] p-0 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-8 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[#30343B] mb-2 text-center">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {authMode === 'login' ? 'Login to access your dashboard.' : 'Sign up to get started.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-8 pb-8">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700 py-6 text-base rounded-lg" onClick={handleGoogleSignIn} disabled={loading}>
                <FcGoogle size={22} />
                <span>Continue with Google</span>
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#F8F5FA] px-2 text-gray-500">Or</span></div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl">
              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <Input id="fullName-modal" type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#8541EF] transition-colors" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <Input id="email-modal" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#8541EF] transition-colors" />
                </div>
                  {authMode === 'signup' && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <Input id="mobile-modal" type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#8541EF] transition-colors" />
                  </div>
                )}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <Input id="password-modal" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 pl-10 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#8541EF] transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {authMode === 'signup' && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <Input id="confirm-password-modal" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-3 pl-10 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#8541EF] transition-colors" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                {!isOnline && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    <WifiOff size={16} className="flex-shrink-0" />
                    <span>You're currently offline. Please check your internet connection.</span>
                  </div>
                )}
                
                {isOnline && retryCount > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                    <Wifi size={16} className="flex-shrink-0" />
                    <span>Connection restored. You can try again now.</span>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full mt-6 bg-[#8541EF] hover:bg-[#7a38d9] text-white rounded-xl shadow-lg font-semibold py-3 text-lg" disabled={loading}>
                 {loading ? <LoaderCircle className="animate-spin" /> : (authMode === 'login' ? 'Login' : 'Create Account')}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-medium text-[#8541EF] hover:text-[#7a38d9] hover:underline transition-colors">
                {authMode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}