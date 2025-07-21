export interface DOMParticle {
  element: HTMLElement;
  originalTransform: string;
  originalOpacity: string;
  originalTransition: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
  size: { width: number; height: number };
  captured: boolean;
  captureTime?: number;
  spiralAngle: number;
  spiralRadius: number;
}

export interface BlackHoleCenter {
  x: number;
  y: number;
  mass: number;
  eventHorizonRadius: number;
}

export class DOMParticleSystem {
  private particles: DOMParticle[] = [];
  private originalStyles: Map<HTMLElement, {
    transform: string;
    opacity: string;
    transition: string;
    pointerEvents: string;
  }> = new Map();
  private animationFrame: number | null = null;
  private startTime: number = Date.now();

  constructor() {}

  // Capture all visible DOM elements
  captureElements(): void {
    // Select all major content elements
    const selectors = [
      'section',
      'nav',
      'header',
      'footer',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p',
      'img',
      'button',
      'a',
      '.card',
      '.tile',
      '.glow-card',
      '.project-tile',
      '.research-tile',
      '.easter-egg-counter',
      'svg',
      'span.text-xs',
      'span.text-sm',
      'span.text-base',
      'div.flex:not(.fixed)',
      '.sticky-header'
    ];
    
    const elements = document.querySelectorAll(selectors.join(', '));
    
    elements.forEach(element => {
      const el = element as HTMLElement;
      
      // Skip if element is not visible or is a background element
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      // Include fixed position elements (we want everything to be sucked in)
      const computedStyle = window.getComputedStyle(el);
      
      // Skip invisible elements
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') return;
      
      // Store original styles
      this.originalStyles.set(el, {
        transform: el.style.transform || '',
        opacity: el.style.opacity || '',
        transition: el.style.transition || '',
        pointerEvents: el.style.pointerEvents || ''
      });
      
      // Create particle
      const particle: DOMParticle = {
        element: el,
        originalTransform: el.style.transform || '',
        originalOpacity: el.style.opacity || '',
        originalTransition: el.style.transition || '',
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        },
        velocity: { x: 0, y: 0 },
        mass: (rect.width * rect.height) / 10000, // Normalize mass
        size: { width: rect.width, height: rect.height },
        captured: false,
        spiralAngle: Math.random() * Math.PI * 2,
        spiralRadius: 0
      };
      
      this.particles.push(particle);
      
      // Disable pointer events during animation
      el.style.pointerEvents = 'none';
    });
    
