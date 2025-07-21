"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { useScroll } from "@/hooks/use-scroll";
import { navigationItems } from "@/config/navigation";
import { MotionDiv } from "@/components/ui/motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandPalette } from "@/components/ui/command-palette";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(true); // Default to Mac
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const { scrolled } = useScroll();
  const pathname = usePathname();
  
  // Detect OS for keyboard shortcut display
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacOS = userAgent.includes('mac');
    setIsMac(isMacOS);
  }, []);

  // Track hero section visibility
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Consider hero in view if any part of it is visible
        setHeroInView(rect.bottom > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky-header",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState({}, '', '/');
              }} 
              showFullName={!heroInView}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector(item.href);
                    target?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/60 hover:bg-muted border border-border/50 transition-colors shadow-sm" />
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center rounded-lg bg-muted/60 hover:bg-muted border border-border/50 transition-colors shadow-sm hover:border-primary/30"
                title="Open command palette"
                onClick={() => setShowCommandPalette(true)}
              >
                <kbd className="inline-flex h-5 w-auto px-1.5 select-none items-center justify-center gap-0.5 rounded bg-transparent font-mono text-[11px] font-medium">
                  <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>
                  <span>Z</span>
                </kbd>
              </Button>
            </div>

            {/* Mobile Header Controls */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/60 hover:bg-muted border border-border/50 transition-colors shadow-sm" />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/60 hover:bg-muted border border-border/50 transition-colors shadow-sm hover:border-primary/30"
                aria-label="Toggle menu"
              >
                <span className="sr-only">Toggle menu</span>
                <div className="relative w-5 h-4 flex flex-col justify-between">
                  <span
                    className={cn(
                      "w-full h-[2px] bg-primary transform transition-all duration-300 origin-left",
                      isOpen && "rotate-45 translate-y-[1px]"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-[2px] bg-primary transition-all duration-300",
                      isOpen && "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-[2px] bg-primary transform transition-all duration-300 origin-left",
                      isOpen && "-rotate-45 -translate-y-[1px]"
                    )}
                  />
                </div>
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <MotionDiv
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0, opacity: 1 },
          closed: { x: "100%", opacity: 0 },
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "fixed inset-0 z-[99] bg-background/95 backdrop-blur-lg md:hidden",
          !isOpen && "pointer-events-none"
        )}
      >
        <Container className="h-full flex flex-col justify-center">
          <nav className="space-y-8">
            {navigationItems.map((item, i) => (
              <MotionDiv
                key={item.name}
                initial={false}
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: { x: 0, opacity: 1 },
                  closed: { x: 50, opacity: 0 },
                }}
                transition={{ delay: isOpen ? i * 0.1 : 0 }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    const target = document.querySelector(item.href);
                    target?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block cursor-pointer"
                >
                  <span className="text-3xl font-bold text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1 block">
                    {item.description}
                  </span>
                </a>
              </MotionDiv>
            ))}
          </nav>
        </Container>
      </MotionDiv>
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
      />
    </>
  );
}