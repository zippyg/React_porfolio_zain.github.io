"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useEasterEggs, EASTER_EGGS } from "@/contexts/easter-egg-context";

interface MouseGlowProps {
  className?: string;
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

interface ClickEffect {
  x: number;
  y: number;
  type: 'shear' | 'rotate' | 'scale' | 'wave' | 'dissolve' | 'ripple' | 'pulse';
  progress: number;
  timestamp: number;
}

export function MouseGlow({ className }: MouseGlowProps) {
  const { isFunMode } = useFunMode();
  const { discoverEgg } = useEasterEggs();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef<TrailPoint[]>([]);
  const glowTrailRef = useRef<TrailPoint[]>([]);
  const clickEffectsRef = useRef<ClickEffect[]>([]);
  const animationFrameRef = useRef<number>();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const torchEnabledRef = useRef(false);
  const lastClickTimeRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scanlineYRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const scrollYRef = useRef(0);
  const pageHeightRef = useRef(0);
  const funModeActivatedRef = useRef(0);
  const isProcessingClickRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const consecutiveClickCountRef = useRef(0);
  const multiClickModeRef = useRef(false);
  const [clickFeedback, setClickFeedback] = useState<{ count: number; show: boolean }>({ count: 0, show: false });
  const lastClickPositionRef = useRef({ x: 0, y: 0 });

  // Load initial torch state
  useEffect(() => {
    setMounted(true);
    if (isFunMode) {
      const saved = localStorage.getItem('torchEnabled');
      if (saved === 'true') {
        setTorchEnabled(true);
        torchEnabledRef.current = true;
      }
    }
  }, [isFunMode]);
  
  // Handle fun mode changes
  useEffect(() => {
    if (!mounted) return;
    
    if (!isFunMode) {
      if (torchEnabled) {
        setTorchEnabled(false);
        torchEnabledRef.current = false;
      }
      // Clear torch state from localStorage when exiting fun mode
      localStorage.removeItem('torchEnabled');
      // Clear all active effects
      trailRef.current = [];
      glowTrailRef.current = [];
      clickEffectsRef.current = [];
      // Remove no-select class
      document.body.classList.remove('no-select');
    } else {
      // Track when fun mode was activated
      funModeActivatedRef.current = Date.now();
      // When entering fun mode, restore torch state from localStorage
      const saved = localStorage.getItem('torchEnabled');
      if (saved === 'true') {
        setTorchEnabled(true);
        torchEnabledRef.current = true;
      }
    }
  }, [isFunMode, mounted]);
  
  // Add/remove no-select class based on torch state
  useEffect(() => {
    if (isFunMode && torchEnabled) {
      document.body.classList.add('no-select');
    } else {
      document.body.classList.remove('no-select');
    }
    
    return () => {
      document.body.classList.remove('no-select');
    };
  }, [isFunMode, torchEnabled]);

  // Sync ref with state and save to localStorage
  useEffect(() => {
    torchEnabledRef.current = torchEnabled;
    // Only save if in fun mode
    if (isFunMode) {
      localStorage.setItem('torchEnabled', torchEnabled.toString());
    }
  }, [torchEnabled, isFunMode]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { ...mouseRef.current };
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Only add trails in fun mode
      if (isFunMode) {
        // Add to trail (longer lasting)
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          opacity: 0.8,
          timestamp: Date.now()
        });
        
        // Add to glow trail
        glowTrailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          opacity: 0.3,
          timestamp: Date.now()
        });
        
        // Keep trail limited to 40 points (longer trail)
        if (trailRef.current.length > 40) {
          trailRef.current.shift();
        }
        
        // Keep glow trail limited to 15 points
        if (glowTrailRef.current.length > 15) {
          glowTrailRef.current.shift();
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Only handle clicks in fun mode
      if (!isFunMode) return;
      
      // Ignore clicks within 500ms of fun mode activation
      if (Date.now() - funModeActivatedRef.current < 500) return;
      
      // Prevent default to stop text selection
      e.preventDefault();
      
      // Only skip interactive elements, allow clicks on text/divs/etc
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.closest('.command-palette') || 
        target.closest('[role="dialog"]')
      ) {
        return;
      }
      
      const currentTime = Date.now();
      const timeSinceLastClick = currentTime - lastClickTimeRef.current;
      
      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      
      // Count rapid clicks
      if (timeSinceLastClick < 300) {
        consecutiveClickCountRef.current++;
      } else {
        consecutiveClickCountRef.current = 1;
      }
      
      lastClickTimeRef.current = currentTime;
      lastClickPositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Show visual feedback for clicks when torch is on
      if (torchEnabledRef.current) {
        setClickFeedback({ count: consecutiveClickCountRef.current, show: true });
        
        // Hide feedback after a delay
        setTimeout(() => {
          setClickFeedback(prev => ({ ...prev, show: false }));
        }, 2000);
        
        console.log(`Click count: ${consecutiveClickCountRef.current}`);
      }
      
      // Wait to see if more clicks are coming
      clickTimeoutRef.current = setTimeout(() => {
        const finalClickCount = consecutiveClickCountRef.current;
        
        // Process based on final click count
        if (finalClickCount === 1) {
          // Single click - toggle torch
          console.log('Single click - toggling torch');
          setTorchEnabled(prev => {
            const newValue = !prev;
            torchEnabledRef.current = newValue;
            // Discover easter egg when torch is first enabled
            if (newValue && isFunMode) {
              discoverEgg(EASTER_EGGS.TORCH_LIGHT);
            }
            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new Event('torchToggled'));
            return newValue;
          });
          
          // Add a pulse effect to indicate torch toggle
          clickEffectsRef.current.push({
            x: e.clientX,
            y: e.clientY,
            type: 'pulse',
            progress: 0,
            timestamp: Date.now()
          });
        } else if (finalClickCount === 2 && torchEnabledRef.current) {
          // Exactly 2 clicks = double-click effect (only when torch is on)
          const effectTypes: ClickEffect['type'][] = ['shear', 'rotate', 'scale', 'wave', 'dissolve', 'ripple'];
          const randomEffect = effectTypes[Math.floor(Math.random() * effectTypes.length)];
          
          clickEffectsRef.current.push({
            x: e.clientX,
            y: e.clientY,
            type: randomEffect,
            progress: 0,
            timestamp: Date.now()
          });
          
          console.log(`Applied ${randomEffect} effect!`);
          discoverEgg(EASTER_EGGS.DOUBLE_CLICK_WARP);
          
          if (clickEffectsRef.current.length > 5) {
            clickEffectsRef.current.shift();
          }
        }
        
        // Reset counter after processing
        consecutiveClickCountRef.current = 0;
        setClickFeedback({ count: 0, show: false });
      }, 300); // Wait 300ms to see if more clicks come
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const updatePageHeight = () => {
      pageHeightRef.current = document.body.scrollHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updatePageHeight);
    
    // Initial values
    handleScroll();
    updatePageHeight();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePageHeight);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isFunMode, discoverEgg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pageHeightRef.current = document.body.scrollHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update page height and scroll in case they changed
      scrollYRef.current = window.scrollY;
      pageHeightRef.current = document.body.scrollHeight;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const gridSize = 50;
      
      // Update scanline position based on time (relative to full page height)
      const elapsed = Date.now() - startTimeRef.current;
      const scanlineSpeed = 0.12; // pixels per millisecond (tripled from original)
      const pageHeight = pageHeightRef.current || canvas.height;
      const scanlineHeight = 500; // Increased from 300px
      
      // Calculate position relative to full page
      const pagePosition = (elapsed * scanlineSpeed) % (pageHeight + scanlineHeight);
      
      // Adjust for current scroll position to get screen position
      const scanlineY = pagePosition - scrollYRef.current - (scanlineHeight / 2);

      // First, draw the base grid very faintly (always visible)
      ctx.lineWidth = 1;
      
      // Draw all vertical lines with scanline enhancement
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        
        // Check if near scanline
        let baseOpacity = 0.03;
        for (let y = 0; y < canvas.height; y += 50) {
          const distToScanline = Math.abs(y - scanlineY);
          if (distToScanline < 250) {
            const scanlineIntensity = Math.pow(1 - distToScanline / 250, 2); // Smoother falloff
            baseOpacity = Math.max(baseOpacity, 0.03 + scanlineIntensity * 0.4); // Brighter
          }
        }
        
        ctx.strokeStyle = `rgba(34, 197, 94, ${baseOpacity})`;
        ctx.stroke();
      }

      // Draw all horizontal lines with scanline enhancement
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        
        // Check if near scanline
        const distToScanline = Math.abs(y - scanlineY);
        let opacity = 0.03;
        if (distToScanline < 250) {
          const scanlineIntensity = Math.pow(1 - distToScanline / 250, 2); // Smoother falloff
          opacity = 0.03 + scanlineIntensity * 0.4; // Brighter
        }
        
        ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.stroke();
      }

      // Update trail opacity (slower fade for longer trail)
      const now = Date.now();
      trailRef.current = trailRef.current.filter(point => {
        point.opacity = Math.max(0, 0.8 - (now - point.timestamp) / 1500); // Slower fade
        return point.opacity > 0;
      });
      
      // Update glow trail opacity
      glowTrailRef.current = glowTrailRef.current.filter(point => {
        point.opacity = Math.max(0, 0.3 - (now - point.timestamp) / 2000);
        return point.opacity > 0;
      });
      
      // Update click effects
      clickEffectsRef.current = clickEffectsRef.current.filter(effect => {
        effect.progress = Math.min(1, (now - effect.timestamp) / 1000); // 1 second animation
        return effect.progress < 1;
      });

      // Only draw glow trail when torch is enabled and in fun mode
      if (isFunMode && torchEnabled && glowTrailRef.current.length > 0) {
        glowTrailRef.current.forEach((point, index) => {
          const radius = 100 * point.opacity;
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
          gradient.addColorStop(0, `rgba(34, 197, 94, ${point.opacity * 0.1})`);
          gradient.addColorStop(0.5, `rgba(34, 197, 94, ${point.opacity * 0.05})`);
          gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
      }
      
      // Draw trail (only in fun mode)
      if (isFunMode && trailRef.current.length > 1) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineCap = "round";
        
        for (let i = 1; i < trailRef.current.length; i++) {
          const prev = trailRef.current[i - 1];
          const curr = trailRef.current[i];
          
          ctx.globalAlpha = curr.opacity * 0.3; // Slightly more visible
          ctx.lineWidth = curr.opacity * 4;
          
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }

      // Draw soft torch glow only when enabled
      if (torchEnabledRef.current) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.1)");
        gradient.addColorStop(0.4, "rgba(34, 197, 94, 0.05)");
        gradient.addColorStop(0.7, "rgba(34, 197, 94, 0.02)");
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Remove the old scanline drawing - it's now just in the grid brightening

      // Apply click effects and brighten grid lines
      const torchRadius = 200;
      
      // Helper function to apply click effect transformations
      const applyClickEffect = (x: number, y: number, effect: ClickEffect) => {
        const dist = Math.sqrt(Math.pow(x - effect.x, 2) + Math.pow(y - effect.y, 2));
        if (dist > torchRadius) return { x, y };
        
        const influence = (1 - dist / torchRadius) * (1 - effect.progress);
        const angle = Math.atan2(y - effect.y, x - effect.x);
        
        switch (effect.type) {
          case 'ripple':
            const rippleOffset = Math.sin(dist * 0.1 - effect.progress * Math.PI * 4) * 10 * influence;
            return {
              x: x + Math.cos(angle) * rippleOffset,
              y: y + Math.sin(angle) * rippleOffset
            };
          case 'rotate':
            const rotAngle = influence * Math.PI * 0.5;
            const cos = Math.cos(rotAngle);
            const sin = Math.sin(rotAngle);
            const dx = x - effect.x;
            const dy = y - effect.y;
            return {
              x: effect.x + dx * cos - dy * sin,
              y: effect.y + dx * sin + dy * cos
            };
          case 'scale':
            const scale = 1 + influence * 0.5 * Math.sin(effect.progress * Math.PI);
            return {
              x: effect.x + (x - effect.x) * scale,
              y: effect.y + (y - effect.y) * scale
            };
          case 'shear':
            return {
              x: x + influence * 20 * Math.sin(effect.progress * Math.PI),
              y: y
            };
          case 'wave':
            return {
              x: x + Math.sin(y * 0.05 + effect.progress * Math.PI * 2) * influence * 10,
              y: y + Math.sin(x * 0.05 + effect.progress * Math.PI * 2) * influence * 10
            };
          case 'dissolve':
            const dissolveOffset = (Math.random() - 0.5) * influence * 20;
            return {
              x: x + dissolveOffset,
              y: y + dissolveOffset
            };
          case 'pulse':
            // Pulse doesn't transform grid, just used for visual feedback
            return { x, y };
        }
      };
      
      // Redraw grid lines with effects
      ctx.strokeStyle = "#22c55e";
      
      // Brighten vertical lines with effects
      for (let x = 0; x < canvas.width; x += gridSize) {
        // Check if this line is within torch or scanline influence
        const distToLine = Math.abs(x - mouseX);
        let shouldProcessLine = false;
        
        // Check if we should process this line based on any effect
        if (isFunMode && torchEnabledRef.current && distToLine < torchRadius) {
          shouldProcessLine = true;
        }
        if (clickEffectsRef.current.length > 0) {
          shouldProcessLine = true;
        }
        // Always check all vertical lines for scanline since it moves horizontally
        shouldProcessLine = true;
        
        if (shouldProcessLine) {
          // Draw segments of the line with varying brightness and effects
          for (let y = 0; y < canvas.height; y += 20) {
            let point1 = { x, y };
            let point2 = { x, y: Math.min(y + 20, canvas.height) };
            
            // Apply all active click effects
            clickEffectsRef.current.forEach(effect => {
              point1 = applyClickEffect(point1.x, point1.y, effect);
              point2 = applyClickEffect(point2.x, point2.y, effect);
            });
            
            const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
            const segmentDistToScanline = Math.abs(y - scanlineY);
            
            // Calculate intensity based on torch, scanline, and effects
            let shouldDraw = false;
            let intensity = 0;
            
            // Check torch influence (only in fun mode)
            if (isFunMode && torchEnabledRef.current && dist < torchRadius) {
              const torchIntensity = Math.pow(1 - dist / torchRadius, 1.5);
              intensity = Math.max(intensity, torchIntensity);
              shouldDraw = true;
            }
            
            // Check scanline influence
            if (segmentDistToScanline < 250) {
              const scanlineIntensity = Math.pow(1 - segmentDistToScanline / 250, 2);
              intensity = Math.max(intensity, scanlineIntensity * 0.6); // Brighter scanline effect
              shouldDraw = true;
            }
            
            // Check click effects
            if (clickEffectsRef.current.length > 0) {
              const hasNearbyEffect = clickEffectsRef.current.some(effect => {
                const effectDist = Math.sqrt(Math.pow(x - effect.x, 2) + Math.pow(y - effect.y, 2));
                return effectDist < torchRadius;
              });
              if (hasNearbyEffect) {
                shouldDraw = true;
                intensity = Math.max(intensity, 0.1); // Minimum visibility for effects
              }
            }
            
            if (shouldDraw) {
              ctx.globalAlpha = intensity * 0.3;
              ctx.lineWidth = 1 + intensity;
              
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      // Brighten horizontal lines with effects
      for (let y = 0; y < canvas.height; y += gridSize) {
        // Check if this line is within torch or scanline influence
        const distToLine = Math.abs(y - mouseY);
        const distToScanline = Math.abs(y - scanlineY);
        
        if ((torchEnabledRef.current && distToLine < torchRadius) || 
            clickEffectsRef.current.length > 0 ||
            distToScanline < 250) {
          // Draw segments of the line with varying brightness and effects
          for (let x = 0; x < canvas.width; x += 20) {
            let point1 = { x, y };
            let point2 = { x: Math.min(x + 20, canvas.width), y };
            
            // Apply all active click effects
            clickEffectsRef.current.forEach(effect => {
              point1 = applyClickEffect(point1.x, point1.y, effect);
              point2 = applyClickEffect(point2.x, point2.y, effect);
            });
            
            const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
            const segmentDistToScanline = Math.abs(y - scanlineY);
            
            // Calculate intensity based on torch, scanline, and effects
            let shouldDraw = false;
            let intensity = 0;
            
            // Check torch influence (only in fun mode)
            if (isFunMode && torchEnabledRef.current && dist < torchRadius) {
              const torchIntensity = Math.pow(1 - dist / torchRadius, 1.5);
              intensity = Math.max(intensity, torchIntensity);
              shouldDraw = true;
            }
            
            // Check scanline influence
            if (segmentDistToScanline < 250) {
              const scanlineIntensity = Math.pow(1 - segmentDistToScanline / 250, 2);
              intensity = Math.max(intensity, scanlineIntensity * 0.6); // Brighter scanline effect
              shouldDraw = true;
            }
            
            // Check click effects
            if (clickEffectsRef.current.length > 0) {
              const hasNearbyEffect = clickEffectsRef.current.some(effect => {
                const effectDist = Math.sqrt(Math.pow(x - effect.x, 2) + Math.pow(y - effect.y, 2));
                return effectDist < torchRadius;
              });
              if (hasNearbyEffect) {
                shouldDraw = true;
                intensity = Math.max(intensity, 0.1); // Minimum visibility for effects
              }
            }
            
            if (shouldDraw) {
              ctx.globalAlpha = intensity * 0.3;
              ctx.lineWidth = 1 + intensity;
              
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      // Draw pulse effects for torch toggle (only in fun mode)
      if (isFunMode) {
        clickEffectsRef.current.forEach(effect => {
          if (effect.type === 'pulse') {
            const radius = effect.progress * 150;
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 2 * (1 - effect.progress);
            ctx.globalAlpha = (1 - effect.progress) * 0.5;
            
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }
      
      // Brighten grid intersections with effects (for both torch AND scanline)
      ctx.fillStyle = "#22c55e";
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          let point = { x, y };
          
          // Apply all active click effects (only in fun mode)
          if (isFunMode) {
            clickEffectsRef.current.forEach(effect => {
              point = applyClickEffect(point.x, point.y, effect);
            });
          }
          
          const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
          const distToScanline = Math.abs(y - scanlineY);
          
          let shouldDraw = false;
          let intensity = 0;
          
          // Check torch influence (only in fun mode)
          if (isFunMode && torchEnabledRef.current && dist < torchRadius) {
            const torchIntensity = Math.pow(1 - dist / torchRadius, 2);
            intensity = Math.max(intensity, 0.1 + torchIntensity * 0.4);
            shouldDraw = true;
          }
          
          // Check scanline influence
          if (distToScanline < 250) {
            const scanlineIntensity = Math.pow(1 - distToScanline / 250, 2);
            intensity = Math.max(intensity, 0.1 + scanlineIntensity * 0.5);
            shouldDraw = true;
          }
          
          if (shouldDraw) {
            ctx.globalAlpha = intensity;
            // Make intersection points slightly larger when affected
            const size = clickEffectsRef.current.length > 0 ? 3 : 2;
            ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
          }
        }
      }

      // Draw diffused scanline glow - TALLER AND BRIGHTER
      ctx.save();
      
      // Wide, diffused gradient
      const scanlineGradient = ctx.createLinearGradient(0, scanlineY - 250, 0, scanlineY + 250);
      scanlineGradient.addColorStop(0, "rgba(34, 197, 94, 0)");
      scanlineGradient.addColorStop(0.15, "rgba(34, 197, 94, 0.2)");
      scanlineGradient.addColorStop(0.3, "rgba(34, 197, 94, 0.4)");
      scanlineGradient.addColorStop(0.45, "rgba(34, 197, 94, 0.5)");
      scanlineGradient.addColorStop(0.5, "rgba(34, 197, 94, 0.6)");  // Brighter peak
      scanlineGradient.addColorStop(0.55, "rgba(34, 197, 94, 0.5)");
      scanlineGradient.addColorStop(0.7, "rgba(34, 197, 94, 0.4)");
      scanlineGradient.addColorStop(0.85, "rgba(34, 197, 94, 0.2)");
      scanlineGradient.addColorStop(1, "rgba(34, 197, 94, 0)");
      
      ctx.fillStyle = scanlineGradient;
      ctx.fillRect(0, scanlineY - 250, canvas.width, 500);
      
      // Add brighter glow using shadow
      ctx.shadowBlur = 100;
      ctx.shadowColor = "rgba(34, 197, 94, 0.6)";
      ctx.strokeStyle = "rgba(34, 197, 94, 0)"; // Invisible line but visible shadow
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, scanlineY);
      ctx.lineTo(canvas.width, scanlineY);
      ctx.stroke();
      
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFunMode]); // Added isFunMode dependency

  return (
    <>
      <canvas
        ref={canvasRef}
        className={cn("pointer-events-none", className)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      {/* Click feedback indicator - subtle, near game controller */}
      {clickFeedback.show && clickFeedback.count > 2 && torchEnabled && (
        <div className="fixed bottom-4 left-44 pointer-events-none z-20">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-green-500/60 font-mono text-xs">
              {clickFeedback.count} clicks
            </span>
          </div>
        </div>
      )}
    </>
  );
}