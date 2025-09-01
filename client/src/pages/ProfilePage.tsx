import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, CreditCard, LogOut, LoaderCircle, Bookmark } from 'lucide-react';
import { Redirect, useLocation } from 'wouter';
import { updateUserProfile } from '@/lib/userService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [, navigate] = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoaderCircle className="w-10 h-10 animate-spin text-violet" /></div>;
    }

    if (!user) {
        return <Redirect to="/" />;
    }
    
    const scrollToSection = (sectionId: string) => {
        if (sectionId === 'premium-support') {
            navigate("/premium-support");
        } else {
            localStorage.setItem("scrollTo", sectionId);
            navigate("/");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileInformation />;
            case 'subscription':
                return <SubscriptionDetails onUpgradeClick={() => scrollToSection('premium-support')} />;
            case 'security':
                return <SecuritySettings />;
            default:
                return <ProfileInformation />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
          
            <main className="flex-grow bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                        <aside className="md:col-span-1 bg-white p-4 rounded-xl border shadow-sm sticky top-24">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-violet/20 flex items-center justify-center text-violet font-bold text-xl">
                                    {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{user.fullName}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <nav className="flex flex-col space-y-1">
                                <Button variant={activeTab === 'profile' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('profile')} className="justify-start"><User className="mr-2 h-4 w-4" /> My Profile</Button>
                                <Button variant={'ghost'} onClick={() => navigate('/saved-grants')} className="justify-start"><Bookmark className="mr-2 h-4 w-4" /> Saved Grants</Button>
                                <Button variant={activeTab === 'subscription' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('subscription')} className="justify-start"><CreditCard className="mr-2 h-4 w-4" /> Subscription</Button>
                                <Button variant={activeTab === 'security' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('security')} className="justify-start"><Shield className="mr-2 h-4 w-4" /> Account Settings</Button>
                                <Button variant={'ghost'} onClick={logout} className="justify-start text-red-600 hover:bg-red-50 hover:text-red-600"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                            </nav>
                        </aside>
                        <main className="md:col-span-3">
                            {renderContent()}
                        </main>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// ... (ProfileInformation, SubscriptionDetails, and SecuritySettings components remain the same)

const ProfileInformation = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateUserProfile(user.uid, { fullName: formData.fullName, phone: formData.phone });
            toast({ title: "Success", description: "Profile updated successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="fullName" className="font-semibold text-sm">Full Name</label>
                    <Input id="fullName" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label htmlFor="email" className="font-semibold text-sm">Email Address</label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                </div>
                <div className="space-y-1">
                    <label htmlFor="phone" className="font-semibold text-sm">Phone Number</label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Add your phone number" />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
};

const SubscriptionDetails = ({ onUpgradeClick }: { onUpgradeClick: () => void }) => {
    const { user } = useAuth();
    const isPremium = user?.subscriptionStatus === 'premium';

    const getExpiryText = () => {
        if (!user?.subscriptionEndDate) return 'N/A';
        const endDate = new Date(user.subscriptionEndDate);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Expired';
        if (diffDays <= 1) return `in ${diffDays} day`;
        if (diffDays <= 60) return `in ${diffDays} days`;
        return endDate.toLocaleDateString();
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="font-bold text-lg capitalize text-violet">{user?.subscriptionStatus} Plan</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPremium ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {isPremium ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <Button variant="outline" onClick={onUpgradeClick}>
                            {isPremium ? 'Manage Subscription' : 'Upgrade Now'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Expires On</p>
                            <p className="font-semibold">{getExpiryText()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Grants Access</p>
                            <p className="font-semibold">{isPremium ? 'Unlimited' : 'Limited'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your record of all transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">No payment records found.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const SecuritySettings = () => {
    const { toast } = useToast();
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new) {
            toast({ title: "Error", description: "Please fill all password fields.", variant: "destructive" });
            return;
        }
        
        const user = auth.currentUser;
        if (!user || !user.email) return;

        setIsSaving(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwords.new);
            toast({ title: "Success", description: "Password updated successfully." });
            setPasswords({ current: '', new: '' });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update password. Check your current password.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await deleteUser(user);
            toast({ title: "Success", description: "Account deleted successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete account. Please re-login and try again.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>It's recommended to use a strong, unique password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input type="password" placeholder="Current Password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                    <Input type="password" placeholder="New Password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleChangePassword} disabled={isSaving}>
                        {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Change Password
                    </Button>
                </CardFooter>
            </Card>

            <Card className="border-red-500">
                <CardHeader>
                    <CardTitle className="text-red-600">Delete Account</CardTitle>
                    <CardDescription>Once you delete your account, it cannot be recovered. All your data will be permanently removed.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete My Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfilePage;