import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight, LoaderCircle, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import { usePosts } from "../hooks/use-posts";
import type { Post } from "shared/schema";
import { fetchPublishedPosts } from "@/services/firebase";

export default function BlogDetail() {
  const [, navigate] = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const { posts, loading } = usePosts();

  
  const relatedPosts = useMemo(() => {
    if (!post || !posts || posts.length === 0) return [];
    
    return posts
      .filter(p => p.id !== post.id && (p.status === 'published' || p.published))
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        title: p.title,
        description: p.content ? p.content.substring(0, 100) + "..." : "Starting a business is exciting, but funding...",
        imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
        author: p.author || "Get Grants Team",
        createdAt: p.createdAt
      }));
  }, [post, posts]);

  useEffect(() => {
   
    window.scrollTo({ top: 0, behavior: 'auto' });

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    
    if (!loading && postId) {
      const foundPost = posts.find(p => p.id === postId && (p.status === 'published' || p.published));
      if (foundPost) {
        setPost(foundPost);
      } else {
        fetchPublishedPosts().then((list: any[]) => {
          const matched = list.find((p: any) => p.id === postId);
          setPost(matched || null);
        });
      }
    }
  }, [posts, loading]);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Government Grants": "bg-[#EB5E77]/10 text-[#EB5E77]",
      "Tools": "bg-[#EB5E77]/10 text-[#EB5E77]",
      "Funding": "bg-[#EB5E77]/10 text-[#EB5E77]",
      "Private Grants": "bg-[#EB5E77]/10 text-[#EB5E77]",
      "Startup Funding": "bg-[#EB5E77]/10 text-[#EB5E77]",
      "Strategy": "bg-[#EB5E77]/10 text-[#EB5E77]",
    };
    return colors[category as keyof typeof colors] || "bg-white text-gray-800";
  };
  
  const handleBackToBlog = () => {
    localStorage.setItem("scrollTo", "blog");
    navigate("/#blog");
  };

  const handleRelatedPostClick = (relatedPost: any) => {
    navigate(`/blog-detail?id=${relatedPost.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <LoaderCircle className="w-10 h-10 animate-spin text-[#EB5E77] mx-auto mb-4" />
          <p className="text-[#565F6C]">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#30343B] mb-4">Post not found</h1>
              <p className="text-[#565F6C] mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Button onClick={handleBackToBlog} className="bg-[#EB5E77] hover:bg-[#d4556a] text-white rounded-lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl">
              {/* Back Button */}
              <button
                onClick={handleBackToBlog}
                className="flex items-center text-violet hover:text-pink font-semibold mb-6 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to all blogs
              </button>

              {/* Main Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                {post.title}
              </h1>

              {/* Hero Image Box */}
              {post.imageUrl && (
                <div className="mb-8 bg-white rounded-xl p-4 shadow-sm">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto max-h-[400px] object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content Box */}
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{post.title}</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg leading-8">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Author and Social Media Box */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 font-medium">By {post.author}</span>
                    <div className="flex items-center space-x-3">
                      <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                      <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                      <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                      <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
                    </div>
                  </div>
                  <div className="text-gray-600 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { 
                      day: 'numeric',
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        onClick={() => handleRelatedPostClick(relatedPost)}
                        className="cursor-pointer group"
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="aspect-video">
                            <img
                              src={relatedPost.imageUrl}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {relatedPost.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-xl">
                      <p>No related posts available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}