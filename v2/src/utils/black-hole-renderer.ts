import * as THREE from 'three';

export interface BlackHoleRendererConfig {
  gridSize: number;
  gridDivisions: number;
  blackHoleRadius: number;
  accretionDiskRadius: number;
  particleCount: number;
}

export class BlackHoleRenderer {
  private scene: THREE.Scene;
  private blackHoleMesh: THREE.Mesh | null = null;
  private gridMesh: THREE.Mesh | null = null;
  private accretionDiskGroup: THREE.Group | null = null;
  private eventHorizonMesh: THREE.Mesh | null = null;
  private photonSphereMesh: THREE.Mesh | null = null;
  private config: BlackHoleRendererConfig;

  constructor(scene: THREE.Scene, config: BlackHoleRendererConfig) {
    this.scene = scene;
    this.config = config;
  }

  // Create the main black hole with event horizon
  createBlackHole(position: THREE.Vector3): void {
    // Event horizon (pure black sphere)
    const eventHorizonGeometry = new THREE.SphereGeometry(
      this.config.blackHoleRadius,
      64,
      64
    );
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    });
    this.eventHorizonMesh = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);
    this.eventHorizonMesh.position.copy(position);
    this.scene.add(this.eventHorizonMesh);

    // Photon sphere (1.5x Schwarzschild radius)
    const photonSphereGeometry = new THREE.SphereGeometry(
      this.config.blackHoleRadius * 1.5,
      64,
      64
    );
    const photonSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    this.photonSphereMesh = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial);
    this.photonSphereMesh.position.copy(position);
    this.scene.add(this.photonSphereMesh);

    // Gravitational lensing effect (using custom shader)
    const lensingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        blackHolePosition: { value: position },
        schwarzschildRadius: { value: this.config.blackHoleRadius }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 blackHolePosition;
        uniform float schwarzschildRadius;
        varying vec3 vPosition;

        void main() {
          float dist = distance(vPosition, blackHolePosition);
          float influence = 1.0 - smoothstep(schwarzschildRadius, schwarzschildRadius * 3.0, dist);
          
          vec3 color = vec3(0.0);
          if (influence > 0.0) {
            // Create gravitational lensing rings
            float ring = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
            color = vec3(0.1, 0.2, 0.5) * ring * influence;
          }
          
          gl_FragColor = vec4(color, influence * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const lensingGeometry = new THREE.SphereGeometry(
      this.config.blackHoleRadius * 5,
      128,
      128
    );
    const lensingMesh = new THREE.Mesh(lensingGeometry, lensingMaterial);
    lensingMesh.position.copy(position);
    this.scene.add(lensingMesh);

    this.blackHoleMesh = lensingMesh;
  }

  // Create warped spacetime grid
  createSpacetimeGrid(blackHolePosition: THREE.Vector3, mass: number): void {
    const gridShader = new THREE.ShaderMaterial({
      uniforms: {
        blackHolePos: { value: new THREE.Vector2(blackHolePosition.x, blackHolePosition.y) },
        blackHoleMass: { value: mass },
        time: { value: 0 },
        gridColor: { value: new THREE.Color(0x22c55e) },
        warpStrength: { value: 1.0 },
        gridOpacity: { value: 0.3 }
      },
      vertexShader: `
        uniform vec2 blackHolePos;
        uniform float blackHoleMass;
        uniform float warpStrength;
        
        varying vec3 vPosition;
        varying float vDistortion;
        
        vec3 warpSpace(vec3 pos) {
          vec2 delta = pos.xy - blackHolePos;
          float r = length(delta);
          float Rs = 0.05 * blackHoleMass; // Schwarzschild radius
          
          if (r > Rs && blackHoleMass > 0.0) {
            // Schwarzschild metric warping
            float warp = 1.0 - Rs / r;
            vec2 direction = normalize(delta);
            
            // Apply warping with adjustable strength
            float warpAmount = mix(1.0, sqrt(warp), warpStrength);
            vec2 newPos = blackHolePos + direction * r * warpAmount;
            
            // Add vertical displacement for 3D effect
            float zWarp = (1.0 - warp) * 0.5 * warpStrength;
            return vec3(newPos, pos.z - zWarp);
          }
          return pos;
        }
        
        void main() {
          vPosition = position;
          vec3 originalPos = position;
          vec3 warped = warpSpace(position);
          vDistortion = distance(originalPos.xy, warped.xy);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(warped, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 gridColor;
        uniform float time;
        uniform float gridOpacity;
        varying vec3 vPosition;
        varying float vDistortion;
        
        void main() {
          // Create finer grid lines
          float gridScale = 2.0; // Finer grid
          float gridX = step(0.98, fract(vPosition.x * gridScale));
          float gridY = step(0.98, fract(vPosition.y * gridScale));
          float grid = max(gridX, gridY);
          
          // Also add major grid lines
          float majorGridX = step(0.95, fract(vPosition.x));
          float majorGridY = step(0.95, fract(vPosition.y));
          float majorGrid = max(majorGridX, majorGridY);
          
          // Combine grids
          grid = max(grid * 0.5, majorGrid);
          
          // Brighten based on distortion
          float brightness = 1.0 + vDistortion * 3.0;
          
          // Pulse effect
          brightness *= 0.8 + 0.2 * sin(time * 2.0 + vDistortion * 10.0);
          
          // Energy wave effect
          float wave = sin(length(vPosition.xy) * 5.0 - time * 3.0) * 0.5 + 0.5;
          brightness *= 0.7 + wave * 0.3;
          
          vec3 color = gridColor * brightness;
          float alpha = grid * gridOpacity * (1.0 + vDistortion * 2.0);
          
          gl_FragColor = vec4(color * grid, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false
    });

    const gridGeometry = new THREE.PlaneGeometry(
      this.config.gridSize,
      this.config.gridSize,
      this.config.gridDivisions,
      this.config.gridDivisions
    );

    this.gridMesh = new THREE.Mesh(gridGeometry, gridShader);
    this.gridMesh.rotation.x = -Math.PI / 2; // Make it horizontal
    this.scene.add(this.gridMesh);
  }

  // Create accretion disk with swirling particles
  createAccretionDisk(blackHolePosition: THREE.Vector3): void {
    this.accretionDiskGroup = new THREE.Group();
    this.accretionDiskGroup.position.copy(blackHolePosition);

    // Create disk geometry with custom shader
    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerRadius: { value: this.config.blackHoleRadius * 2 },
        outerRadius: { value: this.config.accretionDiskRadius }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float innerRadius;
        uniform float outerRadius;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center) * 2.0;
          
          // Create spiral pattern
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float spiral = sin(angle * 5.0 + dist * 10.0 - time * 3.0) * 0.5 + 0.5;
          
          // Radial falloff
          float radialFade = smoothstep(0.0, 0.3, dist) * (1.0 - smoothstep(0.7, 1.0, dist));
          
          // Color gradient (hot inner, cool outer)
          vec3 innerColor = vec3(1.0, 0.8, 0.3); // Yellow-orange
          vec3 outerColor = vec3(0.3, 0.5, 1.0); // Blue
          vec3 color = mix(innerColor, outerColor, dist);
          
          // Doppler shift effect
          float dopplerShift = sin(angle + time * 2.0) * 0.5 + 0.5;
          color = mix(color, vec3(1.0, 0.3, 0.1), dopplerShift * 0.3);
          
          float alpha = spiral * radialFade * 0.8;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const diskGeometry = new THREE.RingGeometry(
      this.config.blackHoleRadius * 2,
      this.config.accretionDiskRadius,
      64,
      64
    );
    const diskMesh = new THREE.Mesh(diskGeometry, diskMaterial);
    diskMesh.rotation.x = -Math.PI / 2;
    this.accretionDiskGroup.add(diskMesh);

    // Add particle system for disk
    const particleCount = this.config.particleCount;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = this.config.blackHoleRadius * 2 + 
        Math.random() * (this.config.accretionDiskRadius - this.config.blackHoleRadius * 2);
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // Small vertical spread
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Orbital velocity
      const orbitalSpeed = 1 / Math.sqrt(radius);
      velocities[i * 3] = -Math.sin(angle) * orbitalSpeed;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = Math.cos(angle) * orbitalSpeed;
      
      sizes[i] = Math.random() * 2 + 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0xffaa00,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    this.accretionDiskGroup.add(particleSystem);

    this.scene.add(this.accretionDiskGroup);
  }

  // Update animation
  update(deltaTime: number, time: number): void {
    // Update shader uniforms
    if (this.blackHoleMesh && this.blackHoleMesh.material instanceof THREE.ShaderMaterial) {
      this.blackHoleMesh.material.uniforms.time.value = time;
    }

    if (this.gridMesh && this.gridMesh.material instanceof THREE.ShaderMaterial) {
      this.gridMesh.material.uniforms.time.value = time;
    }

    // Rotate accretion disk
    if (this.accretionDiskGroup) {
      this.accretionDiskGroup.rotation.y += deltaTime * 0.5;
      
      // Update disk shader
      this.accretionDiskGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          child.material.uniforms.time.value = time;
        }
      });
    }

    // Pulse photon sphere
    if (this.photonSphereMesh) {
      const pulseFactor = 1 + Math.sin(time * 3) * 0.05;
      this.photonSphereMesh.scale.setScalar(pulseFactor);
    }
  }

  // Set black hole mass (affects warping strength)
  setMass(mass: number): void {
    if (this.gridMesh && this.gridMesh.material instanceof THREE.ShaderMaterial) {
      this.gridMesh.material.uniforms.blackHoleMass.value = mass;
    }
  }

  // Set warp strength for animation
  setWarpStrength(strength: number): void {
    if (this.gridMesh && this.gridMesh.material instanceof THREE.ShaderMaterial) {
      this.gridMesh.material.uniforms.warpStrength.value = strength;
    }
  }

  // Set grid opacity for brightening effect
  setGridOpacity(opacity: number): void {
    if (this.gridMesh && this.gridMesh.material instanceof THREE.ShaderMaterial) {
      this.gridMesh.material.uniforms.gridOpacity.value = opacity;
    }
  }

  // Clean up resources
  dispose(): void {
    if (this.blackHoleMesh) {
      this.blackHoleMesh.geometry.dispose();
      if (this.blackHoleMesh.material instanceof THREE.Material) {
        this.blackHoleMesh.material.dispose();
      }
      this.scene.remove(this.blackHoleMesh);
    }

    if (this.gridMesh) {
      this.gridMesh.geometry.dispose();
      if (this.gridMesh.material instanceof THREE.Material) {
        this.gridMesh.material.dispose();
      }
      this.scene.remove(this.gridMesh);
    }

    if (this.eventHorizonMesh) {
      this.eventHorizonMesh.geometry.dispose();
      if (this.eventHorizonMesh.material instanceof THREE.Material) {
        this.eventHorizonMesh.material.dispose();
      }
      this.scene.remove(this.eventHorizonMesh);
    }

    if (this.photonSphereMesh) {
      this.photonSphereMesh.geometry.dispose();
      if (this.photonSphereMesh.material instanceof THREE.Material) {
        this.photonSphereMesh.material.dispose();
      }
      this.scene.remove(this.photonSphereMesh);
    }

    if (this.accretionDiskGroup) {
      this.scene.remove(this.accretionDiskGroup);
    }
  }
}