import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, Rocket } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#111827] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
    
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-6">
              <div className="mr-3">
                <Rocket className="h-8 w-8 sm:h-9 sm:w-9 text-[#EB5E77]" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] bg-clip-text text-transparent">
                Get Grants
              </h3>
            </div>
            <p className="text-white mb-8 leading-relaxed text-sm opacity-90">
              Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
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

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            
              <div className="flex flex-col items-start px-4 sm:px-0"> 
                <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white uppercase tracking-wide">QUICK LINKS</h4>
                <ul className="space-y-2 sm:space-y-3"> 
                  <li>
                    <button
                      onClick={() => scrollToSection("home")}
                      className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                      HOME
                    </button>
                  </li>
                  <li>
                    <Link href="/grants">
                      <a className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                        <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                        FIND GRANTS
                      </a>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("blog")}
                      className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                      BLOG
                    </button>
                  </li>
                  <li>
                    <Link href="/about">
                      <a className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                        <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                        ABOUT US
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <a className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                        <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                        CONTACT
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-start px-4 sm:px-0"> 
                <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white uppercase tracking-wide">LEGAL</h4>
                <ul className="space-y-2 sm:space-y-3"> 
                  <li>
                    <Link href="/premium-support">
                      <a className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                        <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                        SUPPORT
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/premium-support#pricing">
                      <a className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                        <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                        PRICING
                      </a>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("faq")}
                      className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                    >
                      <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                      FAQ'S
                    </button>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                      <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                      PRIVACY POLICY
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                      <span className="w-1 h-1 bg-white rounded-full mr-2 group-hover:bg-[#EB5E77] transition-colors"></span>
                      TERMS
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start lg:col-span-1"> 
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wide">CONTACT US</h4>
            
            {/* --- THIS IS THE CHANGED LINE --- */}
            <div className="flex flex-row flex-wrap justify-center md:flex-col gap-4"> 
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm">help@hirenari.com</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm">+91 1000000011</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center text-white text-sm opacity-75">
            <p>&copy;2025 UX/UI Team. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}