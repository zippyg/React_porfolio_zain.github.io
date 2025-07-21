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
  physics: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  finance: "text-green-400 border-green-400/20 bg-green-400/10",
  software: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  ml: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  research: "text-pink-400 border-pink-400/20 bg-pink-400/10",
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
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 text-xs rounded-full border ${categoryColors[project.category]}`}>
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                  Featured
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </div>
          
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">
          {project.shortDescription}
        </p>
        
        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-white/5 text-gray-500 rounded border border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.year}
          </span>
          <span className={project.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
            {project.status === 'completed' ? '● Completed' : '● In Progress'}
          </span>
        </div>
      </div>
    </motion.article>
  );
}