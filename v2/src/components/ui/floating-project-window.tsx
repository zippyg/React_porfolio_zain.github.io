"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Calendar, CheckCircle, FileText, Video } from "lucide-react";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import { useLenis } from "@/components/layout/smooth-scroll-provider";

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

interface FloatingProjectWindowProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingProjectWindow({ project, isOpen, onClose }: FloatingProjectWindowProps) {
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Handle ESC key + stop Lenis scroll when open
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      lenis.stop();
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
      lenis.start();
    };
  }, [isOpen, onClose, lenis]);

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Floating Window */}
          {isMobile ? (
            // Mobile: full-screen slide-up
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 top-12 z-50"
            >
              <WindowContent project={project} onClose={onClose} />
            </motion.div>
          ) : (
            // Desktop: centered floating window, draggable
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag
              dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
              dragElastic={0.1}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="w-full max-w-[900px] max-h-[85vh] pointer-events-auto">
                <WindowContent project={project} onClose={onClose} isDraggable />
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

function WindowContent({
  project,
  onClose,
  isDraggable = false
}: {
  project: Project;
  onClose: () => void;
  isDraggable?: boolean;
}) {
  return (
    <div className="bg-background/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-border/50 rounded-t-xl md:rounded-xl h-full flex flex-col overflow-hidden shadow-2xl">
      {/* Terminal-style title bar */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/80 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              aria-label="Close"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-60" />
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-60" />
          </div>

          {/* Project title */}
          <span className="font-mono text-sm text-muted-foreground truncate max-w-[300px]">
            ~/{project.id}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-muted/50 rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Header info */}
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
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

          {/* Description */}
          <div>
            <h4 className="text-sm font-mono text-muted-foreground/60 uppercase tracking-wider mb-3">Overview</h4>
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {project.longDescription}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-sm font-mono text-muted-foreground/60 uppercase tracking-wider mb-3">Key Achievements</h4>
            <ul className="space-y-2">
              {project.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-primary mt-1 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-muted-foreground">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-mono text-muted-foreground/60 uppercase tracking-wider mb-3">Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs bg-card/60 text-muted-foreground rounded border border-border/50 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      {(project.github || project.live || project.pdf || project.video) && (
        <div className="px-6 py-4 border-t border-border/30 bg-card/40">
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/80 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30 text-sm"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.pdf && (
              <a
                href={project.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/80 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30 text-sm"
              >
                <FileText className="w-4 h-4" />
                Paper
              </a>
            )}
            {project.video && (
              <a
                href={project.video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-card/60 hover:bg-card/80 border border-border/50 rounded-lg transition-colors shadow-sm hover:border-primary/30 text-sm"
              >
                <Video className="w-4 h-4" />
                Video
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
