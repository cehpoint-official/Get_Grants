import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Bell, CalendarClock } from "lucide-react";
import { Link } from "wouter";

export default function FoundersArea() {
  // Features directly from the document
  const features = [
    {
      text: "Bookmark grants to review later",
      icon: <Bell className="h-6 w-6 text-white" />,
    },
    {
      text: "Track deadlines so you never miss an opportunity",
      icon: <CalendarClock className="h-6 w-6 text-white" />,
    },
    {
      text: "Receive WhatsApp & Email alerts for new grants",
      icon: <Zap className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <div id="founders-area" className="bg-light-blue">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Unlock Your Founder Superpowers
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Register for a free account to access tools designed to help you secure funding.
        </p>

        <div className="mt-12 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-6 text-gray-800">Register/Login to:</h3>
          <div className="space-y-5 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 bg-primary-blue rounded-full h-10 w-10 flex items-center justify-center mr-4">
                  {feature.icon}
                </div>
                <span className="text-gray-700 text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {/* CTA Button from the document */}
          <Button asChild size="lg" className="bg-primary-blue hover:bg-accent-blue text-base px-8 py-6">
            <Link href="/login">Create Your Free Founder Profile</Link>
          </Button>
        </div>
        
        <div className="mt-16">
            <h3 className="text-lg font-semibold text-gray-800">Ready for More?</h3>
            <p className="text-gray-600 mt-2">
                Subscribe to our premium plan to get access to all ongoing grants and exclusive programs.
            </p>
        </div>

      </div>
    </div>
  );
}
