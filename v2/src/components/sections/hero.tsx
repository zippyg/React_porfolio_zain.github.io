"use client";

import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlitchText } from "@/components/ui/animated-text";
import { MotionDiv } from "@/components/ui/motion";
import { EasterEggCounter } from "@/components/ui/easter-egg-counter";
import { useFunMode } from "@/contexts/fun-mode-context";
import { BlackHoleEffect } from "@/components/ui/black-hole-effect";
import { gsap } from "@/lib/gsap-config";
import { useGSAP } from "@gsap/react";

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
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (isFunMode) {
      const saved = localStorage.getItem('torchEnabled');
      setTorchEnabled(saved === 'true');
    }
  }, [isFunMode]);

  // GSAP text scramble on tagline
  useGSAP(() => {
    if (!mounted) return;

    // Scramble the tagline text
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

    // Blur-to-clear on CTA buttons
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll('button, a');
      gsap.fromTo(buttons,
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
        console.log('Torch state update in hero:', newState);
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

  // Debug trigger state
  useEffect(() => {
    if (triggerBlackHole) {
      console.log('🚨 triggerBlackHole is now TRUE in hero component!');
    }
  }, [triggerBlackHole]);

  const handleZainClick = (e: React.MouseEvent) => {
    console.log('=== Zain Click Debug ===');
    console.log('Fun mode:', isFunMode);
    console.log('Torch enabled:', torchEnabled);

    if (!isFunMode || !torchEnabled) {
      console.log('Click ignored - fun mode or torch not enabled');
      return;
    }

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

    console.log(`Zain click count: ${clickCountRef.current}, time since last: ${timeSinceLastClick}ms`);
    lastClickTimeRef.current = currentTime;
    clickPositionRef.current = { x: e.clientX, y: e.clientY };

    setShowClickCount(clickCountRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      const finalCount = clickCountRef.current;
      console.log(`Final Zain click count: ${finalCount}`);

      if (finalCount >= 6) {
        console.log('🌌 BLACK HOLE SHOULD TRIGGER NOW!');
        console.log('Setting triggerBlackHole to true...');
        setTriggerBlackHole(true);
      } else {
        console.log(`Not enough clicks: ${finalCount} < 6`);
      }
      clickCountRef.current = 0;
      setShowClickCount(0);
    }, 300);
  };

  return (
    <section id="hero" className="min-h-[calc(100vh-2rem)] relative overflow-hidden flex items-center pt-8">

      <Container className="relative z-10 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display">
              <span
                onClick={handleZainClick}
                className={`cursor-pointer inline-block relative ${torchEnabled ? 'hover:scale-105 transition-transform' : ''}`}
                style={{ userSelect: torchEnabled ? 'none' : 'auto' }}
              >
                <GlitchText text="Zain" className="text-primary glow-green" />
                {showClickCount > 0 && torchEnabled && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-green-500 font-mono">
                    {showClickCount} / 6
                  </span>
                )}
              </span>{" "}
              <GlitchText text="Mughal" className="text-foreground" />
            </h1>
          </MotionDiv>

          {/* Tagline with GSAP text scramble */}
          <p ref={taglineRef} className="text-xl text-muted-foreground mb-4 font-mono">
            <span className="text-primary scramble-target"></span>
          </p>

          {/* Subtitle — replaced from generic to concrete */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p ref={subtitleRef} className="text-lg text-muted-foreground/80 mb-8">
              Physics MSci · Imperial College London · Quantitative Research
            </p>
          </MotionDiv>
        </div>

        {/* CTA Buttons — stagger in with blur-to-clear via GSAP */}
        <div ref={ctaRef} className="flex gap-4 justify-center mb-16 flex-wrap">
          <Button
            variant="terminal"
            size="lg"
            className="group bg-background/40 dark:bg-black/40 backdrop-blur-sm border border-green-600 dark:border-green-500/30 text-green-600 dark:text-green-500 hover:bg-green-600/10 dark:hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-700 dark:hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 opacity-0"
            onClick={() => {
              const target = document.querySelector("#projects");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Projects
            <span className="ml-2 transition-transform group-hover:translate-y-0.5">↓</span>
          </Button>
          <a
            href="/assets/Zain%20Mughal%20resume%20Quant.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0"
          >
            <Button
              variant="outline"
              size="lg"
              className="group bg-background/40 dark:bg-black/40 backdrop-blur-sm border border-cyan-600 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-500 hover:bg-cyan-600/10 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-700 dark:hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
            >
              Resume
              <span className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
            </Button>
          </a>
          <Button
            variant="outline"
            size="lg"
            className="bg-background/40 dark:bg-black/40 backdrop-blur-sm border border-purple-600 dark:border-purple-500/30 text-purple-600 dark:text-purple-500 hover:bg-purple-600/10 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-400 hover:border-purple-700 dark:hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 opacity-0"
            onClick={() => {
              const target = document.querySelector("#contact");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact Me
          </Button>
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
            console.log('Black hole animation complete');
            setTriggerBlackHole(false);
            clickCountRef.current = 0;
          }}
        />
      )}
    </section>
  );
}
