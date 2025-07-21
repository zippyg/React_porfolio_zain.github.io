import { useRef, useCallback } from 'react';

// Physical constants (normalized for visual effect)
const G = 1; // Gravitational constant (normalized)
const c = 1; // Speed of light (normalized)

export interface Vector2 {
  x: number;
  y: number;
}

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  mass: number;
  radius: number;
}

export interface BlackHole {
  position: Vector2;
  mass: number;
  schwarzschildRadius: number;
  spinRate: number; // For Kerr black hole effects
}

export function useBlackHolePhysics() {
  const blackHoleRef = useRef<BlackHole | null>(null);

  // Calculate Schwarzschild radius
  const calculateSchwarzschildRadius = useCallback((mass: number): number => {
    return 2 * G * mass / (c * c);
  }, []);

  // Calculate gravitational force using Newton's law (for far field)
  const calculateGravitationalForce = useCallback((
    particle: Particle,
    blackHole: BlackHole
  ): Vector2 => {
    const dx = blackHole.position.x - particle.position.x;
    const dy = blackHole.position.y - particle.position.y;
    const r2 = dx * dx + dy * dy;
    const r = Math.sqrt(r2);

    // Prevent singularity
    if (r < blackHole.schwarzschildRadius) {
      return { x: 0, y: 0 };
    }

    // F = G * m1 * m2 / r^2
    const forceMagnitude = G * particle.mass * blackHole.mass / r2;
    
    return {
      x: forceMagnitude * dx / r,
      y: forceMagnitude * dy / r
    };
  }, []);

  // Warp spacetime coordinates using Schwarzschild metric
  const warpSpacetime = useCallback((
    point: Vector2,
    blackHole: BlackHole
  ): Vector2 | null => {
    const dx = point.x - blackHole.position.x;
    const dy = point.y - blackHole.position.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    
    // Inside event horizon - return null
    if (r < blackHole.schwarzschildRadius) {
      return null;
    }

    // Schwarzschild metric warping
    // ds² = -(1 - Rs/r)dt² + (1 - Rs/r)^(-1)dr² + r²dΩ²
    const warpFactor = 1 - blackHole.schwarzschildRadius / r;
    const radialStretch = 1 / Math.sqrt(warpFactor);
    
    // Apply radial stretching
    const newR = r * radialStretch;
    const angle = Math.atan2(dy, dx);
    
    return {
      x: blackHole.position.x + newR * Math.cos(angle),
      y: blackHole.position.y + newR * Math.sin(angle)
    };
  }, []);

  // Calculate light bending (gravitational lensing)
  const calculateLightBending = useCallback((
    lightPath: Vector2[],
    blackHole: BlackHole
  ): Vector2[] => {
    return lightPath.map(point => {
      const dx = point.x - blackHole.position.x;
      const dy = point.y - blackHole.position.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      // Einstein ring radius
      const einsteinRadius = Math.sqrt(4 * G * blackHole.mass / (c * c));
      
      if (r < blackHole.schwarzschildRadius) {
        return point; // Light can't escape
      }
      
      // Deflection angle: α = 4GM/(rc²)
      const deflectionAngle = 4 * G * blackHole.mass / (r * c * c);
      const angle = Math.atan2(dy, dx);
      
      // Apply deflection
      const newAngle = angle + deflectionAngle;
      const newPoint = {
        x: blackHole.position.x + r * Math.cos(newAngle),
        y: blackHole.position.y + r * Math.sin(newAngle)
      };
      
      return warpSpacetime(newPoint, blackHole) || point;
    });
  }, [warpSpacetime]);

  // Update particle physics in curved spacetime
  const updateParticle = useCallback((
    particle: Particle,
    blackHole: BlackHole,
    deltaTime: number
  ): Particle => {
    const force = calculateGravitationalForce(particle, blackHole);
    
    // Update velocity (F = ma, so a = F/m)
    const acceleration = {
      x: force.x / particle.mass,
      y: force.y / particle.mass
    };
    
    const newVelocity = {
      x: particle.velocity.x + acceleration.x * deltaTime,
      y: particle.velocity.y + acceleration.y * deltaTime
    };
    
    // Update position
    const newPosition = {
      x: particle.position.x + newVelocity.x * deltaTime,
      y: particle.position.y + newVelocity.y * deltaTime
    };
    
    // Check if particle crossed event horizon
    const dx = newPosition.x - blackHole.position.x;
    const dy = newPosition.y - blackHole.position.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    
    if (r < blackHole.schwarzschildRadius) {
      // Particle is captured
      return {
        ...particle,
        position: blackHole.position,
        velocity: { x: 0, y: 0 }
      };
    }
    
    return {
      ...particle,
      position: newPosition,
      velocity: newVelocity
    };
  }, [calculateGravitationalForce]);

  // Create accretion disk physics
  const createAccretionDisk = useCallback((
    blackHole: BlackHole,
    particleCount: number
  ): Particle[] => {
    const particles: Particle[] = [];
    const innerRadius = blackHole.schwarzschildRadius * 3; // Innermost stable circular orbit
    const outerRadius = blackHole.schwarzschildRadius * 10;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      // Orbital velocity: v = sqrt(GM/r)
      const orbitalSpeed = Math.sqrt(G * blackHole.mass / radius);
      
      particles.push({
        position: {
          x: blackHole.position.x + radius * Math.cos(angle),
          y: blackHole.position.y + radius * Math.sin(angle)
        },
        velocity: {
          x: -orbitalSpeed * Math.sin(angle),
          y: orbitalSpeed * Math.cos(angle)
        },
        mass: 0.001,
        radius: 1
      });
    }
    
    return particles;
  }, []);

  // Calculate tidal forces (spaghettification)
  const calculateTidalForce = useCallback((
    particle: Particle,
    blackHole: BlackHole
  ): number => {
    const dx = particle.position.x - blackHole.position.x;
    const dy = particle.position.y - blackHole.position.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    
    // Tidal force ∝ GM/r³
    return 2 * G * blackHole.mass * particle.radius / (r * r * r);
  }, []);

  // Hawking radiation effect (visual only)
  const getHawkingRadiation = useCallback((
    blackHole: BlackHole,
    time: number
  ): { intensity: number; particles: Vector2[] } => {
    // Temperature ∝ 1/M
    const temperature = 1 / (8 * Math.PI * blackHole.mass);
    const intensity = temperature * Math.sin(time * 10);
    
    // Generate random particles near event horizon
    const particles: Vector2[] = [];
    const particleCount = Math.floor(intensity * 10);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = blackHole.schwarzschildRadius * (1 + Math.random() * 0.1);
      
      particles.push({
        x: blackHole.position.x + r * Math.cos(angle),
        y: blackHole.position.y + r * Math.sin(angle)
      });
    }
    
    return { intensity, particles };
  }, []);

  return {
    calculateSchwarzschildRadius,
    calculateGravitationalForce,
    warpSpacetime,
    calculateLightBending,
    updateParticle,
    createAccretionDisk,
    calculateTidalForce,
    getHawkingRadiation
  };
}