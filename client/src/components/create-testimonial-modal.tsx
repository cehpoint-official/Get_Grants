

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@shared/schema";

const insertTestimonialSchemaFE = z.object({
  author: z.string().min(1, "Author name is required"),
  title: z.string().min(1, "Title is required"),
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  amountSecured: z.string().min(1, "Amount is required"),
 
});

type TestimonialFormValues = z.infer<typeof insertTestimonialSchemaFE>;

interface CreateTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Testimonial | null;
  onSuccess: () => void; 
}

export function CreateTestimonialModal({ isOpen, onClose, initialData, onSuccess }: CreateTestimonialModalProps) {
  const { toast } = useToast();
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(insertTestimonialSchemaFE),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        author: "",
        title: "",
        quote: "",
        amountSecured: "",
       
      });
    }
  }, [initialData, form, isOpen]);

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      if (initialData?.id) {
       
        const testimonialRef = doc(db, "testimonials", initialData.id);
        await updateDoc(testimonialRef, data);
        toast({ title: "Success", description: "Testimonial updated successfully!" });
      } else {
        
        await addDoc(collection(db, "testimonials"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Testimonial added successfully!" });
      }
      onSuccess(); 
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="author" control={form.control} render={({ field }) => (<FormItem><FormLabel>Author Name</FormLabel><FormControl><Input placeholder="e.g., Nirdosh Arora" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="title" control={form.control} render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., CEO Of cehpoint" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="quote" control={form.control} render={({ field }) => (<FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea placeholder="Write the case content here..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="amountSecured" control={form.control} render={({ field }) => (<FormItem><FormLabel>Amount Secured</FormLabel><FormControl><Input placeholder="e.g.,  ₹18 Lakhs" {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Testimonial"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}