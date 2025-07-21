import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { GitHubContributionsSection } from "@/components/sections/github-contributions";
import { ProjectsSection } from "@/components/sections/projects/projects";
import { SkillsSection } from "@/components/sections/skills";
import { ResearchSection } from "@/components/sections/research";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <AboutSection />
      <GitHubContributionsSection />
      <ProjectsSection />
      <SkillsSection />
      <ResearchSection />
      <ContactSection />
    </main>
  );
}