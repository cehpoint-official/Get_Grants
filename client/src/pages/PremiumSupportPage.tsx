import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2, ArrowDown, FileText, Bell, RotateCcw } from "lucide-react";
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


  return (
    <div id="premium-support" className="bg-white py-10">
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-violet mb-6">
              Unlock All Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the complete power of our platform with nothing held back.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 relative transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
              <div className="mb-6">
                <div className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4">Basic</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for startups looking for quick funding opportunities</p>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited grant access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic search functionality</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email notifications for new grants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Access to grant details</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Application deadline reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Grant eligibility checker</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Early access to new features</span>
                </li>
              </ul>
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-white border-2 border-violet text-violet hover:bg-violet hover:text-white rounded-xl shadow-lg font-semibold">Get started</Button>
            </div>

            {/* Growth Plan */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 relative transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
              <div className="absolute -top-4 right-4">
                <span className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">Popular</span>
              </div>
              <div className="mb-6">
                <div className="inline-block bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">Growth</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹499</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for startups looking for quick funding opportunities</p>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited grant access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic search functionality</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email notifications for new grants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Access to grant details</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Application deadline reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Grant eligibility checker</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                  <span className="text-gray-400">Early access to new features</span>
                </li>
              </ul>
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-violet hover:bg-pink text-white rounded-xl shadow-lg font-semibold">Get started</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 relative transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
              <div className="mb-6">
                <div className="inline-block bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">Pro</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹699</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for startups looking for quick funding opportunities</p>
              </div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited grant access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic search functionality</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email notifications for new grants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Access to grant details</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Application deadline reminders</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Grant eligibility checker</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Early access to new features</span>
                </li>
              </ul>
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-white border-2 border-violet text-violet hover:bg-violet hover:text-white rounded-xl shadow-lg font-semibold">Get started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Unlock All Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enjoy full access to every tool and benefit without any limits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mx-auto bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Access</h3>
              <p className="text-gray-600">Browse and review every grant opportunity with no restrictions.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mx-auto bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Alerts</h3>
              <p className="text-gray-600">Stay updated with timely notifications for new grants that match your profile.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mx-auto bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <RotateCcw className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority Updates</h3>
              <p className="text-gray-600">Gain early insights into fresh funding programs before others.</p>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-violet hover:bg-pink text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg">
              Join Us
            </Button>
          </div>
        </div>
      </section>


      {/* Need Assistance Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Need Assistance?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Reach out to our team for tailored solutions and personalized support.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg">
            Connect Us
          </Button>
        </div>
      </section>

      {/* Auth Modal unified for pricing actions */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
      
      <Faq />

      <Footer />
    </div>
  );
}