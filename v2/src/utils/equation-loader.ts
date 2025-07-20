import { Equation } from '@/data/equation-bank';

// Interface for pre-rendered equation data
export interface PrerenderedEquation extends Equation {
  id: string;
  category: string;
  filename: string;
  path: string;
  width: number;
  height: number;
  actualFontSize: number;
}

// Interface for the manifest
export interface EquationManifest {
  equations: Record<string, PrerenderedEquation>;
  metadata: {
    generatedAt: string;
    totalEquations: number;
    fontColor: string;
    backgroundColor: string;
  };
}

// Cache for the manifest
let manifestCache: EquationManifest | null = null;
let imageCache: Map<string, HTMLImageElement> = new Map();

// Load the manifest
export async function loadEquationManifest(): Promise<EquationManifest> {
  if (manifestCache) {
    return manifestCache;
  }

  try {
    const response = await fetch('/equations/manifest.json');
    if (!response.ok) {
      throw new Error('Failed to load equation manifest');
    }
    manifestCache = await response.json();
    return manifestCache!;
  } catch (error) {
    console.error('Error loading equation manifest:', error);
    throw error;
  }
}

// Get all available equations
export async function getAllPrerenderedEquations(): Promise<PrerenderedEquation[]> {
  const manifest = await loadEquationManifest();
  return Object.entries(manifest.equations).map(([id, equation]) => ({
    ...equation,
    id
  }));
}

// Get equations by complexity
export async function getEquationsByComplexity(
  complexity: 'simple' | 'medium' | 'complex'
): Promise<PrerenderedEquation[]> {
  const equations = await getAllPrerenderedEquations();
  return equations.filter(eq => eq.complexity === complexity);
}

// Get equations by category
export async function getEquationsByCategory(categoryName: string): Promise<PrerenderedEquation[]> {
  const equations = await getAllPrerenderedEquations();
  return equations.filter(eq => eq.category === categoryName);
}

// Get random equations
export async function getRandomEquations(count: number): Promise<PrerenderedEquation[]> {
  const equations = await getAllPrerenderedEquations();
  const shuffled = [...equations].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Load an equation image
export async function loadEquationImage(equation: PrerenderedEquation): Promise<HTMLImageElement> {
  // Check cache first
  if (imageCache.has(equation.id)) {
    return imageCache.get(equation.id)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(equation.id, img);
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load equation image: ${equation.path}`));
    };
    
    img.src = equation.path;
  });
}

// Preload multiple equation images
export async function preloadEquationImages(equations: PrerenderedEquation[]): Promise<HTMLImageElement[]> {
  const loadPromises = equations.map(equation => loadEquationImage(equation));
  return Promise.all(loadPromises);
}

// Clear the image cache (useful for memory management)
export function clearEquationImageCache(): void {
  imageCache.clear();
}

// Get equation by ID
export async function getEquationById(id: string): Promise<PrerenderedEquation | null> {
  const manifest = await loadEquationManifest();
  const equation = manifest.equations[id];
  return equation ? { ...equation, id } : null;
}

// Debug function to log manifest info
export async function debugManifest(): Promise<void> {
  try {
    const manifest = await loadEquationManifest();
    console.log('Equation manifest loaded:', {
      totalEquations: manifest.metadata.totalEquations,
      firstEquationId: Object.keys(manifest.equations)[0],
      sampleEquation: manifest.equations[Object.keys(manifest.equations)[0]]
    });
  } catch (error) {
    console.error('Failed to load manifest:', error);
  }
}

// Helper function to create an equation pool for continuous randomization
export class EquationPool {
  private equations: PrerenderedEquation[] = [];
  private currentIndex = 0;
  private isLoaded = false;

  constructor(
    private options: {
      complexityFilter?: ('simple' | 'medium' | 'complex')[];
      categoryFilter?: string[];
      minPoolSize?: number;
    } = {}
  ) {}

  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    let equations = await getAllPrerenderedEquations();

    // Apply filters
    if (this.options.complexityFilter) {
      equations = equations.filter(eq => this.options.complexityFilter!.includes(eq.complexity));
    }

    if (this.options.categoryFilter) {
      equations = equations.filter(eq => this.options.categoryFilter!.includes(eq.category));
    }

    // Ensure minimum pool size
    const minSize = this.options.minPoolSize || 10;
    while (equations.length < minSize && equations.length > 0) {
      equations = [...equations, ...equations];
    }

    // Shuffle the equations
    this.equations = equations.sort(() => Math.random() - 0.5);
    this.isLoaded = true;
  }

  async getNext(): Promise<PrerenderedEquation | null> {
    if (!this.isLoaded) {
      await this.initialize();
    }

    if (this.equations.length === 0) {
      return null;
    }

    const equation = this.equations[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.equations.length;

    // Reshuffle when we've gone through all equations
    if (this.currentIndex === 0) {
      this.equations = this.equations.sort(() => Math.random() - 0.5);
    }

    return equation;
  }

  async getRandomBatch(count: number): Promise<PrerenderedEquation[]> {
    if (!this.isLoaded) {
      await this.initialize();
    }

    const batch: PrerenderedEquation[] = [];
    const maxCount = Math.min(count, this.equations.length);

    for (let i = 0; i < maxCount; i++) {
      const equation = await this.getNext();
      if (equation) {
        batch.push(equation);
      }
    }

    return batch;
  }

  getTotalCount(): number {
    return this.equations.length;
  }
}