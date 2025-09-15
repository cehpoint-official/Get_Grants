import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, User, Mail, Phone, Building, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createPremiumInquiry } from "@/services/premiumSupport";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const inquiryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  companyName: z.string().min(1, "Company name is required"),
  queryText: z.string().min(10, "Query must be at least 10 characters"),
});

type PremiumInquiryForm = z.infer<typeof inquiryFormSchema>;

export default function PremiumSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<PremiumInquiryForm>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      queryText: "",
    },
  });

  const { isSubmitting } = form.formState;

  const faqs = [
    { question: "What kind of support can I expect?", answer: "Our premium support includes end-to-end grant application assistance, professional review of your pitch deck and compliance documents, and direct 1:1 access to our grant experts for personalized advice." },
    { question: "Who are the experts I will be consulting with?", answer: "Our experts are seasoned professionals with years of experience in the venture capital and grant funding sectors. They have a proven track record of helping startups secure funding." },
    { question: "What if I don't get the grant after using the service?", answer: "While we cannot guarantee funding, our service significantly increases your chances by ensuring your application is professional, compliant, and compelling. We focus on perfecting your submission to meet the highest standards." },
    { question: "How do I schedule my 1:1 consultation?", answer: "Once you sign up for a plan, you will receive access to a private booking calendar where you can schedule your consultation calls at a time that is convenient for you." },
    { question: "Is my data secure with your service?", answer: "Absolutely. We prioritize your data's security and confidentiality using industry-standard encryption and privacy protocols. Your information is safe with us." }
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const onSubmit = async (data: PremiumInquiryForm) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your inquiry.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPremiumInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        specificNeeds: data.queryText,
        userId: user.uid,
        currentPlan: "Not Specified",
        budget: "Not Specified",
        timeline: "Not Specified",
        message: "",
      });
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will get back to you shortly.",
      });
      form.reset();
      setIsContactModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div id="faq" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-2xl bg-purple-100 text-[#8541EF]">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#111827]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-[#565F6C]">
              Simplifying everything you need here
            </p>
            <div className="mt-6 h-1 w-28 mx-auto lg:mx-0 bg-[#8541EF]" />
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button onClick={() => handleFaqToggle(index)} className="w-full flex justify-between items-center text-left p-5">
                    <span className="text-base font-medium text-[#30343B]">{faq.question}</span>
                    <Plus className={`h-5 w-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-45' : ''}`} style={{ color: '#30343B' }} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? "max-h-screen" : "max-h-0"}`}>
                    <div className="px-5 pb-5">
                      <p className="text-[#565F6C]">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <Button onClick={() => setIsContactModalOpen(true)} className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-2 font-semibold text-base rounded-lg shadow-lg transition-opacity h-auto">
            Have Any Queries
          </Button>
        </div>
      </div>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-lg bg-[#F8F5FA] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-[#30343B]">Ask Us Anything</DialogTitle>
            <DialogDescription className="text-[#565F6C] mt-2">
              Have a question? Fill out the form and we'll get back to you.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input {...field} placeholder="Your Name" className="pl-10 bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input {...field} type="email" placeholder="Your Email" className="pl-10 bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input {...field} type="tel" placeholder="Phone Number" className="pl-10 bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="companyName" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Company/Startup Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input {...field} placeholder="Company/Startup Name" className="pl-10 bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="queryText" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#30343B] font-semibold">Your Query/Requirement</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-5 -translate-y-1/2 text-gray-400" size={20} />
                      <Textarea {...field} placeholder="Your query/Requirement" rows={4} className="pl-10 bg-white border-gray-300 focus:border-[#8541EF] focus:ring-[#8541EF] rounded-lg resize-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-center pt-4">
                <Button type="submit" disabled={isSubmitting} className="bg-[#8541EF] hover:bg-[#7a38d9] text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 min-w-[150px] text-base">
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}