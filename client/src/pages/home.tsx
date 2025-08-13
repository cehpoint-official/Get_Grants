import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { GrantCategories } from "../components/grant-categories";
import { BlogSection } from "../components/blog-section";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CheckCircle } from "lucide-react";
import { TrustBar } from "../components/TrustBar";
import FoundersArea from "../components/FoundersArea";
import PremiumSupport from "../components/PremiumSupport";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <GrantCategories />
      <FoundersArea />
      <BlogSection />
      <PremiumSupport />

      {/* About Section */}
      <section id="about" className="py-20 bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
                alt="Professional team discussing startup strategy"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Empowering Indian Startups with Government Funding
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                We believe every innovative startup deserves access to
                non-dilutive funding. Our platform simplifies the complex world
                of government grants, making it easy for founders to discover
                and apply for the right opportunities.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "500+ Verified Grant Programs",
                  "Real-time Updates & Notifications",
                  "Expert Application Guidance",
                  "All Indian States Covered",
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => scrollToSection("apply-incubator")}
                variant="outline"
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-6 py-3 font-medium"
              >
                Apply as Incubator
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about grants or need help with your application?
              We're here to assist you.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <form className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Startup</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your startup and funding needs"
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-primary-blue hover:bg-accent-blue"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section> */}

      <Footer />
    </>
  );
}
