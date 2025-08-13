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
import { useEffect } from "react";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll to section when navigating from other pages
  useEffect(() => {
    const scrollTo = localStorage.getItem("scrollTo");
    if (scrollTo) {
      localStorage.removeItem("scrollTo");
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Scroll to top when page loads normally
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      
      {/* Explore Grants Section */}
      <section id="explore-grants">
        <GrantCategories />
      </section>
      
      {/* Founders Area Section */}
      <section id="founders-area" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Founders Area
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock exclusive features and stay ahead of the competition with our premium founder tools
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: "🔖",
                  title: "Bookmark Grants",
                  description: "Save your favorite grants and programs for easy access"
                },
                {
                  icon: "⏰",
                  title: "Track Deadlines",
                  description: "Never miss important application deadlines with smart reminders"
                },
                {
                  icon: "📱",
                  title: "WhatsApp/Email Alerts",
                  description: "Get instant notifications about new opportunities and updates"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Your Free Founder Profile</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of founders who are already using our platform to discover funding opportunities
              </p>
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-primary-blue hover:bg-accent-blue text-white px-8 py-3 font-semibold"
              >
                Get Started Free
              </Button>
            </div>

            {/* Premium Features */}
            <div className="mt-8 bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Premium Subscription</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  ₹999/month
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Access to all ongoing grants and programs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Priority deadline notifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Exclusive grant recommendations</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Direct application assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">WhatsApp priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Current month highlights</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Current Month Highlights:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• 15+ New Grant Programs</p>
                  <p>• 8 Incubator Applications Open</p>
                  <p>• 3 Major Funding Deadlines</p>
                  <p>• 2 New Sector-Specific Programs</p>
                </div>
              </div>

              <Button 
                className="w-full bg-primary-blue hover:bg-accent-blue text-white py-3 font-semibold"
                onClick={() => scrollToSection('contact')}
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Incubator Area Section */}
      <section id="incubator-area" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Incubator Area
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reach Thousands of Founders. List Your Incubator.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: "🤖",
                  title: "Automated Applications",
                  description: "AI-powered application processing and screening for efficient candidate selection"
                },
                {
                  icon: "📈",
                  title: "Boost Program Visibility",
                  description: "Reach thousands of qualified founders actively seeking incubation support"
                },
                {
                  icon: "🎯",
                  title: "Targeted Matching",
                  description: "AI algorithms match startups with the right incubator programs"
                },
                {
                  icon: "📊",
                  title: "Analytics Dashboard",
                  description: "Track applications, success rates, and program performance metrics"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Admin Features */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Admin Dashboard</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  AI-Powered
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Web scraper for ongoing programs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">LinkedIn page scraping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">AI auto-fill in desired format</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Real-time data updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Automated content management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Multiple source integration</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">AI Scraping Sources:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Government websites & portals</p>
                  <p>• LinkedIn company pages</p>
                  <p>• Incubator websites</p>
                  <p>• Startup ecosystem platforms</p>
                </div>
              </div>

              <Button 
                className="w-full bg-primary-blue hover:bg-accent-blue text-white py-3 font-semibold"
                onClick={() => scrollToSection('incubator-login')}
              >
                Access Admin Dashboard
              </Button>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">List Your Program</h3>
              <p className="text-gray-600 mb-6">
                Join leading incubators and accelerators in our network. Start receiving qualified applications today.
              </p>
              <Button 
                onClick={() => scrollToSection('incubator-login')}
                className="bg-primary-blue hover:bg-accent-blue text-white px-8 py-3 font-semibold"
              >
                List Your Program
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Incubator Login Section */}
      <section id="incubator-login" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Incubator Login Area
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access your admin dashboard to manage programs, view applications, and leverage AI-powered tools
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Login Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h3>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="incubator-email">Email</Label>
                  <Input 
                    id="incubator-email" 
                    type="email" 
                    placeholder="your@incubator.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incubator-password">Password</Label>
                  <Input 
                    id="incubator-password" 
                    type="password" 
                    placeholder="Your password" 
                    required 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </a>
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-primary-blue hover:bg-accent-blue text-white py-3 font-semibold"
                >
                  Sign In
                </Button>
              </form>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">New Incubator?</h3>
              <p className="text-gray-600 mb-6">
                Register your incubator program and start receiving applications from qualified founders.
              </p>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="incubator-name">Incubator Name</Label>
                  <Input 
                    id="incubator-name" 
                    placeholder="Your Incubator Name" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incubator-email-reg">Email</Label>
                  <Input 
                    id="incubator-email-reg" 
                    type="email" 
                    placeholder="your@incubator.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incubator-website">Website</Label>
                  <Input 
                    id="incubator-website" 
                    placeholder="https://yourincubator.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incubator-sector">Focus Sector</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="agritech">AgriTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="deeptech">DeepTech</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-primary-blue hover:bg-accent-blue text-white py-3 font-semibold"
                >
                  Register Incubator
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Support Section */}
      <section id="premium-support" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Premium Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Want to Increase Your Chances of Getting Funded?
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: "📝",
                  title: "Done-for-you Grant Application",
                  description: "Our experts handle your entire grant application process from start to finish"
                },
                {
                  icon: "📊",
                  title: "Pitch Deck & Compliance Review",
                  description: "Professional pitch deck creation and compliance verification"
                },
                {
                  icon: "👨‍💼",
                  title: "1:1 Expert Consultation",
                  description: "Direct access to industry experts and grant specialists"
                }
              ].map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>

            {/* Success Metrics */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Success Metrics</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { metric: "85%", label: "Success Rate" },
                  { metric: "3x", label: "Faster Processing" },
                  { metric: "₹50Cr+", label: "Total Funding" },
                  { metric: "500+", label: "Happy Clients" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-blue mb-1">{stat.metric}</div>
                    <div className="font-medium text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Free Consultation</h3>
              <p className="text-gray-600 mb-6">
                Schedule a free 30-minute consultation with our grant experts to discuss your funding needs
              </p>
              <Button 
                onClick={() => scrollToSection('premium-consultation')}
                className="bg-primary-blue hover:bg-accent-blue text-white px-8 py-3 font-semibold"
              >
                Book Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Consultation Booking Section */}
      <section id="premium-consultation" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Book Your Free Consultation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule a free 30-minute consultation with our grant experts. No obligation, just valuable insights.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="consultation-name">Full Name</Label>
                  <Input 
                    id="consultation-name" 
                    placeholder="Your Name" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-email">Email</Label>
                  <Input 
                    id="consultation-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="consultation-company">Company/Startup</Label>
                  <Input 
                    id="consultation-company" 
                    placeholder="Your Company" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-phone">Phone Number</Label>
                  <Input 
                    id="consultation-phone" 
                    placeholder="+91 98765 43210" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation-sector">Sector</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="agritech">AgriTech</SelectItem>
                    <SelectItem value="edtech">EdTech</SelectItem>
                    <SelectItem value="deeptech">DeepTech</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation-funding">Funding Amount Needed</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Funding Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-25">₹10-25 Lakhs</SelectItem>
                    <SelectItem value="25-50">₹25-50 Lakhs</SelectItem>
                    <SelectItem value="50-100">₹50 Lakhs - 1 Crore</SelectItem>
                    <SelectItem value="100+">₹1 Crore+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultation-message">Tell us about your funding needs</Label>
                <Textarea
                  id="consultation-message"
                  placeholder="Describe your startup, funding requirements, and any specific challenges you're facing..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-primary-blue hover:bg-accent-blue text-white px-12 py-4 font-semibold text-lg"
                >
                  Book Free Consultation
                </Button>
                <p className="text-sm text-gray-600 mt-3">
                  No cost • No obligation • 30-minute session
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

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
      <section id="contact" className="py-20 bg-white">
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
      </section>

      <Footer />
    </>
  );
}
