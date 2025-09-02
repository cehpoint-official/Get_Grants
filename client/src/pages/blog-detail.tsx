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
      "Government Grants": "bg-blue-100 text-blue-800",
      "Private Grants": "bg-green-100 text-green-800",
      "Startup Funding": "bg-orange-100 text-orange-800",
      "Tools": "bg-indigo-100 text-indigo-800",
      "Strategy": "bg-purple-100 text-purple-800",
      "Funding": "bg-pink-100 text-pink-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  const handleBackToBlog = () => {
    localStorage.setItem("scrollTo", "blog");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="w-10 h-10 animate-spin text-violet" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-violet mb-4">Post not found</h1>
              <Button onClick={handleBackToBlog} className="bg-violet hover:bg-pink text-white">
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
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBackToBlog}
            className="flex items-center text-violet hover:text-pink font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to all blogs
          </button>

          <header className="mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-violet tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
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
            <div className="mb-8">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[450px] object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 p-8 bg-violet/5 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-violet mb-4">Ready to find your grant?</h2>
            <p className="text-gray-600 mb-6">
              Our platform lists hundreds of verified grants. Start your search today.
            </p>
            <Button
              onClick={() => navigate('/grants')}
              size="lg"
              className="bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold"
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