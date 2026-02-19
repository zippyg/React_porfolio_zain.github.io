"use client";

import { useState, useMemo } from "react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectTile } from "./project-tile";
import { FloatingProjectWindow } from "@/components/ui/floating-project-window";
import { Project } from "@/types/project";

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'physics', label: 'Physics' },
  { id: 'quant', label: 'Quant Research' },
  { id: 'ml-ai', label: 'ML & AI' },
  { id: 'software', label: 'Software' },
  { id: 'math-stats', label: 'Math & Stats' }
];

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter(p => p.categories.includes(selectedCategory as any));
  }, [selectedCategory]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <Section id="projects" className="relative pt-24 lg:pt-32">
        <Container>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From particle physics simulations to quantitative finance models,
              explore my diverse portfolio of technical projects
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-black'
                    : 'bg-card/60 text-muted-foreground hover:bg-card/70 hover:text-foreground border border-border/50 shadow-sm hover:border-primary/30'
                }`}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-60">
                  ({category.id === 'all'
                    ? projects.length
                    : projects.filter(p => p.categories.includes(category.id as any)).length})
                </span>
              </button>
            ))}
          </motion.div>

          {/* Projects Bento Grid - 12 column */}
          <div className="grid grid-cols-12 gap-5">
            {filteredProjects.map((project, index) => {
              // First 4 projects in unfiltered view are featured (half-width)
              const isFeatured = selectedCategory === 'all' && index < 4;
              return (
                <ProjectTile
                  key={project.id}
                  project={project}
                  index={index}
                  isFeatured={isFeatured}
                  onClick={() => handleProjectClick(project)}
                />
              );
            })}
          </div>

          {/* No projects message */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400">No projects found in this category.</p>
            </motion.div>
          )}
        </Container>
      </Section>

      {/* Floating Project Window */}
      <FloatingProjectWindow
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
