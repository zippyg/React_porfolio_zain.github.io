"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useEasterEggs, EASTER_EGGS } from "@/contexts/easter-egg-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DOMParticleSystemV2 } from "@/utils/dom-particle-system-v2";
import { BlackHoleRendererV2 } from "@/utils/black-hole-renderer-v2";

type AnimationPhase = 
  | "IDLE"
  | "TRIGGERED"
  | "GRID_BRIGHTEN"
  | "BLACK_HOLE_FORM"
  | "WARPING"
  | "SUCKING"
  | "BLACK"
  | "MESSAGE"
  | "SUPERNOVA"
  | "RESTORING";

interface BlackHoleEasterEggProps {
  torchEnabled: boolean;
  trigger?: boolean;
  clickPosition?: { x: number; y: number };
  className?: string;
  onAnimationComplete?: () => void;
}

interface ClickEvent {
  x: number;
  y: number;
  timestamp: number;
}

// Constants
const CONSECUTIVE_CLICK_THRESHOLD = 6;
const CLICK_TIME_WINDOW = 300; // ms - match the double-click timing
const EVENT_HORIZON_RADIUS = 80;

export function BlackHoleEasterEgg({ torchEnabled, trigger, clickPosition, className, onAnimationComplete }: BlackHoleEasterEggProps) {
  const { isFunMode } = useFunMode();
  const { discoverEgg, discoveredEggs } = useEasterEggs();
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("IDLE");
  const [blackHolePosition, setBlackHolePosition] = useState({ x: 0, y: 0 });
  const [showMessage, setShowMessage] = useState(false);
  const [blackHoleMass, setBlackHoleMass] = useState(0);
  
  const hasTriggeredRef = useRef(false);
  const domParticleSystemRef = useRef<DOMParticleSystemV2 | null>(null);
  const phaseTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  // Animation sequence manager (defined first)
  const startAnimationSequence = useCallback(() => {
    console.log("🎬 Starting animation sequence");
    
    // Clear any existing timeouts
    phaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    phaseTimeoutsRef.current = [];

    const sequence = [
      { phase: "GRID_BRIGHTEN" as AnimationPhase, duration: 1500, mass: 0.1 },
      { phase: "BLACK_HOLE_FORM" as AnimationPhase, duration: 2000, mass: 0.3 },
      { phase: "WARPING" as AnimationPhase, duration: 2500, mass: 0.8 },
      { phase: "SUCKING" as AnimationPhase, duration: 4000, mass: 2.0 },
      { phase: "BLACK" as AnimationPhase, duration: 1000, mass: 3.0 },
      { phase: "MESSAGE" as AnimationPhase, duration: 4000, mass: 0 },
      { phase: "SUPERNOVA" as AnimationPhase, duration: 2000, mass: -1.0 },
      { phase: "RESTORING" as AnimationPhase, duration: 1500, mass: 0 },
    ];

    let delay = 0;
    sequence.forEach(({ phase, duration, mass }, index) => {
      const timeout = setTimeout(() => {
        console.log(`Animation phase ${index + 1}/${sequence.length}: ${phase}`);
        setAnimationPhase(phase);
        setBlackHoleMass(mass);
        
        if (phase === "SUCKING") {
          // Initialize DOM particle system
          if (!domParticleSystemRef.current) {
            domParticleSystemRef.current = new DOMParticleSystemV2();
          }
          domParticleSystemRef.current.captureElements();
          domParticleSystemRef.current.start({
            x: blackHolePosition.x,
            y: blackHolePosition.y,
            mass: 2.0,
            eventHorizonRadius: EVENT_HORIZON_RADIUS
          });
        } else if (phase === "MESSAGE") {
          setShowMessage(true);
          discoverEgg(EASTER_EGGS.FINAL_SECRET);
        } else if (phase === "SUPERNOVA") {
          // Trigger supernova effect
          if (domParticleSystemRef.current) {
            domParticleSystemRef.current.createSupernova({
              x: blackHolePosition.x,
              y: blackHolePosition.y,
              mass: 0,
              eventHorizonRadius: EVENT_HORIZON_RADIUS
            });
          }
        } else if (phase === "RESTORING") {
          // Reset everything
          setTimeout(() => {
            setAnimationPhase("IDLE");
            setShowMessage(false);
            setBlackHoleMass(0);
            hasTriggeredRef.current = false;
            
            // Clean up DOM particle system
            if (domParticleSystemRef.current) {
              domParticleSystemRef.current.stop();
              domParticleSystemRef.current.restore();
              domParticleSystemRef.current = null;
            }
            
            // Restore scroll position and enable scrolling
            document.body.style.overflow = '';
            window.scrollTo(scrollPositionRef.current.x, scrollPositionRef.current.y);
            
            // Call completion callback
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }, duration);
        }
      }, delay);
      
      phaseTimeoutsRef.current.push(timeout);
      delay += duration;
    });
  }, [blackHolePosition, discoverEgg, onAnimationComplete]);

  // Trigger the black hole animation
  const triggerBlackHole = useCallback((lastClick: ClickEvent) => {
    console.log("🌌 Black hole animation triggered!");
    console.log("Click position:", lastClick);
    
    // Store current scroll position
    scrollPositionRef.current = {
      x: window.scrollX,
      y: window.scrollY
    };
    
    setBlackHolePosition({ x: lastClick.x, y: lastClick.y });
    setAnimationPhase("TRIGGERED");
    console.log("Animation phase set to TRIGGERED");
    
    // Disable scrolling during animation
    document.body.style.overflow = 'hidden';
    
    // Start animation sequence
    startAnimationSequence();
  }, [startAnimationSequence]);

  // Watch for trigger from parent component
  useEffect(() => {
    console.log('=== BlackHoleEasterEgg Debug ===');
    console.log('Trigger prop:', trigger);
    console.log('Has triggered before:', hasTriggeredRef.current);
    console.log('Animation phase:', animationPhase);
    console.log('Final secret discovered:', discoveredEggs.has(EASTER_EGGS.FINAL_SECRET));
    
    if (trigger && !hasTriggeredRef.current && animationPhase === "IDLE") {
      // Check if final secret is already discovered
      if (discoveredEggs.has(EASTER_EGGS.FINAL_SECRET)) {
        console.log('Final secret already discovered, skipping');
        return;
      }
      
      console.log('🎯 TRIGGERING BLACK HOLE ANIMATION!');
      hasTriggeredRef.current = true;
      const position = clickPosition || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      
      // Small delay to ensure state updates properly
      setTimeout(() => {
        triggerBlackHole({ x: position.x, y: position.y, timestamp: Date.now() });
      }, 0);
    }
  }, [trigger, animationPhase, clickPosition, discoveredEggs, triggerBlackHole]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      phaseTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      
      // Clean up DOM particle system
      if (domParticleSystemRef.current) {
        domParticleSystemRef.current.stop();
        domParticleSystemRef.current.restore();
      }
    };
  }, []);

  if (animationPhase === "IDLE") {
    console.log("BlackHoleEasterEgg not rendering - phase is IDLE");
    return null;
  }

  console.log("BlackHoleEasterEgg rendering with phase:", animationPhase);
  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)} style={{ zIndex: 9999 }}>
      {/* Canvas for Three.js black hole effect */}
      {animationPhase !== "BLACK" && animationPhase !== "MESSAGE" && (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ alpha: true, antialias: true }}
          >
            <BlackHoleScene
              phase={animationPhase}
              blackHolePosition={blackHolePosition}
              mass={blackHoleMass}
            />
          </Canvas>
        </div>
      )}

      {/* Black screen overlay */}
      <AnimatePresence>
        {(animationPhase === "BLACK" || animationPhase === "MESSAGE") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>

      {/* Completion message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.5,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
              >
                <motion.h1
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.3)",
                      "0 0 30px rgba(255,255,255,0.5)",
                      "0 0 10px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-5xl md:text-7xl font-mono text-white/40 mb-6 tracking-[0.3em] font-light"
                  style={{ 
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.3em"
                  }}
                >
                  SYSTEM BREACH
                </motion.h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-block border border-white/20 px-8 py-4">
                  <p className="text-3xl md:text-4xl font-mono text-green-500/80 mb-2">
                    EASTER EGGS COMPLETED
                  </p>
                  <p className="text-5xl md:text-6xl font-mono text-green-500">
                    5/5
                  </p>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="text-sm md:text-base font-mono text-white/30 tracking-widest uppercase"
              >
                Reality Matrix Restored • Simulation Stable
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ 
                  delay: 2,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
              >
                <p className="text-xs font-mono text-white/20">
                  [ INITIATING SUPERNOVA ]
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supernova flash effect */}
      <AnimatePresence>
        {animationPhase === "SUPERNOVA" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.2, 1] }}
            className="absolute inset-0 bg-white mix-blend-screen"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Three.js scene component
