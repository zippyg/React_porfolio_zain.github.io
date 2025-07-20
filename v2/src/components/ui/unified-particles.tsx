"use client";

import { useEffect, useRef, useCallback } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

// Define particle types
type ParticleType = "dot" | "symbol" | "equation";

interface BaseParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: ParticleType;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface DotParticle extends BaseParticle {
  type: "dot";
  size: number;
}

interface SymbolParticle extends BaseParticle {
  type: "symbol";
  symbol: string;
  fontSize: number;
}

interface EquationParticle extends BaseParticle {
  type: "equation";
  latex: string;
  image?: ImageBitmap;
  width: number;
  height: number;
  scale: number;
}

type Particle = DotParticle | SymbolParticle | EquationParticle;

// Simple symbols (Greek letters, operators)
const simpleSymbols = [
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "λ", "μ", "π", "ρ", "σ", "τ", "φ", "ψ", "ω",
  "Δ", "Θ", "Λ", "Σ", "Φ", "Ψ", "Ω", "∇", "∂", "∫", "∑", "∏", "√", "∞",
];

// Complex LaTeX equations
const complexEquations = [
  // Financial Mathematics
  "\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0",
  "C = S_0 N(d_1) - Ke^{-rT}N(d_2)",
  "d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}",
  "\\text{VaR}_\\alpha = \\mu - \\sigma\\Phi^{-1}(\\alpha)",
  
  // Tensor Calculus & General Relativity
  "R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",
  "\\nabla_\\mu T^{\\mu\\nu} = 0",
  "ds^2 = g_{\\mu\\nu}dx^\\mu dx^\\nu",
  
  // Quantum Mechanics
  "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi",
  "\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r})",
  "[\\hat{x}, \\hat{p}] = i\\hbar",
  
  // Lagrangian & Hamiltonian Mechanics
  "\\mathcal{L} = T - V = \\frac{1}{2}m\\dot{\\mathbf{q}}^2 - V(\\mathbf{q})",
  "\\frac{d}{dt}\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = 0",
  "H = \\sum_i p_i\\dot{q}_i - \\mathcal{L}",
  
  // Rough Path Theory
  "\\|\\mathbf{X}\\|_{p\\text{-var};[s,t]} = \\sup_{\\mathcal{D}} \\left(\\sum_{[t_i,t_{i+1}]\\in\\mathcal{D}} |X_{t_{i+1}} - X_{t_i}|^p\\right)^{1/p}",
  "\\mathbb{S}_n(X)_{s,t} = \\int_{s<t_1<\\cdots<t_n<t} dX_{t_1} \\otimes \\cdots \\otimes dX_{t_n}",
  
  // Stochastic Differential Equations
  "dX_t = \\mu(X_t, t)dt + \\sigma(X_t, t)dW_t",
  "\\mathbb{E}[f(X_T)] = f(x) + \\mathbb{E}\\left[\\int_0^T \\mathcal{A}f(X_s)ds\\right]",
];

interface UnifiedParticlesProps {
  className?: string;
  dotCount?: number;
  symbolCount?: number;
  equationCount?: number;
}

