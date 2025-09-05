import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
// FIX: LoaderCircle is now imported
import { ArrowLeft, Calendar, User, ArrowRight, LoaderCircle } from "lucide-react";
import { usePosts } from "../hooks/use-posts";
import type { Post } from "shared/schema";
import { fetchPublishedPosts } from "@/services/firebase";

export default function BlogDetail() {
  const [, navigate] = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const { posts, loading } = usePosts();

  useEffect(() => {
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
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  const handleBackToBlog = () => {
    localStorage.setItem("scrollTo", "blog");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F5FA]">
        <div className="text-center">
          <LoaderCircle className="w-10 h-10 animate-spin text-[#EB5E77] mx-auto mb-4" />
          <p className="text-[#565F6C]">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F5FA]">
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
    <div className="flex flex-col min-h-screen bg-[#F8F5FA]">
      <main className="flex-grow">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBackToBlog}
            className="flex items-center text-[#EB5E77] hover:text-[#d4556a] font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to all blogs
          </button>

          <header className="mb-8 bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-[#30343B] tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-[#565F6C]">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </header>

          {post.imageUrl && (
            <div className="mb-8 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[450px] object-cover rounded-xl"
              />
            </div>
          )}

          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8">
            <div className="prose prose-lg max-w-none text-[#565F6C] leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-8">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="p-8 bg-[#FFE1E0] rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h2 className="text-2xl font-bold text-[#30343B] mb-4">Ready to find your grant?</h2>
            <p className="text-[#565F6C] mb-6 text-lg">
              Our platform lists hundreds of verified grants. Start your search today.
            </p>
            <Button
              onClick={() => navigate('/grants')}
              size="lg"
              className="bg-[#EB5E77] hover:bg-[#d4556a] text-white rounded-lg shadow-lg font-semibold px-8 py-3"
            >
              Explore Grants <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}