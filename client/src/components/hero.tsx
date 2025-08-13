import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin } from "lucide-react";

export function Hero() {
  return (
    // The outer section provides the full-width background color.
    <section id="home" className="bg-light-blue py-20">
      {/* This inner div centers the content and sets a max-width. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Discover & Apply for <span className="text-primary-blue">Startup Grants</span> & Incubator Programs
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              India’s go-to platform for early-stage funding and acceleration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  const element = document.getElementById('explore-grants');
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-primary-blue hover:bg-accent-blue text-white px-6 py-3 font-medium text-base"
              >
                Explore Free Grants
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById('premium-support');
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-primary-blue hover:bg-accent-blue text-white px-6 py-3 font-medium text-base"
              >
                Apply with Support
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById('incubator-area');
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-primary-blue hover:bg-accent-blue text-white px-6 py-3 font-medium text-base"
              >
                List Your Program
              </Button>
            </div>

            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                500+ Verified Grants
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary-blue mr-2" />
                All Indian States Covered
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Professional team collaborating on startup planning"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center text-green-600 font-semibold">
                <span className="text-xl">₹</span>
                <span className="text-sm ml-1">77,000+ Cr</span>
              </div>
              <p className="text-xs text-gray-500">Available Funding</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