export function UnifiedParticles({
  className,
  dotCount = 15,
  symbolCount = 15,
  equationCount = 10,
}: UnifiedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const equationCacheRef = useRef<Map<string, ImageBitmap>>(new Map());

  // Render LaTeX to canvas using KaTeX
  const renderLatexToImage = useCallback(async (latex: string): Promise<ImageBitmap | null> => {
    try {
      // Check cache first
      if (equationCacheRef.current.has(latex)) {
        return equationCacheRef.current.get(latex)!;
      }

      // Create a temporary div to render KaTeX
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.color = "#22c55e";
      tempDiv.style.fontSize = "24px";
      document.body.appendChild(tempDiv);

      // Render LaTeX
      katex.render(latex, tempDiv, {
        throwOnError: false,
        displayMode: true,
      });

      // Get the rendered element
      const katexElement = tempDiv.querySelector(".katex-html") as HTMLElement;
      if (!katexElement) {
        document.body.removeChild(tempDiv);
        return null;
      }

      // Create canvas to render the equation
      const bbox = katexElement.getBoundingClientRect();
      const scale = 2; // For better quality
      const canvas = document.createElement("canvas");
      canvas.width = bbox.width * scale;
      canvas.height = bbox.height * scale;
      const ctx = canvas.getContext("2d")!;
      
      // Set up canvas
      ctx.scale(scale, scale);
      ctx.fillStyle = "#22c55e";
      ctx.font = "24px 'JetBrains Mono', monospace";
      
      // Use html2canvas alternative - manual SVG approach
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${bbox.width}" height="${bbox.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color: #22c55e; font-size: 24px; font-family: 'JetBrains Mono', monospace;">
              ${tempDiv.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `;
      
      const img = new Image();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      return new Promise((resolve) => {
        img.onload = async () => {
          ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
          URL.revokeObjectURL(url);
          document.body.removeChild(tempDiv);
          
          const imageBitmap = await createImageBitmap(canvas);
          equationCacheRef.current.set(latex, imageBitmap);
          resolve(imageBitmap);
        };
        img.onerror = () => {
          document.body.removeChild(tempDiv);
          resolve(null);
        };
        img.src = url;
      });
    } catch (error) {
      console.error("Error rendering LaTeX:", error);
      return null;
    }
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    let idCounter = 0;

    // Create dot particles
    for (let i = 0; i < dotCount; i++) {
      particles.push({
        id: idCounter++,
        type: "dot",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2,
        size: 2,
        opacity: 0.6,
        rotation: 0,
        rotationSpeed: 0,
      });
    }

    // Create symbol particles
    for (let i = 0; i < symbolCount; i++) {
      const fontSize = Math.random() * 8 + 12;
      particles.push({
        id: idCounter++,
        type: "symbol",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: fontSize * 0.5,
        symbol: simpleSymbols[Math.floor(Math.random() * simpleSymbols.length)],
        fontSize,
        opacity: Math.random() * 0.3 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Create equation particles with pre-rendered images
    for (let i = 0; i < equationCount; i++) {
      const latex = complexEquations[Math.floor(Math.random() * complexEquations.length)];
      const scale = Math.random() * 0.3 + 0.5;
      
      const particle: EquationParticle = {
        id: idCounter++,
        type: "equation",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 50 * scale, // Approximate radius
        latex,
        width: 100 * scale, // Will be updated
        height: 50 * scale, // Will be updated
        scale,
        opacity: Math.random() * 0.2 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      };
      
      particles.push(particle);
      
      // Render equation asynchronously
      renderLatexToImage(latex).then((image) => {
        if (image) {
          particle.image = image;
          particle.width = image.width * scale * 0.5;
          particle.height = image.height * scale * 0.5;
          particle.radius = Math.max(particle.width, particle.height) * 0.5;
        }
      });
    }

    particlesRef.current = particles;
  }, [dotCount, symbolCount, equationCount, renderLatexToImage]);

  // Collision detection and response
  const checkCollisions = useCallback(() => {
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = p1.radius + p2.radius;
        
        if (distance < minDistance && distance > 0) {
          // Collision detected
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Relative velocity
          const dvx = p1.vx - p2.vx;
          const dvy = p1.vy - p2.vy;
          const dvn = dvx * nx + dvy * ny;
          
          // Don't resolve if velocities are separating
          if (dvn > 0) continue;
          
          // Collision impulse (simplified for different masses)
          const mass1 = p1.radius;
          const mass2 = p2.radius;
          const impulse = (2 * dvn) / (mass1 + mass2);
          
          // Update velocities
          p1.vx -= impulse * mass2 * nx * 0.8; // 0.8 for energy loss
          p1.vy -= impulse * mass2 * ny * 0.8;
          p2.vx += impulse * mass1 * nx * 0.8;
          p2.vy += impulse * mass1 * ny * 0.8;
          
          // Separate particles
          const overlap = minDistance - distance;
          const separationX = nx * overlap * 0.5;
          const separationY = ny * overlap * 0.5;
          p1.x += separationX;
          p1.y += separationY;
          p2.x -= separationX;
          p2.y -= separationY;
          
          // Add slight rotation change on collision
          if (p1.type !== "dot") p1.rotationSpeed += (Math.random() - 0.5) * 0.02;
          if (p2.type !== "dot") p2.rotationSpeed += (Math.random() - 0.5) * 0.02;
        }
      }
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update collisions
    checkCollisions();
    
    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      
      // Wrap around edges
      const buffer = 100;
      if (particle.x < -buffer) particle.x = canvas.width + buffer;
      if (particle.x > canvas.width + buffer) particle.x = -buffer;
      if (particle.y < -buffer) particle.y = canvas.height + buffer;
      if (particle.y > canvas.height + buffer) particle.y = -buffer;
      
      // Apply friction
      particle.vx *= 0.999;
      particle.vy *= 0.999;
      particle.rotationSpeed *= 0.999;
      
      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      switch (particle.type) {
        case "dot":
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case "symbol":
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.fillStyle = "#22c55e";
          ctx.font = `${particle.fontSize}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(particle.symbol, 0, 0);
          break;
          
        case "equation":
          if (particle.image) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.drawImage(
              particle.image,
              -particle.width / 2,
              -particle.height / 2,
              particle.width,
              particle.height
            );
          }
          break;
      }
      
      ctx.restore();
    });
    
    // Draw connections between nearby particles
    ctx.strokeStyle = "rgba(34, 197, 94, 0.1)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.globalAlpha = (1 - distance / 150) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [checkCollisions]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles]);

  // Start animation after particles are initialized
  useEffect(() => {
    const startAnimation = async () => {
      await initializeParticles();
      animate();
    };
    
    startAnimation();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}