import * as THREE from "three";
import { gsap } from "gsap";

// Vertex shader for spacetime grid
const vertexShader = `
  uniform float time;
  uniform vec3 blackHolePosition;
  uniform float blackHoleMass;
  uniform float gridOpacity;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    
    // Calculate distance to black hole
    vec3 diff = pos - blackHolePosition;
    float dist = length(diff);
    
    // Schwarzschild metric distortion
    float rs = 2.0 * blackHoleMass; // Schwarzschild radius
    float distortionFactor = 1.0;
    
    if (dist > rs * 0.5) {
      distortionFactor = 1.0 + (rs / dist) * 2.0;
      
      // Warp spacetime - pull vertices toward black hole
      vec3 direction = normalize(diff);
      float warpStrength = (rs / dist) * blackHoleMass;
      pos -= direction * warpStrength * 0.5;
      
      // Add rotation around black hole
      float angle = time * 0.5 * (1.0 + blackHoleMass * 0.5);
      float cosA = cos(angle);
      float sinA = sin(angle);
      
      // Rotate around Y axis (assuming black hole is in XZ plane)
      vec3 rotated = pos - blackHolePosition;
      float x = rotated.x * cosA - rotated.z * sinA;
      float z = rotated.x * sinA + rotated.z * cosA;
      rotated.x = x;
      rotated.z = z;
      pos = rotated + blackHolePosition;
    }
    
    vDistortion = distortionFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for spacetime grid
const fragmentShader = `
  uniform float time;
  uniform vec3 blackHolePosition;
  uniform float blackHoleMass;
  uniform float gridOpacity;
  uniform vec3 gridColor;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying vec3 vPosition;
  
  void main() {
    // Create grid pattern
    float gridScale = 20.0;
    vec2 grid = abs(fract(vUv * gridScale) - 0.5);
    float line = smoothstep(0.0, 0.02, min(grid.x, grid.y));
    
    // Distance to black hole
    float dist = length(vPosition.xy - blackHolePosition.xy);
    float rs = 2.0 * blackHoleMass;
    
    // Fade near event horizon
    float eventHorizonFade = smoothstep(rs * 0.5, rs * 1.5, dist);
    
    // Add energy waves
    float wave = sin(dist * 10.0 - time * 3.0) * 0.5 + 0.5;
    float energy = (1.0 - eventHorizonFade) * wave * 0.5;
    
    // Color with distortion
    vec3 color = gridColor + vec3(energy * 0.5, energy * 0.3, energy);
    
    // Apply grid opacity
    float opacity = (1.0 - line) * gridOpacity * eventHorizonFade;
    opacity *= (1.0 + vDistortion * 0.2);
    
    gl_FragColor = vec4(color, opacity);
  }
`;

// Accretion disk shader
const accretionVertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const accretionFragmentShader = `
  uniform float time;
  uniform float blackHoleMass;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    float dist = length(vPosition.xy);
    float angle = atan(vPosition.y, vPosition.x);
    
    // Rotating spiral pattern
    float spiral = sin(angle * 4.0 - dist * 10.0 + time * 5.0) * 0.5 + 0.5;
    
    // Temperature gradient (hotter near black hole)
    float temp = 1.0 - smoothstep(0.5, 3.0, dist);
    
    // Colors from hot (blue-white) to cool (red-orange)
    vec3 hotColor = vec3(0.8, 0.9, 1.0);
    vec3 coolColor = vec3(1.0, 0.6, 0.2);
    vec3 color = mix(coolColor, hotColor, temp);
    
    // Add brightness variation
    color *= 0.5 + spiral * 0.5;
    
    // Fade at edges
    float opacity = smoothstep(3.5, 2.5, dist) * smoothstep(0.3, 0.5, dist);
    opacity *= blackHoleMass;
    
    gl_FragColor = vec4(color, opacity * 0.8);
  }
