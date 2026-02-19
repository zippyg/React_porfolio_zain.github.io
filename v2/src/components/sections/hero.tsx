"use client";

import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { MotionDiv } from "@/components/ui/motion";
import { EasterEggCounter } from "@/components/ui/easter-egg-counter";
import { useFunMode } from "@/contexts/fun-mode-context";
import { BlackHoleEffect } from "@/components/ui/black-hole-effect";
import { gsap } from "@/lib/gsap-config";
import { useGSAP } from "@gsap/react";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const { isFunMode } = useFunMode();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [triggerBlackHole, setTriggerBlackHole] = useState(false);
  const [showClickCount, setShowClickCount] = useState(0);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef(0);
  const clickPositionRef = useRef({ x: 0, y: 0 });
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const zainRef = useRef<HTMLSpanElement>(null);
  const mughalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
    if (isFunMode) {
      const saved = localStorage.getItem('torchEnabled');
      setTorchEnabled(saved === 'true');
    }
  }, [isFunMode]);

  // GSAP text scramble on tagline + name typewriter
  useGSAP(() => {
    if (!mounted) return;

    // Name typewriter: type "Zain" then "Mughal"
    const tl = gsap.timeline();
    if (zainRef.current) {
      tl.to(zainRef.current, {
        text: "Zain",
        duration: 0.8,
        ease: "none",
      });
    }
    if (mughalRef.current) {
      tl.to(mughalRef.current, {
        text: " Mughal",
        duration: 1.0,
        ease: "none",
      }, "+=0.1");
    }

    // Scramble the tagline text (starts at 0.8s)
    if (taglineRef.current) {
      const span = taglineRef.current.querySelector('.scramble-target');
      if (span) {
        gsap.fromTo(span,
          { text: "" },
          {
            text: ":= Math + Code + Physics",
            duration: 1.5,
            delay: 0.8,
            ease: "none",
          }
        );
      }
    }

    // Blur-to-clear on CTA links
    if (ctaRef.current) {
      const items = ctaRef.current.querySelectorAll('.cta-item');
      gsap.fromTo(items,
        { filter: "blur(8px)", opacity: 0, y: 10 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          delay: 1.4,
          ease: "power2.out",
        }
      );
    }
  }, [mounted]);

  // Listen for torch state changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (isFunMode) {
        const saved = localStorage.getItem('torchEnabled');
        const newState = saved === 'true';
        setTorchEnabled(newState);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('torchToggled', handleStorageChange);

    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('torchToggled', handleStorageChange);
      clearInterval(interval);
    };
  }, [isFunMode]);

  // Reset trigger when component unmounts or fun mode changes
  useEffect(() => {
    return () => {
      setTriggerBlackHole(false);
      clickCountRef.current = 0;
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isFunMode]);

  const handleZainClick = (e: React.MouseEvent) => {
    if (!isFunMode || !torchEnabled) return;

    e.preventDefault();
    e.stopPropagation();

    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTimeRef.current;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    if (timeSinceLastClick < 300) {
      clickCountRef.current++;
    } else {
      clickCountRef.current = 1;
    }

    lastClickTimeRef.current = currentTime;
    clickPositionRef.current = { x: e.clientX, y: e.clientY };

    setShowClickCount(clickCountRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      const finalCount = clickCountRef.current;

      if (finalCount >= 6) {
        setTriggerBlackHole(true);
      }
      clickCountRef.current = 0;
      setShowClickCount(0);
    }, 300);
  };

  return (
    <section id="hero" className="min-h-[calc(100vh-2rem)] relative overflow-hidden flex items-center pt-8">

      <Container className="relative z-10 px-4 sm:px-6">
        {/* Split layout: left text, right terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-16">
          {/* Left side — 60% */}
          <div className="lg:col-span-3 text-left">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-display">
                <span
                  onClick={handleZainClick}
                  className={`cursor-pointer inline-block relative ${torchEnabled ? 'hover:scale-105 transition-transform' : ''}`}
                  style={{ userSelect: torchEnabled ? 'none' : 'auto' }}
                >
                  <span ref={zainRef} className="text-primary glow-green"></span>
                  {showClickCount > 0 && torchEnabled && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-500 font-mono">
                      {showClickCount} / 6
                    </span>
                  )}
                </span>
                <span ref={mughalRef} className="text-foreground"></span>
              </h1>
            </MotionDiv>

            {/* Tagline with GSAP text scramble */}
            <p ref={taglineRef} className="text-xl text-muted-foreground mb-4 font-mono">
              <span className="text-primary scramble-target"></span>
            </p>

            {/* Subtitle */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-lg text-muted-foreground/80 mb-8">
                Physics MSci · Imperial College London · Quantitative Research
              </p>
            </MotionDiv>

            {/* CTA Links — minimal text with dividers */}
            <div ref={ctaRef} className="flex items-center gap-3 font-mono text-sm">
              <span
                className="cta-item cursor-pointer text-green-600 dark:text-green-500 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] hover:scale-105 transition-all duration-300 opacity-0"
                onClick={() => {
                  const target = document.querySelector("#projects");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Projects
              </span>
              <span className="cta-item text-muted-foreground/30 opacity-0 select-none">|</span>
              <a
                href="/assets/Zain%20Mughal%20resume%20Quant.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-item cursor-pointer text-cyan-600 dark:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300 opacity-0"
              >
                Resume
              </a>
              <span className="cta-item text-muted-foreground/30 opacity-0 select-none">|</span>
              <span
                className="cta-item cursor-pointer text-purple-600 dark:text-purple-500 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 opacity-0"
                onClick={() => {
                  const target = document.querySelector("#contact");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact Me
              </span>
            </div>
          </div>

          {/* Right side — 40% interactive terminal */}
          <div className="lg:col-span-2">
            <MotionDiv
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <InteractiveTerminal initialDelay={500} />
            </MotionDiv>
          </div>
        </div>
      </Container>

      {/* Easter egg hint */}
      {mounted && (
        <MotionDiv
          initial={{ opacity: 0, x: 100, y: 50 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            x: [100, 0, 5, -5, 0, 100],
            y: [50, 0, -5, 5, 0, 50]
          }}
          transition={{
            duration: 5,
            times: [0, 0.1, 0.5, 0.8, 0.9, 1],
            ease: "easeInOut"
          }}
          className="fixed bottom-16 left-24 sm:left-32 pointer-events-none z-50"
        >
          <div className="text-xs text-muted-foreground/60 dark:text-muted-foreground/40 font-mono bg-background/80 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
            <span className="inline-block animate-pulse">
              challenge: find the easter eggs
            </span>
          </div>
        </MotionDiv>
      )}

      {/* Easter egg counter */}
      <EasterEggCounter />

      {/* Scroll indicator */}
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        style={{ marginLeft: '-20px' }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-mono text-center">scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full p-1 flex items-start justify-center">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </MotionDiv>

      {/* Black hole easter egg */}
      {isFunMode && (
        <BlackHoleEffect
          trigger={triggerBlackHole}
          position={clickPositionRef.current}
          onComplete={() => {
            setTriggerBlackHole(false);
            clickCountRef.current = 0;
          }}
        />
      )}
    </section>
  );
}
