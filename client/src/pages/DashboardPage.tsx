import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogOut, LoaderCircle, Bookmark, FileText, Home, CreditCard, Clock, MessageSquare } from 'lucide-react';
import { Redirect, Link, useLocation } from 'wouter';
import { fetchUserApplications } from '@/services/applications';
import { Application, Grant, Payment } from '@shared/schema';
import { fetchGrantById } from "@/services/grants";
import { fetchUserPayments } from "@/services/payments";
import { fetchUserPremiumInquiriesByUserIdOrEmail, PremiumInquiry } from "@/services/premiumSupport";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number."),
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
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [, navigate] = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoaderCircle className="w-10 h-10 animate-spin text-violet" /></div>;
    }

    if (!user) {
        return <Redirect to="/" />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <DashboardOverview />;
            case 'applications': return <ApplicationTracking />;
            case 'saved-grants': return <SavedGrantsSection />;
            case 'my-queries': return <MyQueriesSection />;
            case 'settings': return <SettingsSection />;
            case 'subscription': return <SubscriptionSection />;
            default: return <DashboardOverview />;
        }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-left mb-12">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-violet tracking-tight">My Dashboard</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl">Welcome back, {user.fullName}! Here's your grant application hub.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                        <aside className="md:col-span-1 bg-white p-4 rounded-xl border shadow-sm sticky top-24">
                            <nav className="flex flex-col space-y-1">
                                <Button variant={activeTab === 'overview' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('overview')} className="justify-start"><Home className="mr-2 h-4 w-4" /> Overview</Button>
                                <Button variant={activeTab === 'applications' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('applications')} className="justify-start"><FileText className="mr-2 h-4 w-4" /> Applications</Button>
                                <Button variant={activeTab === 'saved-grants' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('saved-grants')} className="justify-start"><Bookmark className="mr-2 h-4 w-4" /> Saved Grants</Button>
                                <Button variant={activeTab === 'my-queries' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('my-queries')} className="justify-start"><MessageSquare className="mr-2 h-4 w-4" /> My Queries</Button>
                                <Button variant={activeTab === 'subscription' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('subscription')} className="justify-start"><CreditCard className="mr-2 h-4 w-4" /> Subscription</Button>
                                <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('settings')} className="justify-start"><Shield className="mr-2 h-4 w-4" /> Account Settings</Button>
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

const DashboardOverview = () => {
    const { user } = useAuth();
    const [applicationCount, setApplicationCount] = useState(0);

    useEffect(() => {
        if (user?.uid) {
            fetchUserApplications(user.uid).then(apps => setApplicationCount(apps.length));
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to your Dashboard!</CardTitle>
                <CardDescription>Here is a summary of your activity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Saved Grants</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{user?.savedGrants?.length || 0}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-lg">Applications</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{applicationCount}</p></CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

const ApplicationTracking = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApplications = async () => {
            if (user?.uid) {
                setLoading(true);
                const userApps = await fetchUserApplications(user.uid);
                setApplications(userApps);
                setLoading(false);
            }
        };
        loadApplications();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Reviewed': return 'bg-blue-100 text-blue-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8"><LoaderCircle className="w-8 h-8 animate-spin text-violet" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Tracking</CardTitle>
                <CardDescription>Track the status of your grant applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {applications.length > 0 ? applications.map(app => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-800">{app.startupName || "Grant Application"}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1"><Clock size={14} className="mr-1.5" /> Applied on {app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status || 'Pending')}`}>{app.status || 'Pending'}</span>
                        </div>
                    )) : (<p className="text-center text-gray-500 py-8">You haven't submitted any applications yet.</p>)}
                </div>
            </CardContent>
        </Card>
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
                                <a className="block p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
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

    useEffect(() => {
        if (user) {
            fetchUserPremiumInquiriesByUserIdOrEmail({ userId: user.uid, email: user.email })
                .then(setQueries)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center p-8"><LoaderCircle className="w-8 h-8 animate-spin text-violet" /></div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Queries</CardTitle>
                <CardDescription>View your submitted queries and responses from our team.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {queries.length > 0 ? queries.map(query => (
                        <div key={query.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-semibold text-gray-800 pr-4">{query.specificNeeds}</p>
                                <Badge variant={query.status === 'responded' ? 'default' : 'secondary'} className="whitespace-nowrap">{query.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-500">Submitted on: {query.createdAt.toLocaleDateString()}</p>
                            {query.adminResponse && (
                                <div className="mt-4 p-3 bg-violet/5 border-l-4 border-violet rounded-r-lg">
                                    <p className="font-semibold text-violet mb-1">Admin's Response:</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{query.adminResponse}</p>
                                </div>
                            )}
                        </div>
                    )) : (<p className="text-center text-gray-500 py-8">You haven't submitted any queries yet.</p>)}
                </div>
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
        }
    }, [user]);

    const plan = user?.subscriptionStatus === 'premium' ? 'Premium' : 'Free';
    const status = user?.subscriptionStatus || 'free';
    const expiresOn = user?.subscriptionEndDate ? user.subscriptionEndDate.toLocaleDateString() : 'N/A';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Subscription</CardTitle>
                    <CardDescription>View your current plan and payment history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center p-4 bg-violet/5 border border-violet/20 rounded-lg">
                        <div>
                            <p className="font-semibold text-gray-800">Current Plan: <span className="text-violet">{plan}</span></p>
                            <p className="text-sm text-gray-500">Expires on: {expiresOn}</p>
                        </div>
                        <Badge className={status === 'premium' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{status}</Badge>
                    </div>
                    {plan === 'Free' && <Button onClick={handleViewPricing} className="mt-4 bg-violet hover:bg-pink text-white">Upgrade Now</Button>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
                <CardContent>
                    {loading ? <LoaderCircle className="animate-spin" /> : (
                        <table className="w-full text-sm">
                            <thead><tr className="text-left text-gray-500"><th className="py-2">Date</th><th className="py-2">Plan</th><th className="py-2">Amount</th><th className="py-2">Status</th></tr></thead>
                            <tbody>
                                {payments.length > 0 ? payments.map(p => (
                                    <tr key={p.id} className="border-t">
                                        <td className="py-3">{p.date.toLocaleDateString()}</td>
                                        <td className="py-3">{p.plan}</td>
                                        <td className="py-3">₹{p.amount.toFixed(2)}</td>
                                        <td className="py-3"><Badge variant="secondary" className="bg-green-50 text-green-700">{p.status}</Badge></td>
                                    </tr>
                                )) : <tr><td colSpan={4} className="text-center py-4 text-gray-500">No payment history found.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const SettingsSection = () => {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { fullName: user?.fullName || "", phoneNumber: user?.phone || "" },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            await updateUserProfileDetails(data);
            toast({ title: "Success", description: "Your profile has been updated." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update profile. Please try again.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your name and mobile number.</CardDescription></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div><label>Full Name</label><Input {...register("fullName")} />{errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}</div>
                    <div><label>Phone Number</label><Input {...register("phoneNumber")} />{errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>}</div>
                    <Button type="submit" disabled={isSubmitting} className="bg-violet hover:bg-pink text-white">{isSubmitting ? <LoaderCircle className="animate-spin" /> : "Save Changes"}</Button>
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
                    <Button type="submit" disabled={isSubmitting} className="bg-violet hover:bg-pink text-white">{isSubmitting ? <LoaderCircle className="animate-spin" /> : "Update Password"}</Button>
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
        <Card className="border-red-500 bg-red-50">
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