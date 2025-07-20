"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MathParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const mathSymbols = [
  // Greek letters
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "λ", "μ", "π", "ρ", "σ", "τ", "φ", "ψ", "ω",
  "Δ", "Θ", "Λ", "Σ", "Φ", "Ψ", "Ω",
  
  // Financial equations
  "∂V/∂t + ½σ²S²∂²V/∂S²", // Black-Scholes PDE
  "C = SN(d₁) - Ke^(-rt)N(d₂)", // Black-Scholes solution
  "dS = μSdt + σSdW", // Geometric Brownian Motion
  "VaR = μ - σΦ⁻¹(α)", // Value at Risk
  "Σ = E[(R-μ)(R-μ)ᵀ]", // Covariance matrix
  
  // Physics equations
  "iℏ∂ψ/∂t = Ĥψ", // Time-dependent Schrödinger
  "-ℏ²/2m ∇²ψ + Vψ = Eψ", // Time-independent Schrödinger
  "F = -kx", // Hooke's law
  "∇·E = ρ/ε₀", // Gauss's law
  "∇×B = μ₀J + μ₀ε₀∂E/∂t", // Ampère-Maxwell
  
  // Differential equations
  "∂²u/∂t² = c²∇²u", // Wave equation
  "∂u/∂t = κ∇²u", // Heat equation
  "∇²φ = 0", // Laplace equation
  "dy/dx + P(x)y = Q(x)", // First-order linear ODE
  
  // Topology & Rough paths
  "∫_γ ω = ∫_∂Σ ω", // Stokes' theorem
  "χ(M) = Σ(-1)ⁱbᵢ", // Euler characteristic
  "||S||_p-var < ∞", // p-variation
  "X_t = ∫₀ᵗ σdB_s", // Itô integral
  
  // Machine Learning
  "∇_θ J(θ) = E[∇_θ log π_θ(a|s)R]", // Policy gradient
  "L = -Σy log(ŷ)", // Cross-entropy
  "||w||₂² + C Σξᵢ", // SVM objective
];

interface MathParticlesProps {
  className?: string;
  quantity?: number;
}

export function MathParticles({ className, quantity = 25 }: MathParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MathParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < quantity; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
          size: Math.random() * 16 + 12,
          opacity: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    const checkCollisions = () => {
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (particles[i].size + particles[j].size) * 0.8;
          
          if (distance < minDistance) {
            // Elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            const vx1 = particles[i].vx * cos + particles[i].vy * sin;
            const vy1 = particles[i].vy * cos - particles[i].vx * sin;
            const vx2 = particles[j].vx * cos + particles[j].vy * sin;
            const vy2 = particles[j].vy * cos - particles[j].vx * sin;
            
            // Swap velocities
            particles[i].vx = vx2 * cos - vy1 * sin;
            particles[i].vy = vy1 * cos + vx2 * sin;
            particles[j].vx = vx1 * cos - vy2 * sin;
            particles[j].vy = vy2 * cos + vx1 * sin;
            
            // Separate particles
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            particles[i].x += separationX;
            particles[i].y += separationY;
            particles[j].x -= separationX;
            particles[j].y -= separationY;
          }
        }
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Check collisions
      checkCollisions();
      
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Draw
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.opacity;
        ctx.font = `${particle.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = "#22c55e";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [quantity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{ opacity: 0.6 }}
    />
  );
}