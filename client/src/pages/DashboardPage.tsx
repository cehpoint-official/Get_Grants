import { useState, useEffect ,useMemo} from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogOut, LoaderCircle, Bookmark, Home, CreditCard, MessageSquare, Menu as MenuIcon, Crown, Send, Search, Star, ArrowRight, PlusCircle } from 'lucide-react';
import { Redirect, Link, useLocation } from 'wouter';
import { Grant, Payment, PremiumInquiry } from '@shared/schema';
import { fetchGrantById } from "@/services/grants";
import { fetchUserPayments } from "@/services/payments";
import { fetchUserPremiumInquiriesByUserIdOrEmail } from "@/services/premiumSupport";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChatInterface } from '@/components/ChatInterface';

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    phone: z.string()
        .refine((val) => val === '' || /^[6-9]\d{9}$/.test(val), {
            message: "Please enter a valid 10-digit mobile number.",
        }),
    avatarUrl: z.string().url().optional().or(z.literal('')),
});

const passwordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const deleteSchema = z.object({
    password: z.string().min(1, "Password is required to delete your account."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type DeleteFormValues = z.infer<typeof deleteSchema>;

const DashboardPage = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoaderCircle className="w-10 h-10 animate-spin text-violet" /></div>;
    }

    if (!user) {
        return <Redirect to="/" />;
    }

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'saved-grants': return <SavedGrantsSection />;
            case 'my-queries': return <MyQueriesSection />;
            case 'settings': return <SettingsSection />;
            case 'subscription': return <SubscriptionSection />;
            default: return <DashboardOverview />;
        }
    };
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-grow">
                 <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-800 hover:bg-gray-100" aria-label="Open menu">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h2 className="font-semibold text-gray-800 text-lg capitalize">{activeTab.replace('-', ' ')}</h2>
                    <div className="w-9"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                     <div className="hidden md:block mb-8">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-violet tracking-tight">My Dashboard</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl">Welcome back, {user.fullName}! Here's your grant application hub.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetContent side="left" className="w-64 p-0 flex flex-col">
                                <SidebarContent user={user} activeTab={activeTab} handleTabClick={handleTabClick} />
                            </SheetContent>
                        </Sheet>
                        
                        <aside className="hidden md:block md:col-span-1 bg-white p-4 rounded-xl border shadow-sm sticky top-24">
                            <SidebarContent user={user} activeTab={activeTab} handleTabClick={handleTabClick} />
                        </aside>

                        <main className="col-span-1 md:col-span-3">
                            {renderContent()}
                        </main>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const SidebarContent = ({ user, activeTab, handleTabClick }: { user: any, activeTab: string, handleTabClick: (tab: string) => void }) => {
    const { logout } = useAuth();
    const isPremium = user.subscriptionStatus === 'premium' || (user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date());
    
    return (
        <>
        <div className="px-4 py-4 border-b flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-violet/50">
                <AvatarImage src={user.avatarUrl} alt={user.fullName}/>
                <AvatarFallback className="bg-violet/20 text-violet font-bold">
                    {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div>
                <div className="font-bold text-base text-gray-900 flex items-center">{user.fullName} {isPremium && <Crown className="ml-1 h-4 w-4 text-yellow-500"/>}</div>
                <div className="text-xs text-gray-500">Founder</div>
            </div>
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-grow">
            <Button variant={activeTab === 'overview' ? 'secondary' : 'ghost'} onClick={() => handleTabClick('overview')} className="justify-start"><Home className="mr-2 h-4 w-4" /> Overview</Button>
            <Button variant={activeTab === 'saved-grants' ? 'secondary' : 'ghost'} onClick={() => handleTabClick('saved-grants')} className="justify-start"><Bookmark className="mr-2 h-4 w-4" /> Saved Grants</Button>
            <Button variant={activeTab === 'my-queries' ? 'secondary' : 'ghost'} onClick={() => handleTabClick('my-queries')} className="justify-start"><MessageSquare className="mr-2 h-4 w-4" /> My Queries</Button>
            <Button variant={activeTab === 'subscription' ? 'secondary' : 'ghost'} onClick={() => handleTabClick('subscription')} className="justify-start"><CreditCard className="mr-2 h-4 w-4" /> Subscription</Button>
            <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} onClick={() => handleTabClick('settings')} className="justify-start"><Shield className="mr-2 h-4 w-4" /> Account Settings</Button>
        </nav>
        <div className="p-2">
            <Button variant={'ghost'} onClick={logout} className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
        </div>
        </>
    )
}

