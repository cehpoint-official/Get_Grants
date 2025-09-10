import React from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type TestimonialCardProps = {
  name: string;
  title: string;
  quote: string;
  amountSecured: string;
  initial: string;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, title, quote, amountSecured, initial }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{initial}</span>
          </div>
        </div>
      </div>
      <blockquote className="text-gray-600 mb-4">
        <p>"{quote}"</p>
      </blockquote>
      <a href="#" className="text-purple-600 font-semibold hover:underline">
        {amountSecured}
      </a>
    </div>
  );
};

export default function Testimonials() {
  const [, navigate] = useLocation();
  const testimonials: TestimonialCardProps[] = [
    {
      name: "Krunal Chachiya",
      title: "Founder Of SeaFreshh",
      quote:
        "We secured ₹7 lakhs in grant funding within our first month of using this platform. The live grants notification saved us from missing a crucial opportunity.",
      amountSecured: "Secured ₹18 Lakhs",
      initial: "K",
    },
    {
      name: "Krunal Chachiya",
      title: "Founder Of SeaFreshh",
      quote:
        "We secured ₹7 lakhs in grant funding within our first month of using this platform. The live grants notification saved us from missing a crucial opportunity.",
      amountSecured: "Secured ₹18 Lakhs",
      initial: "K",
    },
    {
      name: "Krunal Chachiya",
      title: "Founder Of SeaFreshh",
      quote:
        "We secured ₹7 lakhs in grant funding within our first month of using this platform. The live grants notification saved us from missing a crucial opportunity.",
      amountSecured: "Secured ₹18 Lakhs",
      initial: "K",
    },
    {
      name: "Krunal Chachiya",
      title: "Founder Of SeaFreshh",
      quote:
        "We secured ₹7 lakhs in grant funding within our first month of using this platform. The live grants notification saved us from missing a crucial opportunity.",
      amountSecured: "Secured ₹18 Lakhs",
      initial: "K",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 self-start">
            <span className="inline-block text-sm font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Case Studies
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Explore their journey to raising capital
            </h2>
            <p className="text-lg text-gray-600">
              Meet the entrepreneurs who raised capital on our platform
            </p>
            <Button
                    onClick={() => navigate('/grants')}
                    className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
                  >
                    Find Grants
                  </Button>
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                title={testimonial.title}
                quote={testimonial.quote}
                amountSecured={testimonial.amountSecured}
                initial={testimonial.initial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


