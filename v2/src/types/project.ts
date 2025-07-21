export type ProjectCategory = 'physics' | 'quant' | 'software' | 'ml-ai' | 'math-stats';

export interface Project {
  id: string;
  title: string;
  categories: ProjectCategory[];
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  techStack: string[];
  github?: string;
  live?: string;
  pdf?: string;
  video?: string;
  images?: string[];
  featured: boolean;
  year: number;
  status: 'completed' | 'in-progress';
}