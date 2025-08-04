"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSmoothScrollAnimation, scrollAnimationVariants, getStaggerDelay } from "@/hooks/use-smooth-scroll-animation";

interface Skill {
  name: string;
  icon?: string;
  level: number; // 1-5
}

const skillCategories: Record<string, { title: string; color: string; glowColor: string; skills: Skill[] }> = {
  quantFinance: {
    title: "Quantitative Finance",
    color: "from-emerald-500 to-green-600",
    glowColor: "rgba(34, 197, 94, 0.3)",
    skills: [
      { name: "Options Pricing", level: 5 },
      { name: "Monte Carlo Methods", level: 5 },
      { name: "Time Series Analysis", level: 4 },
      { name: "Risk Management", level: 4 },
      { name: "Portfolio Optimization", level: 4 },
      { name: "Derivatives", level: 4 },
      { name: "Stochastic Calculus", level: 4 },
      { name: "Black-Scholes", level: 5 },
      { name: "GARCH Models", level: 4 },
      { name: "Heston Model", level: 4 },
      { name: "SABR Model", level: 4 },
      { name: "Value at Risk (VaR)", level: 5 },
      { name: "CVaR", level: 5 },
      { name: "Lévy Processes", level: 3 },
      { 
        name: "pandas", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
        level: 5 
      },
      { 
        name: "NumPy", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
        level: 5 
      },
      { name: "Polars", level: 4 },
      { name: "QuantLib", level: 4 }
    ]
  },
  software: {
    title: "Software Development",
    color: "from-orange-500 to-red-600",
    glowColor: "rgba(249, 115, 22, 0.3)",
    skills: [
      { 
        name: "Python", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        level: 5 
      },
      { 
        name: "C++", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        level: 4 
      },
      { 
        name: "JavaScript", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        level: 5 
      },
      { 
        name: "TypeScript", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        level: 5 
      },
      { 
        name: "React", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        level: 5 
      },
      { 
        name: "Next.js", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        level: 5 
      },
      { 
        name: "Node.js", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        level: 4 
      },
      { 
        name: "Flask", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        level: 4 
      },
      { 
        name: "PostgreSQL", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        level: 4 
      },
      { 
        name: "MongoDB", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        level: 4 
      },
      { 
        name: "Docker", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        level: 4 
      },
      { 
        name: "Git", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        level: 5 
      },
      { 
        name: "HTML5", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        level: 5 
      },
      { 
        name: "CSS3", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        level: 5 
      },
      { 
        name: "Material UI", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
        level: 4 
      },
      { 
        name: "Tailwind CSS", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        level: 5 
      }
    ]
  },
  physics: {
    title: "Physics",
    color: "from-blue-500 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.3)",
    skills: [
      { name: "Quantum Mechanics", level: 5 },
      { name: "Statistical Mechanics", level: 5 },
      { name: "Electromagnetism", level: 5 },
      { name: "Classical Mechanics", level: 5 },
      { name: "Lagrangian Mechanics", level: 5 },
      { name: "Hamiltonian Mechanics", level: 5 },
      { name: "Particle Physics", level: 4 },
      { name: "Thermodynamics", level: 5 },
      { name: "Computational Physics", level: 5 },
      { name: "Special Relativity", level: 5 },
      { name: "General Relativity", level: 4 },
      { name: "Quantum Field Theory", level: 3 },
      { name: "Condensed Matter", level: 4 },
      { name: "Optics", level: 4 },
      { name: "Scientific Computing", level: 5 },
      { name: "Research Methodologies", level: 5 }
    ]
  },
  mathematics: {
    title: "Mathematics",
    color: "from-purple-500 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.3)",
    skills: [
      { name: "Linear Algebra", level: 5 },
      { name: "Multivariable Calculus", level: 5 },
      { name: "Real Analysis", level: 5 },
      { name: "Complex Analysis", level: 4 },
      { name: "Differential Equations", level: 5 },
      { name: "Partial Differential Equations", level: 4 },
      { name: "Probability Theory", level: 5 },
      { name: "Measure Theory", level: 4 },
      { name: "Rough Path Theory", level: 3 },
      { name: "Numerical Methods", level: 5 },
      { name: "Mathematical Optimization", level: 5 },
      { name: "Group Theory", level: 4 },
      { name: "Topology", level: 3 },
      { name: "Fourier Analysis", level: 5 },
      { name: "Stochastic Processes", level: 5 },
      { name: "Statistical Analysis", level: 5 },
      { name: "Bayesian Statistics", level: 4 },
      { name: "Time Series Analysis", level: 5 }
    ]
  },
  machineLearning: {
    title: "Machine Learning & AI",
    color: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6, 182, 212, 0.3)",
    skills: [
      { 
        name: "TensorFlow", 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
        level: 5 
      },
      { name: "PyTorch", level: 5 },
      { name: "JAX", level: 4 },
      { name: "CUDA", level: 4 },
      { name: "Scikit-Learn", level: 5 },
      { name: "LSTM", level: 5 },
      { name: "GRU", level: 4 },
      { name: "Transformers", level: 4 },
      { name: "ARIMA", level: 4 },
      { name: "GANs", level: 4 },
      { name: "Optuna", level: 4 },
      { name: "Neural Networks", level: 5 },
      { name: "Deep Learning", level: 5 },
      { name: "NLP", level: 4 },
      { name: "Computer Vision", level: 3 },
      { name: "Reinforcement Learning", level: 4 },
      { name: "SLURM", level: 4 },
      { name: "RAG", level: 4 },
      { name: "QLoRA", level: 4 }
    ]
  }
};

