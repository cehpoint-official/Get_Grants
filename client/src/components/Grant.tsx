import { CheckCircle, MapPin } from "lucide-react";

import { useLocation } from 'wouter';

const GrantCallToAction = () => {
  const [, navigate] = useLocation();
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div 
      className="py-20 px-4 sm:px-6 lg:px-8 text-center"
      style={{ backgroundColor: '#EEE0FF' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Main Heading */}
        <h1 
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: '#111827' }}
        >
          Start Free Trial | Browse All Grants
        </h1>

        {/* Subheading */}
        <p 
          className="mt-4 text-lg"
          style={{ color: '#565F6C' }}
        >
          No credit card required • Cancel anytime
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => navigate('/grants')}
            className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-7 py-3 font-semibold text-base rounded-lg shadow-lg transition-opacity"
           
          >
            Find Grants
          </button>
          <button 
           onClick={() => scrollToSection('grant-library')}
            className="bg-white/80 border-2 border-gray-300 text-[#565F6C] hover:bg-white px-8 py-3 font-bold text-base rounded-lg shadow-lg"
           
          >
            Explore Grant Library
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
           
            <span 
              className="font-medium"
              style={{ color: '#111827' }}
            >
              500+ Verified Grants
            </span>
          </div>
          <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
            
            <span 
              className="font-medium"
              style={{ color: '#111827' }}
            >
              All Indian States Covered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantCallToAction;