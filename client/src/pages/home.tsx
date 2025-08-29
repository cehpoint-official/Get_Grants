import { useEffect } from "react"; // Add this line
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
import { CheckCircle, Search, FileText, Send, Award, Users, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";
import { TrustBar } from "../components/TrustBar";
// import FoundersArea from "../components/FoundersArea";
import PremiumSupport from "../components/PremiumSupport";
import Faq from "../components/Faq";

export default function Home() {
  
  // Add this useEffect block to handle scrolling
  useEffect(() => {
    const sectionId = localStorage.getItem("scrollTo");
    if (sectionId) {
      setTimeout(() => { // Added timeout for better reliability
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        localStorage.removeItem("scrollTo");
      }, 100);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Hero /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><TrustBar /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Features /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><GrantCategories /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><BlogSection /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><PremiumSupport /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Faq /></div>
      </div>
      
      <div className="h-[15px]" />
      <Footer />
    </>
  );
}