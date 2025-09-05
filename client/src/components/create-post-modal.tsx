import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { Upload, X } from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinary";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
  } | null;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreatePostModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const { createPost } = usePosts();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      author: user?.email || "Admin",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const formData = {
          title: initialData.title || "",
          content: initialData.content || "",
          category: initialData.category || "",
          author: user?.email || "Admin",
          imageUrl: initialData.imageUrl || "",
        };

        form.reset(formData);
        setCurrentImageUrl(initialData.imageUrl || "");
        setImagePreview(initialData.imageUrl || null);
        setSelectedImage(null);

      } else {
        const formData = {
          title: "",
          content: "",
          category: "",
          author: user?.email || "Admin",
          imageUrl: "",
        };

        form.reset(formData);
        setCurrentImageUrl("");
        setImagePreview(null);
        setSelectedImage(null);

      }
    }
  }, [isOpen, initialData, form, user]);

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

  const handleSubmitForm = async (data: any) => {
    if (!user) return;

    try {
      let finalImageUrl = currentImageUrl;

      if (selectedImage) {
        setUploadingImage(true);
        finalImageUrl = await uploadToCloudinary(selectedImage);
      } else if (!imagePreview) {
        toast({ title: "Image required", description: "Please upload a featured image.", variant: "destructive" });
        return;
      }

      const payload = {
        ...data,
        author: user.email || "Admin",
        imageUrl: finalImageUrl,
      };

      if (initialData && onSubmit) {
        await onSubmit({ ...payload, id: initialData.id });
      } else {
        await createPost(payload);
      }

      toast({
        title: "Success",
        description: `Post ${initialData ? "updated" : "created"} successfully!`,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${initialData ? "update" : "create"} post.`,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImageUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F8F5FA]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#30343B]">
            {initialData ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <p className="text-[#565F6C] mt-2">Create and publish your blog post</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6 bg-white p-6 rounded-xl">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter post title" 
                      {...field} 
                      className="bg-white border-gray-300 focus:border-[#EB5E77] focus:ring-[#EB5E77] rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-[#EB5E77] focus:ring-[#EB5E77] rounded-lg">
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
              )}
            />

            <div className="space-y-3">
              <Label className="text-[#30343B] font-semibold">Featured Image</Label>
              <div className="border-2 border-dashed border-[#EB5E77]/30 rounded-xl p-8 text-center bg-white hover:border-[#EB5E77]/50 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 mx-auto rounded-lg object-cover shadow-lg"
                    />
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
                    <Upload className="h-12 w-12 mx-auto text-[#EB5E77] mb-4" />
                    <p className="text-[#565F6C] mb-4 font-medium">Upload a featured image for your post</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="bg-[#EB5E77] hover:bg-[#d4556a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter post content"
                      className="min-h-[200px] bg-white border-gray-300 focus:border-[#EB5E77] focus:ring-[#EB5E77] rounded-lg resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="border-gray-300 text-[#565F6C] hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#EB5E77] hover:bg-[#d4556a] text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 min-w-[120px]"
                disabled={form.formState.isSubmitting || uploadingImage}
              >
                {form.formState.isSubmitting || uploadingImage
                  ? "Publishing..."
                  : initialData ? "Update Post" : "Publish Post"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}