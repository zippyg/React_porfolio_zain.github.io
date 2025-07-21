"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectTileProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const categoryColors = {
  physics: "text-blue-600 dark:text-blue-400 border-blue-600/30 dark:border-blue-400/20 bg-blue-600/10 dark:bg-blue-400/10",
  quant: "text-green-600 dark:text-green-400 border-green-600/30 dark:border-green-400/20 bg-green-600/10 dark:bg-green-400/10",
  software: "text-purple-600 dark:text-purple-400 border-purple-600/30 dark:border-purple-400/20 bg-purple-600/10 dark:bg-purple-400/10",
  'ml-ai': "text-orange-600 dark:text-orange-400 border-orange-600/30 dark:border-orange-400/20 bg-orange-600/10 dark:bg-orange-400/10",
  'math-stats': "text-pink-600 dark:text-pink-400 border-pink-600/30 dark:border-pink-400/20 bg-pink-600/10 dark:bg-pink-400/10",
};

const categoryLabels = {
  physics: "Physics",
  quant: "Quant",
  software: "Software",
  'ml-ai': "ML & AI",
  'math-stats': "Math/Stats",
};

export function ProjectTile({ project, index, onClick }: ProjectTileProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-sm ${
        project.status === 'completed' 
          ? 'hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
          : 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
      }`}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl ${
        project.status === 'completed'
          ? 'bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0'
          : 'bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0'
      }`} />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {project.categories.map((category) => (
                <span key={category} className={`px-2 py-1 text-xs rounded-full border ${categoryColors[category]}`}>
                  {categoryLabels[category]}
                </span>
              ))}
              {project.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  Featured
                </span>
              )}
            </div>
            
            <h3 className={`text-lg font-semibold text-foreground transition-colors ${
              project.status === 'completed' 
                ? 'group-hover:text-green-500' 
                : 'group-hover:text-orange-500'
            }`}>
              {project.title}
            </h3>
          </div>
          
          <ArrowUpRight className={`w-5 h-5 text-muted-foreground transition-colors ${
            project.status === 'completed' 
              ? 'group-hover:text-green-500' 
              : 'group-hover:text-orange-500'
          }`} />
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.shortDescription}
        </p>
        
        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border border-border/50 shadow-sm"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.year}
          </span>
          <span className={project.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}>
            {project.status === 'completed' ? '● Completed' : '● In Progress'}
          </span>
        </div>
      </div>
    </motion.article>
  );
}