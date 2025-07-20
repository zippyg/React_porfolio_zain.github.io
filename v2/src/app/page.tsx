import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { GlowCard } from "@/components/ui/glow-card";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Particle effect */}
      <Particles className="absolute inset-0" quantity={40} />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/15 to-transparent h-[200%] animate-scan-line" />
      </div>

      <Container className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-down font-display">
            <span className="text-primary glow-green">Zain</span>{" "}
            <span className="text-white">Mughal</span>
          </h1>
          <p className="text-xl text-gray-400 animate-fade-up mb-8">
            Quantitative Researcher • Physicist • Full-Stack Developer
          </p>
          <p className="text-sm text-gray-600 font-mono animate-fade-in">
            Building at the intersection of mathematics and technology
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-terminal-blink" />
          </p>
        </div>

        <div className="flex gap-4 animate-fade-up">
          <Button variant="terminal">View Projects</Button>
          <Button variant="outline">Contact Me</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
          <GlowCard glowColor="green" className="animate-fade-up">
            <h3 className="text-lg font-semibold mb-2">Quantitative Research</h3>
            <p className="text-sm text-muted-foreground">
              Mathematical modeling and data analysis
            </p>
          </GlowCard>
          <GlowCard glowColor="cyan" className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-lg font-semibold mb-2">Physics</h3>
            <p className="text-sm text-muted-foreground">
              Computational physics and simulations
            </p>
          </GlowCard>
          <GlowCard glowColor="purple" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold mb-2">Full-Stack Development</h3>
            <p className="text-sm text-muted-foreground">
              Modern web applications and systems
            </p>
          </GlowCard>
        </div>
      </Container>
    </main>
  );
}