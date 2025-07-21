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
  const { scrolled } = useScroll();
  const pathname = usePathname();
  
  // Detect OS for keyboard shortcut display
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacOS = userAgent.includes('mac');
    setIsMac(isMacOS);
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-sm border-b border-border/20"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo onClick={() => setShowCommandPalette(true)} />

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
              <ThemeToggle className="h-9 w-9 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors" />
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center"
                title="Open command palette"
                onClick={() => setShowCommandPalette(true)}
              >
                <kbd className="inline-flex h-7 w-7 select-none items-center justify-center gap-0.5 rounded border border-border/50 bg-muted/50 font-mono text-[11px] font-medium">
                  <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>
                  <span>Z</span>
                </kbd>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-6 h-6 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="absolute w-6 h-5 flex flex-col justify-between">
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
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden",
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
            
            {/* Theme Toggle in Mobile Menu */}
            <MotionDiv
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { x: 0, opacity: 1 },
                closed: { x: 50, opacity: 0 },
              }}
              transition={{ delay: isOpen ? navigationItems.length * 0.1 : 0 }}
              className="pt-8 flex items-center gap-4"
            >
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </MotionDiv>
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