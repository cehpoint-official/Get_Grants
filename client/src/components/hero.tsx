import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, MapPin, Search } from "lucide-react";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // The outer section provides the full-width background color.
    <section id="home" className="py-20" style={{
      background: 'linear-gradient(135deg, hsl(30, 60%, 70%) 0%, hsl(270, 50%, 60%) 50%, hsl(340, 70%, 70%) 100%)'
    }}>
      {/* This inner div centers the content and sets a max-width. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Discover & Apply for <span className="text-yellowish-white drop-shadow-md">Startup Grants</span> & Incubator Programs
            </h1>
            <p className="text-xl text-yellowish-white mb-8 leading-relaxed drop-shadow-md">
              India's go-to platform for early-stage funding and acceleration.
            </p>

            {/* Search Bar */}
            <div className="w-full mb-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToSection('grants');
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="Search grants by sector, state, or amount"
                    className="pl-10 h-12 text-base bg-yellowish-white border-2 border-pink rounded-xl shadow-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-violet hover:bg-pink text-white px-6 py-3 font-medium text-base rounded-xl shadow-lg"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection('explore-grants')}
                className="bg-violet hover:bg-pink text-white px-6 py-3 font-medium text-base rounded-xl shadow-lg"
              >
                Find Grants
              </Button>
          
              <Button
                onClick={() => scrollToSection('premium-support')}
                className="bg-yellowish-white text-violet hover:bg-pink hover:text-white px-6 py-3 font-medium text-base rounded-xl shadow-lg border-2 border-pink"
              >
                Apply with Support
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection('grants')}
                className="bg-yellowish-white text-violet hover:bg-pink hover:text-white px-6 py-3 font-medium text-base rounded-xl shadow-lg border-2 border-pink"
              >
                Explore Grant Library
              </Button>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-sm text-yellowish-white drop-shadow-md">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-red mr-2" />
                500+ Verified Grants
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-pink mr-2" />
                All Indian States Covered
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Professional team collaborating on startup planning"
              className="rounded-2xl shadow-2xl w-full h-auto border-4 border-yellowish-white"
            />
            <div className="absolute bottom-4 right-4 bg-yellowish-white rounded-2xl p-4 shadow-xl border-2 border-pink">
              <div className="flex items-center text-red font-semibold">
                <span className="text-xl">₹</span>
                <span className="text-sm ml-1">77,000+ Cr</span>
              </div>
              <p className="text-xs text-violet font-medium">Available Funding</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
