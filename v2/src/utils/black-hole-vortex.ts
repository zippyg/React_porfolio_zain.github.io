import { gsap } from "gsap";

interface VortexConfig {
  centerX: number;
  centerY: number;
  radius: number;
  strength: number;
  duration: number;
}

export class BlackHoleVortex {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
  }> = [];
  private animationId?: number;
  private isActive = false;

  constructor() {
    // Create canvas for particle effects
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998';
    this.ctx = this.canvas.getContext('2d')!;
    
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  start(config: VortexConfig) {
    if (this.isActive) return;
    
    this.isActive = true;
    document.body.appendChild(this.canvas);
    
    // Create debris particles
    this.createDebrisParticles(config);
    
    // Start particle animation
    this.animate(config);
  }

  private createDebrisParticles(config: VortexConfig) {
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 100 + Math.random() * 400;
      
      this.particles.push({
        x: config.centerX + Math.cos(angle) * distance,
        y: config.centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5,
        color: Math.random() > 0.7 ? '#22c55e' : (Math.random() > 0.4 ? '#fb923c' : '#fbbf24')
      });
    }
  }

  private animate = (config: VortexConfig) => {
    if (!this.isActive) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw black hole center
    const gradient = this.ctx.createRadialGradient(
      config.centerX, config.centerY, 0,
      config.centerX, config.centerY, config.radius
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles = this.particles.filter((particle, index) => {
      const dx = config.centerX - particle.x;
      const dy = config.centerY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 10) return false; // Remove particles that reached center
      
      // Gravitational pull with spiral
      const force = config.strength / (distance * 0.5);
      const angle = Math.atan2(dy, dx);
      const spiralAngle = angle + (distance * 0.01); // Spiral effect
      
      particle.vx += Math.cos(spiralAngle) * force;
      particle.vy += Math.sin(spiralAngle) * force;
      
      // Apply velocity with damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Fade as it gets closer
      particle.opacity = Math.min(1, distance / 200);
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
      this.ctx.fill();
      
      return true;
    });
    
    // Add new particles occasionally
    if (Math.random() < 0.3 && this.particles.length < 300) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 300 + Math.random() * 200;
      
      this.particles.push({
        x: config.centerX + Math.cos(angle) * distance,
        y: config.centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 3,
        opacity: 1,
        color: Math.random() > 0.7 ? '#22c55e' : (Math.random() > 0.4 ? '#fb923c' : '#fbbf24')
      });
    }
    
    this.animationId = requestAnimationFrame(() => this.animate(config));
  };

  supernova() {
    // Explode all particles outward
    this.particles.forEach(particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 20;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
    });
    
    // Fade out canvas
    gsap.to(this.canvas, {
      opacity: 0,
      duration: 1,
      onComplete: () => this.stop()
    });
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas.parentElement) {
      this.canvas.remove();
    }
    this.particles = [];
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}