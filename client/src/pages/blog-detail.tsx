import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { usePosts } from "../hooks/use-posts";
import type { Post } from "shared/schema";

export default function BlogDetail() {
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const { posts } = usePosts();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    
    if (postId && posts.length > 0) {
      const foundPost = posts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // Try to find from default posts
        const defaultPosts = [
          {
            id: "1",
            title: "Read This Before You Apply for Any Government Grant in India",
            content: "Every Indian founder wants non-dilutive funding. Government grants seem perfect—free money, no equity dilution. Yet 9 out of 10 applications get rejected.\n\nThe problem isn't the grants themselves. The problem is how founders approach them.\n\nHere's what most people get wrong:\n\n1. **They apply to everything**: Shotgun approach rarely works. Each grant has specific criteria, and generic applications are instantly rejected.\n\n2. **They underestimate the paperwork**: Government grants require extensive documentation. Plan for 2-3 weeks just for paperwork.\n\n3. **They ignore compliance requirements**: Post-approval compliance is strict. Missing reports can lead to fund recovery.\n\n4. **They don't understand the timeline**: Government processes are slow. Factor in 3-6 months from application to disbursal.\n\nThe right approach:\n\n- Research thoroughly before applying\n- Tailor your application to specific grant criteria\n- Prepare all documents in advance\n- Have a compliance plan ready\n- Apply only to grants that truly fit your startup stage and sector\n\nGovernment grants can be game-changing, but only if approached strategically.",
            category: "Government Grants",
            author: "Get Grants Team",
            imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
            createdAt: new Date("2025-07-01"),
            published: true,
          },
          {
            id: "2",
            title: "🧭 Stop Searching. Start Applying: How to Use the Get Grants Tool",
            content: "Finding startup grants in India feels like a full-time job. One post on LinkedIn. Another on WhatsApp. Some buried in incubator PDFs.\n\nThe scattered information makes it nearly impossible to:\n- Track application deadlines\n- Compare eligibility criteria\n- Understand funding amounts\n- Follow up on applications\n\nOur Get grants Tool changes this.\n\n**How it works:**\n\n1. **Filter by Stage**: Select your startup's current development phase\n2. **Choose Sector**: Pick your industry vertical\n3. **Select Location**: Filter by state-specific schemes\n4. **View Details**: Get complete grant information in one place\n\n**Key Features:**\n\n- **500+ Verified Grants**: All schemes are verified and updated regularly\n- **Smart Filtering**: Find relevant grants in seconds, not hours\n- **Direct Links**: Apply directly through official government portals\n- **Deadline Tracking**: Never miss an application window again\n\n**Pro Tips:**\n\n- Start with central government schemes (wider eligibility)\n- Check state-specific grants for your registered location\n- Look for sector-agnostic grants if your industry isn't covered\n- Bookmark grants with upcoming deadlines\n\nThe goal isn't to apply to every grant. It's to find the RIGHT grants for your startup and apply strategically.\n\nTime spent searching is time not spent building. Use the tool, find your grants, and get back to what matters—growing your startup.",
            category: "Tools",
            author: "Get Grants Team",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
            createdAt: new Date("2025-06-30"),
            published: true,
          },
          {
            id: "3",
            title: "Why Most Indian Startups Miss Out on ₹77,000 Cr in Free Capital",
            content: "India has built one of the largest startup ecosystems in the world — yet every year, thousands of founders ignore something critical: non-dilutive government capital.\n\n₹77,000 crores. That's how much the Indian government allocates annually for startup funding across various schemes.\n\nYet utilization rates remain shockingly low:\n- Only 23% of eligible startups apply for government grants\n- Of those who apply, 68% submit incomplete applications\n- 89% of founders are unaware of scheme eligibility criteria\n\n**Why the disconnect?**\n\n1. **Information Asymmetry**: Grant information is scattered across multiple government websites, making discovery difficult.\n\n2. **Perceived Complexity**: Founders assume government processes are too bureaucratic and time-consuming.\n\n3. **Lack of Guidance**: No centralized resource exists to guide startups through the application process.\n\n4. **Focus on VC Funding**: The startup ecosystem glorifies venture capital while ignoring government support.\n\n**The Real Cost of Ignorance:**\n\n- Dilution that could have been avoided\n- Slower growth due to capital constraints\n- Missed opportunities for strategic partnerships\n- Higher cost of capital in later rounds\n\n**Success Stories:**\n\nStartups that leverage government grants effectively often:\n- Achieve profitability faster\n- Maintain higher founder equity\n- Build stronger unit economics\n- Scale more sustainably\n\n**The Solution:**\n\nSystematic approach to government funding:\n1. Map all applicable schemes\n2. Create application timeline\n3. Prepare documentation in advance\n4. Apply strategically, not randomly\n5. Maintain compliance post-approval\n\nGovernment grants aren't charity. They're strategic capital with aligned interests—the government wants startups to succeed, create jobs, and contribute to economic growth.\n\nThe question isn't whether you should apply. It's why you haven't already.",
            category: "Funding",
            author: "Get Grants Team",
            imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
            createdAt: new Date("2025-06-29"),
            published: true,
          },
        ];
        
        const defaultPost = defaultPosts.find(p => p.id === postId);
        if (defaultPost) {
          setPost(defaultPost);
        }
      }
    }
  }, [posts]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
            <Button onClick={() => setLocation("/")} className="bg-primary-blue hover:bg-accent-blue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <Button
          onClick={() => setLocation("/")}
          variant="ghost"
          className="mb-8 text-primary-blue hover:text-accent-blue"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-gray-500 mb-6">
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

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                // Handle bold paragraphs as subheadings
                return (
                  <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              } else if (paragraph.trim().startsWith('- ')) {
                // Handle bullet points
                const items = paragraph.split('\n- ').map(item => item.replace(/^- /, ''));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                );
              } else if (paragraph.trim().match(/^\d+\./)) {
                // Handle numbered lists
                const items = paragraph.split(/\n\d+\./).map(item => item.replace(/^\d+\.\s*/, ''));
                return (
                  <ol key={index} className="list-decimal list-inside space-y-2 ml-4">
                    {items.filter(item => item.trim()).map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ol>
                );
              } else {
                // Regular paragraphs
                return (
                  <p key={index} className="text-gray-700 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-light-blue rounded-xl">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Find Your Perfect Grant?
            </h3>
            <p className="text-gray-600 mb-4">
              Explore our comprehensive database of government grants and funding opportunities.
            </p>
            <Button
              onClick={() => setLocation("/#grants")}
              className="bg-primary-blue hover:bg-accent-blue"
            >
              Explore Grants
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}