import { useEffect, useState } from "react";
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
  updateApplicationStatus
} from "@/services/applications";
import { fetchAllUsers } from "@/services/users"; // Import the new user service
import { Grant, InsertGrant, Post, InsertPost, Application, User, CalendarEvent, InsertEvent } from "@shared/schema";
import { CreatePostModal } from "@/components/create-post-modal";
import { CreateGrantModal } from "@/components/create-grant-modal";
import { EventModal } from "@/components/ui/EventModal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  X, ChevronDown, LayoutDashboard, FileText, Inbox, Home, BookOpen, Menu as MenuIcon,
  Users, FileCheck, Award, LoaderCircle, Calendar as CalendarIcon, Briefcase, Share2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats, DashboardStats } from "@/services/admin";
import { Calendar } from "@/components/ui/calendar";
import { fetchEvents, createEvent as createCalendarEvent, updateEvent as updateCalendarEvent, deleteEvent as deleteCalendarEvent } from "@/services/events";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// --- ALL SIDEBAR ITEMS ARE HERE ---
const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  { name: "Grants", icon: <FileText className="w-4 h-4 mr-2" /> },
  { name: "Applications", icon: <Inbox className="w-4 h-4 mr-2" /> },
  { name: "Users", icon: <Users className="w-4 h-4 mr-2" /> },
  { name: "Blogs", icon: <BookOpen className="w-4 h-4 mr-2" /> },
  { name: "Incubators", icon: <Briefcase className="w-4 h-4 mr-2" /> },
  { name: "Calendar", icon: <CalendarIcon className="w-4 h-4 mr-2" /> },
  { name: "Social Apps", icon: <Share2 className="w-4 h-4 mr-2" /> },
  { name: "Home", icon: <Home className="w-4 h-4 mr-2" /> },
];

// --- INTERACTIVE DASHBOARD ANALYTICS ---
const DashboardAnalytics = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8"><LoaderCircle className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card onClick={() => setActiveTab('Users')} className="cursor-pointer hover:border-violet transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Click to view all users</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('Applications')} className="cursor-pointer hover:border-violet transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalApplications}</div>
                    <p className="text-xs text-muted-foreground">Click to view applications</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('Grants')} className="cursor-pointer hover:border-violet transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalGrants}</div>
                    <p className="text-xs text-muted-foreground">Click to manage grants</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

