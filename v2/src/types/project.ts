export interface Project {
  id: string;
  title: string;
  category: 'physics' | 'finance' | 'software' | 'ml' | 'research';
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