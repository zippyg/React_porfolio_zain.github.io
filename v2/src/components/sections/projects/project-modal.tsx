"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Calendar, CheckCircle, FileText, Video } from "lucide-react";
import { Project } from "@/types/project";
import { useEffect } from "react";

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

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 dark:bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl z-50"
          >
            <div className="bg-background/95 dark:bg-black/90 backdrop-blur-xl border border-primary/20 rounded-xl h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-primary/10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {project.categories.map((category) => (
                      <span key={category} className={`px-2 py-1 text-xs rounded-full border ${categoryColors[category]}`}>
                        {categoryLabels[category]}
                      </span>
                    ))}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {project.year}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${
                      project.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-card/60 border border-border/50 rounded-lg transition-colors shadow-sm"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Overview</h4>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {project.longDescription}
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Key Achievements</h4>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-primary mt-1">▸</span>
                          <span className="text-muted-foreground">{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-card/60 text-muted-foreground rounded-full border border-border/50 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              {(project.github || project.live || project.pdf || project.video) && (
                <div className="p-6 border-t border-primary/10">
                  <div className="flex flex-wrap gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/70 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm">View Code</span>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
                    {project.pdf && (
                      <a
                        href={project.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/70 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Research Paper</span>
                      </a>
                    )}
                    {project.video && (
                      <a
                        href={project.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/70 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30"
                      >
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Demo Video</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}