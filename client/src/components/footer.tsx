import { Facebook, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer style={{
      background: 'white'
    }} className="text-violet py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-pink">Get Grants</h3>
            <p className="text-violet mb-6 leading-relaxed">
              Empowering Indian Startups through Incubator Programs
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-violet hover:text-pink transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-violet hover:text-pink transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-violet hover:text-pink transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-violet hover:text-pink transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("grants")}
                  className="text-violet hover:text-pink transition-colors"
                >
                  Browse Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("blog")}
                  className="text-violet hover:text-pink transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-violet hover:text-pink transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-violet hover:text-pink transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-pink">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-violet hover:text-pink transition-colors">
                  Grant Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-violet hover:text-pink transition-colors">
                  Application Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-violet hover:text-pink transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
              <button
                  onClick={() => scrollToSection("faq")}
                  className="text-violet hover:text-pink transition-colors"
                >
                   FAQ
                </button>
                 
                
              </li>
              <li>
                <a href="#" className="text-violet hover:text-pink transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t-2 border-pink mt-8 pt-8 text-center">
          <p className="text-violet">
            © 2025 Get Grants. All rights reserved. |{" "}
            <span className="text-sm">
              Powered by black leo ventures
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
