import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X, User, Mail, Phone, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createPremiumInquiry } from "@/services/premiumSupport";

// Updated form interface
interface PremiumInquiryForm {
  name: string;
  email: string;
  phone: string;
  companyName: string;
}

export default function PremiumSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PremiumInquiryForm>();

  const faqs = [
    {
      question: "What kind of support can I expect?",
      answer: "Our premium support includes end-to-end grant application assistance, professional review of your pitch deck and compliance documents, and direct 1:1 access to our grant experts for personalized advice.",
    },
    {
      question: "Who are the experts I will be consulting with?",
      answer: "Our experts are seasoned professionals with years of experience in the venture capital and grant funding sectors. They have a proven track record of helping startups secure funding.",
    },
    {
      question: "What if I don't get the grant after using the service?",
      answer: "While we cannot guarantee funding, our service significantly increases your chances by ensuring your application is professional, compliant, and compelling. We focus on perfecting your submission to meet the highest standards.",
    },
    {
      question: "How do I schedule my 1:1 consultation?",
      answer: "Once you sign up for a plan, you will receive access to a private booking calendar where you can schedule your consultation calls at a time that is convenient for you.",
    },
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const onSubmit = async (data: PremiumInquiryForm) => {
    setIsSubmitting(true);
    try {
      // We pass the simplified data along with default values for other fields
      // to match the backend service function.
      await createPremiumInquiry({
        ...data,
        currentPlan: "Not Specified",
        budget: "Not Specified",
        timeline: "Not Specified",
        specificNeeds: "General Inquiry from FAQ section",
        message: "",
      });
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will get back to you shortly.",
      });
      reset();
      setIsContactModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="faq" className="bg-white py-16">
      <section id="faq" className="py-5 md:py-10" >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-3xl font-bold text-violet mb-8">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b-2 border-pink pb-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full flex justify-between items-center text-left py-2"
                  >
                    <span className="text-lg font-medium text-violet">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-6 w-6 text-pink transform transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-screen pt-2" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
                <Button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold px-5 py-3 text-base"
                >
                    Have Any Queries
                </Button>
            </div>
          </div>
        </div>
      </section>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Button variant="ghost" size="icon" onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </Button>
            <h3 className="text-2xl font-bold text-violet mb-6 text-center">Contact Us</h3>
            <p className="text-gray-600 text-center mb-6">Have a question? Fill out the form and we'll get back to you.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Your Name *" 
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="email" 
                  placeholder="Your Email *" 
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="tel" 
                  placeholder="Phone Number *" 
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Company/Startup Name *" 
                  {...register("companyName", { required: "Company Name is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold py-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}