"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectTileProps {
  project: Project;
  index: number;
  isFeatured: boolean;
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

const hoverColors = [
  { border: "rgba(34,197,94,0.6)", shadow: "rgba(34,197,94,0.15)" },
  { border: "rgba(59,130,246,0.6)", shadow: "rgba(59,130,246,0.15)" },
  { border: "rgba(168,85,247,0.6)", shadow: "rgba(168,85,247,0.15)" },
  { border: "rgba(236,72,153,0.6)", shadow: "rgba(236,72,153,0.15)" },
  { border: "rgba(245,158,11,0.6)", shadow: "rgba(245,158,11,0.15)" },
  { border: "rgba(6,182,212,0.6)", shadow: "rgba(6,182,212,0.15)" },
];

export function ProjectTile({ project, index, isFeatured, onClick }: ProjectTileProps) {
  // Stable random hover color per tile
  const hoverColor = useMemo(
    () => hoverColors[Math.floor(Math.random() * hoverColors.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Alternating slide direction: even from left, odd from right
  const slideX = index % 2 === 0 ? -30 : 30;

  return (
    <motion.article
      initial={{ opacity: 0, x: slideX, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      style={{
        ["--hover-border" as string]: hoverColor.border,
        ["--hover-shadow" as string]: hoverColor.shadow,
        ...(isFeatured ? { borderTopColor: hoverColor.border } : {}),
      }}
      className={`group relative bg-card/50 backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all duration-300 shadow-sm
        ${isFeatured
          ? 'col-span-12 md:col-span-6 min-h-[220px] border-t-2 ring-1 ring-primary/10 border-border/50'
          : 'col-span-12 md:col-span-6 lg:col-span-4 border-border/50'}
        hover:shadow-[0_0_50px_var(--hover-shadow)]
      `}
      whileHover={{
        borderColor: hoverColor.border,
      }}
    >
      {/* Featured badge or index number */}
      {isFeatured ? (
        <span className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-wider text-primary/70 select-none">
          Featured
        </span>
      ) : (
        <span className="absolute top-3 right-4 font-mono text-xs text-muted-foreground/40 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pr-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {project.categories.map((category) => (
                <span key={category} className={`px-2 py-1 text-xs rounded-full border ${categoryColors[category]}`}>
                  {categoryLabels[category]}
                </span>
              ))}
            </div>

            <h3 className={`font-semibold text-foreground transition-colors group-hover:text-primary ${
              isFeatured ? 'text-xl' : 'text-lg'
            }`}>
              {project.title}
            </h3>
          </div>

          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>

        {/* Description */}
        <p className={`text-sm text-muted-foreground ${isFeatured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {project.shortDescription}
        </p>

        {/* Tech Stack Preview */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, isFeatured ? 6 : 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded border border-border/50 shadow-sm"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > (isFeatured ? 6 : 4) && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{project.techStack.length - (isFeatured ? 6 : 4)} more
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
