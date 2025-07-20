import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      
      {/* Placeholder sections - we'll build these next */}
      <section id="about" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-600">About Section Coming Soon</h2>
      </section>
      
      <section id="projects" className="min-h-screen flex items-center justify-center bg-gray-900/20">
        <h2 className="text-4xl font-bold text-gray-600">Projects Section Coming Soon</h2>
      </section>
      
      <section id="research" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-600">Research Section Coming Soon</h2>
      </section>
      
      <section id="contact" className="min-h-screen flex items-center justify-center bg-gray-900/20">
        <h2 className="text-4xl font-bold text-gray-600">Contact Section Coming Soon</h2>
      </section>
    </main>
  );
}