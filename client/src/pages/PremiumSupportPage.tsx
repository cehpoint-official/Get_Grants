import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import Faq from "@/components/Faq";

// Importing the new icons from the assets folder
import accessIcon from "@/assets/logos/access.png";
import alertIcon from "@/assets/logos/alert.png";
import priorityIcon from "@/assets/logos/priority.png";


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
    <div id="premium-support" className="bg-white" >
      {/* Pricing Section */}
      <section id="pricing" >
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-[#FAF5FF] py-16 ">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#30343B] mb-4">
              Unlock All Features
            </h2>
            <p className="text-lg text-[#565F6C] max-w-3xl mx-auto">
              Experience the complete power of our platform with nothing held back.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            {/* Basic Plan */}
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg border w-full max-w-sm transition-all duration-300 ease-in-out hover:scale-105 ">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-[#F3F4F6] text-[#4B5563] px-4 py-2 rounded-[36px] text-sm font-medium mb-4 h-[31px] w-[115px]">Basic</div>
                <div className="mb-4 h-[39px] flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter', fontSize: '32px', fontWeight: 700 }}>₹199</span>
                  <span className="text-gray-600 text-lg" style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500 }}>/month</span>
                </div>
                <p className="text-[#565F6C] min-h-[40px]" style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500, lineHeight: '20px' }}>Perfect for startups looking for quick funding opportunities</p>
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
              <Button onClick={() => handlePlanClick('login')} className="w-full text-[#8541EF] group-hover:bg-[#8541EF] group-hover:text-dark-voilet rounded-[20px] font-semibold h-[40px] border border-[#8541EF]" style={{backgroundColor: '#8541EF17'}}>Get started</Button>
            </div>

            {/* Growth Plan */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl w-full max-w-sm relative transition-all duration-300 ease-in-out hover:scale-110">
              <div className="absolute top-4 right-4">
                <span 
                    className="text-white text-xs font-semibold px-4 py-1.5 rounded-[27px] shadow-lg h-[21px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(91.15deg, #FA9025 30.26%, #FFEBE3 81.29%, #FF9B10 94.61%)' }}
                >
                    Popular
                </span>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-[#E0E7FF] text-[#3730A3] px-4 py-2 rounded-[36px] text-sm font-medium mb-4 h-[31px] w-[115px]">Growth</div>
                 <div className="mb-4 h-[39px] flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter', fontSize: '32px', fontWeight: 700 }}>₹499</span>
                  <span className="text-gray-600 text-lg" style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500 }}>/month</span>
                </div>
                <p className="text-[#565F6C] min-h-[40px]" style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500, lineHeight: '20px' }}>Perfect for startups looking for quick funding opportunities</p>
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
              <Button onClick={() => handlePlanClick('login')} className="w-full bg-[#8541EF] hover:bg-[#7a38d9] text-white rounded-[20px] font-semibold h-[40px]">Get started</Button>
            </div>

            {/* Pro Plan */}
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg border w-full max-w-sm transition-all duration-300 ease-in-out hover:scale-105 ">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center bg-[#FEF3C7] text-[#92400E] px-4 py-2 rounded-[36px] text-sm font-medium mb-4 h-[31px] w-[115px]">Pro</div>
                <div className="mb-4 h-[39px] flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter', fontSize: '32px', fontWeight: 700 }}>₹699</span>
                  <span className="text-gray-600 text-lg" style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 500 }}>/month</span>
                </div>
                <p className="text-[#565F6C] min-h-[40px]" style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500, lineHeight: '20px' }}>Perfect for startups looking for quick funding opportunities</p>
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
               <Button onClick={() => handlePlanClick('login')} className="w-full text-[#8541EF] group-hover:bg-[#8541EF] group-hover:text-dark-violet rounded-[20px] font-semibold h-[40px] border border-[#8541EF]" style={{backgroundColor: '#8541EF17'}}>Get started</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 bg-[#F9FAFB] sm:px-6 lg:px-8">
          <div className="text-center py-10 mb-12">
            <h2 className="text-4xl mb-4" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#30343B' }}>
              Unlock All Features
            </h2>
            <p className="text-base" style={{ fontFamily: 'Poppins', fontWeight: 400, color: '#00000094' }}>
              Enjoy full access to every tool and benefit without any limits.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-16 max-w-6xl mx-auto mt-20 relative">
            {/* Full Access Card */}
            <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                <img src={accessIcon} alt="Full Access" className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Full Access</h3>
              <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Browse and review every grant opportunity with no restrictions.</p>
            </div>

            {/* Instant Alerts Card */}
            <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                <img src={alertIcon} alt="Instant Alerts" className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Instant Alerts</h3>
              <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Stay updated with timely notifications for new grants that match your profile.</p>
            </div>

            {/* Priority Updates Card */}
            <div className="bg-white p-8 rounded-[21px] text-center border relative w-[354px] h-[190px]" style={{ boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full h-[70px] w-[70px] flex items-center justify-center" style={{ border: '1px solid #8541EF4F', boxShadow: '0px 4px 22.1px 0px #8A51CE3D' }}>
                 <img src={priorityIcon} alt="Priority Updates" className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Priority Updates</h3>
              <p className="text-sm text-[#30343B]" style={{height: '48px', lineHeight: '20px'}}>Gain early insights into fresh funding programs before others.</p>
            </div>
          </div>

          <div className="text-center mt-12 translate-y-1/2">
            <Button className="bg-[#8A51CE] hover:bg-[#7c48b8] text-white px-8 py-3 rounded-[20px] font-semibold text-lg">
              Join Us
            </Button>
          </div>
        </div>
      </section>

      <Faq />

      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Need Assistance?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Reach out to our team for tailored solutions and <br /> 
            personalized support.
          </p>
          <Button className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity" style={{ backgroundColor: '#EB5E77' }}>
            Connect Us
          </Button>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authInitialMode} />
      
      <Footer />
    </div>
  );
}