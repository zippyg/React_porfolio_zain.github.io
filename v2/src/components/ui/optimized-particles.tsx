"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { mathSymbols } from "@/data/equation-bank";
import { EquationPool, PrerenderedEquation, loadEquationImage } from "@/utils/equation-loader";

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
  targetOpacity: number;
  rotation: number;
  rotationSpeed: number;
  fadeState: 'in' | 'stable' | 'out';
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
  equation: PrerenderedEquation | null;
  image: HTMLImageElement | null;
  width: number;
  height: number;
  scale: number;
  rotationDirection: 1 | -1;
  maxRotation: number; // Maximum rotation angle (radians)
}

type Particle = DotParticle | SymbolParticle | EquationParticle;

interface OptimizedParticlesProps {
  className?: string;
  dotCount?: number;
  symbolCount?: number;
  equationCount?: number;
}

export function OptimizedParticles({
  className,
  dotCount = 3, // Reduced
  symbolCount = 20, // Increased
  equationCount = 8, // Increased
}: OptimizedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const equationPoolRef = useRef<EquationPool | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize equation pool
  const initializeEquationPool = useCallback(async () => {
    if (!equationPoolRef.current) {
      try {
        equationPoolRef.current = new EquationPool({
          complexityFilter: ['simple', 'medium', 'complex'],
          minPoolSize: 30
        });
        await equationPoolRef.current.initialize();
        console.log('Equation pool initialized with', equationPoolRef.current.getTotalCount(), 'equations');
      } catch (error) {
        console.error('Failed to initialize equation pool:', error);
      }
    }
  }, []);

  // Create a new equation particle
  const createEquationParticle = useCallback(async (
    id: number, 
    x: number | null, 
    y: number | null, 
    canvas: HTMLCanvasElement
  ): Promise<EquationParticle> => {
    // Base scale - will be adjusted based on complexity
    const baseScale = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
    
    // Convert 60 degrees to radians
    const maxRotationDegrees = 60;
    const maxRotationRadians = (maxRotationDegrees * Math.PI) / 180;
    
    // Start with a random rotation within limits
    const initialRotation = (Math.random() - 0.5) * 2 * maxRotationRadians;
    
    const particle: EquationParticle = {
      id,
      type: "equation",
      x: x !== null ? x : Math.random() * canvas.width,
      y: y !== null ? y : Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5, // Increased velocity
      vy: (Math.random() - 0.5) * 1.5,
      radius: 60 * baseScale,
      equation: null,
      image: null,
      width: 100 * baseScale,
      height: 50 * baseScale,
      scale: baseScale,
      opacity: 0,
      targetOpacity: Math.random() * 0.3 + 0.2, // 0.2 to 0.5
      rotation: initialRotation,
      rotationSpeed: (Math.random() + 0.5) * 0.005, // 0.005 to 0.01 rad/frame
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      maxRotation: maxRotationRadians,
      fadeState: 'in'
    };

    // Load a random equation
    if (equationPoolRef.current) {
      try {
        const equation = await equationPoolRef.current.getNext();
        console.log('Loading equation:', equation); // Debug log
        if (equation) {
          particle.equation = equation;
          const img = await loadEquationImage(equation);
          console.log('Loaded image:', img.width, 'x', img.height); // Debug log
          particle.image = img;
          
          // Dynamic scaling based on complexity - make complex equations bigger
          const complexityScale = {
            simple: 0.8,
            medium: 1.0,
            complex: 1.4
          };
          const finalScale = baseScale * (complexityScale[equation.complexity] || 1.0);
          
          // Maximum particle size constraints - increased for complex equations
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 150;
          
          // Calculate dimensions with constraints
          let width = img.width * finalScale;
          let height = img.height * finalScale;
          
          // Apply maximum size constraints
          if (width > MAX_WIDTH) {
            const ratio = MAX_WIDTH / width;
            width = MAX_WIDTH;
            height *= ratio;
          }
          if (height > MAX_HEIGHT) {
            const ratio = MAX_HEIGHT / height;
            height = MAX_HEIGHT;
            width *= ratio;
          }
          
          particle.width = width;
          particle.height = height;
          particle.scale = width / img.width; // Update scale based on final dimensions
          particle.radius = Math.max(particle.width, particle.height) * 0.5;
        }
      } catch (error) {
        console.error('Failed to load equation for particle:', error);
      }
    }

    return particle;
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);
    await initializeEquationPool();

    const particles: Particle[] = [];
    let idCounter = 0;

    // Create fewer dot particles
    for (let i = 0; i < dotCount; i++) {
      particles.push({
        id: idCounter++,
        type: "dot",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 2,
        size: 2,
        opacity: 0.4,
        targetOpacity: 0.4,
        rotation: 0,
        rotationSpeed: 0,
        fadeState: 'stable',
      });
    }

    // Create more symbol particles
    for (let i = 0; i < symbolCount; i++) {
      const fontSize = Math.random() * 8 + 16; // 16-24px
      particles.push({
        id: idCounter++,
        type: "symbol",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: fontSize * 0.4,
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        fontSize,
        opacity: Math.random() * 0.3 + 0.2,
        targetOpacity: Math.random() * 0.3 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        fadeState: 'stable',
      });
    }

    // Create equation particles
    const equationPromises = [];
    for (let i = 0; i < equationCount; i++) {
      equationPromises.push(createEquationParticle(idCounter++, null, null, canvas));
    }

    const equationParticles = await Promise.all(equationPromises);
    particles.push(...equationParticles);

    particlesRef.current = particles;
    setIsLoading(false);
  }, [dotCount, symbolCount, equationCount, initializeEquationPool, createEquationParticle]);

  // Check if particle is off-screen
  const isOffScreen = useCallback((particle: Particle, canvas: HTMLCanvasElement) => {
    const buffer = 100;
    return particle.x < -buffer || 
           particle.x > canvas.width + buffer || 
           particle.y < -buffer || 
           particle.y > canvas.height + buffer;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mouse glow effect
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    
    // Create radial gradient for mouse glow
    const glowRadius = 200;
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
    gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.05)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update rotation with oscillation for equations
      if (particle.type === "equation") {
        const eqParticle = particle as EquationParticle;
        
        // Apply rotation
        particle.rotation += particle.rotationSpeed * eqParticle.rotationDirection;
        
        // Check bounds and reverse direction
        if (Math.abs(particle.rotation) > eqParticle.maxRotation) {
          particle.rotation = Math.sign(particle.rotation) * eqParticle.maxRotation;
          eqParticle.rotationDirection *= -1;
        }
      } else {
        // Non-equation particles rotate normally
        particle.rotation += particle.rotationSpeed;
      }

      // Handle fade states
      if (particle.fadeState === 'in') {
        particle.opacity = Math.min(particle.opacity + 0.02, particle.targetOpacity);
        if (particle.opacity >= particle.targetOpacity) {
          particle.fadeState = 'stable';
        }
      } else if (particle.fadeState === 'out') {
        particle.opacity = Math.max(particle.opacity - 0.02, 0);
      }

      // Check if particle should be replaced (for all types)
      if (isOffScreen(particle, canvas)) {
        if (particle.type === "equation") {
          // Start fading out equation
          particle.fadeState = 'out';
          
          // Replace with new equation when fully faded or immediately if already off screen
          if (particle.opacity <= 0 || isOffScreen(particle, canvas)) {
            // Create new equation particle at random edge
            const edge = Math.floor(Math.random() * 4);
            let newX, newY, newVx, newVy;
            
            switch (edge) {
              case 0: // top
                newX = Math.random() * canvas.width;
                newY = -100;
                newVx = (Math.random() - 0.5) * 1.5;
                newVy = Math.random() * 1.5 + 0.5; // Moving down
                break;
              case 1: // right
                newX = canvas.width + 100;
                newY = Math.random() * canvas.height;
                newVx = -(Math.random() * 1.5 + 0.5); // Moving left
                newVy = (Math.random() - 0.5) * 1.5;
                break;
              case 2: // bottom
                newX = Math.random() * canvas.width;
                newY = canvas.height + 100;
                newVx = (Math.random() - 0.5) * 1.5;
                newVy = -(Math.random() * 1.5 + 0.5); // Moving up
                break;
              case 3: // left
                newX = -100;
                newY = Math.random() * canvas.height;
                newVx = Math.random() * 1.5 + 0.5; // Moving right
                newVy = (Math.random() - 0.5) * 1.5;
                break;
              default:
                newX = 0;
                newY = 0;
                newVx = 1;
                newVy = 1;
            }
            
            createEquationParticle(particle.id, newX, newY, canvas).then(newParticle => {
              newParticle.vx = newVx;
              newParticle.vy = newVy;
              particlesRef.current[index] = newParticle;
            });
          }
        } else {
          // For symbols and dots, respawn at opposite edge with same velocity
          const buffer = 100;
          if (particle.x < -buffer) {
            particle.x = canvas.width + buffer;
            particle.y = Math.random() * canvas.height;
          } else if (particle.x > canvas.width + buffer) {
            particle.x = -buffer;
            particle.y = Math.random() * canvas.height;
          } else if (particle.y < -buffer) {
            particle.y = canvas.height + buffer;
            particle.x = Math.random() * canvas.width;
          } else if (particle.y > canvas.height + buffer) {
            particle.y = -buffer;
            particle.x = Math.random() * canvas.width;
          }
          
          // Give it a new random velocity to keep things interesting
          if (particle.type === "symbol") {
            particle.vx = (Math.random() - 0.5) * 1.0;
            particle.vy = (Math.random() - 0.5) * 1.0;
          }
        }
      }

      // Edge proximity fade for equations
      if (particle.type === "equation") {
        const edgeFadeDistance = 150;
        const distToEdge = Math.min(
          particle.x,
          particle.y,
          canvas.width - particle.x,
          canvas.height - particle.y
        );
        
        if (distToEdge < edgeFadeDistance && particle.fadeState === 'stable') {
          particle.targetOpacity = Math.max(0.1, particle.targetOpacity * (distToEdge / edgeFadeDistance));
        }
      }

      // Ensure minimum velocity for continuous movement
      const minVelocity = 0.3;
      if (Math.abs(particle.vx) < minVelocity) {
        particle.vx = Math.sign(particle.vx || 1) * minVelocity;
      }
      if (Math.abs(particle.vy) < minVelocity) {
        particle.vy = Math.sign(particle.vy || 1) * minVelocity;
      }

      // Calculate distance to mouse for highlighting
      const distToMouse = Math.sqrt(
        Math.pow(particle.x - mouseX, 2) + 
        Math.pow(particle.y - mouseY, 2)
      );
      const mouseEffect = Math.max(0, 1 - distToMouse / glowRadius);

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity + mouseEffect * 0.3; // Brighten near mouse

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
          if (particle.image && particle.equation) {
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

    const maxDistance = 150;
    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          // Enhanced opacity near mouse
          const avgX = (p1.x + p2.x) / 2;
          const avgY = (p1.y + p2.y) / 2;
          const mouseDistToLine = Math.sqrt(
            Math.pow(avgX - mouseX, 2) + 
            Math.pow(avgY - mouseY, 2)
          );
          const lineMouseEffect = Math.max(0, 1 - mouseDistToLine / glowRadius);
          
          ctx.globalAlpha = (1 - distance / maxDistance) * 0.2 + lineMouseEffect * 0.3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [createEquationParticle, isOffScreen]);

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

  // Start animation
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
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-primary/50 text-sm">Loading equations...</div>
        </div>
      )}
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
    </>
  );
}