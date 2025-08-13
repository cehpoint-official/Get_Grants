import { Button } from "@/components/ui/button";
import { Check, Star, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function PremiumSupport() {
  // Features listed in the document
  const services = [
    {
      name: "Done-for-you Grant Application",
      description: "Our experts will handle the entire application process for you, from writing to submission.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
    {
      name: "Pitch Deck & Compliance Review",
      description: "Get your pitch deck and documents reviewed by professionals to ensure they meet all requirements.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
    {
      name: "Access to 1:1 Expert Consultation",
      description: "Schedule a one-on-one call with our grant experts to get personalized advice and strategies.",
      icon: <Check className="h-6 w-6 text-white" />,
    },
  ];

  // Placeholder testimonials
  const testimonials = [
    {
      quote: "The team's expertise was invaluable. They helped us secure a grant we thought was out of reach!",
      author: "Rohan Sharma",
      company: "Founder, AgriTech Innovations",
    },
    {
      quote: "A must-have service for any serious founder. The pitch deck review made all the difference.",
      author: "Priya Singh",
      company: "CEO, HealthWell AI",
    },
  ];

  return (
    <div id="premium-support" className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary-blue text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Want to Increase Your Chances of Getting Funded?
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-blue-100">
            Let our experts guide you through every step of the application process.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.name} className="bg-light-blue p-8 rounded-lg text-center">
                <div className="mx-auto bg-primary-blue rounded-full h-12 w-12 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="mt-2 text-lg text-gray-600">
            Book a free, no-obligation consultation call with our experts today.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary-blue hover:bg-accent-blue text-base px-8 py-6">
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
