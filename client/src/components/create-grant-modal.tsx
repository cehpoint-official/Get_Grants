import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGrantSchema, Grant } from "@shared/schema";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

type GrantFormValues = z.infer<typeof insertGrantSchema>;

interface CreateGrantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrantFormValues) => void;
  initialData?: Grant | null;
}

export function CreateGrantModal({ isOpen, onClose, onSubmit, initialData }: CreateGrantModalProps) {
  const form = useForm<GrantFormValues>({
    resolver: zodResolver(insertGrantSchema),
    defaultValues: {
      title: "",
      organization: "",
      status: "Active",
      description: "",
      overview: "",
      startDate: "",
      deadline: "",
      fundingAmount: "",
      eligibility: "",
      documents: [{ title: "", description: "", required: true }],
      faqs: [],
      contactEmail: "",
      applyLink: "",
      category: "",
      isPremium: false,
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
        // Helper function to safely format dates
        const formatDate = (dateValue: string | Date | null | undefined): string => {
          if (!dateValue) return "";
          try {
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            if (isNaN(date.getTime())) {
              console.warn("Invalid date:", dateValue);
              return "";
            }
            return format(date, "yyyy-MM-dd");
          } catch (error) {
            console.warn("Error formatting date:", dateValue, error);
            return "";
          }
        };

        form.reset({
          ...initialData,
          startDate: formatDate(initialData.startDate),
          deadline: formatDate(initialData.deadline),
          faqs: initialData.faqs || [],
          isPremium: initialData.isPremium || false,
          status: initialData.status || "Active",
        });
      } else {
        
        form.reset({
          title: "",
          organization: "",
          status: "Active",
          description: "",
          overview: "",
          startDate: "",
          deadline: "",
          fundingAmount: "",
          eligibility: "",
          documents: [{ title: "", description: "", required: true }],
          faqs: [],
          contactEmail: "",
          applyLink: "",
          category: "",
          isPremium: false,
        });
      }
    }
  }, [initialData, form, isOpen]);

  const categories = ['Technology', 'Healthcare', 'Education', 'Environment', 'Sustainability', 'Fintech', 'Agriculture', 'Retail', 'Diversity', 'Social'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F8F5FA] p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#30343B]">{initialData ? "Edit Grant" : "Create New Grant"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="title" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Title</FormLabel><FormControl><Input placeholder="e.g., NIDHI-EIR Programme" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="organization" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Organization</FormLabel><FormControl><Input placeholder="e.g., iCreate" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField name="status" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"><SelectValue placeholder="Select Status..." /></SelectTrigger></FormControl><SelectContent>{["Active", "Expired", "Upcoming", "Closing Soon"].map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <FormField name="category" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg"><SelectValue placeholder="Select Category..." /></SelectTrigger></FormControl><SelectContent>{categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />

              <FormField
                control={form.control}
                name="isPremium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start rounded-lg border p-3 shadow-sm mt-7">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#8541EF] data-[state=checked]:text-white data-[state=checked]:border-[#8541EF] focus-visible:ring-[#8541EF]"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none ml-2">
                      <FormLabel className="font-semibold text-[#30343B]">
                        Mark as Premium
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField name="description" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Short Description (for card)</FormLabel><FormControl><Textarea placeholder="A brief summary of the grant..." {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="overview" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Grant Overview (detailed)</FormLabel><FormControl><Textarea placeholder="Full details about the grant..." rows={5} {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />

            <div className="grid md:grid-cols-3 gap-6">
              <FormField name="startDate" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Start Date (Optional)</FormLabel><FormControl><Input type="date" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="deadline" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Application Deadline</FormLabel><FormControl><Input type="date" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="fundingAmount" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Funding Amount</FormLabel><FormControl><Input placeholder="e.g., ₹3,00,000" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField name="eligibility" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Eligibility Criteria</FormLabel><FormControl><Textarea placeholder="Describe the eligibility criteria..." rows={4} {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />

            <div className="space-y-4 rounded-md border p-4">
              <Label className="text-base font-semibold text-[#30343B]">Required Documents</Label>
              {docFields.map((field, index) => (
                <div key={field.id} className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-4">
                    <Input {...form.register(`documents.${index}.title`)} placeholder="Document Title (e.g., Business Plan)" className="flex-grow bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                    <div className="flex items-center gap-2">
                       <Checkbox id={`documents.${index}.required`} {...form.register(`documents.${index}.required`)} defaultChecked className="data-[state=checked]:bg-[#8541EF] data-[state=checked]:text-white data-[state=checked]:border-[#8541EF] focus-visible:ring-[#8541EF]"/>
                       <Label htmlFor={`documents.${index}.required`} className="text-sm font-medium">Required</Label>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeDoc(index)}><X className="h-4 w-4" /></Button>
                  </div>
                  <Textarea {...form.register(`documents.${index}.description`)} placeholder="Document description (e.g., Detailed business plan for healthcare...)" className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ title: "", description: "", required: true })}><Plus className="h-4 w-4 mr-2" />Add Document</Button>
            </div>

            <div className="space-y-4 rounded-md border p-4">
              <Label className="text-base font-semibold text-[#30343B]">FAQs (Optional)</Label>
              {faqFields.map((field, index) => (
                <div key={field.id} className="space-y-3 border-t pt-4">
                  <Input {...form.register(`faqs.${index}.question`)} placeholder="Question" className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                  <Textarea {...form.register(`faqs.${index}.answer`)} placeholder="Answer" className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                  <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:bg-red-100" onClick={() => removeFaq(index)}>Remove FAQ</Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: '', answer: '' })}><Plus className="h-4 w-4 mr-2" />Add FAQ</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="contactEmail" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Contact Email</FormLabel><FormControl><Input type="email" placeholder="e.g., contact@iit.ac.in" {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="applyLink" control={form.control} render={({ field }) => (<FormItem><FormLabel className="text-[#30343B] font-semibold">Application Link</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} className="bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[#8541EF] hover:bg-[#7a38d9] text-white">{form.formState.isSubmitting ? "Saving..." : "Save Grant"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}