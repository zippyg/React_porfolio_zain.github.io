"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { navigationItems, socialLinks } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useTheme } from "@/contexts/theme-context";

export function Footer() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const currentYear = new Date().getFullYear();
  const { toggleFunMode, isFunMode } = useFunMode();
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Handle commands
    if (trimmedCmd === "/about" || trimmedCmd === "about") {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      setOutput("Navigating to About section...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/projects" || trimmedCmd === "projects") {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      setOutput("Navigating to Projects section...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/skills" || trimmedCmd === "skills") {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      setOutput("Navigating to Skills section...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/research" || trimmedCmd === "research") {
      document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
      setOutput("Navigating to Research section...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/contact" || trimmedCmd === "contact") {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      setOutput("Navigating to Contact section...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/resume" || trimmedCmd === "resume") {
      window.open('/assets/Zain%20Mughal%20resume%20Quant.pdf', '_blank');
      setOutput("Opening resume...");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/fun" || trimmedCmd === "fun") {
      toggleFunMode();
      setOutput(isFunMode ? "🎮 Fun mode disabled" : "🎮 Fun mode activated!");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "/theme" || trimmedCmd === "theme") {
      toggleTheme();
      setOutput(theme === 'dark' ? "☀️ Switched to light theme" : "🌙 Switched to dark theme");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
      setCommand("");
    } else if (trimmedCmd === "sudo make me a sandwich") {
      setOutput("🥪 Okay.");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 3000);
      setCommand("");
    } else if (trimmedCmd === "help" || trimmedCmd === "/help") {
      setOutput("Available commands: /about, /projects, /skills, /research, /contact, /resume, /fun, /theme");
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 4000);
      setCommand("");
    } else if (trimmedCmd === "clear") {
      setCommand("");
      setOutput("");
      setShowOutput(false);
    } else if (trimmedCmd !== "") {
      setOutput(`Command not found: ${cmd}`);
      setShowOutput(true);
      setTimeout(() => setShowOutput(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(command);
    }
  };

  return (
    <footer className="relative mt-32 border-t border-border/20 bg-background/60 dark:bg-black/40 backdrop-blur-sm">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="matrix-bg" />
      </div>

      <Container className="relative">
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold font-display text-primary">ZM</span>
              <span className="inline-block w-3 h-5 bg-primary animate-terminal-blink" />
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Physics enthusiast and student at Imperial College London. Diving into complex 
              datasets and turning them into insights through Python, C++, machine learning 
              and deep theoretical understanding.
            </p>
            
            {/* Terminal */}
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="text-primary">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="type a command..."
                  className="bg-transparent outline-none flex-1 text-muted-foreground placeholder:text-muted-foreground/50"
                  spellCheck={false}
                />
              </div>
              {showOutput && (
                <div className="absolute top-full mt-2 text-xs font-mono text-primary animate-fade-in whitespace-nowrap">
                  {output}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      /
                    </span>
                    {item.name.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-border/50 rounded flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all hover:-translate-y-0.5"
                  aria-label={link.name}
                >
                  <SocialIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© {currentYear} Zain Mughal. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <span className="font-mono">
                <span className="text-muted-foreground">Built with</span>{" "}
                <span className="text-primary">React</span>{" "}
                <span className="text-muted-foreground">&</span>{" "}
                <span className="text-primary">Next.js</span>
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* Add matrix rain CSS */}
      <style jsx>{`
        .matrix-bg {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(34, 197, 94, 0.03) 2px,
            rgba(34, 197, 94, 0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(34, 197, 94, 0.03) 2px,
            rgba(34, 197, 94, 0.03) 4px
          );
          background-size: 100px 100px;
          animation: matrix-move 20s linear infinite;
        }
        
        @keyframes matrix-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100px, 100px);
          }
        }
      `}</style>
    </footer>
  );
}

// Social Icons Component
function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "github":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case "email":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
  }
}