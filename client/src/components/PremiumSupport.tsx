import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2, X, User, Mail, Phone, Lock } from "lucide-react";
import { Link } from "wouter";

export default function PremiumSupport() {
  // State to manage which FAQ is open
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  // State for Signup Modal
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);


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


  return (
    <div id="premium-support" className="bg-white py-10">
      {/* Hero Section */}
      <section style={{
        background: 'white'
      }} className="text-violet">
        <div className="container mx-auto px-4 py-5 md:py-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl drop-shadow-lg">
            Want to Increase Your Chances of Getting Funded?
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700 drop-shadow-md">
            Let our experts guide you through every step of the application process.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-white p-8 rounded-2xl text-center shadow-xl border-2 border-violet hover:border-pink transition-all duration-300">
                <div className="mx-auto bg-violet rounded-full h-12 w-12 flex items-center justify-center mb-4 shadow-lg">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-violet">{service.name}</h3>
                <p className="mt-2 text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-15" style={{
        background: 'white'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-violet mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Get funded in 3 simple steps. Our platform makes the grant application process straightforward and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-violet mb-4">Subscribe to a plan</h3>
              <p className="text-gray-700">
                Choose the plan that works best for you and get access to our comprehensive grant database.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-violet rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-violet mb-4">Receive updates</h3>
              <p className="text-gray-700">
                Get real-time notifications about new grants, deadlines, and opportunities via email and WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-violet rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-violet mb-4">Apply for grants</h3>
              <p className="text-gray-700">
                Submit your applications with expert guidance and increase your chances of getting funded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      {/* <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button 
                    onClick={() => setIsSignupModalOpen(true)}
                    className="w-full sm:w-auto bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold px-8 py-6 text-lg"
                >
                    Signup for Free
                </Button>
                <Button 
                    onClick={() => scrollToSection('pricing')}
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-violet text-violet hover:bg-violet hover:text-white rounded-xl shadow-lg font-semibold px-8 py-6 text-lg"
                >
                    View Pricing Plans
                </Button>
            </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-violet mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Select the plan that works best for you. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-violet rounded-2xl p-8 text-center hover:border-pink transition-all duration-300 hover:shadow-xl shadow-lg">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-violet mb-2 ">Free</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-violet">₹0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Access to 100+ basic grants</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Basic grant information</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Email notifications</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Community forum access</span></li>
              </ul>
              <Button onClick={() => setIsSignupModalOpen(true)} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Get Started Free</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-violet hover:border-pink rounded-2xl p-8 text-center shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-violet text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">Most Popular</span></div>
              <div className="mb-6"><h3 className="text-2xl font-bold text-violet mb-2">Pro</h3><p className="text-gray-600">For serious founders</p></div>
              <div className="mb-8"><span className="text-4xl font-bold text-violet">₹999</span><span className="text-gray-600">/month</span></div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Everything in Free</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Access to 500+ premium grants</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Priority application support</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">WhatsApp & SMS alerts</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Grant deadline tracking</span></li>
              </ul>
              <Button className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Choose Pro Plan</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-violet rounded-2xl p-8 text-center hover:border-pink transition-all duration-300 hover:shadow-xl shadow-lg">
              <div className="mb-6"><h3 className="text-2xl font-bold text-violet mb-2">Enterprise</h3><p className="text-gray-600">For teams & incubators</p></div>
              <div className="mb-8"><span className="text-4xl font-bold text-violet">₹2,999</span><span className="text-gray-600">/month</span></div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Everything in Pro</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Done-for-you applications</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">1:1 expert consultation</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Pitch deck review</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-red mr-3 flex-shrink-0" /><span className="text-gray-700">Team collaboration tools</span></li>
              </ul>
              <Button className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      
      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full max-w-md" style={{ background: 'linear-gradient(135deg, hsl(60, 30%, 95%) 0%, hsl(30, 60%, 90%) 100%)' }}>
            <Button variant="ghost" size="icon" onClick={() => setIsSignupModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full">
              <X size={24} />
            </Button>
            <h3 className="text-2xl font-bold text-violet mb-6 text-center">Join Our Community</h3>
            <form className="space-y-4">
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder="Name" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet focus:border-violet"/></div>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="email" placeholder="Email" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet focus:border-violet"/></div>
                <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="tel" placeholder="Mobile No." className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet focus:border-violet"/></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" placeholder="Password" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet focus:border-violet"/></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" placeholder="Confirm Password" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet focus:border-violet"/></div>
                <Button type="submit" className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold py-3 text-lg">Continue</Button>
            </form>
          </div>
        </div>
      )}

   
    </div>
  );
}