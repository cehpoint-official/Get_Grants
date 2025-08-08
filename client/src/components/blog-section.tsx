import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { CreatePostModal } from "./create-post-modal";
import { useLocation } from "wouter";

export function BlogSection() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { posts, loading } = usePosts();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const defaultPosts = [
    {
      id: "1",
      title: "Read This Before You Apply for Any Government Grant in India",
      content: "Every Indian founder wants non-dilutive funding. Government grants seem perfect—free money, no equity dilution. Yet 9 out of 10 applications get rejected.",
      category: "Government Grants",
      author: "Get Grants Team",
      createdAt: new Date("2025-07-01"),
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
      published: true,
    },
    {
      id: "2",
      title: "Stop Searching. Start Applying: How to Use the Get grants Tool",
      content: "Finding startup grants in India feels like a full-time job. One post on LinkedIn. Another on WhatsApp. Some buried in incubator PDFs.",
      category: "Tools",
      author: "Get Grants Team",
      createdAt: new Date("2025-06-30"),
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
      published: true,
    },
    {
      id: "3",
      title: "Why Most Indian Startups Miss Out on ₹77,000 Cr in Free Capital",
      content: "India has built one of the largest startup ecosystems in the world — yet every year, thousands of founders ignore something critical: non-dilutive government capital.",
      category: "Funding",
      author: "Get Grants Team",
      createdAt: new Date("2025-06-29"),
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
      published: true,
    },
  ];

  const allPosts = [...posts, ...defaultPosts];
  const visiblePosts = showAllPosts ? allPosts : allPosts.slice(0, 6);
  const getCategoryColor = (category: string) => {
    const colors = {
      "Government Grants": "bg-blue-100 text-primary-blue",
      "Private Grants": "bg-green-100 text-green-600",
      "Startup Funding": "bg-orange-100 text-orange-600",
      "Tools": "bg-green-100 text-green-600",
      "Strategy": "bg-purple-100 text-purple-600",
      "Funding": "bg-orange-100 text-orange-600",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <>
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Latest Insights from Get Grants
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Stay updated with the latest guides, tips, and insights on
                  startup grants and funding in India
                </p>
              </div>
            
            </div>
          </div>

        

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Loading posts...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                >
                  <img
                    src={
                      post.imageUrl ||
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
                    }
                    alt="Blog post"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-blue cursor-pointer"
                      onClick={() => setLocation(`/blog?id=${post.id}`)}
                    >
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 ? "..." : ""}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>By {post.author}</span>
                    </div>
                    <Button
                      variant="link"
                      className="mt-4 text-primary-blue hover:text-accent-blue font-medium p-0"
                      onClick={() => setLocation(`/blog?id=${post.id}`)}
                    >
                      Read More →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Show Button Only if More Than 6 Posts */}
          {!showAllPosts && allPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setShowAllPosts(true)}
                className="bg-primary-blue hover:bg-accent-blue"
              >
                View All Blog Posts
              </Button>
            </div>
          )}
        </div>
      </section>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </>
  );
}