function BlackHoleScene({ phase, blackHolePosition, mass }: {
  phase: AnimationPhase;
  blackHolePosition: { x: number; y: number };
  mass: number;
}) {
  const { size, scene } = useThree();
  const rendererRef = useRef<BlackHoleRendererV2 | null>(null);
  const supernovaTriggeredRef = useRef(false);

  // Initialize renderer
  useEffect(() => {
    if (!scene) return;

    rendererRef.current = new BlackHoleRendererV2(scene, {
      gridSize: 80, // Larger grid to cover full screen
      gridDivisions: 150, // More divisions for finer grid
      blackHoleRadius: 0.8,
      accretionDiskRadius: 3
    });

    // Convert screen coordinates to Three.js world coordinates
    const worldX = (blackHolePosition.x / size.width - 0.5) * 10;
    const worldY = -(blackHolePosition.y / size.height - 0.5) * 10;
    const worldPos = new THREE.Vector3(worldX, worldY, 0);

    // Create components based on phase
    if (phase === "GRID_BRIGHTEN" || phase === "BLACK_HOLE_FORM" || phase === "WARPING" || phase === "SUCKING") {
      rendererRef.current.createSpacetimeGrid(worldPos, mass);
    }

    if (phase === "BLACK_HOLE_FORM" || phase === "WARPING" || phase === "SUCKING") {
      rendererRef.current.createBlackHole(worldPos);
    }

    if (phase === "WARPING" || phase === "SUCKING") {
      rendererRef.current.createAccretionDisk(worldPos);
      rendererRef.current.createParticleSystem(worldPos, 1500);
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      supernovaTriggeredRef.current = false;
    };
  }, [phase, blackHolePosition, size, mass, scene]);

  // Update animation
  useFrame((state, delta) => {
    if (!rendererRef.current) return;

    rendererRef.current.setMass(mass);
    
    // Update grid opacity based on phase
    let gridOpacity = 0.3;
    
    if (phase === "GRID_BRIGHTEN") {
      gridOpacity = 0.3 + (state.clock.elapsedTime % 2) * 0.5; // Pulse grid
    } else if (phase === "BLACK_HOLE_FORM") {
      gridOpacity = 0.8;
    } else if (phase === "WARPING") {
      gridOpacity = 1.0;
    } else if (phase === "SUCKING") {
      gridOpacity = 0.8;
    } else if (phase === "SUPERNOVA") {
      gridOpacity = 2.0; // Extra bright for explosion
      
      // Trigger supernova effect once
      if (!supernovaTriggeredRef.current) {
        supernovaTriggeredRef.current = true;
        rendererRef.current.createSupernova();
      }
    }
    
    rendererRef.current.setGridOpacity(gridOpacity);
    rendererRef.current.update(delta, state.clock.elapsedTime);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={1} />
    </>
  );
}