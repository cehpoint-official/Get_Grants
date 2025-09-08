import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, User, Mail, Phone, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createPremiumInquiry } from "@/services/premiumSupport";

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
    {
        question: "Is my data secure with your service?",
        answer: "Absolutely. We prioritize your data's security and confidentiality using industry-standard encryption and privacy protocols. Your information is safe with us.",
    }
  ];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const onSubmit = async (data: PremiumInquiryForm) => {
    setIsSubmitting(true);
    try {
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
    <div 
      id="faq" 
      className="py-16 sm:py-24" 
      style={{ background: ' #FFFFFF ' }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-left">
            <span 
              className="inline-block px-3 py-1 text-sm font-semibold rounded-2xl"
              style={{ backgroundColor: '#F49BAB', color: '#EB5E77' }}
            >
              FAQ
            </span>
            <h2 
              className="mt-4 text-4xl lg:text-5xl font-bold"
              style={{ color: '#111827' }}
            >
              Frequently Asked Questions
            </h2>
            <p 
              className="mt-4 text-lg"
              style={{ color: '#565F6C' }}
            >
              Simplifying everything you need here
            </p>
            <div 
              className="mt-6 h-1 w-25"
              style={{ backgroundColor: '#EB5E77' }}
            />
          </div>

          {/* Right Content - Accordion */}
          <div className="mt-10 lg:mt-0">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full flex justify-between items-center text-left p-5"
                  >
                    <span 
                      className="text-base font-medium"
                      style={{ color: '#30343B' }}
                    >
                      {faq.question}
                    </span>
                    <Plus 
                      className={`h-5 w-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-45' : ''}`}
                      style={{ color: '#30343B' }}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    <div className="px-5 pb-5">
                      <p style={{ color: '#565F6C' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Have Any Queries Button */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => setIsContactModalOpen(true)}
            className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
            style={{ backgroundColor: '#EB5E77' }}
          >
            Have Any Queries
          </Button>
        </div>

      </div>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Button variant="ghost" size="icon" onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </Button>
            <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#30343B' }}>Contact Us</h3>
            <p className="text-center mb-6" style={{ color: '#565F6C' }}>Have a question? Fill out the form and we'll get back to you.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Your Name *" 
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#EB5E77] transition-colors"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="email" 
                  placeholder="Your Email *" 
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#EB5E77] transition-colors"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="tel" 
                  placeholder="Phone Number *" 
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#EB5E77] transition-colors"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                <input 
                  type="text" 
                  placeholder="Company/Startup Name *" 
                  {...register("companyName", { required: "Company Name is required" })}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#EB5E77] transition-colors"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full text-white rounded-xl shadow-lg font-semibold py-3 text-lg disabled:opacity-50"
                style={{ backgroundColor: '#EB5E77' }}
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