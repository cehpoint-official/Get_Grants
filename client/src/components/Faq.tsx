import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2, X, User, Mail, Phone, Lock } from "lucide-react";
import { Link } from "wouter";

export default function PremiumSupport() {
  // State to manage which FAQ is open
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
 
  // State for Contact Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
                    Have any question
                </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-md">
            <Button variant="ghost" size="icon" onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </Button>
            <h3 className="text-2xl font-bold text-violet mb-6 text-center">Send us a message</h3>
            <form className="space-y-4">
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Your Name" className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"/></div>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="email" placeholder="Your Email" className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"/></div>
                <textarea placeholder="Your Message" rows={4} className="w-full p-3 pl-10 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-500 transition-colors"></textarea>
                <Button type="submit" className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold py-3 text-lg">Send Message</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}