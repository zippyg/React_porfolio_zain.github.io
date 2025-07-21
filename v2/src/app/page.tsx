import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ProjectsSection } from "@/components/sections/projects/projects";
import { ResearchSection } from "@/components/sections/research";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ResearchSection />
      <ContactSection />
    </main>
  );
}