import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, Rocket } from "lucide-react";

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
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1: Branding and Social Media */}
          
          <div>
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

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  HOME
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("grants")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  BROWSE GRANTS
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("blog")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  BLOGS
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  ABOUT US
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  CONTACT
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wide">LEGAL</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  SUPPORT
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  FAQ'S
                </button>
              </li>
              <li>
                <a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-[#EB5E77] transition-colors text-sm flex items-center group">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-3 group-hover:bg-[#EB5E77] transition-colors"></span>
                  TERMS AND CONDITIONS
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white uppercase tracking-wide">CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm">Email: help@hirenari.com</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-[#EB5E77] to-[#8A51CE] rounded-full flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm">Phone: +91 1000000011</span>
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
