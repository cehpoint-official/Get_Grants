import aboutImage1 from "@/assets/logos/about-img1.jpg";
import aboutImage2 from "@/assets/logos/about-img2.jpg";
import aboutImage3 from "@/assets/logos/about-img3.jpg";
import { Button } from "@/components/ui/button";
import StartupGrowth from "@/components/startup";
import { Footer } from "../components/footer";

import {
  CheckCircle,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Scaling,
} from "lucide-react";
import { useLocation } from "wouter";

const ListItem = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </li>
);

const CoreValueCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
    <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-purple-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function About() {
  const [, navigate] = useLocation();

  const missionItems = [
    "Connect founders with the most relevant grants and programs",
    "Simplify complex funding requirements into clear, actionable steps",
    "Build a collaborative network for ambitious entrepreneurs",
    "Make funding accessible to every deserving innovator",
  ];

  const visionItems = [
    "Empower startups to turn bold ideas into successful ventures",
    "Remove financial barriers for innovation-driven founders",
    "Foster a diverse and inclusive startup ecosystem",
    "Drive long-term economic growth and positive social impact",
  ];

  const coreValues = [
    {
      icon: Scaling,
      title: "Openness",
      description: "Equal access to opportunities for every founder.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving to meet the evolving needs of startups.",
    },
    {
      icon: HeartHandshake,
      title: "Collaboration",
      description: "Fostering a supportive community where entrepreneurs grow together.",
    },
    {
      icon: ShieldCheck,
      title: "Integrity",
      description: "Operating with honesty and transparency to build lasting trust.",
    },
  ];

  return (
    <div className="bg-white font-sans">
      {/* About Us */}
      <section
        className="flex items-center justify-center py-16 md:py-24"
        style={{ backgroundColor: "#FAF5FF" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <span className="inline-block bg-[#8541EF29] text-sm text-[#8541EF] font-semibold px-4 py-2 rounded-full mb-4">
                About Us
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#191919] leading-tight mb-6">
                Fueling Innovation, One Startup at a Time
              </h1>
              <p className="text-lg text-[#565F6C] leading-relaxed mb-8">
                We exist to help entrepreneurs transform ideas into impact. By
                making funding simpler and more transparent, we empower startups
                across India to grow with confidence.
              </p>
              <Button
                onClick={() => navigate("/grants")}
                className="bg-[linear-gradient(90deg,_#8A51CE_0%,_#EB5E77_100%)] hover:opacity-90 text-white px-8 py-4 font-semibold text-base rounded-lg shadow-lg transition-opacity"
              >
                Find Grants
              </Button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={aboutImage1}
                alt="About Us Illustration"
                className="max-w-md w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="flex items-center justify-center py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
         
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
           
            <div className="w-full md:w-1/2 text-center md:text-left md:order-2">
              <span className="inline-block bg-purple-200 text-sm text-purple-800 font-semibold px-4 py-2 rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Making Funding Simple and Fair
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We believe no visionary should be limited by lack of capital.
                Our platform connects startups with the right opportunities,
                ensuring the funding journey is smooth, transparent, and
                achievable.
              </p>
              <ul className="space-y-4">
                {missionItems.map((item, index) => (
                  <ListItem key={index} text={item} />
                ))}
              </ul>
            </div>
           
            <div className="w-full md:w-1/2 flex justify-center md:order-1">
              <div className="relative p-4 bg-purple-100 rounded-lg shadow-lg">
                <img
                  src={aboutImage2}
                  alt="Our Mission"
                  className="rounded-md w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="flex items-center justify-center py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <span className="inline-block bg-purple-200 text-sm text-purple-800 font-semibold px-4 py-2 rounded-full mb-4">
                Our Vision
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                A World Where Every Idea Gets a Chance
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We aim to build a future where promising startups never
                struggle to find funding. By opening doors to capital, we're
                contributing to a diverse, inclusive, and thriving
                entrepreneurial ecosystem across India and beyond.
              </p>
              <ul className="space-y-4">
                {visionItems.map((item, index) => (
                  <ListItem key={index} text={item} />
                ))}
              </ul>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative p-4 bg-purple-100 rounded-lg shadow-lg">
                <img
                  src={aboutImage3}
                  alt="Our Vision"
                  className="rounded-md w-full h-auto max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <StartupGrowth />
      
      {/* Our Core Values */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-24"> 
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-4xl font-semibold mb-2"
            style={{ color: "#111827" }}
          >
            Our Core Values
          </h2>
          <p
            className="text-lg text-[#505050] max-w-lg mx-auto mb-8"
            style={{ lineHeight: "36px" }}
          >
            Principles that guide our work and shape our commitment to
            startups.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 container">
            {coreValues.map((value, index) => (
              <CoreValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}