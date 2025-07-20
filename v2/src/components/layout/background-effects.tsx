"use client";

import { useState, useEffect } from "react";
import { OptimizedParticles } from "@/components/ui/optimized-particles";
import { ParticleField } from "@/components/ui/particle-field";
import { MouseGlow } from "@/components/ui/mouse-glow";

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Grid pattern removed - now drawn by mouse torch effect */}

      {/* Mouse glow effect that highlights the grid */}
      {mounted && <MouseGlow className="fixed inset-0" />}

      {/* Optimized Particle System - dots, symbols, and pre-rendered equations */}
      {mounted && (
        <OptimizedParticles 
          className="fixed inset-0" 
          dotCount={30}
          symbolCount={8}
          equationCount={4}
          enableMouseCollision={true}
          collisionStrength={0.4}
        />
      )}

      {/* 3D Particle Field */}
      {mounted && (
        <div className="fixed inset-0 opacity-40 pointer-events-none">
          <ParticleField className="w-full h-full" />
        </div>
      )}

      {/* Terminal-style scan line effect - removed, now handled in MouseGlow */}
    </>
  );
}