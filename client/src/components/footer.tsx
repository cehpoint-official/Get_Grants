import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, Rocket } from "lucide-react";
import { Link, useLocation } from "wouter";
import { scrollToSectionWithOffset } from "@/lib/scrollUtils";

export function Footer() {
  const [location, navigate] = useLocation();

  const handleScrollClick = (sectionId: string) => {
    if (location === "/") {
      scrollToSectionWithOffset(sectionId);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handlePageNavigation = (path: string) => {
      navigate(path);
      window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#111827] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8 text-center lg:text-left">
          
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <div className="flex items-center mb-6">
              <div className="mr-3">
                <Rocket className="h-8 w-8 text-[#EB5E77]" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] bg-clip-text text-transparent">
                Get Grants
              </h3>
            </div>
            <p className="text-white mb-8 leading-relaxed text-sm opacity-90 max-w-sm">
              Unlock your startup's potential with Get Grants. We provide the tools and insights you need to navigate India's grant ecosystem and secure funding without diluting equity.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300">
                <Linkedin className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300">
                <Instagram className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-3">
              
              <div className="col-span-1 text-left">
                <h4 className="text-base font-semibold mb-6 text-white uppercase tracking-wide text-left sm:text-left">QUICK LINKS</h4>
                <ul className="space-y-3 flex flex-col items-start sm:items-start">
                  <li><button onClick={() => handleScrollClick("home")} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>HOME</button></li>
                  <li><button onClick={() => handlePageNavigation('/grants')} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>FIND GRANTS</button></li>
                  <li><button onClick={() => handleScrollClick("blog")} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>BLOG</button></li>
                  <li><button onClick={() => handlePageNavigation('/about')} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>ABOUT US</button></li>
                  <li><button onClick={() => handlePageNavigation('/contact')} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>CONTACT</button></li>
                </ul>
              </div>

              <div className="col-span-1 text-left">
                <h4 className="text-base font-semibold mb-6 text-white uppercase tracking-wide text-left sm:text-left">LEGAL</h4>
                <ul className="space-y-3 flex flex-col items-start sm:items-start">
                <li><a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>SUPPORT</a></li>
                 <li><button onClick={() => handlePageNavigation('/premium-support#pricing')} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>PRICING</button></li>
                  <li><button onClick={() => handleScrollClick("faq")} className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>FAQ'S</button></li>
                  <li><a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>PRIVACY POLICY</a></li>
                  <li><a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"><span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77]"></span>TERMS</a></li>
                </ul>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wide">CONTACT US</h4>
                <div className="flex flex-col gap-4 items-start lg:items-start">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <a href="mailto:Blackleoventures@gmail.com" className="text-white text-sm hover:text-[#EB5E77] transition-colors">
                      Blackleoventures@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <a href="tel:+917837059633" className="text-white text-sm hover:text-[#EB5E77] transition-colors">
                      +91 7837059633
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center text-white text-sm opacity-75">
            <p>&copy; {new Date().getFullYear()} Get Grants. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}