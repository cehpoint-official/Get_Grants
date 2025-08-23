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
      background: 'linear-gradient(135deg, hsl(270, 50%, 60%) 0%, hsl(30, 60%, 70%) 100%)'
    }} className="text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-yellowish-white">Get Grants</h3>
            <p className="text-yellowish-white mb-6 leading-relaxed">
              Empowering Indian Startups through Incubator Programs
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellowish-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-yellowish-white hover:text-pink transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("grants")}
                  className="text-yellowish-white hover:text-pink transition-colors"
                >
                  Browse Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("blog")}
                  className="text-yellowish-white hover:text-pink transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-yellowish-white hover:text-pink transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-yellowish-white hover:text-pink transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-yellowish-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                  Grant Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                  Application Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-yellowish-white hover:text-pink transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t-2 border-pink mt-8 pt-8 text-center">
          <p className="text-yellowish-white">
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
