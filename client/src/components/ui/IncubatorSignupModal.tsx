// src/components/ui/IncubatorSignupModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";


interface IncubatorSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncubatorSignupModal({ isOpen, onClose }: IncubatorSignupModalProps) {
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactName: "",
    phone: "",
    website: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { registerIncubator, login } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password should be at least 6 characters",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({ title: "Success", description: "Logged in successfully!" });
      } else {
        await registerIncubator(formData.email, formData.password, {
          companyName: formData.companyName,
          contactName: formData.contactName,
          phone: formData.phone,
          website: formData.website,
          description: formData.description
        });
        toast({
          title: "Success",
          description: "Account created successfully! You can now access the incubator application form.",
        });
      }

      onClose();
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        contactName: "",
        phone: "",
        website: "",
        description: ""
      });
       navigate("/applyincubator");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-violet">
            {isLogin ? "Login as Incubator" : "Register as Incubator"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Organization Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your incubator/organization..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-yellowish-white border-2 border-violet focus:border-pink focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? (isLogin ? "Logging in..." : "Creating Account...") : (isLogin ? "Login" : "Create Account")}
          </Button>

          <p className="text-sm text-center pt-2">
            {isLogin ? "Don’t have an account?" : "Already have an account?"} {" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet hover:text-pink hover:underline transition-colors"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