`;

export interface BlackHoleRendererConfig {
  gridSize?: number;
  gridDivisions?: number;
  blackHoleRadius?: number;
  accretionDiskRadius?: number;
}

export class BlackHoleRendererV2 {
  private scene: THREE.Scene;
  private gridMesh?: THREE.Mesh;
  private blackHoleMesh?: THREE.Mesh;
  private accretionDiskMesh?: THREE.Mesh;
  private particleSystem?: THREE.Points;
  private config: Required<BlackHoleRendererConfig>;
  private clock: THREE.Clock;
  private animationTimeline?: gsap.core.Timeline;

  constructor(scene: THREE.Scene, config?: BlackHoleRendererConfig) {
    this.scene = scene;
    this.clock = new THREE.Clock();
    this.config = {
      gridSize: config?.gridSize ?? 100,
      gridDivisions: config?.gridDivisions ?? 200,
      blackHoleRadius: config?.blackHoleRadius ?? 1,
      accretionDiskRadius: config?.accretionDiskRadius ?? 4,
    };
  }

  createSpacetimeGrid(position: THREE.Vector3, mass: number): void {
    // Create grid geometry
    const geometry = new THREE.PlaneGeometry(
      this.config.gridSize,
      this.config.gridSize,
      this.config.gridDivisions,
      this.config.gridDivisions
    );

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        blackHolePosition: { value: position },
        blackHoleMass: { value: mass },
        gridOpacity: { value: 0.5 },
        gridColor: { value: new THREE.Color(0x22c55e) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.gridMesh = new THREE.Mesh(geometry, material);
    this.gridMesh.position.z = -1; // Behind other elements
    this.scene.add(this.gridMesh);
  }

  createBlackHole(position: THREE.Vector3): void {
    // Create event horizon (black sphere)
    const geometry = new THREE.SphereGeometry(this.config.blackHoleRadius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
    });

    this.blackHoleMesh = new THREE.Mesh(geometry, material);
    this.blackHoleMesh.position.copy(position);
    this.scene.add(this.blackHoleMesh);

    // Animate black hole appearance
    gsap.to(material, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.in",
    });
  }

  createAccretionDisk(position: THREE.Vector3): void {
    // Create rotating disk
    const geometry = new THREE.RingGeometry(
      this.config.blackHoleRadius * 1.5,
      this.config.accretionDiskRadius,
      64,
      32
    );

    const material = new THREE.ShaderMaterial({
      vertexShader: accretionVertexShader,
      fragmentShader: accretionFragmentShader,
      uniforms: {
        time: { value: 0 },
        blackHoleMass: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.accretionDiskMesh = new THREE.Mesh(geometry, material);
    this.accretionDiskMesh.position.copy(position);
    
    // Tilt the disk slightly for better visibility
    this.accretionDiskMesh.rotation.x = Math.PI * 0.7;
    
    this.scene.add(this.accretionDiskMesh);
  }

  createParticleSystem(position: THREE.Vector3, count: number = 1000): void {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Initialize particles in a sphere around the scene
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 20 + Math.random() * 30;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Green-ish colors
      colors[i * 3] = 0.1 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  setMass(mass: number): void {
    if (this.gridMesh) {
      (this.gridMesh.material as THREE.ShaderMaterial).uniforms.blackHoleMass.value = mass;
    }
    if (this.accretionDiskMesh) {
      (this.accretionDiskMesh.material as THREE.ShaderMaterial).uniforms.blackHoleMass.value = mass;
    }
  }

  setGridOpacity(opacity: number): void {
    if (this.gridMesh) {
      (this.gridMesh.material as THREE.ShaderMaterial).uniforms.gridOpacity.value = opacity;
    }
  }

  update(delta: number, elapsedTime: number): void {
    // Update shader uniforms
    if (this.gridMesh) {
      (this.gridMesh.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime;
    }
    if (this.accretionDiskMesh) {
      (this.accretionDiskMesh.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime;
    }

    // Update particle positions (gravitational attraction)
    if (this.particleSystem && this.blackHoleMesh) {
      const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;
      const velocities = this.particleSystem.geometry.attributes.velocity.array as Float32Array;
      const blackHolePos = this.blackHoleMesh.position;
      const mass = (this.gridMesh?.material as THREE.ShaderMaterial)?.uniforms.blackHoleMass.value || 1;

      for (let i = 0; i < positions.length; i += 3) {
        const dx = blackHolePos.x - positions[i];
        const dy = blackHolePos.y - positions[i + 1];
        const dz = blackHolePos.z - positions[i + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);

        if (dist > 0.5) { // Not inside event horizon
          // Gravitational acceleration
          const force = (mass * 5) / distSq;
          const ax = (dx / dist) * force * delta;
          const ay = (dy / dist) * force * delta;
          const az = (dz / dist) * force * delta;

          // Update velocities
          velocities[i] += ax;
          velocities[i + 1] += ay;
          velocities[i + 2] += az;

          // Apply velocities
          positions[i] += velocities[i] * delta;
          positions[i + 1] += velocities[i + 1] * delta;
          positions[i + 2] += velocities[i + 2] * delta;
        } else {
          // Respawn particle far away
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 30 + Math.random() * 20;

          positions[i] = r * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = r * Math.cos(phi);

          velocities[i] = 0;
          velocities[i + 1] = 0;
          velocities[i + 2] = 0;
        }
      }

      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
  }

  createSupernova(callback?: () => void): void {
    if (!this.blackHoleMesh) return;

    // Create explosion timeline
    const tl = gsap.timeline({
      onComplete: callback,
    });

    // Flash to white
    const flashGeometry = new THREE.SphereGeometry(50, 32, 32);
    const flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });
    const flashMesh = new THREE.Mesh(flashGeometry, flashMaterial);
    flashMesh.position.copy(this.blackHoleMesh.position);
    this.scene.add(flashMesh);

    // Explosion sequence
    tl.to(flashMaterial, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.in",
    })
    .to(flashMesh.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 0.5,
      ease: "power2.out",
    }, "<")
    .to(flashMaterial, {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
    .call(() => {
      this.scene.remove(flashMesh);
      flashGeometry.dispose();
      flashMaterial.dispose();
    });

    // Particle explosion
    if (this.particleSystem) {
      const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;
      const velocities = this.particleSystem.geometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < velocities.length; i += 3) {
        const speed = 20 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        velocities[i] = speed * Math.sin(phi) * Math.cos(theta);
        velocities[i + 1] = speed * Math.sin(phi) * Math.sin(theta);
        velocities[i + 2] = speed * Math.cos(phi);
      }
    }
  }

  dispose(): void {
    // Clean up geometries and materials
    if (this.gridMesh) {
      this.gridMesh.geometry.dispose();
      (this.gridMesh.material as THREE.ShaderMaterial).dispose();
      this.scene.remove(this.gridMesh);
    }

    if (this.blackHoleMesh) {
      this.blackHoleMesh.geometry.dispose();
      (this.blackHoleMesh.material as THREE.Material).dispose();
      this.scene.remove(this.blackHoleMesh);
    }

    if (this.accretionDiskMesh) {
      this.accretionDiskMesh.geometry.dispose();
      (this.accretionDiskMesh.material as THREE.ShaderMaterial).dispose();
      this.scene.remove(this.accretionDiskMesh);
    }

    if (this.particleSystem) {
      this.particleSystem.geometry.dispose();
      (this.particleSystem.material as THREE.Material).dispose();
      this.scene.remove(this.particleSystem);
    }
  }
}