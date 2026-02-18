"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { OptimizedParticles } from "@/components/ui/optimized-particles";
import { MouseGlow } from "@/components/ui/mouse-glow";

// Lazy-load ParticleField to defer the entire Three.js bundle (~600KB)
const ParticleField = dynamic(
  () => import("@/components/ui/particle-field").then((mod) => ({ default: mod.ParticleField })),
  { ssr: false }
);

function getDeviceCapability(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "medium";
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  if (isMobile || cores < 4) return "low";
  if (cores < 8) return "medium";
  return "high";
}

export function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  const [capability, setCapability] = useState<"high" | "medium" | "low">("medium");

  useEffect(() => {
    setMounted(true);
    setCapability(getDeviceCapability());
  }, []);

  const particleConfig = capability === "low"
    ? { dotCount: 15, symbolCount: 4, equationCount: 2 }
    : capability === "medium"
    ? { dotCount: 22, symbolCount: 6, equationCount: 3 }
    : { dotCount: 30, symbolCount: 8, equationCount: 4 };

  return (
    <>
      {mounted && <MouseGlow className="fixed inset-0" />}

      {mounted && (
        <OptimizedParticles
          className="fixed inset-0"
          dotCount={particleConfig.dotCount}
          symbolCount={particleConfig.symbolCount}
          equationCount={particleConfig.equationCount}
          collisionStrength={0.4}
        />
      )}

      {/* 3D Particle Field - skip on low-capability devices */}
      {mounted && capability !== "low" && (
        <div className="fixed inset-0 opacity-40 pointer-events-none">
          <ParticleField className="w-full h-full" />
        </div>
      )}
    </>
  );
}