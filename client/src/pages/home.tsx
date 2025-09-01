import { useEffect } from "react";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { GrantCategories } from "../components/grant-categories";
import { BlogSection } from "../components/blog-section";
import { Footer } from "../components/footer";
import { TrustBar } from "../components/TrustBar";
import Faq from "../components/Faq";

export default function Home() {
  
  useEffect(() => {
    const sectionId = localStorage.getItem("scrollTo");
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        localStorage.removeItem("scrollTo");
      }, 100);
    }
  }, []);

  return (
    <>
      <div className="space-y-5">
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Hero /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><TrustBar /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Features /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><GrantCategories /></div>
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><BlogSection /></div>
        {/* <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><PremiumSupport /></div> */} 
        <div className="shadow-[0_2px_6px_rgba(0,0,0,0.06)]"><Faq /></div>
      </div>
      
      <div className="h-[15px]" />
      <Footer />
    </>
  );
}