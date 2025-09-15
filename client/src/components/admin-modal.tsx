
// src/components/ui/admin-modal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { isAdminEmail } from "@/lib/adminUtils";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email is admin before attempting login
    if (!isAdminEmail(email)) {
      toast({
        title: "Access Denied",
        description: "You are not authorized to access the admin dashboard.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Admin logged in successfully!",
      });
      onClose();
      setEmail("");
      setPassword("");
    } catch (error: any) {
      let errorMessage = "Invalid credentials.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Admin account not found.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Invalid password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="xyz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary-blue hover:bg-accent-blue"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}