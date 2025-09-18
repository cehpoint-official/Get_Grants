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
      className="bg-[#F9FAFB] lg:bg-white p-4 md:p-6 lg:p-8" 
    >
      <div 
        className="w-full h-full rounded-2xl flex items-center relative" 
        style={{ 
          background: window.innerWidth >= 1024 ? 'linear-gradient(135deg,rgb(214, 170, 245) 0%,rgb(224, 192, 190) 50%, #FEE6CA 100%)' : 'transparent'
        }}
      >
        <div className="w-full">
          <div className="max-w-7xl mx-auto lg:mx-[50px] my-12 lg:my-[50px] px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:gap-14 items-center">
            
              <div className="flex flex-col text-center lg:text-left">
                
                <div>
                  <h1 className="text-3xl lg:text-[40px] font-extrabold text-[#30343B] mb-4 leading-tight max-w-3xl mx-auto lg:mx-0">
                    <span style={{ color: '#EB5E77', fontWeight: 'bold' }}>Discover & Apply</span> for Startup Grants & Incubator Programs
                  </h1>
                  <p className="text-lg text-[#565F6C] mb-10 lg:whitespace-nowrap hidden lg:block">
                    India's go-to platform for early-stage funding and acceleration.
                  </p>
                </div>
                
                <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 mb-8 lg:mb-12">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full"
                  >
                    <div className="relative flex items-center bg-white rounded-full lg:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <Search className="absolute left-4 h-5 w-5 text-gray-400 lg:text-[#EB5E77] z-10" />
                      <Input
                        placeholder="Search for grants"
                        className="pl-12 pr-4 lg:pr-32 h-12 text-base w-full border-0 focus-visible:ring-0 focus:outline-none bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                      <Button
                        type="submit"
                        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 h-11 bg-violet hover:bg-[#8A41CE] text-white px-5 font-semibold text-base rounded-lg transition-colors"
                      >
                        Search
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                  <Button
                    onClick={() => navigate('/grants')}
                    className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-4 py-2 font-semibold text-base rounded-lg shadow-lg transition-opacity h-auto"
                  >
                    Find Grants
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection('grant-library')}
                    className="bg-white/80 border-2 border-gray-300 text-[#565F6C] hover:bg-white px-4 py-2 font-bold text-base rounded-lg shadow-lg h-auto"
                  >
                    Explore Grant Library
                  </Button>
                </div>

                <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-[#565F6C] justify-center lg:justify-start">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
                    500+ Verified Grants
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" style={{ color: '#EB5E77' }} />
                    All Indian States Covered
                  </div>
                </div>

                <div className=" my-8 lg:hidden">
                  <img
                    src={heroImage}
                    alt="Startup collaboration"
                    className="w-full max-w-sm mx-auto h-auto object-contain"
                  />
                </div>

              </div>

              <div className="hidden lg:flex justify-center items-end lg:absolute lg:right-[-60px] lg:bottom-[-110px] z-10">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Startup collaboration and planning"
                    className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain"
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