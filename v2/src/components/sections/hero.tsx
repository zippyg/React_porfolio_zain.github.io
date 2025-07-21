"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedText, GlitchText } from "@/components/ui/animated-text";
import { MotionDiv } from "@/components/ui/motion";
import { fadeInUp, staggerContainer } from "@/components/ui/motion";
import { TrendingUp, Atom, Brain } from "lucide-react";
import { EasterEggCounter } from "@/components/ui/easter-egg-counter";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero" className="min-h-[calc(100vh-2rem)] relative overflow-hidden flex items-center pt-8">

      <Container className="relative z-10 px-4 sm:px-6">
        <MotionDiv
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-8 sm:mb-12"
        >
          <MotionDiv variants={fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display cursor-pointer">
              <GlitchText text="Zain" className="text-primary glow-green" />{" "}
              <GlitchText text="Mughal" className="text-foreground" />
            </h1>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <p className="text-xl text-muted-foreground mb-4">
              Harnessing Physics for Data Mastery
            </p>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <p className="text-lg text-muted-foreground/80 mb-8">
              Innovator and Technologist
            </p>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <div className="text-sm text-muted-foreground/60 font-mono">
              <AnimatedText text="Imperial College London • Physics MSci" typewriter />
            </div>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={fadeInUp} className="flex gap-4 justify-center mb-16 flex-wrap">
          <Button 
            variant="terminal" 
            size="lg" 
            className="group bg-background/40 dark:bg-black/40 backdrop-blur-sm border border-green-600 dark:border-green-500/30 text-green-600 dark:text-green-500 hover:bg-green-600/10 dark:hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-700 dark:hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
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
            className="bg-background/40 dark:bg-black/40 backdrop-blur-sm border border-purple-600 dark:border-purple-500/30 text-purple-600 dark:text-purple-500 hover:bg-purple-600/10 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-400 hover:border-purple-700 dark:hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
            onClick={() => {
              const target = document.querySelector("#contact");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact Me
          </Button>
        </MotionDiv>

        <MotionDiv
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <MotionDiv variants={fadeInUp} className="h-full">
            <GlowCard glowColor="green" className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0" />
                <h3 className="text-base font-semibold">Quantitative Finance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Options pricing, risk management, and Monte Carlo simulations
              </p>
            </GlowCard>
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="h-full">
            <GlowCard glowColor="cyan" className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Atom className="w-6 h-6 text-cyan-500 flex-shrink-0" />
                <h3 className="text-base font-semibold">Physics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Particle physics, thermodynamics, and computational simulations
              </p>
            </GlowCard>
          </MotionDiv>

          <MotionDiv variants={fadeInUp} className="h-full">
            <GlowCard glowColor="purple" className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <h3 className="text-base font-semibold">ML & AI</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Neural networks and time-series analysis for predictions
              </p>
            </GlowCard>
          </MotionDiv>
        </MotionDiv>
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
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <span className="text-xs font-mono text-center">scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full p-1 flex items-start justify-center">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}