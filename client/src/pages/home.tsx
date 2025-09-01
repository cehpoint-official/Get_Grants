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
      <section id="grant-library">
        <GrantCategories />
      </section>
     
      <section id="blog">
        <BlogSection />
      </section>
      <Faq />
      <Footer />
    </main>
  );
}