import { useEffect, useState, useMemo, useRef } from "react";
import "react-calendar/dist/Calendar.css";
import {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    fetchPendingPosts,
    approvePost,
    rejectPost,
} from "@/services/firebase";
import {
    fetchGrants,
    createGrant,
    updateGrant,
    deleteGrant,
} from "@/services/grants";
import {
    fetchApplications as fetchAllApplications,
} from "@/services/applications";
import { fetchAllUsers } from "@/services/users";
import {
    fetchPremiumInquiries,
    sendInquiryMessage,
    subscribeToInquiryMessages,
} from "@/services/premiumSupport";
import {
    Grant,
    InsertGrant,
    Post,
    InsertPost,
    Application,
    User,
    CalendarEvent,
    InsertEvent,
    InquiryMessage,
    PremiumInquiry,
} from "@shared/schema";
import { CreatePostModal } from "@/components/create-post-modal";
import { CreateGrantModal } from "@/components/create-grant-modal";
import { EventModal } from "@/components/ui/EventModal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
    X,
    LayoutDashboard,
    Inbox,
    Home,
    BookOpen,
    Menu as MenuIcon,
    Users,
    FileCheck,
    Award,
    LoaderCircle,
    Calendar as CalendarIcon,
    Briefcase,
    Share2,
    MessageSquare,
    Mail,
    LogOut,
    Check,
    Trash2,
    Edit,
    PlusCircle,
    MoreHorizontal,
    Download,
    Send,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchDashboardStats, DashboardStats, fetchContactMessages, ContactMessage } from "@/services/admin";
import { Calendar } from "@/components/ui/calendar";
import {
    fetchEvents,
    createEvent as createCalendarEvent,
    updateEvent as updateCalendarEvent,
    deleteEvent as deleteCalendarEvent,
} from "@/services/events";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/lib/excelUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Grants", icon: Award },
    { name: "Applications", icon: Inbox },
    { name: "Users", icon: Users },
    { name: "Blogs", icon: BookOpen },
    { name: "Users Queries", icon: MessageSquare },
    { name: "Contact Messages", icon: Mail },
    { name: "Incubators", icon: Briefcase },
    { name: "Calendar", icon: CalendarIcon },
    { name: "Social Apps", icon: Share2 },
    { name: "Home", icon: Home },
];

const StatCard = ({ title, value, icon: Icon, onClick, cta }: { title: string, value: string | number, icon: React.ElementType, onClick: () => void, cta: string }) => (
    <Card onClick={onClick} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-transparent hover:border-violet">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            <Icon className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold text-gray-800">{value}</div>
            <p className="text-xs text-gray-500 pt-1">{cta}</p>
        </CardContent>
    </Card>
);

const DashboardAnalytics = ({ setActiveTab }: { setActiveTab: (tab: string) => void; }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats().then((data) => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="w-8 h-8 animate-spin text-violet" /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} onClick={() => setActiveTab("Users")} cta="View all users" />
                <StatCard title="Applications" value={stats?.totalApplications ?? 0} icon={FileCheck} onClick={() => setActiveTab("Applications")} cta="View applications" />
                <StatCard title="Grants Listed" value={stats?.totalGrants ?? 0} icon={Award} onClick={() => setActiveTab("Grants")} cta="Manage grants" />
            </div>
        </div>
    );
};