    console.log(`Captured ${this.particles.length} DOM elements as particles`);
  }

  // Update physics for all particles
  updatePhysics(blackHole: BlackHoleCenter, deltaTime: number): void {
    const currentTime = Date.now();
    const G = 50000; // Gravitational constant (tuned for visual effect)
    const maxVelocity = 2000; // Maximum velocity cap
    const spiralStrength = 0.5; // How much particles spiral

    this.particles.forEach(particle => {
      if (particle.captured) {
        // Continue shrinking captured particles
        const timeSinceCaptured = currentTime - (particle.captureTime || currentTime);
        const shrinkFactor = Math.max(0, 1 - timeSinceCaptured / 300);
        
        particle.element.style.transform = `
          translate(${blackHole.x - particle.position.x}px, ${blackHole.y - particle.position.y}px)
          scale(${shrinkFactor})
          rotate(${timeSinceCaptured * 0.02}rad)
        `;
        particle.element.style.opacity = shrinkFactor.toString();
        
        return;
      }

      // Calculate distance to black hole
      const dx = blackHole.x - particle.position.x;
      const dy = blackHole.y - particle.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check if captured by event horizon
      if (distance < blackHole.eventHorizonRadius) {
        particle.captured = true;
        particle.captureTime = currentTime;
        particle.element.style.transition = 'all 0.3s ease-in';
        return;
      }
      
      // Calculate gravitational force (F = GMm/r²)
      const forceMagnitude = (G * blackHole.mass * particle.mass) / (distance * distance);
      const forceX = forceMagnitude * (dx / distance);
      const forceY = forceMagnitude * (dy / distance);
      
      // Add spiral motion
      particle.spiralAngle += spiralStrength / distance;
      const spiralForceX = Math.cos(particle.spiralAngle) * forceMagnitude * spiralStrength;
      const spiralForceY = Math.sin(particle.spiralAngle) * forceMagnitude * spiralStrength;
      
      // Update velocity (F = ma, so a = F/m)
      particle.velocity.x += ((forceX + spiralForceX) / particle.mass) * deltaTime;
      particle.velocity.y += ((forceY + spiralForceY) / particle.mass) * deltaTime;
      
      // Cap velocity to prevent instability
      const velocity = Math.sqrt(particle.velocity.x ** 2 + particle.velocity.y ** 2);
      if (velocity > maxVelocity) {
        particle.velocity.x = (particle.velocity.x / velocity) * maxVelocity;
        particle.velocity.y = (particle.velocity.y / velocity) * maxVelocity;
      }
      
      // Update position
      const deltaX = particle.velocity.x * deltaTime;
      const deltaY = particle.velocity.y * deltaTime;
      
      // Apply transform to element
      const currentRect = particle.element.getBoundingClientRect();
      const currentCenterX = currentRect.left + currentRect.width / 2;
      const currentCenterY = currentRect.top + currentRect.height / 2;
      
      const translateX = particle.position.x + deltaX - currentCenterX;
      const translateY = particle.position.y + deltaY - currentCenterY;
      
      // Calculate rotation based on velocity
      const rotation = Math.atan2(particle.velocity.y, particle.velocity.x);
      
      // Calculate stretching effect (spaghettification)
      const stretchFactor = 1 + (velocity / maxVelocity) * 0.5;
      const tidal = Math.min(2, 1 + (blackHole.eventHorizonRadius / distance) * 0.5);
      
      // Apply all transformations
      particle.element.style.transform = `
        ${particle.originalTransform}
        translate(${translateX}px, ${translateY}px)
        rotate(${rotation}rad)
        scaleX(${stretchFactor * tidal})
        scaleY(${1 / tidal})
      `;
      
      // Fade out as it gets closer
      const fadeDistance = blackHole.eventHorizonRadius * 3;
      if (distance < fadeDistance) {
        const opacity = (distance - blackHole.eventHorizonRadius) / (fadeDistance - blackHole.eventHorizonRadius);
        particle.element.style.opacity = opacity.toString();
      }
      
      // Update particle position
      particle.position.x += deltaX;
      particle.position.y += deltaY;
    });
  }

  // Create shockwave effect for supernova
  createSupernova(blackHole: BlackHoleCenter): void {
    const explosionDuration = 1500;
    const explosionStartTime = Date.now();
    
    this.particles.forEach((particle, index) => {
      // Calculate explosion direction (opposite of black hole)
      const dx = particle.position.x - blackHole.x;
      const dy = particle.position.y - blackHole.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Explosion force inversely proportional to distance
      const explosionForce = 5000 / Math.max(distance, 50);
      const dirX = dx / distance;
      const dirY = dy / distance;
      
      // Apply explosion velocity
      particle.velocity.x = dirX * explosionForce;
      particle.velocity.y = dirY * explosionForce;
      
      // Reset capture state
      particle.captured = false;
      
      // Animate back to original position with easing
      setTimeout(() => {
        particle.element.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        particle.element.style.transform = particle.originalTransform;
        particle.element.style.opacity = particle.originalOpacity;
        
        // Restore pointer events after animation
        setTimeout(() => {
          particle.element.style.pointerEvents = this.originalStyles.get(particle.element)?.pointerEvents || '';
        }, 1000);
      }, index * 10); // Stagger the restoration
    });
  }

  // Start animation loop
  start(blackHole: BlackHoleCenter): void {
    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      this.updatePhysics(blackHole, deltaTime);
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }

  // Stop animation and clean up
  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  // Restore all elements to original state
  restore(): void {
    this.particles.forEach(particle => {
      const originalStyle = this.originalStyles.get(particle.element);
      if (originalStyle) {
        particle.element.style.transform = originalStyle.transform;
        particle.element.style.opacity = originalStyle.opacity;
        particle.element.style.transition = originalStyle.transition;
        particle.element.style.pointerEvents = originalStyle.pointerEvents;
      }
    });
    
    this.particles = [];
    this.originalStyles.clear();
  }

  // Get particle count
  getParticleCount(): number {
    return this.particles.length;
  }

  // Get captured particle count
  getCapturedCount(): number {
    return this.particles.filter(p => p.captured).length;
  }
}