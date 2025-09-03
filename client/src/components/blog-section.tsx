import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { CreatePostModal } from "./create-post-modal";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinary";
import { useToast } from "@/hooks/use-toast";

export function BlogSection() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showUserSubmit, setShowUserSubmit] = useState(false);
  const { posts, loading } = usePosts();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const { user, isAdmin } = useAuth();
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

  const publishedPosts = posts.filter(p => p.status === 'published' || p.published);
  const allPosts = [...publishedPosts, ...defaultPosts];
  const visiblePosts = showAllPosts ? allPosts : allPosts.slice(0, 3);
  const getCategoryColor = (category: string) => {
    const colors = {
      "Government Grants": "bg-violet/20 text-violet border border-violet",
      "Private Grants": "bg-pink/20 text-pink border border-pink",
      "Startup Funding": "bg-rose-gold/20 text-rose-gold border border-rose-gold",
      "Tools": "bg-pink/20 text-pink border border-pink",
      "Strategy": "bg-violet/20 text-violet border border-violet",
      "Funding": "bg-rose-gold/20 text-rose-gold border border-rose-gold",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-600 border border-gray-300";
  };

  return (
    <>
      <section id="blog" className="py-16" style={{
        background: 'white'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-violet mb-4">
                  Latest Insights from Get Grants
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Stay updated with the latest guides, tips, and insights on
                  startup grants and funding in India
                </p>
              </div>
              {isAdmin ? (
                <Button onClick={() => setShowCreatePost(true)} className="ml-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              ) : (
                <Button onClick={() => setShowUserSubmit(true)} className="ml-4">
                  Submit Your Blog
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-violet">Loading posts...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01]"
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
                      className="text-xl font-semibold text-violet mb-3 hover:text-pink cursor-pointer transition-colors"
                      onClick={() => setLocation(`/blog?id=${post.id}`)}
                    >
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 ? "..." : ""}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>By {post.author}</span>
                    </div>
                    <Button
                      variant="link"
                      className="mt-4 text-violet hover:text-pink font-medium p-0 transition-colors"
                      onClick={() => setLocation(`/blog?id=${post.id}`)}
                    >
                      Read More →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!showAllPosts && allPosts.length > 3 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setShowAllPosts(true)}
                className="bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold"
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

      <UserSubmitModal isOpen={showUserSubmit} onClose={() => setShowUserSubmit(false)} />
    </>
  );
}

function UserSubmitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: { title: "", content: "", category: "", author: "User", authorName: "", authorEmail: "", imageUrl: "" },
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("imageUrl", "");
  };

  const onSubmit = async (data: any) => {
    let finalImageUrl = data.imageUrl || "";
    try {
      if (selectedImage) {
        setUploadingImage(true);
        finalImageUrl = await uploadToCloudinary(selectedImage);
      } else {
        toast({
          title: "Image required",
          description: "Please upload a featured image.",
          variant: "destructive",
        });
        return;
      }

      await addDoc(collection(db, "posts"), {
        title: data.title,
        content: data.content,
        category: data.category || "General",
        author: data.authorEmail || data.authorName || "User",
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        imageUrl: finalImageUrl,
        status: "pending",
        published: false,
        createdAt: serverTimestamp(),
      });
      onClose();
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Blog</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} placeholder="Title" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="authorName" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl><Input {...field} placeholder="Your name" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="authorEmail" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl><Input type="email" {...field} placeholder="you@example.com" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Government Grants">Government Grants</SelectItem>
                    <SelectItem value="Private Grants">Private Grants</SelectItem>
                    <SelectItem value="Startup Funding">Startup Funding</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Strategy">Strategy</SelectItem>
                    <SelectItem value="Funding">Funding</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="space-y-2">
              <FormLabel>Featured Image</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-48 mx-auto rounded-lg object-cover" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload a featured image (required)</p>
                    <Input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="user-image-upload" />
                    <FormLabel htmlFor="user-image-upload" className="cursor-pointer bg-primary-blue hover:bg-accent-blue text-white px-4 py-2 rounded-md inline-block">
                      Choose Image
                    </FormLabel>
                  </div>
                )}
              </div>
            </div>

            <FormField name="content" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl><Textarea {...field} rows={6} placeholder="Write your post..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={uploadingImage}>{uploadingImage ? "Uploading..." : "Submit"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}