const PlaceholderContent = ({ title }: { title: string }) => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center text-gray-500">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Coming Soon!</h3>
            <p className="text-sm mt-2">The <span className="font-semibold text-violet">{title}</span> section is under construction.</p>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [posts, setPosts] = useState<Post[]>([]);
    const [grants, setGrants] = useState<Grant[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [premiumInquiries, setPremiumInquiries] = useState<PremiumInquiry[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showGrantModal, setShowGrantModal] = useState(false);
    const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [activePendingPost, setActivePendingPost] = useState<Post | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [viewingInquiry, setViewingInquiry] = useState<PremiumInquiry | null>(null);
    const [inquiryMessages, setInquiryMessages] = useState<InquiryMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const { logout, user: adminUser } = useAuth();
    const [, navigate] = useLocation();
    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const grantsPerPage = 6;

     useEffect(() => {
        if (activeTab === "Blogs") {
            loadPosts();
            loadPending();
        }
        if (activeTab === "Grants") loadGrants();
        if (activeTab === "Calendar") loadEvents();
        if (activeTab === "Applications") loadApplications();
        if (activeTab === "Users") loadUsers();
        if (activeTab === "Users Queries") loadPremiumInquiries();
        if (activeTab === "Contact Messages") loadContactMessages();
        if (activeTab === "Home") navigate("/");
    }, [activeTab, navigate]);

    useEffect(() => {
        if (viewingInquiry?.id) {
            const unsubscribe = subscribeToInquiryMessages(viewingInquiry.id, (msgs) => {
                setInquiryMessages(msgs);
            });
            return () => unsubscribe();
        }
    }, [viewingInquiry]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [inquiryMessages]);

    const loadPosts = async () => setPosts((await fetchPosts()) as Post[]);
    const loadPending = async () => setPendingPosts((await fetchPendingPosts()) as Post[]);
    const loadGrants = async () => setGrants((await fetchGrants()) as Grant[]);
    const loadApplications = async () => setApplications(await fetchAllApplications());
    const loadUsers = async () => setUsers(await fetchAllUsers());
    const loadEvents = async () => setEvents((await fetchEvents()).sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()));
    const loadPremiumInquiries = async () => setPremiumInquiries(await fetchPremiumInquiries());
    const loadContactMessages = async () => setContactMessages(await fetchContactMessages());

    const handleDeletePost = async (id: string) => { await deletePost(id); loadPosts(); };
    const handleCreatePost = async (formData: InsertPost) => { await createPost(formData); loadPosts(); setShowModal(false); };
    const handleUpdatePost = async (updated: InsertPost & { id: string }) => { if (editingPost) { await updatePost(editingPost.id, updated); loadPosts(); setEditingPost(null); setShowModal(false); } };
    const handleCreateGrant = async (formData: InsertGrant) => { await createGrant(formData); loadGrants(); setShowGrantModal(false); };
    const handleUpdateGrant = async (updatedData: InsertGrant) => { if (editingGrant) { await updateGrant(editingGrant.id, updatedData); loadGrants(); setEditingGrant(null); setShowGrantModal(false); } };
    const handleDeleteGrant = async (id: string) => { if (window.confirm("Sure you want to delete?")) { await deleteGrant(id); loadGrants(); } };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !viewingInquiry?.id || !adminUser?.id) return;
        try {
            await sendInquiryMessage({
                inquiryId: viewingInquiry.id,
                text: newMessage,
                sender: 'admin',
                senderId: adminUser.id,
            });
            setNewMessage("");
            loadPremiumInquiries();
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
        }
    };
    
    const handleSidebarItemClick = (item: string) => { setActiveTab(item); setSidebarOpen(false); };
    
    const eventsForSelectedDate = useMemo(() => {
        const y = selectedDate.getFullYear();
        const m = selectedDate.getMonth();
        const d = selectedDate.getDate();
        return events.filter(ev => {
            const start = new Date(ev.start);
            return start.getFullYear() === y && start.getMonth() === m && start.getDate() === d;
        });
    }, [events, selectedDate]);
    
    const eventDates = useMemo(() => events.map(ev => new Date(ev.start)), [events]);

    const formatEventTime = (ev: CalendarEvent) => {
        if (ev.allDay) return "All day";
        const start = new Date(ev.start);
        const end = new Date(ev.end);
        return `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    const handleCreateEvent = async (data: InsertEvent) => { await createCalendarEvent(data); await loadEvents(); setShowEventModal(false); };
    const handleUpdateEvent = async (data: InsertEvent & { id: string }) => { await updateCalendarEvent(data.id, data); await loadEvents(); setEditingEvent(null); setShowEventModal(false); };
    const handleDeleteEvent = async (id: string) => { if (window.confirm("Delete this event?")) { await deleteCalendarEvent(id); await loadEvents(); } };

    // Grants Pagination Logic
    const indexOfLastGrant = currentPage * grantsPerPage;
    const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
    const currentGrants = grants.slice(indexOfFirstGrant, indexOfLastGrant);
    const totalPages = Math.ceil(grants.length / grantsPerPage);

    const paginate = (pageNumber: number) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard": return <DashboardAnalytics setActiveTab={setActiveTab} />;
            case "Grants": return (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Grants Management</h1>
                    <Button onClick={() => { setEditingGrant(null); setShowGrantModal(true); }} className="bg-violet hover:bg-violet/90 text-white font-semibold shadow-md"><PlusCircle className="mr-2 h-5 w-5" /> Create Grant</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentGrants.map((grant) => (
                      <Card key={grant.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col overflow-hidden">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                             <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">{grant.title}</CardTitle>
                             <Badge variant={grant.status === "Active" ? "default" : "destructive"} className={`${grant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{grant.status}</Badge>
                          </div>
                          <CardDescription className="text-sm text-gray-500 pt-1">{grant.organization}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{grant.description}</p>
                           <div className="text-xs text-gray-500 space-y-2">
                               <p><strong>Funding:</strong> <span className="font-semibold text-violet">{grant.fundingAmount}</span></p>
                               <p><strong>Deadline:</strong> {grant.deadline.toLocaleDateString()}</p>
                           </div>
                        </CardContent>
                        <div className="p-4 border-t bg-gray-50 flex gap-2">
                          <Button size="sm" variant="outline" className="w-full" onClick={() => { setEditingGrant(grant); setShowGrantModal(true); }}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                          <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDeleteGrant(grant.id)}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-end items-center mt-6 gap-2">
                      <Button variant="outline" size="icon" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                      <Button variant="outline" size="icon" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                          <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
            );
            case "Applications": return (
                <div>
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-3xl font-bold text-gray-800">Grant Applications</h1>
                      <Button onClick={() => exportToExcel(applications, "GrantApplications")} className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md" disabled={applications.length === 0}><Download className="mr-2 h-5 w-5"/>Export</Button>
                    </div>
                    <Card className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                              <th scope="col" className="px-6 py-4">Applicant</th>
                              <th scope="col" className="px-6 py-4">Contact</th>
                              <th scope="col" className="px-6 py-4">Help Needed</th>
                              <th scope="col" className="px-6 py-4">Support Areas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.map((app) => (
                              <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                                <td className="px-6 py-4">{app.email}<br/><span className="text-xs text-gray-400">{app.phone}</span></td>
                                <td className="px-6 py-4 max-w-xs truncate">{app.helpDescription || 'N/A'}</td>
                                <td className="px-6 py-4">{app.supportAreas ? app.supportAreas.join(', ') : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                </div>
            );
             case "Users": return (
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
                    <Card className="overflow-hidden">
                       <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Joined On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={(user as any).avatarUrl} alt={user.fullName}/>
                                                <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              {user.fullName}
                                              <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.phoneNumber || "N/A"}</td>
                                        <td className="px-6 py-4">{user.createdAt.toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       </div>
                    </Card>
                </div>
            );
            case "Users Queries": return (
                <div>
                     <h1 className="text-3xl font-bold text-gray-800 mb-6">User Queries</h1>
                     <div className="space-y-4">
                        {premiumInquiries.map((inquiry) => (
                            <Card key={inquiry.id} className="overflow-hidden">
                                <CardHeader className="flex flex-row justify-between items-start bg-gray-50 p-4 border-b">
                                    <div>
                                      <CardTitle className="text-base">{inquiry.name}</CardTitle>
                                      <CardDescription>{inquiry.email} • {inquiry.phone}</CardDescription>
                                    </div>
                                    <Badge variant={inquiry.status === 'responded' ? 'default' : 'secondary'}>{inquiry.status}</Badge>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <p className="text-sm font-semibold text-gray-700">Company: {inquiry.companyName || "N/A"}</p>
                                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{inquiry.specificNeeds || inquiry.message}</p>
                                    <div className="mt-4">
                                       <Button size="sm" variant="outline" onClick={() => setViewingInquiry(inquiry)}>
                                          <MessageSquare className="mr-2 h-4 w-4"/> Chat
                                       </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {premiumInquiries.length === 0 && (<div className="text-center py-16 text-gray-500"><p>No user queries yet. ✨</p></div>)}
                    </div>
                </div>
            );
            case "Contact Messages": return (
                <div>
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
                      <Button onClick={() => exportToExcel(contactMessages as any, "ContactMessages")} className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md" disabled={contactMessages.length === 0}><Download className="mr-2 h-5 w-5"/>Export</Button>
                    </div>
                    <Card className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
                            <tr>
                              <th className="px-6 py-4">Received</th>
                              <th className="px-6 py-4">From</th>
                              <th className="px-6 py-4">Subject</th>
                              <th className="px-6 py-4">Message</th>
                            </tr>
                          </thead>
                           <tbody>
                                {contactMessages.map((msg) => (
                                    <tr key={msg.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{msg.createdAt.toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium">{msg.name}<br/><span className="text-xs text-gray-400">{msg.email}</span></td>
                                        <td className="px-6 py-4 font-semibold">{msg.subject}</td>
                                        <td className="px-6 py-4 max-w-sm truncate text-gray-600">{msg.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                    </Card>
                </div>
            );
            case "Blogs": return (
                <>
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
                      <Button onClick={() => { setEditingPost(null); setShowModal(true); }} className="bg-violet hover:bg-violet/90 text-white font-semibold shadow-md"><PlusCircle className="mr-2 h-5 w-5"/> Create Blog</Button>
                    </div>

                    <Card className="mb-8">
                       <CardHeader>
                          <CardTitle className="text-pink">Pending Approval ({pendingPosts.length})</CardTitle>
                          <CardDescription>Review and publish user-submitted blog posts.</CardDescription>
                       </CardHeader>
                       <CardContent>
                         {pendingPosts.length > 0 ? (
                            <div className="space-y-3">
                                {pendingPosts.map((p) => (
                                    <div key={p.id} className="border rounded-lg p-3 flex justify-between items-center">
                                       <div>
                                          <p className="font-semibold text-gray-800">{p.title}</p>
                                          <p className="text-xs text-gray-500">By {p.authorName || p.author}</p>
                                       </div>
                                       <div className="flex gap-2">
                                           <Button size="sm" variant="outline" onClick={() => { setActivePendingPost(p); setShowPendingModal(true); }}>View</Button>
                                           <Button size="sm" className="bg-green-100 text-green-800 hover:bg-green-200" onClick={async () => { await approvePost(p.id); await loadPending(); await loadPosts(); }}><Check className="h-4 w-4"/></Button>
                                           <Button size="sm" variant="destructive" onClick={async () => { await rejectPost(p.id); await loadPending(); }}><X className="h-4 w-4"/></Button>
                                       </div>
                                    </div>
                                ))}
                            </div>
                         ) : (<div className="text-center py-6 text-gray-500">No pending posts for approval.</div>)}
                       </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Card key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col overflow-hidden">
                                <img src={post.imageUrl || "https://placehold.co/600x400"} alt={post.title} className="w-full h-40 object-cover" />
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold line-clamp-2">{post.title}</CardTitle>
                                    <CardDescription>{post.category}</CardDescription>
                                </CardHeader>
                                <div className="p-4 border-t mt-auto bg-gray-50">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full">
                                          <MoreHorizontal className="h-4 w-4"/> Options
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => { setEditingPost(post); setShowModal(true); }}>
                                          <Edit className="mr-2 h-4 w-4"/> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600">
                                          <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            );
            case "Incubators": return <PlaceholderContent title="Incubators" />;
            case "Calendar": return (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Event Calendar</h1>
                    <Button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="bg-violet hover:bg-violet/90 text-white font-semibold shadow-md"><PlusCircle className="mr-2 h-5 w-5"/> Add Event</Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <Card className="lg:col-span-1">
                      <Calendar 
                          mode="single" 
                          selected={selectedDate} 
                          onSelect={(d: any) => setSelectedDate(d || new Date())} 
                          className="p-0"
                          modifiers={{ hasEvent: eventDates }}
                          modifiersClassNames={{ hasEvent: "bg-violet/20 text-violet rounded-full" }}
                      />
                    </Card>
                    <Card className="lg:col-span-2">
                       <CardHeader>
                          <CardTitle>Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
                       </CardHeader>
                       <CardContent>
                          <div className="space-y-4">
                              {eventsForSelectedDate.length === 0 ? (<p className="text-sm text-center text-gray-500 py-8">No events for this day.</p>)
                               : (eventsForSelectedDate.map((ev) => (
                                  <div key={ev.id} className="border-l-4 border-violet pl-4 py-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-800">{ev.title}</p>
                                          <p className="text-xs text-gray-500">{formatEventTime(ev)} {ev.location && `• ${ev.location}`}</p>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal/></Button></DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => { setEditingEvent(ev); setShowEventModal(true); }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteEvent(ev.id)} className="text-red-600">Delete</DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      {ev.description && (<p className="text-sm text-gray-600 mt-1">{ev.description}</p>)}
                                  </div>
                              )))}
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                  <Card className="mt-6">
                      <CardHeader>
                          <CardTitle>All Upcoming Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                              {events.length === 0 ? (<p className="text-sm text-center text-gray-500 py-8">No events scheduled.</p>)
                               : (events.map((ev) => (
                                  <div key={ev.id} className="border-l-4 border-gray-300 pl-4 py-2">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-800">{ev.title}</p>
                                           <p className="text-xs text-gray-500">
                                            {new Date(ev.start).toLocaleDateString()} • {formatEventTime(ev)} {ev.location && `• ${ev.location}`}
                                          </p>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal/></Button></DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => { setEditingEvent(ev); setShowEventModal(true); }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteEvent(ev.id)} className="text-red-600">Delete</DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                  </div>
                              )))}
                          </div>
                      </CardContent>
                  </Card>
                </div>
            );
            case "Social Apps": return <PlaceholderContent title="Social Apps" />;
            default: return <DashboardAnalytics setActiveTab={setActiveTab} />;
        }
    };

    const SidebarContent = () => (
      <>
        <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 py-6 font-bold text-xl border-b text-violet flex items-center justify-between">
                <span>ADMIN</span>
            </div>
             <nav className="flex-1 overflow-y-auto flex flex-col gap-1 mt-4 px-4 text-sm text-gray-700">
                {sidebarItems.map(({ name, icon: Icon }) => (
                    <button key={name} className={`px-4 py-3 rounded-lg cursor-pointer transition-all flex items-center text-left ${activeTab === name ? "bg-violet/10 text-violet font-semibold" : "hover:bg-violet/5"}`} onClick={() => handleSidebarItemClick(name)}>
                        <Icon className="w-5 h-5 mr-3" /> {name}
                    </button>
                ))}
            </nav>
        </div>
        <div className="p-4 border-t flex items-center gap-3">
             <Avatar>
                <AvatarImage src={adminUser?.avatarUrl} />
                <AvatarFallback>{adminUser?.fullName?.[0]}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
               <p className="text-sm font-semibold truncate">{adminUser?.fullName}</p>
               <p className="text-xs text-gray-500 truncate">{adminUser?.email}</p>
             </div>
             <Button variant="ghost" size="icon" onClick={logout} className="text-gray-500 hover:text-red-500 hover:bg-red-50"><LogOut className="h-5 w-5"/></Button>
        </div>
      </>
    );

    return (
        <div className="min-h-screen flex bg-[#F9FAFB]">
            <aside className="fixed md:relative w-64 bg-white shadow-lg border-r flex-col h-full z-50 transition-transform duration-300 ease-in-out hidden md:flex">
                <SidebarContent/>
            </aside>
            
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-64 flex flex-col">
                   <SidebarContent />
                </SheetContent>
            </Sheet>

            <main className="flex-1 flex flex-col min-w-0">
                <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-800 hover:bg-gray-100" aria-label="Open menu">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <h1 className="font-semibold text-gray-800">{activeTab}</h1>
                    <div className="w-9"></div>
                </div>

                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>

            <CreatePostModal isOpen={showModal} onClose={() => { setEditingPost(null); setShowModal(false); }} initialData={editingPost} onSubmit={editingPost ? handleUpdatePost : handleCreatePost} />
            <CreateGrantModal isOpen={showGrantModal} onClose={() => { setEditingGrant(null); setShowGrantModal(false); }} initialData={editingGrant} onSubmit={editingGrant ? handleUpdateGrant : handleCreateGrant} />
             <EventModal
                isOpen={showEventModal}
                onClose={() => { setEditingEvent(null); setShowEventModal(false); }}
                initialData={editingEvent ? { id: editingEvent.id, title: editingEvent.title, description: editingEvent.description, start: editingEvent.start, end: editingEvent.end, allDay: editingEvent.allDay, location: editingEvent.location, } : null}
                onSubmit={(data: InsertEvent & { id?: string }) => {
                    if (editingEvent) {
                        return handleUpdateEvent({ ...(data as InsertEvent), id: editingEvent.id, });
                    }
                    return handleCreateEvent(data as InsertEvent);
                }}
            />
            <Sheet open={!!viewingInquiry} onOpenChange={() => setViewingInquiry(null)}>
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Chat with {viewingInquiry?.name}</SheetTitle>
                        <SheetDescription>{viewingInquiry?.email}</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto pr-4 -mr-6 mt-4 space-y-4">
                        {inquiryMessages.map((msg) => (
                           <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${msg.sender === 'admin' ? 'bg-violet text-white' : 'bg-gray-200 text-gray-800'}`}>
                                   <p className="text-sm">{msg.text}</p>
                                   <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-violet-200' : 'text-gray-500'}`}>{msg.createdAt.toLocaleTimeString()}</p>
                               </div>
                           </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <SheetFooter>
                       <form onSubmit={handleSendMessage} className="flex gap-2 w-full mt-4">
                           <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..."/>
                           <Button type="submit"><Send className="h-4 w-4"/></Button>
                       </form>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={showPendingModal} onOpenChange={() => { setShowPendingModal(false); setActivePendingPost(null); }}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Pending Blog Preview</DialogTitle></DialogHeader>
                    {activePendingPost && (
                        <div className="space-y-4">
                            {activePendingPost.imageUrl && (<img src={activePendingPost.imageUrl} alt={activePendingPost.title} className="w-full h-64 object-cover rounded-md" />)}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{activePendingPost.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">Category: {activePendingPost.category || "General"}</p>
                                <p className="text-sm text-gray-500">By {activePendingPost.authorName || activePendingPost.author} {activePendingPost.authorEmail ? `• ${activePendingPost.authorEmail}` : ""}</p>
                            </div>
                            <div className="prose max-w-none whitespace-pre-wrap">{activePendingPost.content}</div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => { setShowPendingModal(false); setActivePendingPost(null); }}>Close</Button>
                                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={async () => { if (!activePendingPost) return; await approvePost(activePendingPost.id); await loadPending(); await loadPosts(); setShowPendingModal(false); setActivePendingPost(null); }}>Approve</Button>
                                <Button variant="destructive" onClick={async () => { if (!activePendingPost) return; await rejectPost(activePendingPost.id); await loadPending(); setShowPendingModal(false); setActivePendingPost(null); }}>Reject</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}