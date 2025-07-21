import { gsap } from "gsap";

interface Particle {
  element: HTMLElement;
  originalTransform: string;
  originalPosition: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
  isFixed?: boolean;
}

interface BlackHoleConfig {
  x: number;
  y: number;
  mass: number;
  eventHorizonRadius: number;
}

export class DOMParticleSystemV2 {
  private particles: Particle[] = [];
  private animationId?: number;
  private isRunning = false;
  private blackHoleConfig?: BlackHoleConfig;
  private capturedElements: Map<HTMLElement, {
    parent: HTMLElement;
    nextSibling: Node | null;
  }> = new Map();

  captureElements(): void {
    // Clear previous particles
    this.particles = [];
    this.capturedElements.clear();

    // Extended selectors for all visible elements
    const selectors = [
      'section', 'nav', 'header', 'footer', 'main', 'article', 'aside',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'a', 'button', 'img', 'svg',
      'div[class*="card"]', 'div[class*="tile"]', 'div[class*="glow"]',
      '[class*="easter-egg"]', '[class*="sticky"]',
      'ul', 'ol', 'li', 'table', 'form', 'input', 'textarea',
      '.project-tile', '.research-tile', '.glow-card',
      '[class*="motion"]', '[class*="animated"]'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    
    elements.forEach((el) => {
      const element = el as HTMLElement;
      
      // Skip if not visible or too small
      const rect = element.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      
      // Skip if outside viewport
      if (rect.bottom < 0 || rect.top > window.innerHeight ||
          rect.right < 0 || rect.left > window.innerWidth) return;

      // Store original parent info for restoration
      if (element.parentElement) {
        this.capturedElements.set(element, {
          parent: element.parentElement,
          nextSibling: element.nextSibling,
        });
      }

      // Calculate center position
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Create particle
      const particle: Particle = {
        element,
        originalTransform: element.style.transform || '',
        originalPosition: { x: centerX, y: centerY },
        velocity: { x: 0, y: 0 },
        mass: Math.sqrt(rect.width * rect.height) / 100, // Mass based on size
        isFixed: element.style.position === 'fixed',
      };

      this.particles.push(particle);

      // Apply initial styles
      gsap.set(element, {
        position: particle.isFixed ? 'fixed' : 'absolute',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        margin: 0,
        zIndex: 1000,
        transformOrigin: 'center center',
      });

      // Move to body for consistent positioning
      document.body.appendChild(element);
    });

    console.log(`Captured ${this.particles.length} elements as particles`);
  }

  start(config: BlackHoleConfig): void {
    this.blackHoleConfig = config;
    this.isRunning = true;

    // Add some initial random velocities for more dynamic effect
    this.particles.forEach(particle => {
      particle.velocity.x = (Math.random() - 0.5) * 2;
      particle.velocity.y = (Math.random() - 0.5) * 2;
    });

    this.animate();
  }

  private animate = (): void => {
    if (!this.isRunning || !this.blackHoleConfig) return;

    const deltaTime = 1 / 60; // 60 FPS
    const G = 500; // Gravitational constant
    const damping = 0.98; // Velocity damping

    this.particles.forEach((particle, index) => {
      if (!particle.element.parentElement) return; // Skip if removed

      const rect = particle.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance to black hole
      const dx = this.blackHoleConfig!.x - centerX;
      const dy = this.blackHoleConfig!.y - centerY;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Check if inside event horizon
      if (dist < this.blackHoleConfig!.eventHorizonRadius) {
        // Fade out and remove
        gsap.to(particle.element, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          onComplete: () => {
            if (particle.element.parentElement) {
              particle.element.remove();
            }
          }
        });
        return;
      }

      // Calculate gravitational force
      const force = (G * this.blackHoleConfig!.mass * particle.mass) / distSq;
      const ax = (dx / dist) * force;
      const ay = (dy / dist) * force;

      // Update velocity
      particle.velocity.x += ax * deltaTime;
      particle.velocity.y += ay * deltaTime;

      // Apply damping
      particle.velocity.x *= damping;
      particle.velocity.y *= damping;

      // Add some spiral motion
      const tangentX = -dy / dist;
      const tangentY = dx / dist;
      const spiralForce = force * 0.3;
      particle.velocity.x += tangentX * spiralForce * deltaTime;
      particle.velocity.y += tangentY * spiralForce * deltaTime;

      // Update position
      const newX = rect.left + particle.velocity.x * deltaTime;
      const newY = rect.top + particle.velocity.y * deltaTime;

      // Apply rotation based on velocity
      const rotation = Math.atan2(particle.velocity.y, particle.velocity.x) * 180 / Math.PI;

      // Apply spaghettification (stretching) as it gets closer
      const stretchFactor = 1 + (1 - dist / 500) * 2;
      const scaleX = 1;
      const scaleY = stretchFactor;

      // Update element
      gsap.set(particle.element, {
        left: newX,
        top: newY,
        rotation: rotation,
        scaleX: scaleX,
        scaleY: scaleY,
      });
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  createSupernova(config: BlackHoleConfig): void {
    this.blackHoleConfig = config;

    // Explosion effect for remaining particles
    this.particles.forEach(particle => {
      if (!particle.element.parentElement) return;

      // Random explosion velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 500 + Math.random() * 1000;
      
      particle.velocity.x = Math.cos(angle) * speed;
      particle.velocity.y = Math.sin(angle) * speed;

      // Fade out while moving
      gsap.to(particle.element, {
        opacity: 0,
        scale: 2,
        duration: 1.5,
        ease: "power2.out",
      });
    });

    // Stop animation after explosion
    setTimeout(() => {
      this.stop();
    }, 1500);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  restore(): void {
    // Restore all elements to their original positions
    this.particles.forEach(particle => {
      try {
        // Skip if element was already removed
        if (!particle.element || !particle.element.parentElement) return;

        const originalInfo = this.capturedElements.get(particle.element);
        if (originalInfo && originalInfo.parent) {
          // Check if parent still exists in DOM
          if (!document.body.contains(originalInfo.parent)) {
            console.warn('Original parent no longer in DOM, appending to body');
            document.body.appendChild(particle.element);
          } else {
            // Validate nextSibling is still a child of parent
            if (originalInfo.nextSibling && originalInfo.parent.contains(originalInfo.nextSibling)) {
              originalInfo.parent.insertBefore(particle.element, originalInfo.nextSibling);
            } else {
              // Safe fallback - just append to parent
              originalInfo.parent.appendChild(particle.element);
            }
          }
        }

        // Reset all styles
        gsap.set(particle.element, {
          clearProps: "all",
          transform: particle.originalTransform || '',
        });
      } catch (error) {
        console.warn('Failed to restore element:', error);
        // Try to at least reset styles if element still exists
        if (particle.element) {
          gsap.set(particle.element, {
            clearProps: "all",
            transform: particle.originalTransform || '',
          });
        }
      }
    });

    // Clear arrays
    this.particles = [];
    this.capturedElements.clear();
  }
}