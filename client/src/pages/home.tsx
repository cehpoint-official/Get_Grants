import { useEffect } from "react";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { GrantCategories } from "../components/grant-categories";
import { BlogSection } from "../components/blog-section";
import { Footer } from "../components/footer";
import { TrustBar } from "../components/TrustBar";
import { SmartTools } from "@/components/SmartTools";
import StartupGrowth from "@/components/startup";


export default function Home() {
  
  useEffect(() => {
    const sectionId = localStorage.getItem("scrollTo");
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        localStorage.removeItem("scrollTo");
      }
    }
  }, []);

  return (
    <main>
      <Hero />
      <TrustBar />
      <Features />
      <SmartTools />   
      <StartupGrowth />
     
      <section id="grant-library">
        <GrantCategories />
      </section>
     
      <section id="blog">
        <BlogSection />
      </section>
      <Footer />
    </main>
  );
}