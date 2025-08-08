import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/services/firebase";
import { uploadToCloudinary } from "@/services/cloudinary";
import { CreatePostModal } from "@/components/create-post-modal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { updateDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  Mail,
  Trash,
  Phone,
  Building,
} from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
interface Post {
  id: string;
  title: string;
  link?: string;
  content?: string;
  category?: string;
  imageUrl: string;
}
interface Application {
  id: string;
  name: string;
  phone: string;
  email: string;
  helpAreas: string[]; // ✅ Replaces helpDescription with checkbox values
  submittedAt?: any;   // Keep this if you still log timestamps
}


interface SocialApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  followers: number;
  engagement: number;
  color: string;
  bgColor: string;
}
interface IncubatorApplication {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  sectors: { label: string; value: string }[];
  programName?: string;
  deadlineDate: string;
  programDetails: string;
  applicationFormLink: string;
}
const sidebarItems = ["Dashboard","Inbox", "Incubators", "Calendar", "Social Apps","Home"];
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [incubatorApplications, setIncubatorApplications] = useState<IncubatorApplication[]>([]);
const [selectedIncubator, setSelectedIncubator] = useState<IncubatorApplication | null>(null);
  // Social apps mock data
  const [socialApps] = useState<SocialApp[]>([
    {
      id: "1",
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      connected: true,
      followers: 12500,
      engagement: 85,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      id: "2",
      name: "Twitter",
      icon: <Twitter className="w-6 h-6" />,
      connected: true,
      followers: 8900,
      engagement: 72,
      color: "text-sky-500",
      bgColor: "bg-sky-50 border-sky-200",
    },
    {
      id: "3",
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      connected: false,
      followers: 0,
      engagement: 0,
      color: "text-pink-600",
      bgColor: "bg-pink-50 border-pink-200",
    },
    {
      id: "4",
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      connected: true,
      followers: 3200,
      engagement: 68,
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      id: "5",
      name: "YouTube",
      icon: <Youtube className="w-6 h-6" />,
      connected: false,
      followers: 0,
      engagement: 0,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
    },
  ]);

  useEffect(() => {
  if (activeTab === "Dashboard") loadPosts();
  if (activeTab === "Inbox") listenToApplications();
  if (activeTab === "Incubators") listenToIncubatorApplications(); // Add this line
  if (activeTab === "Home") navigate("/");
}, [activeTab]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  const handleCreate = async (formData: any) => {
    const imageUrl = await uploadToCloudinary(formData.image);
    await createPost({ ...formData, imageUrl });
    loadPosts();
    setShowModal(false);
  };

  const handleUpdate = async (updated: any) => {
    const imageUrl = updated.image
      ? await uploadToCloudinary(updated.image)
      : editingPost?.imageUrl;

    await updatePost(editingPost!.id, { ...updated, imageUrl });
    loadPosts();
    setEditingPost(null);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    loadPosts();
  };
  const listenToApplications = () => {
    const unsubscribe = onSnapshot(
      collection(db, "grant_applications"),
      (snapshot) => {
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];
        setApplications(apps);
      }
    );
    return unsubscribe;
  };

  const deleteApplication = async (id: string) => {
    await deleteDoc(doc(db, "grant_applications", id));
    // Clear selection if the deleted application was selected
    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
  };
  const getCategoryColor = (category: string = "") => {
    const colors = {
      "Government Grants": "bg-blue-100 text-blue-700",
      "Private Grants": "bg-green-100 text-green-700",
      "Startup Funding": "bg-orange-100 text-orange-700",
      Tools: "bg-green-100 text-green-700",
      Strategy: "bg-purple-100 text-purple-700",
      Funding: "bg-yellow-100 text-yellow-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const handleSidebarItemClick = (item: string) => {
    setActiveTab(item);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const toggleSocialConnection = (appId: string) => {
    // This would typically integrate with actual social media APIs
    console.log(`Toggling connection for app: ${appId}`);
  };


const listenToIncubatorApplications = () => {
  const unsubscribe = onSnapshot(
    collection(db, "incubator_requests"),
    (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        email: doc.data().email || "",
        phoneNumber: doc.data().phoneNumber || "",
        sectors: doc.data().sectors || [],
        programName: doc.data().programName,
        deadlineDate: doc.data().deadlineDate || "",
        programDetails: doc.data().programDetails || "",
        applicationFormLink: doc.data().applicationFormLink || "",
      })) as IncubatorApplication[];
      setIncubatorApplications(apps);
    }
  );
  return unsubscribe;
};

