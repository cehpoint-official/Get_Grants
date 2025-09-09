import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2, ArrowDown } from "lucide-react";
import { useLocation } from "wouter";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import Faq from "@/components/Faq";

export default function PremiumSupportPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handlePlanClick = (mode: 'login' | 'signup') => {
    if (user) {
      navigate("/apply");
    } else {
      setAuthInitialMode(mode);
      setIsAuthModalOpen(true);
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div id="premium-support" className="bg-white py-10">
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

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 relative transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-violet text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">Most Popular</span></div>
              <div className="mb-6"><h3 className="text-2xl font-bold text-violet mb-2">Pro</h3><p className="text-gray-600">For serious founders</p></div>
              <div className="mb-8"><span className="text-4xl font-bold text-violet">₹399</span><span className="text-gray-600">/month</span></div>
              <ul className="text-left space-y-4 mb-8">
                {/* Checkmark color changed from text-red to text-violet */}
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Everything in Free</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Access to 500+ premium grants</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Priority application support</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">WhatsApp & SMS alerts</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Grant deadline tracking</span></li>
              </ul>
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Choose Pro Plan</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl shadow-lg shadow-black/20 hover:shadow-black/40 transform hover:-translate-y-1 hover:scale-[1.01]">
              <div className="mb-6"><h3 className="text-2xl font-bold text-violet mb-2">Enterprise</h3><p className="text-gray-600">For teams & incubators</p></div>
              <div className="mb-8"><span className="text-4xl font-bold text-violet">₹3,999</span><span className="text-gray-600">/month</span></div>
              <ul className="text-left space-y-4 mb-8">
                {/* Checkmark color changed from text-red to text-violet */}
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Everything in Pro</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Done-for-you applications</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">1:1 expert consultation</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Pitch deck review</span></li>
                <li className="flex items-center"><CheckCircle2 className="h-5 w-5 text-violet mr-3 flex-shrink-0" /><span className="text-gray-700">Team collaboration tools</span></li>
              </ul>
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
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
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-white p-8 rounded-2xl text-center shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
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

      {/* Auth Modal unified for pricing actions */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
      <Faq />

      <Footer />
    </div>
  );
}