export function SkillsSection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Reorder categories for the layout: 2 on top, 3 on bottom
  const topCategories = ['quantFinance', 'software'];
  const bottomCategories = ['physics', 'mathematics', 'machineLearning'];

  const renderCategoryTile = (key: string, category: typeof skillCategories[string], index: number, isTopRow: boolean) => {
    const { ref, isInView } = useSmoothScrollAnimation({ threshold: 0.3 });
    
    return (
      <motion.div
        ref={ref}
        key={key}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={scrollAnimationVariants.fadeInUp}
        transition={{ delay: getStaggerDelay(index, 0.12) }}
        onMouseEnter={(e) => {
        setHoveredCategory(key);
        e.currentTarget.style.borderColor = 
          key === 'quantFinance' ? 'rgba(34, 197, 94, 0.5)' :
          key === 'software' ? 'rgba(249, 115, 22, 0.5)' :
          key === 'physics' ? 'rgba(59, 130, 246, 0.5)' :
          key === 'mathematics' ? 'rgba(168, 85, 247, 0.5)' :
          'rgba(6, 182, 212, 0.5)';
      }}
      onMouseLeave={(e) => {
        setHoveredCategory(null);
        e.currentTarget.style.borderColor = '';
      }}
      className={`
        relative p-6 rounded-2xl
        bg-muted/30 dark:bg-muted/20 backdrop-blur-sm
        border-2 border-gray-300/30 dark:border-gray-700/30
        shadow-lg hover:shadow-2xl
        transition-all duration-500
        h-fit
        ${isTopRow ? 'lg:col-span-1' : ''}
      `}
      style={{
        boxShadow: hoveredCategory === key 
          ? `0 0 50px ${category.glowColor}` 
          : undefined
      }}
    >
      {/* Background gradient */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
          bg-gradient-to-br ${category.color}
          ${hoveredCategory === key ? 'opacity-5' : ''}
        `}
      />
      
      {/* Category Header */}
      <div className="relative mb-6 text-center">
        <h3 className={`
          text-2xl font-bold bg-gradient-to-r ${category.color} 
          bg-clip-text text-transparent
        `}>
          {category.title}
        </h3>
      </div>

      {/* Skills with dynamic sizing */}
      <div className="relative flex flex-wrap gap-2">
        {category.skills.map((skill, skillIndex) => {
          // Calculate dynamic width based on text length
          const textLength = skill.name.length;
          const widthClass = textLength < 5 ? 'w-auto px-3' : 
                            textLength < 10 ? 'w-auto px-4' : 
                            textLength < 15 ? 'w-auto px-5' : 
                            'w-auto px-6';
          
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.15 + skillIndex * 0.02,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }}
              className={`
                ${widthClass} py-2
                bg-background/50 dark:bg-black/50
                backdrop-blur-sm
                border border-gray-300/30 dark:border-gray-700/30
                rounded-lg
                transition-all duration-300
                hover:shadow-md
                group cursor-pointer
                inline-flex items-center gap-2
              `}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 
                  key === 'quantFinance' ? 'rgba(34, 197, 94, 0.5)' :
                  key === 'software' ? 'rgba(249, 115, 22, 0.5)' :
                  key === 'physics' ? 'rgba(59, 130, 246, 0.5)' :
                  key === 'mathematics' ? 'rgba(168, 85, 247, 0.5)' :
                  'rgba(6, 182, 212, 0.5)';
                e.currentTarget.style.boxShadow = 
                  key === 'quantFinance' ? '0 0 20px rgba(34, 197, 94, 0.3)' :
                  key === 'software' ? '0 0 20px rgba(249, 115, 22, 0.3)' :
                  key === 'physics' ? '0 0 20px rgba(59, 130, 246, 0.3)' :
                  key === 'mathematics' ? '0 0 20px rgba(168, 85, 247, 0.3)' :
                  '0 0 20px rgba(6, 182, 212, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Icon */}
              {skill.icon && (
                skill.icon.startsWith('http') ? (
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      fill
                      className="object-contain dark:filter dark:brightness-90"
                    />
                  </div>
                ) : (
                  <span className="text-sm">{skill.icon}</span>
                )
              )}
              
              {/* Name */}
              <span className="text-sm font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
    );
  };

  return (
    <Section id="skills" className="relative">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scrollAnimationVariants.fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Technical <span className="text-primary">Skills</span>
          </h2>

          {/* Top row - 2 categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {topCategories.map((key, index) => 
              renderCategoryTile(key, skillCategories[key], index, true)
            )}
          </div>

          {/* Bottom row - 3 categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bottomCategories.map((key, index) => 
              renderCategoryTile(key, skillCategories[key], index + 2, false)
            )}
          </div>

          {/* Bottom Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground mt-12"
          >
            Proficiency levels based on academic coursework, research projects, and industry experience
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  );
}