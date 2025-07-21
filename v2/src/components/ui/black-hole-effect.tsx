"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { BlackHoleVortex } from "@/utils/black-hole-vortex";
import { useEasterEggs, EASTER_EGGS } from "@/contexts/easter-egg-context";

interface BlackHoleEffectProps {
  trigger: boolean;
  position: { x: number; y: number };
  onComplete: () => void;
}

export function BlackHoleEffect({ trigger, position, onComplete }: BlackHoleEffectProps) {
  const [phase, setPhase] = useState<"idle" | "warping" | "sucking" | "message" | "restoring">("idle");
  const [showMessage, setShowMessage] = useState(false);
  const vortexRef = useRef<BlackHoleVortex | null>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);
  const gridOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const { discoverEgg } = useEasterEggs();
  const capturedElementsRef = useRef<Array<{
    element: HTMLElement;
    originalTransform: string;
    originalTransition: string;
    originalOpacity: string;
  }>>([]);

  useEffect(() => {
    if (trigger && phase === "idle") {
      startBlackHoleSequence();
    }
  }, [trigger, phase]);

  const startBlackHoleSequence = async () => {
    console.log("🌌 Starting elegant black hole sequence");
    
    // Disable scanline by hiding the mouse glow temporarily
    const mouseGlowCanvas = document.querySelector('canvas[style*="z-index: 1"]') as HTMLCanvasElement;
    if (mouseGlowCanvas) {
      mouseGlowCanvas.style.display = 'none';
    }

    // Phase 1: Grid brightening and warping
    setPhase("warping");
    await createGridWarpEffect();
    
    // Phase 2: Black hole formation and DOM element capture
    setPhase("sucking");
    await captureAndAnimateDOMElements();
    
    // Phase 3: Show message
    setPhase("message");
    setShowMessage(true);
    discoverEgg(EASTER_EGGS.FINAL_SECRET);
    await new Promise(resolve => setTimeout(resolve, 6000)); // Increased wait time
    
    // Phase 4: Supernova and restore
    setPhase("restoring");
    await restoreEverything();
    
    // Re-enable scanline
    if (mouseGlowCanvas) {
      mouseGlowCanvas.style.display = '';
    }
    
    // Cleanup
    setPhase("idle");
    setShowMessage(false);
    onComplete();
  };

  const createGridWarpEffect = async () => {
    // Create overlay canvas for grid distortion effect
    const canvas = document.createElement('canvas');
    // Make canvas larger than viewport to avoid edge gaps
    canvas.width = window.innerWidth + 400;
    canvas.height = window.innerHeight + 400;
    canvas.style.position = 'fixed';
    canvas.style.top = '-200px';
    canvas.style.left = '-200px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9997';
    document.body.appendChild(canvas);
    gridOverlayRef.current = canvas;
    
    const ctx = canvas.getContext('2d')!;
    const gridSize = 50;
    
    // Animate grid warping with continuous rotation
    const timeline = gsap.timeline();
    const warpState = { 
      strength: 0,
      rotation: 0,
      spiralIntensity: 0
    };
    
    timeline
      .to(warpState, {
        strength: 300,
        spiralIntensity: 1,
        duration: 3,
        ease: "power2.in"
      })
      .to(warpState, {
        rotation: Math.PI * 6, // 3 full rotations
        duration: 4,
        ease: "none",
        onUpdate: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.lineWidth = 1;
          
          // Adjust position for canvas offset
          const adjustedX = position.x + 200;
          const adjustedY = position.y + 200;
          
          // Draw warped grid - vertical lines
          // Use adaptive spacing - denser near black hole
          const drawVerticalLines = () => {
            // Create denser grid lines near the black hole
            const lines = [];
            
            // Add lines with varying density based on distance from black hole
            for (let x = -400; x < canvas.width + 400; x += 50) {
              lines.push(x);
              
              // Add extra lines near the black hole
              const distToCenter = Math.abs(x - adjustedX);
              if (distToCenter < 200) {
                const density = 1 - (distToCenter / 200);
                const extraLines = Math.floor(density * 4);
                for (let i = 1; i <= extraLines; i++) {
                  lines.push(x + (50 / (extraLines + 1)) * i);
                }
              }
            }
            
            lines.sort((a, b) => a - b);
            
            for (const x of lines) {
              ctx.beginPath();
              let firstPoint = true;
              let prevDepth = 0;
              
              for (let y = -400; y < canvas.height + 400; y += 3) {
                const warpedPoint = applyGravitationalLensing(
                  x, y, adjustedX, adjustedY, 
                  warpState.strength, warpState.rotation, warpState.spiralIntensity
                );
                
                // Color based on depth and distance
                const depth = warpedPoint.depth || 0;
                const dist = Math.sqrt(Math.pow(x - adjustedX, 2) + Math.pow(y - adjustedY, 2));
                
                // Skip if too close to singularity
                if (dist < 30) continue;
                
                // Interpolate color based on spacetime curvature depth
                let opacity = 0.8 - depth * 0.3;
                if (depth > 0.5) {
                  // Deep in the gravity well - orange glow
                  ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`;
                } else if (depth > 0.2) {
                  // Transition zone
                  const mixFactor = (depth - 0.2) / 0.3;
                  const r = Math.round(34 + (251 - 34) * mixFactor);
                  const g = Math.round(197 + (146 - 197) * mixFactor);
                  const b = Math.round(94 + (60 - 94) * mixFactor);
                  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                  // Far field - normal green
                  ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
                }
                
                // Vary line width based on depth gradient
                ctx.lineWidth = 1 + Math.abs(depth - prevDepth) * 20;
                prevDepth = depth;
                
                if (firstPoint) {
                  ctx.moveTo(warpedPoint.x, warpedPoint.y);
                  firstPoint = false;
                } else {
                  ctx.lineTo(warpedPoint.x, warpedPoint.y);
                }
              }
              ctx.stroke();
            }
          };
          
          drawVerticalLines();
          
          // Draw warped grid - horizontal lines
          const drawHorizontalLines = () => {
            // Create denser grid lines near the black hole
            const lines = [];
            
            // Add lines with varying density based on distance from black hole
            for (let y = -400; y < canvas.height + 400; y += 50) {
              lines.push(y);
              
              // Add extra lines near the black hole
              const distToCenter = Math.abs(y - adjustedY);
              if (distToCenter < 200) {
                const density = 1 - (distToCenter / 200);
                const extraLines = Math.floor(density * 4);
                for (let i = 1; i <= extraLines; i++) {
                  lines.push(y + (50 / (extraLines + 1)) * i);
                }
              }
            }
            
            lines.sort((a, b) => a - b);
            
            for (const y of lines) {
              ctx.beginPath();
              let firstPoint = true;
              let prevDepth = 0;
              
              for (let x = -400; x < canvas.width + 400; x += 3) {
                const warpedPoint = applyGravitationalLensing(
                  x, y, adjustedX, adjustedY, 
                  warpState.strength, warpState.rotation, warpState.spiralIntensity
                );
                
                // Color based on depth and distance
                const depth = warpedPoint.depth || 0;
                const dist = Math.sqrt(Math.pow(x - adjustedX, 2) + Math.pow(y - adjustedY, 2));
                
                // Skip if too close to singularity
                if (dist < 30) continue;
                
                // Interpolate color based on spacetime curvature depth
                let opacity = 0.8 - depth * 0.3;
                if (depth > 0.5) {
                  // Deep in the gravity well - orange glow
                  ctx.strokeStyle = `rgba(251, 146, 60, ${opacity})`;
                } else if (depth > 0.2) {
                  // Transition zone
                  const mixFactor = (depth - 0.2) / 0.3;
                  const r = Math.round(34 + (251 - 34) * mixFactor);
                  const g = Math.round(197 + (146 - 197) * mixFactor);
                  const b = Math.round(94 + (60 - 94) * mixFactor);
                  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                } else {
                  // Far field - normal green
                  ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
                }
                
                // Vary line width based on depth gradient
                ctx.lineWidth = 1 + Math.abs(depth - prevDepth) * 20;
                prevDepth = depth;
                
                if (firstPoint) {
                  ctx.moveTo(warpedPoint.x, warpedPoint.y);
                  firstPoint = false;
                } else {
                  ctx.lineTo(warpedPoint.x, warpedPoint.y);
                }
              }
              ctx.stroke();
            }
          };
          
          drawHorizontalLines();
          
          // Add increasing opacity fade near black hole
          const gradient = ctx.createRadialGradient(
            adjustedX, adjustedY, 0,
            adjustedX, adjustedY, 150
          );
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }, 0);
    
    // Create black hole vortex
    vortexRef.current = new BlackHoleVortex();
    vortexRef.current.start({
      centerX: position.x,
      centerY: position.y,
      radius: 150,
      strength: 10,
      duration: 4000
    });
    
    await timeline.play();
  };

  const applyGravitationalLensing = (
    x: number, y: number, 
    centerX: number, centerY: number, 
    strength: number, rotation: number, spiralIntensity: number
  ) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1) return { x: centerX, y: centerY };
    
    // Schwarzschild radius (event horizon)
    const rs = 50; // Visual event horizon radius
    
    // Gravitational potential follows 1/r (infinite range)
    // But we cap the minimum distance to avoid singularity
    const safeDistance = Math.max(distance, rs);
    
    // Gravitational strength with proper falloff
    // Using modified Schwarzschild metric for visual effect
    const gravitationalStrength = strength * (rs / safeDistance);
    
    // Calculate the "depth" of spacetime curvature
    // This creates the fabric dip effect
    const curvatureDepth = gravitationalStrength / (1 + distance / 100);
    
    // Radial compression - space gets compressed near the black hole
    // This follows the actual spacetime metric around a black hole
    const radialCompression = 1 - (curvatureDepth / (1 + Math.pow(distance / rs, 2)));
    
    // Angular distortion - frame dragging effect (Kerr metric)
    const angle = Math.atan2(dy, dx);
    const frameDragging = rotation * Math.pow(rs / safeDistance, 2) * spiralIntensity;
    
    // Tidal stretching perpendicular to radial direction
    const tidalFactor = 1 + (0.1 * gravitationalStrength / distance);
    
    // Apply the transformations
    const warpedDistance = distance * radialCompression;
    const warpedAngle = angle + frameDragging;
    
    // Add spiral infall for matter close to event horizon
    const inwardSpiral = distance < rs * 3 ? 
      spiralIntensity * 0.1 * Math.pow((rs * 3 - distance) / (rs * 2), 2) : 0;
    
    return {
      x: centerX + Math.cos(warpedAngle) * (warpedDistance - inwardSpiral),
      y: centerY + Math.sin(warpedAngle) * (warpedDistance - inwardSpiral),
      // Return depth for 3D effect visualization
      depth: curvatureDepth
    };
  };

  const captureAndAnimateDOMElements = async () => {
    // Select elements to capture
    const selectors = [
      'h1', 'h2', 'h3', 'p', 'button', 'a',
      '.glow-card', '.project-tile', '.research-tile',
      'nav', 'section > div'
    ];
    
    const elements = document.querySelectorAll(selectors.join(', '));
    const timeline = gsap.timeline();
    
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      const rect = element.getBoundingClientRect();
      
      // Skip if out of viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      
      // Store original values
      capturedElementsRef.current.push({
        element,
        originalTransform: element.style.transform || '',
        originalTransition: element.style.transition || '',
        originalOpacity: element.style.opacity || ''
      });
      
      // Calculate distance and angle to black hole
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = position.x - centerX;
      const dy = position.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Stagger the animation based on distance
      const delay = distance / 1000;
      
      timeline.to(element, {
        x: dx,
        y: dy,
        scale: 0,
        rotation: 720,
        opacity: 0,
        duration: 2,
        delay: delay,
        ease: "power3.in",
        force3D: true
      }, 0);
    });
    
    await timeline.play();
  };

  const restoreEverything = async () => {
    // Create supernova sequence
    const supernovaTimeline = gsap.timeline();
    
    // First, collapse the black hole
    if (blackHoleRef.current) {
      supernovaTimeline.to(blackHoleRef.current, {
        scale: 0.2,
        duration: 0.5,
        ease: "power2.in"
      });
    }
    
    // Create expanding shockwave
    const shockwave = document.createElement('div');
    shockwave.style.position = 'fixed';
    shockwave.style.left = position.x - 2 + 'px';
    shockwave.style.top = position.y - 2 + 'px';
    shockwave.style.width = '4px';
    shockwave.style.height = '4px';
    shockwave.style.borderRadius = '50%';
    shockwave.style.border = '2px solid white';
    shockwave.style.boxShadow = '0 0 20px white, inset 0 0 20px white';
    shockwave.style.pointerEvents = 'none';
    shockwave.style.zIndex = '10001';
    shockwave.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(shockwave);
    
    // Animate shockwave expansion
    supernovaTimeline.to(shockwave, {
      width: window.innerWidth * 2,
      height: window.innerWidth * 2,
      borderWidth: 20,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out"
    }, 0.5);
    
    // Supernova particles
    if (vortexRef.current) {
      vortexRef.current.supernova();
    }
    
    // Multiple flash effects
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'white';
    flash.style.opacity = '0';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '10000';
    flash.style.mixBlendMode = 'screen';
    document.body.appendChild(flash);
    
    supernovaTimeline.to(flash, {
      opacity: 1,
      duration: 0.1,
      ease: "power2.out"
    }, 0.5)
    .to(flash, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    })
    .to(flash, {
      opacity: 0.8,
      duration: 0.1,
      ease: "power2.out"
    })
    .to(flash, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        flash.remove();
        shockwave.remove();
      }
    });
    
    await supernovaTimeline.play();
    
    // Restore all elements with staggered elastic effect
    const restoreTimeline = gsap.timeline();
    
    capturedElementsRef.current.forEach((item, index) => {
      // Elements emerge from the supernova point
      const angle = (Math.PI * 2 * index) / capturedElementsRef.current.length;
      const distance = 100 + Math.random() * 200;
      
      gsap.set(item.element, {
        x: position.x - item.element.getBoundingClientRect().left + Math.cos(angle) * distance,
        y: position.y - item.element.getBoundingClientRect().top + Math.sin(angle) * distance,
        scale: 0,
        opacity: 0
      });
      
      restoreTimeline.to(item.element, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: item.originalOpacity || 1,
        duration: 1.5,
        delay: index * 0.02,
        ease: "elastic.out(1, 0.5)",
        clearProps: "all",
        onComplete: () => {
          item.element.style.transform = item.originalTransform;
          item.element.style.transition = item.originalTransition;
        }
      }, 0);
    });
    
    // Remove grid overlay
    if (gridOverlayRef.current) {
      gsap.to(gridOverlayRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: () => gridOverlayRef.current?.remove()
      });
    }
    
    await restoreTimeline.play();
    
    // Cleanup
    capturedElementsRef.current = [];
    if (vortexRef.current) {
      vortexRef.current.dispose();
      vortexRef.current = null;
    }
  };

  if (phase === "idle") return null;

  return (
    <>
      {/* Black hole visual */}
      <AnimatePresence>
        {(phase === "warping" || phase === "sucking") && (
          <motion.div
            ref={blackHoleRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed pointer-events-none"
            style={{
              left: position.x - 100,
              top: position.y - 100,
              width: 200,
              height: 200,
              zIndex: 9999
            }}
          >
            <div className="relative w-full h-full">
              {/* Event horizon */}
              <div className="absolute inset-0 rounded-full bg-black shadow-[0_0_100px_rgba(0,0,0,0.9)]" />
              
              {/* Orange accretion disk */}
              <div className="absolute inset-[-60%] rounded-full animate-spin-slow">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 opacity-80 blur-2xl" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-r from-orange-500 via-transparent to-orange-500 opacity-60 blur-xl" />
              </div>
              
              {/* Inner hot glow */}
              <div className="absolute inset-[-20%] rounded-full bg-gradient-radial from-yellow-500/30 via-orange-500/20 to-transparent blur-3xl animate-pulse" />
              
              {/* Green particle streams */}
              <div className="absolute inset-[-40%] rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}>
                <div className="absolute inset-12 rounded-full bg-gradient-to-r from-green-500/30 via-transparent to-green-500/30 blur-lg" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Black screen and message */}
      <AnimatePresence>
        {phase === "message" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black z-[10000] flex items-center justify-center"
          >
            {showMessage && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-7xl font-mono text-white/40 mb-6 tracking-[0.3em] font-light">
                  SYSTEM BREACH
                </h1>
                
                <div className="inline-block border border-white/20 px-8 py-4 mb-8">
                  <p className="text-3xl md:text-4xl font-mono text-green-500/80 mb-2">
                    EASTER EGGS COMPLETED
                  </p>
                  <p className="text-5xl md:text-6xl font-mono text-green-500">
                    5/5
                  </p>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="text-sm md:text-base font-mono text-white/60 tracking-widest uppercase"
                >
                  Reality Matrix Restored • Simulation Stable
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}