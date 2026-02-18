"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { mathSymbols } from "@/data/equation-bank";
import { EquationPool, PrerenderedEquation, loadEquationImage } from "@/utils/equation-loader";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useEasterEggs, EASTER_EGGS } from "@/contexts/easter-egg-context";

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
  enableMouseCollision?: boolean;
  collisionStrength?: number;
}

export function OptimizedParticles({
  className,
  dotCount = 30, // More dots for better constellation
  symbolCount = 8, // Even fewer symbols
  equationCount = 4, // Further reduced for less density
  enableMouseCollision: enableMouseCollisionProp,
  collisionStrength = 0.5,
}: OptimizedParticlesProps) {
  const { isFunMode } = useFunMode();
  const { discoverEgg } = useEasterEggs();
  // Only enable mouse collision if fun mode is active (unless prop explicitly overrides)
  const enableMouseCollision = enableMouseCollisionProp !== undefined ? enableMouseCollisionProp : isFunMode;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const equationPoolRef = useRef<EquationPool | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const hasTriggeredEquationCollision = useRef(false);
  const isInitializedRef = useRef(false);
  
  // Performance monitoring
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);
  const hasShownHintRef = useRef(false);

  // Track mouse position and velocity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Reset equation collision tracking when fun mode changes
  useEffect(() => {
    if (!isFunMode) {
      hasTriggeredEquationCollision.current = false;
    }
  }, [isFunMode]);

  // Initialize equation pool
  const initializeEquationPool = useCallback(async () => {
    if (!equationPoolRef.current) {
      try {
        equationPoolRef.current = new EquationPool({
          complexityFilter: ['simple', 'medium', 'complex'],
          minPoolSize: 30
        });
        await equationPoolRef.current.initialize();
        // Pool initialized
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
      rotationSpeed: (Math.random() - 0.5) * 0.05, // Much higher initial rotation speed, can be negative
      rotationDirection: 1, // Not used anymore but keeping for compatibility
      maxRotation: maxRotationRadians,
      fadeState: 'in'
    };

    // Load a random equation
    if (equationPoolRef.current) {
      try {
        const equation = await equationPoolRef.current.getNext();
        if (equation) {
          particle.equation = equation;
          const img = await loadEquationImage(equation);
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
    
    // Prevent double initialization
    if (isInitializedRef.current && particlesRef.current.length > 0) {
      return;
    }

    isInitializedRef.current = true;

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
        vx: (Math.random() - 0.5) * 0.6, // Increased velocity
        vy: (Math.random() - 0.5) * 0.6,
        radius: 0.5,
        size: 1, // Fixed size dots
        opacity: 1.0,
        targetOpacity: 1.0, // Fully visible dots
        rotation: 0,
        rotationSpeed: 0,
        fadeState: 'stable',
      });
    }

    // Create more symbol particles
    for (let i = 0; i < symbolCount; i++) {
      const fontSize = Math.random() * 4 + 12; // 12-16px, much smaller
      particles.push({
        id: idCounter++,
        type: "symbol",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8, // Increased velocity
        vy: (Math.random() - 0.5) * 0.8,
        radius: 8, // Fixed small radius
        symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
        fontSize,
        opacity: Math.random() * 0.2 + 0.1, // More subtle
        targetOpacity: Math.random() * 0.2 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02, // Symbol rotation
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
    
    // Easter egg hint: Make one equation particle briefly glow on first load
    if (!hasShownHintRef.current && !isFunMode && equationParticles.length > 0) {
      hasShownHintRef.current = true;
      const hintParticle = equationParticles[0];
      
      // Temporarily boost opacity and size
      const originalOpacity = hintParticle.targetOpacity;
      const originalScale = hintParticle.scale;
      
      hintParticle.targetOpacity = 0.8;
      hintParticle.scale = originalScale * 1.2;
      
      // Add a special "hint" property to make it pulse
      (hintParticle as any).isHintParticle = true;
      
      // Reset after 3 seconds
      setTimeout(() => {
        hintParticle.targetOpacity = originalOpacity;
        hintParticle.scale = originalScale;
        (hintParticle as any).isHintParticle = false;
      }, 3000);
    }
  }, [dotCount, symbolCount, equationCount, initializeEquationPool, createEquationParticle, isFunMode]);

  // Check if particle is off-screen
  const isOffScreen = useCallback((particle: Particle, canvas: HTMLCanvasElement) => {
    const buffer = 100;
    return particle.x < -buffer || 
           particle.x > canvas.width + buffer || 
           particle.y < -buffer || 
           particle.y > canvas.height + buffer;
  }, []);

  // Mouse collision detection
  interface CollisionInfo {
    isColliding: boolean;
    distance: number;
    dx: number;
    dy: number;
    normalX: number;
    normalY: number;
  }

  const checkMouseCollision = useCallback((particle: Particle, mouseX: number, mouseY: number): CollisionInfo | null => {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Define interaction radius based on particle type - even tighter
    let interactionRadius = particle.radius;
    if (particle.type === "equation") {
      // Minimal buffer for equations - just enough to interact
      interactionRadius = particle.radius + 5;
    } else if (particle.type === "symbol") {
      interactionRadius = particle.radius + 3;
    } else {
      // Dots have minimal interaction radius
      interactionRadius = particle.radius + 2;
    }
    
    if (distance < interactionRadius) {
      return {
        isColliding: distance < particle.radius,
        distance,
        dx,
        dy,
        normalX: distance > 0 ? dx / distance : 1,
        normalY: distance > 0 ? dy / distance : 0
      };
    }
    
    return null;
  }, []);

  // Apply collision response
  const handleMouseCollision = useCallback((
    particle: Particle, 
    collision: CollisionInfo,
    strength: number = 0.5
  ) => {
    const { distance, normalX, normalY, isColliding } = collision;
    
    if (isColliding) {
      // Calculate mouse velocity for momentum transfer
      const mouseVx = mouseRef.current.x - prevMouseRef.current.x;
      const mouseVy = mouseRef.current.y - prevMouseRef.current.y;
      const mouseSpeed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy);
      
      // Position correction to prevent penetration - gentler
      const overlap = particle.radius - distance;
      if (overlap > 0) {
        particle.x += normalX * overlap * 0.8; // Push out of collision
        particle.y += normalY * overlap * 0.8;
      }
      
      // More natural momentum transfer based on mouse movement
      if (mouseSpeed > 0.1) { // Only transfer momentum if mouse is actually moving
        // Calculate relative velocity
        const relativeVx = mouseVx - particle.vx;
        const relativeVy = mouseVy - particle.vy;
        
        // Dot product for momentum transfer in collision direction
        const dotProduct = (relativeVx * normalX + relativeVy * normalY);
        
        // Only transfer momentum if moving towards particle
        if (dotProduct < 0) {
          const impactForce = Math.min(mouseSpeed * 0.3, 2.0) * strength;
          
          // Apply force based on collision dynamics
          const elasticity = 0.7; // How bouncy the collision is
          const friction = 0.3; // How much tangential velocity is transferred
          
          // Normal impulse (bounce)
          particle.vx += normalX * impactForce * Math.abs(dotProduct) * elasticity;
          particle.vy += normalY * impactForce * Math.abs(dotProduct) * elasticity;
          
          // Tangential impulse (dragging/friction)
          const tangentX = -normalY;
          const tangentY = normalX;
          const tangentialMouseV = mouseVx * tangentX + mouseVy * tangentY;
          
          particle.vx += tangentX * tangentialMouseV * friction;
          particle.vy += tangentY * tangentialMouseV * friction;
          
          // Direct momentum transfer in mouse direction
          particle.vx += mouseVx * 0.15;
          particle.vy += mouseVy * 0.15;
        }
      }
      
      // Very subtle bounce to prevent sticking
      particle.vx += normalX * 0.2;
      particle.vy += normalY * 0.2;
      
      // Add smooth rotation impulse for equations and symbols
      if (particle.type === 'symbol') {
        // Very small rotation impulse for symbols
        const rotationImpulse = (Math.random() - 0.5) * 0.02 * strength;
        particle.rotationSpeed += rotationImpulse;
      } else if (particle.type === 'equation') {
        const eqParticle = particle as EquationParticle;
        
        // Calculate rotation based on glancing angle of impact
        const crossProduct = (mouseVx * normalY - mouseVy * normalX); // How much the hit is glancing
        
        // Add rotation based on how off-center the hit is
        const rotationImpulse = crossProduct * 0.15; // Much stronger impulse
        particle.rotationSpeed += rotationImpulse;
        
        // Add some random rotation to make it more dynamic
        particle.rotationSpeed += (Math.random() - 0.5) * 0.03;
        
        // Remove smoothing - let it spin freely
        // particle.rotationSpeed *= 0.98;
        
        // Clamp rotation speed to prevent wild spinning
        const maxRotSpeed = 0.2; // Even higher max rotation speed
        particle.rotationSpeed = Math.max(-maxRotSpeed, Math.min(maxRotSpeed, particle.rotationSpeed));
      }
      
      // Very subtle visual feedback
      particle.targetOpacity = Math.min(particle.targetOpacity + 0.1, particle.targetOpacity * 1.2);
    } else {
      // Soft repulsion field - very localized around mouse
      const repulsionRadius = particle.radius + 5; // Very tight field
      if (distance < repulsionRadius) {
        // Use exponential falloff for sharp localization
        const normalizedDist = distance / repulsionRadius;
        const repulsionStrength = Math.exp(-normalizedDist * 5); // Sharp exponential decay
        const repulsionForce = repulsionStrength * 0.2 * strength; // Very subtle force
        
        particle.vx += normalX * repulsionForce;
        particle.vy += normalY * repulsionForce;
        
        // Extremely subtle rotation effect in repulsion field
        if (particle.type === 'equation' && repulsionStrength > 0.5) {
          // Don't slow down rotation - let it continue spinning
          // particle.rotationSpeed *= 0.98;
        }
      }
    }
    
    // Clamp velocities to prevent particles from going too fast
    const maxVelocity = particle.type === 'equation' ? 5 : 3;
    particle.vx = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vx));
    particle.vy = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vy));
    
    // Clamp rotation speed
    if (particle.type !== 'dot') {
      const maxRotationSpeed = 0.2; // Match the equation max speed
      particle.rotationSpeed = Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, particle.rotationSpeed));
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;
    
    // Update FPS counter
    frameCountRef.current++;
    if (currentTime - lastFpsUpdateRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = currentTime;
      
      // FPS tracking for internal monitoring only
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mouse glow effect
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    
    // Update previous mouse position for next frame
    prevMouseRef.current = { ...mouseRef.current };
    
    // Create radial gradient for mouse glow
    const glowRadius = 200;
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
    gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.05)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw connection lines BEFORE particles so they appear behind
    const connectionDistance = 200;
    // Collect dot references without allocating a new filtered array each frame
    const dots: Particle[] = [];
    for (let i = 0; i < particlesRef.current.length; i++) {
      if (particlesRef.current[i].type === "dot") dots.push(particlesRef.current[i]);
    }
    
    ctx.save();
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = Math.pow(1 - distance / connectionDistance, 2) * 0.6; // Non-linear falloff
          ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
          ctx.lineWidth = Math.max(0.5, opacity * 2); // Variable line width
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update rotation
      if (particle.type === "equation") {
        const eqParticle = particle as EquationParticle;
        
        // Apply rotation without bounds checking for natural motion
        particle.rotation += particle.rotationSpeed;
        
        // Keep rotation in reasonable range without hard reversals
        if (Math.abs(particle.rotation) > Math.PI * 2) {
          particle.rotation = particle.rotation % (Math.PI * 2);
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
          
          // Give all particles new random velocity to keep things interesting
          if (particle.type === "symbol") {
            particle.vx = (Math.random() - 0.5) * 1.0;
            particle.vy = (Math.random() - 0.5) * 1.0;
          } else if (particle.type === "dot") {
            particle.vx = (Math.random() - 0.5) * 0.6;
            particle.vy = (Math.random() - 0.5) * 0.6;
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

      // Calculate distance to mouse for highlighting
      const distToMouse = Math.sqrt(
        Math.pow(particle.x - mouseX, 2) + 
        Math.pow(particle.y - mouseY, 2)
      );
      const mouseEffect = Math.max(0, 1 - distToMouse / glowRadius);
      
      // Apply mouse collision if enabled - optimize by only checking nearby particles
      if (enableMouseCollision && distToMouse < 150) { // Only check if within reasonable distance
        const collision = checkMouseCollision(particle, mouseX, mouseY);
        if (collision) {
          handleMouseCollision(particle, collision, collisionStrength);
          
          // Track equation collision easter egg
          if (particle.type === 'equation' && !hasTriggeredEquationCollision.current && isFunMode) {
            hasTriggeredEquationCollision.current = true;
            discoverEgg(EASTER_EGGS.EQUATION_COLLISION);
          }
        }
      }
      
      // Apply velocity damping for smoother motion
      particle.vx *= 0.997; // Reduced friction for better movement
      particle.vy *= 0.997;
      if (particle.type !== 'dot') {
        particle.rotationSpeed *= 0.995; // Even less rotational damping to keep spinning
      }

      // Ensure minimum velocity for all particles to prevent stagnation
      let minVelocity = 0.2; // Base minimum for all particles
      if (particle.type === "equation") {
        minVelocity = 0.5; // Higher minimum for equations
        
        // Ensure equations always have some rotation
        if (Math.abs(particle.rotationSpeed) < 0.01) {
          particle.rotationSpeed = (Math.random() - 0.5) * 0.03;
        }
      } else if (particle.type === "symbol") {
        minVelocity = 0.3; // Medium minimum for symbols
      }
      
      // Apply minimum velocity with some randomness to prevent stuck patterns
      if (Math.abs(particle.vx) < minVelocity) {
        particle.vx = Math.sign(particle.vx || (Math.random() - 0.5)) * minVelocity;
        // Add small random perturbation
        particle.vx += (Math.random() - 0.5) * 0.1;
      }
      if (Math.abs(particle.vy) < minVelocity) {
        particle.vy = Math.sign(particle.vy || (Math.random() - 0.5)) * minVelocity;
        // Add small random perturbation
        particle.vy += (Math.random() - 0.5) * 0.1;
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity + mouseEffect * 0.2; // Brighten near mouse
      
      switch (particle.type) {
        case "dot":
          ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "symbol":
          const symbolParticle = particle as SymbolParticle;
          const maxFontSize = 16; // Reduced max size
          const actualFontSize = Math.min(symbolParticle.fontSize, maxFontSize);
          
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.fillStyle = `rgba(34, 197, 94, ${particle.opacity})`;
          ctx.font = `${actualFontSize}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(symbolParticle.symbol, 0, 0);
          break;

        case "equation":
          if (particle.image && particle.equation) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            
            // Add pulsing effect for hint particle
            if ((particle as any).isHintParticle) {
              const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1;
              const glowRadius = 30 * pulse;
              const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
              gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
              gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
              ctx.fillStyle = gradient;
              ctx.fillRect(-glowRadius, -glowRadius, glowRadius * 2, glowRadius * 2);
            }
            
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

    // Reset global alpha
    ctx.globalAlpha = 1;

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [createEquationParticle, isOffScreen, enableMouseCollision, checkMouseCollision, handleMouseCollision, collisionStrength, isFunMode, discoverEgg]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      // Only update if dimensions actually changed
      if (canvas.width === newWidth && canvas.height === newHeight) {
        return;
      }
      
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      
      // Update canvas dimensions (this clears the canvas)
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Only reinitialize if we don't have particles yet
      if (particlesRef.current.length === 0) {
        initializeParticles();
      } else {
        // Scale particle positions to new canvas size
        const widthRatio = newWidth / oldWidth;
        const heightRatio = newHeight / oldHeight;
        
        particlesRef.current.forEach(particle => {
          particle.x *= widthRatio;
          particle.y *= heightRatio;
        });
      }
    };

    // Initial setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
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
    let mounted = true;
    
    const startAnimation = async () => {
      if (!mounted) return;
      await initializeParticles();
      if (!mounted) return;
      animate();
    };

    startAnimation();

    return () => {
      mounted = false;
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
        className={cn(
          "pointer-events-none", // Always disable pointer events on canvas
          className
        )}
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