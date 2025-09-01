import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/services/firebase";
import {
  fetchGrants,
  createGrant,
  updateGrant,
  deleteGrant,
} from "@/services/grants";
import { Grant, InsertGrant, Post, InsertPost } from "@shared/schema";
import { CreatePostModal } from "@/components/create-post-modal";
import { CreateGrantModal } from "@/components/create-grant-modal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Calendar as CalendarIcon, 
  Mail, 
  Trash, 
  Phone, 
  Building,
  X 
} from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Interface Definitions
interface Application { id: string; name: string; phone: string; email: string; helpAreas: string[]; submittedAt?: any; }
interface IncubatorApplication { id: string; name: string; email: string; phoneNumber: string; sectors: { label: string; value: string }[]; programName?: string; deadlineDate: string; programDetails: string; applicationFormLink: string; }

// Sidebar Items
const sidebarItems = ["Dashboard", "Grants", "Inbox", "Incubators", "Calendar", "Social Apps", "Home"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [incubatorApplications, setIncubatorApplications] = useState<IncubatorApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedIncubator, setSelectedIncubator] = useState<IncubatorApplication | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (activeTab === "Dashboard") loadPosts();
    if (activeTab === "Grants") loadGrants();
    if (activeTab === "Inbox") listenToApplications();
    if (activeTab === "Incubators") listenToIncubatorApplications();
    if (activeTab === "Home") navigate("/");
  }, [activeTab]);

  const loadPosts = async () => setPosts(await fetchPosts() as Post[]);
  const handleDeletePost = async (id: string) => { await deletePost(id); loadPosts(); };
  const handleCreatePost = async (formData: InsertPost) => { await createPost(formData); loadPosts(); setShowModal(false); };
  const handleUpdatePost = async (updated: InsertPost & { id: string }) => { if(editingPost) {await updatePost(editingPost.id, updated); loadPosts(); setEditingPost(null); setShowModal(false); } };

  const loadGrants = async () => setGrants(await fetchGrants() as Grant[]);
  const handleCreateGrant = async (formData: InsertGrant) => { await createGrant(formData); loadGrants(); setShowGrantModal(false); };
  const handleUpdateGrant = async (updatedData: InsertGrant) => { if (editingGrant) { await updateGrant(editingGrant.id, updatedData); loadGrants(); setEditingGrant(null); setShowGrantModal(false); } };
  const handleDeleteGrant = async (id: string) => { if (window.confirm("Sure you want to delete?")) { await deleteGrant(id); loadGrants(); } };

  const listenToApplications = () => onSnapshot(collection(db, "grant_applications"), (s) => setApplications(s.docs.map(d => ({id: d.id, ...d.data()})) as any));
  const deleteApplication = async (id: string) => { await deleteDoc(doc(db, "grant_applications", id)); if (selectedApplication?.id === id) setSelectedApplication(null); };
  const listenToIncubatorApplications = () => onSnapshot(collection(db, "incubator_requests"), (s) => setIncubatorApplications(s.docs.map(d => ({id: d.id, ...d.data()})) as any));
  const deleteIncubatorApplication = async (id: string) => { await deleteDoc(doc(db, "incubator_requests", id)); if (selectedIncubator?.id === id) setSelectedIncubator(null); };

  const handleSidebarItemClick = (item: string) => { setActiveTab(item); setSidebarOpen(false); };

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
          <nav className="flex flex-col gap-2 mt-6 px-4 text-sm text-gray-700">
            {sidebarItems.map((item) => (
              <div key={item} className={`px-3 py-2 rounded-md cursor-pointer transition-all ${activeTab === item ? "bg-violet/10 text-violet" : "hover:bg-violet/5"}`} onClick={() => handleSidebarItemClick(item)}>
                {item}
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="font-semibold text-gray-800">{activeTab}</h1>
          <div className="w-9"></div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "Dashboard" && (
            <>
              <div className="bg-white border rounded-lg shadow-sm mb-6 p-4">
                  <div className="flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-semibold text-gray-800">Manage Posts</h2>
                          <p className="text-sm text-gray-500 mt-1">Add, edit, or delete blog posts.</p>
                      </div>
                      <Button onClick={() => { setEditingPost(null); setShowModal(true); }} className="bg-violet text-white hover:bg-pink font-medium">
                          + Create Post
                      </Button>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                      <article key={post.id} className="bg-white rounded-lg border shadow hover:shadow-lg transition-shadow flex flex-col">
                          <img src={post.imageUrl || 'https://placehold.co/600x400'} alt={post.title} className="w-full h-40 object-cover rounded-t-lg" />
                          <div className="p-5 flex-grow">
                              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{post.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{post.category}</p>
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
          )}

          {activeTab === "Grants" && (
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
          )}

          {activeTab === "Inbox" && ( <div className="text-center p-4">Your Inbox UI Here</div> )}
          {activeTab === "Incubators" && ( <div className="text-center p-4">Your Incubators UI Here</div> )}
          {activeTab === "Calendar" && ( <div className="text-center p-4">Your Calendar UI Here</div> )}
          {activeTab === "Social Apps" && ( <div className="text-center p-4">Your Social Apps UI Here</div> )}
        </div>
      </main>
      
      <CreatePostModal isOpen={showModal} onClose={() => {setEditingPost(null); setShowModal(false);}} initialData={editingPost} onSubmit={editingPost ? handleUpdatePost : handleCreatePost} />
      <CreateGrantModal isOpen={showGrantModal} onClose={() => { setEditingGrant(null); setShowGrantModal(false); }} initialData={editingGrant} onSubmit={editingGrant ? handleUpdateGrant : handleCreateGrant}/>
    </div>
  );
}