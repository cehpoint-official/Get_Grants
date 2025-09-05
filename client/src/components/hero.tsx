import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, MapPin, Search } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@/assets/logos/kamini_image.png"; 

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/grants?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/grants');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
   
    <section 
      id="home" 
      className="min-h-screen bg-white p-4 md:p-6 lg:p-8" 
    >
    
      <div 
        className="w-full h-full rounded-2xl flex items-center" 
        style={{ 
          background: 'linear-gradient(135deg,rgb(215, 178, 241) 0%,rgb(224, 192, 190) 50%, #FEE6CA 100%)'
        }}
      >
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
              <div className="mb-12 lg:mb-0 text-left">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-[#30343B] mb-4 leading-tight">
                  <span style={{ color: '#EB5E77' }}>Discover & Apply</span> for Startup Grants & Incubator Programs
                </h1>
                
                <p className="text-lg text-[#565F6C] mb-8">
                  India's go-to platform for early-stage funding and acceleration.
                </p>

                <div className="w-full mb-12">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full"
                  >
                    <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <Search className="absolute left-4 h-5 w-5 text-[#EB5E77] z-10" />
                      <Input
                        placeholder="Search for grants"
                        className="pl-12 pr-32 h-16 text-base w-full border-0 focus-visible:ring-0 focus:outline-none bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="absolute right-2 h-12 bg-[#EB5E77] hover:bg-[#d4556a] text-white px-5 font-semibold text-base rounded-lg transition-colors"
                      >
                        Search
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="flex items-center mb-8">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-[#565F6C] font-medium">No credit card required</span>
                </div>
            
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    onClick={() => navigate('/grants')}
                    className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
                  >
                    Find Grants
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection('grant-library')}
                    className="bg-white/80 border-2 border-gray-300 text-[#565F6C] hover:bg-white px-8 py-3 font-bold text-base rounded-lg shadow-lg"
                  >
                    Explore Grant Library
                  </Button>
                </div>

                <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-[#565F6C]">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
                    500+ Verified Grants
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
                    All Indian States Covered
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end items-end">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Startup collaboration and planning"
                    className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain"
                    style={{ transform: 'translateY(100px)' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}