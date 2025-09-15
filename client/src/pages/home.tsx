import { useEffect } from "react";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { GrantCategories } from "../components/grant-categories";
import { BlogSection } from "../components/blog-section";
import { Footer } from "../components/footer";
import { TrustBar } from "../components/TrustBar";
import { SmartTools } from "@/components/SmartTools";
import StartupGrowth from "@/components/startup";
import SolutionTools from "@/components/SolutionTools";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Grant from "@/components/Grant";
import { scrollToSectionWithOffset } from "@/lib/scrollUtils";
import { useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const sectionId = hash.substring(1);
      scrollToSectionWithOffset(sectionId, 'auto');
    }
  }, [location]); 

  return (
    <main>
      <Hero />
      <TrustBar />
      <Features />
      <section id="grant-library">
        <GrantCategories />
      </section>
      <SmartTools />   
      <StartupGrowth />
      <SolutionTools />
      <Testimonials/>
      <section id="blog">
        <BlogSection />
      </section>
      <Grant />
      <Faq />
      <Footer />
    </main>
  );
}