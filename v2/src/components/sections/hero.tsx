"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedText, GlitchText } from "@/components/ui/animated-text";
import { MotionDiv } from "@/components/ui/motion";
import { fadeInUp, staggerContainer } from "@/components/ui/motion";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">

      <Container className="relative z-10">
        <MotionDiv
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <MotionDiv variants={fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-display cursor-pointer">
              <GlitchText text="Zain" className="text-primary glow-green" />{" "}
              <GlitchText text="Mughal" className="text-white" />
            </h1>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <p className="text-xl text-gray-400 mb-4">
              Harnessing Physics for Data Mastery
            </p>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <p className="text-lg text-gray-500 mb-8">
              Innovator and Technologist
            </p>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <div className="text-sm text-gray-600 font-mono">
              <AnimatedText text="Imperial College London • Physics MSci" typewriter />
            </div>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={fadeInUp} className="flex gap-4 justify-center mb-16 flex-wrap">
          <Button 
            variant="terminal" 
            size="lg" 
            className="group bg-black/40 backdrop-blur-sm border border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
            onClick={() => {
              const target = document.querySelector("#projects");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Projects
            <span className="ml-2 transition-transform group-hover:translate-y-0.5">↓</span>
          </Button>
          <a 
            href="/assets/Zain Mughal resume Quant.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="group bg-black/40 backdrop-blur-sm border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
            >
              Resume
              <span className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
            </Button>
          </a>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-black/40 backdrop-blur-sm border border-purple-500/30 text-purple-500 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
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
          <MotionDiv variants={fadeInUp}>
            <GlowCard glowColor="green">
              <h3 className="text-lg font-semibold mb-2">Quantitative Finance</h3>
              <p className="text-sm text-muted-foreground">
                Options pricing, risk management, and Monte Carlo simulations
              </p>
            </GlowCard>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <GlowCard glowColor="cyan">
              <h3 className="text-lg font-semibold mb-2">Computational Physics</h3>
              <p className="text-sm text-muted-foreground">
                Statistical analysis, particle physics, and thermodynamics
              </p>
            </GlowCard>
          </MotionDiv>

          <MotionDiv variants={fadeInUp}>
            <GlowCard glowColor="purple">
              <h3 className="text-lg font-semibold mb-2">Machine Learning</h3>
              <p className="text-sm text-muted-foreground">
                LSTM, GRU, GANs, and time-series analysis for market predictions
              </p>
            </GlowCard>
          </MotionDiv>
        </MotionDiv>
      </Container>

      {/* Scroll indicator */}
      <MotionDiv
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs font-mono">scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce mx-auto" />
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}