const DashboardOverview = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <Card className="bg-gradient-to-r from-violet to-pink text-white shadow-lg overflow-hidden">
                <div className="p-6">
                    <CardTitle className="text-2xl md:text-3xl">Welcome, {user?.fullName?.split(' ')[0]}!</CardTitle>
                    <CardDescription className="text-violet-200 mt-1">Here's a quick summary of your grant journey.</CardDescription>
                </div>
                <div className="bg-white/20 p-6">
                    <p className="text-4xl font-bold">{user?.savedGrants?.length || 0}</p>
                    <p className="text-sm font-medium">Saved Grants</p>
                </div>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Next?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/grants">
                        <a className="group block p-6 bg-white rounded-xl border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center gap-4">
                                <div className="bg-violet/10 p-3 rounded-full">
                                    <Search className="h-6 w-6 text-violet" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Explore Grants</h3>
                                    <p className="text-sm text-gray-500">Find the perfect grants</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-violet transition-colors"/>
                            </div>
                        </a>
                    </Link>
                    <Link href="/premium-support">
                        <a className="group block p-6 bg-white rounded-xl border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center gap-4">
                                <div className="bg-pink/10 p-3 rounded-full">
                                    <Star className="h-6 w-6 text-pink" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Get Expert Help</h3>
                                    <p className="text-sm text-gray-500">Upgrade to premium</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-pink transition-colors"/>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const SavedGrantsSection = () => {
    const { user } = useAuth();
    const [savedGrants, setSavedGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedGrants = async () => {
            if (user?.savedGrants && user.savedGrants.length > 0) {
                const grantPromises = user.savedGrants.map(id => fetchGrantById(id));
                const grantsData = await Promise.all(grantPromises);
                setSavedGrants(grantsData.filter((grant): grant is Grant => grant !== null));
            }
            setLoading(false);
        };
        fetchSavedGrants();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><LoaderCircle className="w-8 h-8 animate-spin text-violet" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Saved Grants</CardTitle>
                <CardDescription>Here are the grants you've saved for later.</CardDescription>
            </CardHeader>
            <CardContent>
                {savedGrants.length > 0 ? (
                    <div className="space-y-4">
                        {savedGrants.map((grant) => (
                            <Link key={grant.id} href={`/grant/${grant.id}`}>
                                <a className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <h3 className="font-semibold text-violet">{grant.title}</h3>
                                    <p className="text-sm text-gray-600">{grant.organization}</p>
                                    <p className="text-sm text-gray-500 mt-1">Funding: {grant.fundingAmount}</p>
                                </a>
                            </Link>
                        ))}
                    </div>
                ) : (<p className="text-center text-gray-500 py-8">You haven't saved any grants yet.</p>)}
            </CardContent>
        </Card>
    );
};

const MyQueriesSection = () => {
    const { user } = useAuth();
    const [queries, setQueries] = useState<PremiumInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const latestInquiry = useMemo(() => {
        if (queries.length > 0) {
            return queries[0];
        }
        return null;
    }, [queries]);

    const loadQueries = async () => {
        if (user) {
            setLoading(true);
            try {
                const userQueries = await fetchUserPremiumInquiriesByUserIdOrEmail({ userId: user.uid, email: user.email });
                setQueries(userQueries);
            } catch (error) {
                console.error("Failed to load queries", error);
                toast({ title: "Error", description: "Could not load your conversations.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadQueries();
    }, [user]);
    
    const handleChatStarted = () => {
        loadQueries();
    };

    return (
        <Card className="overflow-hidden h-[75vh] flex flex-col">
            <CardHeader>
                <CardTitle>My Queries</CardTitle>
                <CardDescription>Chat directly with our experts for assistance.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <LoaderCircle className="h-8 w-8 animate-spin text-violet"/>
                    </div>
                ) : (
                    <ChatInterface 
                        initialInquiryId={latestInquiry?.id || null}
                        onChatStarted={handleChatStarted}
                    />
                )}
            </CardContent>
        </Card>
    );
};


const SubscriptionSection = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [, navigate] = useLocation();
    const handleViewPricing = () => { navigate("/premium-support"); };

    useEffect(() => {
        if (user?.uid) {
            fetchUserPayments(user.uid).then(data => { setPayments(data); setLoading(false); });
        } else {
            setLoading(false);
        }
    }, [user]);

    const isPremium = user?.subscriptionStatus === 'premium' || (user?.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date());
    const plan = isPremium ? (user?.subscriptionPlan || 'Premium') : 'Free';
    const expiresOn = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'N/A';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Subscription</CardTitle>
                    <CardDescription>View your current plan and payment history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-violet/5 border border-violet/20 rounded-lg">
                        <div className="flex justify-between items-center">
                           <p className="font-semibold text-gray-800">Current Plan: <span className="text-violet capitalize">{plan}</span></p>
                           {isPremium ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge variant="secondary">Free Tier</Badge>}
                        </div>
                        {isPremium && <p className="text-sm text-gray-500 mt-1">Expires on: {expiresOn}</p>}
                    </div>
                    {!isPremium && <Button onClick={handleViewPricing} className="mt-4 bg-violet hover:bg-violet/90 text-white">Upgrade to Premium</Button>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
                <CardContent>
                    {loading ? <LoaderCircle className="animate-spin" /> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-left text-gray-500"><th className="py-2 px-2">Date</th><th className="py-2 px-2">Plan</th><th className="py-2 px-2">Amount</th><th className="py-2 px-2">Status</th></tr></thead>
                                <tbody>
                                    {payments.length > 0 ? payments.map(p => (
                                        <tr key={p.id} className="border-t">
                                            <td className="py-3 px-2">{p.date.toLocaleDateString()}</td>
                                            <td className="py-3 px-2 capitalize">{p.plan}</td>
                                            <td className="py-3 px-2">₹{p.amount.toFixed(2)}</td>
                                            <td className="py-3 px-2"><Badge variant="secondary" className="bg-green-100 text-green-800">{p.status}</Badge></td>
                                        </tr>
                                    )) : <tr><td colSpan={4} className="text-center py-4 text-gray-500">No payment history found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const SettingsSection = () => {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
                <TabsTrigger value="profile">Edit Profile</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
                <TabsTrigger value="delete">Delete Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile"><ProfileSettings /></TabsContent>
            <TabsContent value="password"><PasswordSettings /></TabsContent>
            <TabsContent value="delete"><DeleteAccountSettings /></TabsContent>
        </Tabs>
    );
};

const ProfileSettings = () => {
    const { user, updateUserProfileDetails } = useAuth();
    const { toast } = useToast();
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            phone: user?.phone || "",
            avatarUrl: user?.avatarUrl || "",
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const updates: { [key: string]: any } = {};
            
            if (data.fullName !== user?.fullName) {
                updates.fullName = data.fullName;
            }
            if (data.phone !== user?.phone) {
                updates.phone = data.phone;
            }

            if (Object.keys(updates).length > 0) {
                await updateUserProfileDetails(updates);
                toast({ title: "Success", description: "Your profile has been updated." });
            } else {
                 toast({ title: "No Changes", description: "You haven't made any changes." });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile. Please try again.", variant: "destructive" });
        }
    };
    
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            // Center-square crop on client before upload
            const imageBitmap = await createImageBitmap(file);
            const size = Math.min(imageBitmap.width, imageBitmap.height);
            const sx = (imageBitmap.width - size) / 2;
            const sy = (imageBitmap.height - size) / 2;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');
            ctx.drawImage(imageBitmap, sx, sy, size, size, 0, 0, size, size);
            const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', 0.92));
            const croppedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

            const { uploadToCloudinary } = await import('@/services/cloudinary');
            const url = await uploadToCloudinary(croppedFile);
            await updateUserProfileDetails({ avatarUrl: url });
            toast({ title: 'Avatar Updated', description: 'Your new avatar has been saved.' });
        } catch (err: any) {
            toast({ title: 'Upload Failed', description: err?.message || 'Could not upload image', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your name, avatar and mobile number.</CardDescription></CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                           <AvatarImage src={user?.avatarUrl} alt={user?.fullName}/>
                           <AvatarFallback className="text-2xl">{user?.fullName?.[0]}</AvatarFallback>
                        </Avatar>
                        <label className="text-sm font-medium cursor-pointer text-violet hover:underline">
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            <span>Change avatar</span>
                        </label>
                    </div>
                    <div>
                        <label className="font-medium">Full Name</label>
                        <Input {...form.register("fullName")} />
                        {form.formState.errors.fullName && <p className="text-sm text-red-600 mt-1">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className="font-medium">Phone Number</label>
                        <Input {...form.register("phone")} />
                        {form.formState.errors.phone && <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="bg-violet hover:bg-violet/90 text-white">
                        {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const PasswordSettings = () => {
    const { changePassword } = useAuth();
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

    const onSubmit = async (data: PasswordFormValues) => {
        try {
            await changePassword(data.newPassword);
            toast({ title: "Success", description: "Password changed successfully." });
            reset();
        } catch (error) {
            toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Choose a new password for your account.</CardDescription></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div><label>New Password</label><Input type="password" {...register("newPassword")} />{errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}</div>
                    <div><label>Confirm New Password</label><Input type="password" {...register("confirmPassword")} />{errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}</div>
                    <Button type="submit" disabled={isSubmitting} className="bg-violet hover:bg-violet/90 text-white">{isSubmitting ? <LoaderCircle className="animate-spin" /> : "Update Password"}</Button>
                </form>
            </CardContent>
        </Card>
    );
};

const DeleteAccountSettings = () => {
    const { deleteAccount } = useAuth();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DeleteFormValues>({ resolver: zodResolver(deleteSchema) });

    const onSubmit = async (data: DeleteFormValues) => {
        try {
            await deleteAccount(data.password);
            toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
        } catch (error: any) {
            setIsOpen(false);
            const message = error.code === 'auth/wrong-password' ? "Incorrect password. Please try again." : "An error occurred.";
            toast({ title: "Deletion Failed", description: message, variant: "destructive" });
        }
    };

    return (
        <Card className="border-red-500 bg-red-50/50">
            <CardHeader><CardTitle className="text-red-700">Delete Account</CardTitle></CardHeader>
            <CardContent>
                <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild><Button variant="destructive">Delete My Account</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete your account. To confirm, please enter your password.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4"><label>Password</label><Input type="password" {...register("password")} />{errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}</div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button type="submit" variant="destructive" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="animate-spin" /> : "Yes, delete account"}</Button>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};

export default DashboardPage;