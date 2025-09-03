import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2, X, User, Mail, Phone, Lock, Building, Calendar, DollarSign, Target, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { createPremiumInquiry } from "@/services/premiumSupport";

interface PremiumInquiryForm {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  currentPlan: string;
  budget: string;
  timeline: string;
  specificNeeds: string;
  message: string;
}

export default function PremiumSupport() {
  // State to manage which FAQ is open
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
 
  // State for Contact Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PremiumInquiryForm>();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      name: "Done-for-you Grant Application",
      description: "Our experts will handle the entire application process for you, from writing to submission.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
    {
      name: "Pitch Deck & Compliance Review",
      description: "Get your pitch deck and documents reviewed by professionals to ensure they meet all requirements.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
    {
      name: "Access to 1:1 Expert Consultation",
      description: "Schedule a one-on-one call with our grant experts to get personalized advice and strategies.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
  ];

  // FAQ Data
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

  // Function to toggle FAQ visibility
  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Handle form submission
  const onSubmit = async (data: PremiumInquiryForm) => {
    setIsSubmitting(true);
    try {
      await createPremiumInquiry(data);
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will get back to you within 24 hours.",
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
     
     
      {/* Your New FAQ Section */}
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

            {/* Have a Question Button */}
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

      {/* Enhanced Premium Support Inquiry Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Button variant="ghost" size="icon" onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </Button>
            <h3 className="text-2xl font-bold text-violet mb-6 text-center">Premium Support Inquiry</h3>
            <p className="text-gray-600 text-center mb-6">Tell us about your premium support needs and we'll get back to you within 24 hours.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Company/Startup Name" 
                    {...register("companyName")}
                    className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                  />
                </div>
              </div>

              {/* Premium Subscription Details */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-violet mb-4">Premium Subscription Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <select 
                      {...register("currentPlan", { required: "Please select your current plan" })}
                      className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors appearance-none bg-white"
                    >
                      <option value="">Current Plan *</option>
                      <option value="Free">Free</option>
                      <option value="Pro">Pro (₹999/month)</option>
                      <option value="Enterprise">Enterprise (₹2,999/month)</option>
                      <option value="Not Subscribed">Not Subscribed</option>
                    </select>
                    {errors.currentPlan && <p className="text-red-500 text-sm mt-1">{errors.currentPlan.message}</p>}
                  </div>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <select 
                      {...register("budget", { required: "Please select your budget range" })}
                      className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors appearance-none bg-white"
                    >
                      <option value="">Budget Range *</option>
                      <option value="Under ₹10,000">Under ₹10,000</option>
                      <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                    </select>
                    {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
                  </div>
                </div>

                <div className="relative mt-4">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                  <select 
                    {...register("timeline", { required: "Please select your timeline" })}
                    className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors appearance-none bg-white"
                  >
                    <option value="">Timeline for Premium Support *</option>
                    <option value="ASAP">ASAP (Within 1 week)</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
                </div>
              </div>

              {/* Specific Needs */}
              <div className="relative">
                <Target className="absolute left-3 top-4 text-gray-400" size={20}/>
                <textarea 
                  placeholder="What specific premium support do you need? (e.g., Grant application assistance, Pitch deck review, 1:1 consultation, etc.) *" 
                  rows={3}
                  {...register("specificNeeds", { required: "Please describe your specific needs" })}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
                {errors.specificNeeds && <p className="text-red-500 text-sm mt-1">{errors.specificNeeds.message}</p>}
              </div>

              {/* Additional Message */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-400" size={20}/>
                <textarea 
                  placeholder="Any additional information or questions?" 
                  rows={3}
                  {...register("message")}
                  className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-violet transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold py-3 text-lg disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Premium Support Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}