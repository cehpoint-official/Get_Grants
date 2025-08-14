import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react"; // Import ChevronDown
import { Link } from "wouter";

export default function PremiumSupport() {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  // State to manage which FAQ is open
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div id="premium-support" className="bg-white">
      {/* (Previous sections: Hero, Services, Pricing, CTA) */}
      {/* ... The rest of your component code from before goes here ... */}
      
      {/* --- BIGGER Interactive Pricing Section --- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-2 text-lg text-gray-600">
            Select the plan that works best for you.
          </p>

          <div className="mt-12 max-w-lg mx-auto grid md:grid-cols-2 gap-8">
            
            {/* Monthly Plan BIG Card */}
            <div
              onClick={() => setSelectedPlan("monthly")}
              className={`p-8 border-2 rounded-xl cursor-pointer transition-all flex flex-col text-left ${
                selectedPlan === "monthly" 
                ? "border-primary-blue bg-white shadow-lg" 
                : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-900">Monthly</h3>
              <p className="mt-4 text-4xl font-bold text-gray-900">₹499</p>
              <p className="text-sm font-medium text-gray-500">per month</p>
              <p className="mt-6 text-gray-600">
                A great way to get started with our premium services without a long-term commitment.
              </p>
              <div className="flex-grow" />
              <Button size="lg" className={`w-full mt-8 ${selectedPlan === 'monthly' ? 'bg-primary-blue' : 'bg-gray-300'} text-white`}>
                Choose Plan
              </Button>
            </div>

            {/* Quarterly Plan BIG Card */}
            <div
              onClick={() => setSelectedPlan("quarterly")}
              className={`p-8 border-2 rounded-xl cursor-pointer transition-all flex flex-col text-left ${
                selectedPlan === "quarterly" 
                ? "border-primary-blue bg-white shadow-lg" 
                : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-900">Quarterly</h3>
              <p className="mt-4 text-4xl font-bold text-gray-900">₹999</p>
              <p className="text-sm font-medium text-gray-500">per 3 months</p>
              <p className="mt-6 text-gray-600">
                Save money with our quarterly plan and get consistent support for your funding goals.
              </p>
              <div className="flex-grow" />
              <Button size="lg" className={`w-full mt-8 ${selectedPlan === 'quarterly' ? 'bg-primary-blue' : 'bg-gray-300'} text-white`}>
                Choose Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW FAQ Section --- */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full flex justify-between items-center text-left py-2"
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-6 w-6 text-primary-blue transform transition-transform duration-300 ${
                        openFaqIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-screen pt-2" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}