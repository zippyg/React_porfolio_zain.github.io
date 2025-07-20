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

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrolled } = useScroll();
  const pathname = usePathname();

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
            ? "bg-black/40 backdrop-blur-sm border-b border-border/20"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

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
                  className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
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
          "fixed inset-0 z-40 bg-black/95 backdrop-blur-lg md:hidden",
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
                  <span className="text-3xl font-bold text-white hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <span className="text-sm text-gray-500 mt-1 block">
                    {item.description}
                  </span>
                </a>
              </MotionDiv>
            ))}
            
          </nav>
        </Container>
      </MotionDiv>
    </>
  );
}