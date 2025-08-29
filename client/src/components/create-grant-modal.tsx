import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGrantSchema, Grant } from "@shared/schema";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

// Form  type define 
type GrantFormValues = z.infer<typeof insertGrantSchema>;

// Modal  props type define 
interface CreateGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrantFormValues) => void;
  initialData?: Grant | null;
}

export function CreateGrantModal({ isOpen, onClose, onSubmit, initialData }: CreateGrantModalProps) {
  const form = useForm<GrantFormValues>({
    resolver: zodResolver(insertGrantSchema),
    // Form  default values
    defaultValues: {
      title: "",
      organization: "",
      status: "Active",
      description: "",
      overview: "",
      deadline: "",
      fundingAmount: "",
      eligibility: "",
      documents: [{ name: "", required: true }],
      faqs: [],
      contactEmail: "",
      applyLink: "",
      category: "",
    },
  });

 
  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
    control: form.control,
    name: "documents",
  });
  
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

 
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
     
        form.reset({
          ...initialData,
          deadline: format(new Date(initialData.deadline), "yyyy-MM-dd"),
          faqs: initialData.faqs || [],
        });
      } else {
  
        form.reset({
            title: "", organization: "", status: "Active", description: "",
            overview: "", deadline: "", fundingAmount: "", eligibility: "",
            documents: [{ name: "", required: true }], faqs: [],
            contactEmail: "", applyLink: "", category: "",
        });
      }
    }
  }, [initialData, form, isOpen]);

  const categories = ['Technology', 'Healthcare', 'Education', 'Environment', 'Sustainability', 'Fintech', 'Agriculture', 'Retail', 'Diversity', 'Social'];
  const statuses = ["Active", "Expired", "Upcoming", "Closing Soon"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Grant" : "Create New Grant"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
            
            {/* Title & Organization */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField name="title" control={form.control} render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., NIDHI-EIR Programme" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="organization" control={form.control} render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><FormControl><Input placeholder="e.g., iCreate" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {/* Status & Category */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField name="status" control={form.control} render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField name="category" control={form.control} render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select Category..." /></SelectTrigger></FormControl><SelectContent>{categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            
            <FormField name="description" control={form.control} render={({ field }) => (<FormItem><FormLabel>Short Description (for card)</FormLabel><FormControl><Textarea placeholder="A brief summary of the grant..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="overview" control={form.control} render={({ field }) => (<FormItem><FormLabel>Grant Overview (detailed)</FormLabel><FormControl><Textarea placeholder="Full details about the grant..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />

            {/* Deadline & Funding Amount */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField name="deadline" control={form.control} render={({ field }) => (<FormItem><FormLabel>Application Deadline</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="fundingAmount" control={form.control} render={({ field }) => (<FormItem><FormLabel>Funding Amount</FormLabel><FormControl><Input placeholder="e.g., ₹3,00,000" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <FormField name="eligibility" control={form.control} render={({ field }) => (<FormItem><FormLabel>Eligibility Criteria</FormLabel><FormControl><Textarea placeholder="Describe the eligibility criteria..." rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            {/* Dynamic Documents Section */}
            <div className="space-y-2 rounded-md border p-4">
              <Label>Required Documents</Label>
              {docFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2"><Input {...form.register(`documents.${index}.name`)} placeholder="Document name"/><label className="flex items-center gap-1.5 text-sm"><input type="checkbox" {...form.register(`documents.${index}.required`)} defaultChecked/> Required</label><Button type="button" variant="destructive" size="icon" onClick={() => removeDoc(index)}><X className="h-4 w-4"/></Button></div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ name: '', required: true })}><Plus className="h-4 w-4 mr-2"/>Add Document</Button>
            </div>

            {/* Dynamic FAQs Section */}
            <div className="space-y-2 rounded-md border p-4">
              <Label>FAQs (Optional)</Label>
              {faqFields.map((field, index) => (
                <div key={field.id} className="space-y-2 border-t pt-2"><Input {...form.register(`faqs.${index}.question`)} placeholder="Question"/><Textarea {...form.register(`faqs.${index}.answer`)} placeholder="Answer"/><Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => removeFaq(index)}>Remove FAQ</Button></div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: '', answer: '' })}><Plus className="h-4 w-4 mr-2"/>Add FAQ</Button>
            </div>
            
            {/* Contact & Link */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField name="contactEmail" control={form.control} render={({ field }) => (<FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" placeholder="e.g., contact@iit.ac.in" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="applyLink" control={form.control} render={({ field }) => (<FormItem><FormLabel>Application Link</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving..." : "Save Grant"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}