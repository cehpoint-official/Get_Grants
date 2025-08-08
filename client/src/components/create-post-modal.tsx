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
  };
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

  // Handle modal open/close and data initialization
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Editing mode
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
        
        console.log("Edit mode - Initial data:", initialData);
        console.log("Edit mode - Form reset with:", formData);
      } else {
        // Create mode
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
        
        console.log("Create mode - Form reset");
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
      console.log("New image selected:", file.name);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("imageUrl", "");
    console.log("Image removed");
  };

  const handleSubmit = async (data: any) => {
    if (!user) return;

    console.log("Submit started with data:", data);
    console.log("Current image URL:", currentImageUrl);
    console.log("Selected image:", selectedImage?.name);

    try {
      let finalImageUrl = currentImageUrl;

      // If a new image was selected, upload it
      if (selectedImage) {
        console.log("Uploading new image to Cloudinary...");
        setUploadingImage(true);
        finalImageUrl = await uploadToCloudinary(selectedImage);
        console.log("New image uploaded:", finalImageUrl);
      } else if (!imagePreview) {
        // If no preview and no selected image, user removed the image
        finalImageUrl = "";
        console.log("Image was removed, setting empty URL");
      }
      // If no new image selected and preview exists, keep current image

      const payload = {
        ...data,
        author: user.email || "Admin",
        imageUrl: finalImageUrl,
      };

      console.log("Final payload:", payload);

      if (initialData && onSubmit) {
        console.log("Calling onSubmit for edit...");
        await onSubmit(payload);
      } else {
        console.log("Calling createPost for new post...");
        await createPost(payload);
      }

      toast({
        title: "Success",
        description: `Post ${initialData ? "updated" : "created"} successfully!`,
      });

      handleClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} post.`,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleClose = () => {
    console.log("Modal closing...");
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImageUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Upload a featured image for your post</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-primary-blue hover:bg-accent-blue text-white px-4 py-2 rounded-md inline-block"
                    >
                      Choose Image
                    </Label>
                  </div>
                )}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter post content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-blue hover:bg-accent-blue"
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