const deleteIncubatorApplication = async (id: string) => {
  try {
    await deleteDoc(doc(db, "incubator_requests", id));
    if (selectedIncubator?.id === id) {
      setSelectedIncubator(null);
    }
  } catch (error) {
    console.error("Error deleting incubator application:", error);
    throw error;
  }
};
  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative 
        w-64 bg-white shadow-md border-r 
        flex flex-col justify-between
        h-full md:h-auto
        z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <div className="px-6 py-6 font-bold text-lg border-b text-primary-blue flex items-center justify-between">
            <span>ADMIN PANEL</span>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 mt-6 px-4 text-sm text-gray-700">
            {sidebarItems.map((item) => (
              <div
                key={item}
                className={`px-3 py-2 rounded-md cursor-pointer transition-all ${
                  activeTab === item
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => handleSidebarItemClick(item)}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-800">{activeTab}</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "Dashboard" && (
            <>
              {user && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm mb-6 sm:mb-8 px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex justify-between items-center flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="text-center sm:text-left">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Welcome, Admin
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage blog posts — create, update, or delete content
                        here.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingPost(null);
                        setShowModal(true);
                      }}
                      className="bg-primary-blue text-white hover:bg-accent-blue font-medium whitespace-nowrap"
                    >
                      + Create Post
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow hover:shadow-lg transition-all overflow-hidden"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-36 sm:h-44 object-cover"
                    />
                    <div className="p-4 sm:p-5">
                      {post.category && (
                        <span
                          className={`inline-block mb-2 sm:mb-3 px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                            post.category
                          )}`}
                        >
                          {post.category}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">
                        {post.content?.slice(0, 100)}
                        {post.content && post.content.length > 100 && "..."}
                      </p>

                      <div className="text-sm text-blue-600 hover:underline mb-3">
                        <Link href={`/blog?id=${post.id}`}>Read more →</Link>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="text-sm bg-primary-blue text-white hover:bg-accent-blue flex-1"
                          onClick={() => {
                            setEditingPost(post);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-sm flex-1"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <CreatePostModal
                isOpen={showModal}
                onClose={() => {
                  setEditingPost(null);
                  setShowModal(false);
                }}
                initialData={
                  editingPost
                    ? {
                        id: editingPost.id,
                        title: editingPost.title,
                        content: editingPost.content || "",
                        category: editingPost.category || "",
                        imageUrl: editingPost.imageUrl || "",
                      }
                    : undefined
                }
                onSubmit={editingPost ? handleUpdate : handleCreate}
              />
            </>
          )}
          {activeTab === "Inbox" && (
            <div className="flex h-full">
              {/* Left Panel - Applications List */}
              <div
                className={`${
                  selectedApplication ? "hidden md:block" : "block"
                } w-full md:w-1/2 bg-white border-r border-gray-200 flex flex-col`}
              >
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      Grant Applications
                    </h2>
                    <div className="text-sm text-gray-500">
                      {applications.length} application
                      {applications.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {applications.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No applications submitted yet.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 md:p-4 space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApplication(app)}
                          className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedApplication?.id === app.id
                              ? "bg-blue-50 border-blue-200 shadow-sm"
                              : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Company Avatar */}
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-medium text-xs md:text-sm">
                                {app.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>

                            {/* Application Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                  {app.name || 'Unknown'}
                                </h3>
                                <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {app.email}
                                </span>
                              </div>

                              <p className="text-xs text-gray-500 mt-1 line-clamp-1 hidden md:block">
                                {app.helpAreas?.join(", ")}
                              </p>
                            </div>

                            {/* Time/Status indicator */}
                            <div className="flex flex-col items-end space-y-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-400 hidden sm:block">
                                New
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Detail View */}
              <div
                className={`${
                  selectedApplication ? "block" : "hidden md:block"
                } w-full md:w-1/2 bg-gray-50 flex flex-col`}
              >
                {selectedApplication ? (
                  <>
                    {/* Detail Header */}
                    <div className="bg-white border-b border-gray-200 p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                          {/* Back button for mobile */}
                          <button
                            onClick={() => setSelectedApplication(null)}
                            className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm md:text-lg">
                              {selectedApplication.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                              {selectedApplication.name || 'Unknown'}
                            </h2>
                            <p className="text-sm text-gray-600 truncate">
                              {selectedApplication.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Help Areas Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedApplication.helpAreas?.map((area, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detail Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                      {/* Contact Information */}
                      <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm md:text-base text-gray-900 break-all">
                              {selectedApplication.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm md:text-base text-gray-900">
                              {selectedApplication.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Help Areas */}
                      <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                          Areas of Support Requested
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.helpAreas?.map((area, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 border"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                          Application Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs md:text-sm text-gray-500">
                              Application ID
                            </span>
                            <p className="text-sm md:text-base font-medium text-gray-900">
                              #{selectedApplication.id}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs md:text-sm text-gray-500">
                              Status
                            </span>
                            <p className="text-sm md:text-base font-medium text-green-600">
                              New Application
                            </p>
                          </div>
                          {selectedApplication.submittedAt && (
                            <div className="sm:col-span-2">
                              <span className="text-xs md:text-sm text-gray-500">
                                Submitted At
                              </span>
                              <p className="text-sm md:text-base font-medium text-gray-900">
                                {new Date(selectedApplication.submittedAt).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white border-t border-gray-200 p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={() => {
                            const helpAreasText = selectedApplication.helpAreas?.join(', ') || 'various areas';
                            const applicantName = selectedApplication.name || 'there';
                            const emailBody = `Hi ${applicantName},%0D%0A%0D%0AThanks for applying for grant support.%0D%0A%0D%0AWe'll get back to you shortly regarding your request for help with: ${helpAreasText}.%0D%0A%0D%0ABest,%0D%0AYour GrantPulse Team`;
                            const mailto = `mailto:${selectedApplication.email}?subject=Regarding your grant application&body=${emailBody}`;
                            window.open(mailto);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Send Response
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Mark as Reviewed
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() =>
                            deleteApplication(selectedApplication.id)
                          }
                          className="sm:flex-none px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg justify-center"
                        >
                          <Trash className="w-4 h-4" />
                          <span className="sm:hidden ml-2">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select an Application
                      </h3>
                      <p className="text-gray-500 text-center">
                        Click on an application from the list to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "Calendar" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <CalendarIcon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Event Calendar</h2>
                  </div>
                  <p className="text-blue-100 text-center">
                    Select a date to view or schedule events
                  </p>
                </div>

                <div className="p-6">
                  <div className="calendar-container">
                    <Calendar
                      onChange={(value) => {
                        if (value instanceof Date) setSelectedDate(value);
                      }}
                      value={selectedDate}
                      calendarType="gregory"
                      className="enhanced-calendar w-full"
                      tileClassName={({ date, view }) => {
                        if (view === "month") {
                          const isSelected =
                            date.toDateString() === selectedDate.toDateString();
                          const isToday =
                            date.toDateString() === new Date().toDateString();

                          if (isSelected) {
                            return "selected-date";
                          } else if (isToday) {
                            return "today-date";
                          }
                        }
                        return "";
                      }}
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-gray-800">
                        Selected Date
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 font-medium">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add Event
                      </Button>
                      <Button size="sm" variant="outline">
                        View Events
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
{activeTab === "Incubators" && (
  <div className="flex h-full">
    {/* Left Panel - Incubator Applications List */}
    <div
      className={`${
        selectedIncubator ? "hidden md:block" : "block"
      } w-full md:w-1/2 bg-white border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Incubator Applications
          </h2>
          <div className="text-sm text-gray-500">
            {incubatorApplications.length} application
            {incubatorApplications.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {incubatorApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No incubator applications submitted yet.
            </p>
          </div>
        ) : (
          <div className="p-3 md:p-4 space-y-3">
            {incubatorApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedIncubator(app)}
                className={`p-3 md:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedIncubator?.id === app.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Incubator Avatar */}
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-xs md:text-sm">
                      {app.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Incubator Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                        {app.name}
                      </h3>
                      {app.programName && (
                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {app.programName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {app.email}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {app.phoneNumber}
                    </p>

                    <div className="text-xs text-gray-500 mt-1">
                      Deadline: {new Date(app.deadlineDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Right Panel - Detail View */}
    <div
      className={`${
        selectedIncubator ? "block" : "hidden md:block"
      } w-full md:w-1/2 bg-gray-50 flex flex-col`}
    >
      {selectedIncubator ? (
        <>
          {/* Detail Header */}
          <div className="bg-white border-b border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                {/* Back button for mobile */}
                <button
                  onClick={() => setSelectedIncubator(null)}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm md:text-lg">
                    {selectedIncubator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                    {selectedIncubator.name}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">
                    {selectedIncubator.programName || 'Incubator Application'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
              <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-orange-100 text-orange-800">
                Deadline: {new Date(selectedIncubator.deadlineDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Detail Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-900 break-all">
                    {selectedIncubator.email}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-900">
                    {selectedIncubator.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-900">
                    {selectedIncubator.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Program Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedIncubator.programName && (
                  <div>
                    <span className="text-xs md:text-sm text-gray-500">Program Name</span>
                    <p className="text-sm md:text-base font-medium text-gray-900">
                      {selectedIncubator.programName}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-xs md:text-sm text-gray-500">Application Deadline</span>
                  <p className="text-sm md:text-base font-medium text-gray-900">
                    {new Date(selectedIncubator.deadlineDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs md:text-sm text-gray-500">Program Description</span>
                  <p className="text-sm md:text-base text-gray-700 mt-1">
                    {selectedIncubator.programDetails}
                  </p>
                </div>
              </div>
            </div>

            {/* Sectors */}
            {selectedIncubator.sectors && selectedIncubator.sectors.length > 0 && (
              <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                  Target Sectors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIncubator.sectors.map((sector, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {sector.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Application Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs md:text-sm text-gray-500">Application ID</span>
                  <p className="text-sm md:text-base font-medium text-gray-900">
                    #{selectedIncubator.id}
                  </p>
                </div>
                <div>
                  <span className="text-xs md:text-sm text-gray-500">Application Form</span>
                  <a
                    href={selectedIncubator.applicationFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base font-medium text-blue-600 hover:text-blue-800 underline"
                  >
                    View Form
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white border-t border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => {
                  const emailBody = `Hi,%0D%0A%0D%0ARegarding your incubator program "${selectedIncubator.programName || 'application'}" for ${selectedIncubator.name}:%0D%0A%0D%0AThank you for your submission.%0D%0A%0D%0ABest,%0D%0AYour Admin Team`;
                  const mailto = `mailto:${selectedIncubator.email}?subject=Incubator Program Update&body=${emailBody}`;
                  window.open(mailto);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteIncubatorApplication(selectedIncubator.id)}
                className="sm:flex-none px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg justify-center"
              >
                <Trash className="w-4 h-4" />
                <span className="sm:hidden ml-2">Delete</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select an Incubator Application
            </h3>
            <p className="text-gray-500 text-center">
              Click on an application from the list to view details
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}
          {activeTab === "Social Apps" && (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Social Media Management
                </h2>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-4">Coming Soon</p>

                {/* Description */}
                <p className="text-gray-500 leading-relaxed">
                  We're working hard to bring you powerful social media
                  management tools. Stay tuned for updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>
        {`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .calendar-container {
            overflow-x: auto;
          }

          .enhanced-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
          }

          .enhanced-calendar .react-calendar__navigation {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin-bottom: 1rem;
            border-radius: 0.75rem;
            padding: 0.5rem;
          }

          .enhanced-calendar .react-calendar__navigation button {
            color: white;
            font-weight: 600;
            background: none;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
          }

          .enhanced-calendar .react-calendar__navigation button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .enhanced-calendar .react-calendar__navigation button:disabled {
            opacity: 0.5;
          }

          .enhanced-calendar .react-calendar__month-view__weekdays {
            background: #f8fafc;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .enhanced-calendar .react-calendar__month-view__weekdays__weekday {
            color: #64748b;
            font-weight: 600;
            font-size: 0.875rem;
            padding: 0.75rem 0.5rem;
            text-align: center;
          }

          .enhanced-calendar .react-calendar__tile {
            background: white;
            border: 1px solid #e2e8f0;
            color: #334155;
            font-weight: 500;
            padding: 0.75rem 0.5rem;
            margin: 0.125rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            position: relative;
            min-height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .enhanced-calendar .react-calendar__tile:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }

          .enhanced-calendar .react-calendar__tile--active {
            background: #3b82f6 !important;
            color: white !important;
            border-color: #3b82f6 !important;
          }

          .enhanced-calendar .selected-date {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            color: white !important;
            border-color: #3b82f6 !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .enhanced-calendar .today-date {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            color: white !important;
            border-color: #10b981 !important;
          }

          .enhanced-calendar .react-calendar__tile--now {
            background: #ecfdf5;
            border-color: #10b981;
            color: #059669;
          }

          .enhanced-calendar .react-calendar__tile--neighboringMonth {
            color: #94a3b8;
          }

          @media (max-width: 640px) {
            .enhanced-calendar {
              font-size: 0.875rem;
            }

            .enhanced-calendar .react-calendar__tile {
              padding: 0.5rem 0.25rem;
              min-height: 2.5rem;
            }
          }
        `}
      </style>
    </div>
  );
}