// Placeholder for sections that are not yet built
const PlaceholderContent = ({ title }: { title: string }) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center text-gray-500">
        <p>Content for the <span className="font-semibold text-violet">{title}</span> section will be displayed here.</p>
        <p className="text-sm mt-2">This feature is currently under construction.</p>
      </div>
    </div>
);


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (activeTab === "Blogs") { loadPosts(); loadPending(); }
    if (activeTab === "Grants") loadGrants();
    if (activeTab === "Calendar") loadEvents();
    if (activeTab === "Applications") loadApplications();
    if (activeTab === "Users") loadUsers();
    if (activeTab === "Home") navigate("/");
  }, [activeTab]);

  const loadPosts = async () => setPosts(await fetchPosts() as Post[]);
  const loadPending = async () => setPendingPosts(await fetchPendingPosts() as Post[]);
  const loadGrants = async () => setGrants(await fetchGrants() as Grant[]);
  const loadApplications = async () => setApplications(await fetchAllApplications());
  const loadUsers = async () => setUsers(await fetchAllUsers());
  const loadEvents = async () => setEvents(await fetchEvents());

  const handleDeletePost = async (id: string) => { await deletePost(id); loadPosts(); };
  const handleCreatePost = async (formData: InsertPost) => { await createPost(formData); loadPosts(); setShowModal(false); };
  const handleUpdatePost = async (updated: InsertPost & { id: string }) => { if(editingPost) {await updatePost(editingPost.id, updated); loadPosts(); setEditingPost(null); setShowModal(false); } };

  const handleCreateGrant = async (formData: InsertGrant) => { await createGrant(formData); loadGrants(); setShowGrantModal(false); };
  const handleUpdateGrant = async (updatedData: InsertGrant) => { if (editingGrant) { await updateGrant(editingGrant.id, updatedData); loadGrants(); setEditingGrant(null); setShowGrantModal(false); } };
  const handleDeleteGrant = async (id: string) => { if (window.confirm("Sure you want to delete?")) { await deleteGrant(id); loadGrants(); } };

  const handleStatusChange = async (appId: string, status: string) => {
    await updateApplicationStatus(appId, status);
    loadApplications();
  };

  const handleSidebarItemClick = (item: string) => { setActiveTab(item); setSidebarOpen(false); };
  
  const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Reviewed': return 'bg-blue-100 text-blue-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
  };
  
  const eventsForSelectedDate = () => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const d = selectedDate.getDate();
    return events.filter(ev => {
      const start = new Date(ev.start);
      return start.getFullYear() === y && start.getMonth() === m && start.getDate() === d;
    });
  };

  const formatEventTime = (ev: CalendarEvent) => {
    if (ev.allDay) return "All day";
    const start = new Date(ev.start);
    const end = new Date(ev.end);
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleCreateEvent = async (data: InsertEvent) => {
    await createCalendarEvent(data);
    await loadEvents();
    setShowEventModal(false);
  };

  const handleUpdateEvent = async (data: InsertEvent & { id: string }) => {
    await updateCalendarEvent(data.id, data);
    await loadEvents();
    setEditingEvent(null);
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Delete this event?")) {
      await deleteCalendarEvent(id);
      await loadEvents();
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case "Dashboard": return <DashboardAnalytics setActiveTab={setActiveTab} />;
      case "Grants": return (
        <>
          <div className="bg-white border rounded-lg shadow-sm mb-6 p-4">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-xl font-semibold text-gray-800">Manage Grants</h2>
                      <p className="text-sm text-gray-500 mt-1">Add, edit, or delete grant listings.</p>
                  </div>
                  <Button onClick={() => { setEditingGrant(null); setShowGrantModal(true); }} className="bg-violet text-white hover:bg-pink font-medium">
                      + Create Grant
                  </Button>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grants.map((grant) => (
                  <article key={grant.id} className="bg-white rounded-lg border shadow hover:shadow-lg transition-shadow flex flex-col">
                      <div className="p-5 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{grant.title}</h3>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${grant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{grant.status}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{grant.organization}</p>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{grant.description}</p>
                      </div>
                      <div className="p-5 border-t bg-gray-50 rounded-b-lg">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                              <span className="truncate">Funding: <span className="font-semibold text-gray-700">{grant.fundingAmount}</span></span>
                              <span className="truncate">Deadline: <span className="font-semibold text-gray-700">{grant.deadline.toLocaleDateString()}</span></span>
                          </div>
                          <div className="flex gap-2">
                              <Button size="sm" className="w-full" onClick={() => { setEditingGrant(grant); setShowGrantModal(true); }}>Edit</Button>
                              <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDeleteGrant(grant.id)}>Delete</Button>
                          </div>
                      </div>
                  </article>
              ))}
          </div>
        </>
      );
      case "Applications": return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Grant Applications</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Applicant Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Phone</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                    <td className="px-6 py-4">{app.email}</td>
                    <td className="px-6 py-4">{app.phone}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status || 'Pending')}`}>
                            {app.status || 'Pending'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change Status <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Reviewed')}>Reviewed</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Approved')}>Approved</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'Rejected')}>Rejected</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
       case "Users": return (
        <div>
            <h2 className="text-2xl font-bold mb-4">All Users</h2>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50"><tr className="text-xs text-gray-700 uppercase"><th className="px-6 py-3">Full Name</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Phone Number</th><th className="px-6 py-3">Joined On</th></tr></thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b"><td className="px-6 py-4 font-medium">{user.fullName}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.phoneNumber || 'N/A'}</td><td className="px-6 py-4">{user.createdAt.toLocaleDateString()}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
      );
      case "Blogs": return (
        <>
          <div className="bg-white border rounded-lg shadow-sm mb-6 p-4">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-xl font-semibold text-gray-800">Manage Blogs</h2>
                      <p className="text-sm text-gray-500 mt-1">Add, edit, delete, and approve user-submitted blogs.</p>
                  </div>
                  <Button onClick={() => { setEditingPost(null); setShowModal(true); }} className="bg-violet text-white hover:bg-pink font-medium">
                      + Create Blog
                  </Button>
              </div>
          </div>
          {pendingPosts.length > 0 && (
            <div className="bg-white border rounded-lg shadow-sm mb-6 p-4">
              <h3 className="text-lg font-semibold mb-3">Pending Approval</h3>
              <div className="space-y-3">
                {pendingPosts.map((p) => (
                  <div key={p.id} className="border rounded-md p-3">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-500">By {p.authorName || p.author} • {p.authorEmail || ""}</div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{p.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setActivePendingPost(p); setShowPendingModal(true); }}>View</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={async () => { await approvePost(p.id); await loadPending(); await loadPosts(); }}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={async () => { await rejectPost(p.id); await loadPending(); }}>Reject</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg border shadow hover:shadow-lg transition-shadow flex flex-col">
                      <img src={post.imageUrl || 'https://placehold.co/600x400'} alt={post.title} className="w-full h-40 object-cover rounded-t-lg" />
                      <div className="p-5 flex-grow">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{post.category} {post.status ? `• ${post.status}` : ''}</p>
                      </div>
                      <div className="p-5 border-t bg-gray-50 rounded-b-lg">
                          <div className="flex gap-2">
                              <Button size="sm" className="w-full" onClick={() => { setEditingPost(post); setShowModal(true); }}>Edit</Button>
                              <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                          </div>
                      </div>
                  </article>
              ))}
          </div>
        </>
      );
      case "Incubators": return <PlaceholderContent title="Incubators" />;
      case "Calendar": return (
        <>
          <div className="bg-white border rounded-lg shadow-sm mb-6 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
                <p className="text-sm text-gray-500 mt-1">Add, view, and manage events.</p>
              </div>
              <Button onClick={() => { setEditingEvent(null); setShowEventModal(true); }} className="bg-violet text-white hover:bg-pink font-medium">
                + Add Event
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg shadow-sm p-4 lg:col-span-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d: any) => setSelectedDate(d || new Date())}
                className="rounded-md"
                modifiers={{ hasEvent: events.map(ev => new Date(ev.start)) }}
                modifiersClassNames={{ hasEvent: "bg-violet/20 text-violet rounded-full" }}
              />
            </div>
            <div className="bg-white border rounded-lg shadow-sm p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Events on {selectedDate.toLocaleDateString()}</h3>
                <Button size="sm" onClick={() => { setEditingEvent(null); setShowEventModal(true); }}>Add</Button>
              </div>
              <div className="space-y-3">
                {eventsForSelectedDate().length === 0 && (
                  <p className="text-sm text-gray-500">No events for this day.</p>
                )}
                {eventsForSelectedDate().map((ev) => (
                  <div key={ev.id} className="border rounded-md p-3 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-gray-500">{formatEventTime(ev)}</div>
                      {ev.location && <div className="text-xs text-gray-500">{ev.location}</div>}
                      {ev.description && <div className="text-sm text-gray-700 mt-1">{ev.description}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingEvent(ev); setShowEventModal(true); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(ev.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-lg shadow-sm p-4 mt-6">
            <h3 className="text-lg font-semibold mb-3">All Events</h3>
            {events.length === 0 ? (
              <p className="text-sm text-gray-500">No events added yet.</p>
            ) : (
              <div className="divide-y">
                {events.map((ev) => (
                  <div key={ev.id} className="py-3 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-xs text-gray-500">{new Date(ev.start).toLocaleDateString()} • {formatEventTime(ev)}</div>
                      {ev.location && <div className="text-xs text-gray-500">{ev.location}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingEvent(ev); setShowEventModal(true); }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(ev.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
      case "Social Apps": return <PlaceholderContent title="Social Apps" />;
      default: return <DashboardAnalytics setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className={`fixed md:relative w-64 bg-white shadow-md border-r flex flex-col justify-between h-full z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          <div className="px-6 py-6 font-bold text-lg border-b text-violet flex items-center justify-between">
            <span>ADMIN PANEL</span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 mt-6 px-4 text-sm text-gray-700">
            {sidebarItems.map((item) => (
              <div key={item.name} className={`px-3 py-2.5 rounded-md cursor-pointer transition-all flex items-center ${activeTab === item.name ? "bg-violet/10 text-violet font-semibold" : "hover:bg-violet/5"}`} onClick={() => handleSidebarItemClick(item.name)}>
                {item.icon} {item.name}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t"><Button variant="destructive" className="w-full" onClick={logout}>Logout</Button></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-gray-100 border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-md text-gray-800 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-gray-800">{activeTab}</h1>
          <div className="w-9"></div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {renderContent()}
        </div>
      </main>
      
      <CreatePostModal isOpen={showModal} onClose={() => {setEditingPost(null); setShowModal(false);}} initialData={editingPost} onSubmit={editingPost ? handleUpdatePost : handleCreatePost} />
      <CreateGrantModal isOpen={showGrantModal} onClose={() => { setEditingGrant(null); setShowGrantModal(false); }} initialData={editingGrant} onSubmit={editingGrant ? handleUpdateGrant : handleCreateGrant}/>
      <EventModal
        isOpen={showEventModal}
        onClose={() => { setEditingEvent(null); setShowEventModal(false); }}
        initialData={editingEvent ? { id: editingEvent.id, title: editingEvent.title, description: editingEvent.description, start: editingEvent.start, end: editingEvent.end, allDay: editingEvent.allDay, location: editingEvent.location } : null}
        onSubmit={(data: InsertEvent & { id?: string }) => {
          if (editingEvent) {
            return handleUpdateEvent({ ...(data as InsertEvent), id: editingEvent.id });
          }
          return handleCreateEvent(data as InsertEvent);
        }}
      />

      <Dialog open={showPendingModal} onOpenChange={() => { setShowPendingModal(false); setActivePendingPost(null); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pending Blog Preview</DialogTitle>
          </DialogHeader>
          {activePendingPost && (
            <div className="space-y-4">
              {activePendingPost.imageUrl && (
                <img src={activePendingPost.imageUrl} alt={activePendingPost.title} className="w-full h-64 object-cover rounded-md" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{activePendingPost.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Category: {activePendingPost.category || 'General'}</p>
                <p className="text-sm text-gray-500">By {activePendingPost.authorName || activePendingPost.author} {activePendingPost.authorEmail ? `• ${activePendingPost.authorEmail}` : ''}</p>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap">{activePendingPost.content}</div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setShowPendingModal(false); setActivePendingPost(null); }}>Close</Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={async () => {
                  if (!activePendingPost) return;
                  await approvePost(activePendingPost.id);
                  await loadPending();
                  await loadPosts();
                  setShowPendingModal(false);
                  setActivePendingPost(null);
                }}>Approve</Button>
                <Button variant="destructive" onClick={async () => {
                  if (!activePendingPost) return;
                  await rejectPost(activePendingPost.id);
                  await loadPending();
                  setShowPendingModal(false);
                  setActivePendingPost(null);
                }}>Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}