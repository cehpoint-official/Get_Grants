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

  const publishedPosts = posts.filter(p => p.status === 'published' || p.published);
  const visiblePosts = showAllPosts ? publishedPosts : publishedPosts.slice(0, 3);

  return (
    <>
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-[#FFE1E0] text-[#EB5E77] font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
              Blog
            </div>
          </div>
          
          <div className="md:flex md:items-start md:justify-between text-center mb-16">
            <div className="flex-grow">
              <h2 className="text-4xl font-bold text-[#30343B]">
                Latest Insights from Get Grants
              </h2>
              <p className="mt-4 text-lg text-[#565F6C] max-w-3xl mx-auto">
                Stay updated with the latest guides, tips, and insights on
                startup grants and funding in India
              </p>
            </div>
            
            <div className="hidden md:block flex-shrink-0 md:ml-8">
              {isAdmin ? (
                <Button onClick={() => setShowCreatePost(true)} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity">
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              ) : (
                <Button onClick={() => setShowUserSubmit(true)} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity">
                  <Plus className="mr-1 h-4 w-4" /> Submit Blog
                </Button>
              )}
            </div>
          </div>
          
          <div className="md:hidden text-center mb-8">
              {isAdmin ? (
                <Button onClick={() => setShowCreatePost(true)} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity">
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              ) : (
                <Button onClick={() => setShowUserSubmit(true)} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity">
                  <Plus className="mr-2 h-4 w-4" /> Submit Blog
                </Button>
              )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-[#30343B]">Loading posts...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]"
                >
                  <img
                    src={post.imageUrl || "https://via.placeholder.com/800x400"}
                    alt={post.title}
                    className="w-full h-64 object-cover p-4 rounded-3xl "
                  />
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <h3 className="text-2xl font-bold text-[#30343B] mb-5 flex-grow break-words..." >
                      {post.title}
                    </h3>
                    <p className="text-[#565F6C] mb-4 ">
                      {post.content.substring(0, 75)}
                      {post.content.length > 75 ? "..." : ""}
                    </p>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <Button
                        variant="link"
                        className="bg-violet text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-[#8A41CE] hover:no-underline"
                        onClick={() => {
                          setLocation(`/blog-detail?id=${post.id}`);
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
                        }}
                      >
                        Read More →
                      </Button>
                      <div className="text-right text-sm text-[#565F6C]">
                        <div>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!showAllPosts && publishedPosts.length > 3 && (
            <div className="text-center mt-16">
              <Button
                onClick={() => setShowAllPosts(true)}
                className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
              >
                View All Blogs
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
  const { user } = useAuth(); 

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("imageUrl", "");
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a blog post.",
        variant: "destructive",
      });
      return;
    }

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
        userId: user.uid, 
      });
      
      toast({
        title: "Success",
        description: "Your blog post has been submitted for review!",
      });
      
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F8F5FA]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#30343B]">Submit Your Blog</DialogTitle>
          <p className="text-[#565F6C] mt-2">Share your insights with the startup community</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30343B] font-semibold">Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your blog title" 
                    className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="authorName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Your Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Your name" 
                      className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="authorEmail" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Your Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      {...field} 
                      placeholder="you@example.com" 
                      className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30343B] font-semibold">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg">
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

            <div className="space-y-3">
              <FormLabel className="text-[#30343B] font-semibold">Featured Image</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:border-[#8541EF]/50 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-48 mx-auto rounded-lg object-cover shadow-lg" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600" 
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto text-[#8541EF] mb-4" />
                    <p className="text-[#565F6C] mb-4 font-medium">Upload a featured image (required)</p>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                      className="hidden" 
                      id="user-image-upload" 
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('user-image-upload')?.click()}
                      className="bg-[#8541EF] hover:bg-[#7a38d9] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <FormField name="content" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#30343B] font-semibold">Content</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    rows={6} 
                    placeholder="Write your post content here..." 
                    className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300 text-[#565F6C] hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold min-w-[100px]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploadingImage}
                className="bg-[#8541EF] hover:bg-[#7a38d9] text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 min-w-[120px]"
              >
                {uploadingImage ? "Uploading..." : "Submit Blog"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}