"use client";

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

interface SkillCategory {
  title: string;
  accentColor: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Quantitative & Finance",
    accentColor: "border-l-green-500",
    skills: [
      "Python",
      "C++",
      "Monte Carlo Methods",
      "Derivatives Pricing",
      "Stochastic Calculus",
      "Risk Modelling",
    ],
  },
  {
    title: "Engineering",
    accentColor: "border-l-cyan-500",
    skills: [
      "React / Next.js",
      "TypeScript",
      "Rust",
      "Solidity",
      "CUDA / GPU",
      "Docker",
    ],
  },
  {
    title: "ML & Physics",
    accentColor: "border-l-purple-500",
    skills: [
      "PyTorch",
      "JAX",
      "Deep Learning",
      "NLP",
      "Quantum Mechanics",
      "Statistical Mechanics",
    ],
  },
];

const allSkills = [
  "Options Pricing", "Black-Scholes", "Heston Model", "SABR Model", "VaR / CVaR",
  "GARCH Models", "Time Series Analysis", "Portfolio Optimization",
  "JavaScript", "Node.js", "Flask", "PostgreSQL", "MongoDB", "Git",
  "Tailwind CSS", "NumPy", "pandas", "Polars", "QuantLib",
  "TensorFlow", "Scikit-Learn", "Transformers", "ARIMA", "RAG", "QLoRA",
  "Reinforcement Learning", "Computer Vision",
  "Linear Algebra", "Differential Equations", "Real Analysis",
  "Probability Theory", "Numerical Methods", "Fourier Analysis",
  "Bayesian Statistics", "Stochastic Processes",
  "Electromagnetism", "Thermodynamics", "Computational Physics",
  "Particle Physics", "Special Relativity",
];

export function SkillsSection() {
  const [showAll, setShowAll] = useState(false);

  return (
    <Section id="skills" className="relative pt-8 sm:pt-10 lg:pt-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Technical <span className="text-primary">Skills</span>
          </h2>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {skillCategories.map((category, catIdx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: catIdx * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <h3 className="font-mono text-sm text-muted-foreground/60 uppercase tracking-wider mb-4">
                  {category.title}
                </h3>
                <ul className={`space-y-2 border-l-2 ${category.accentColor} pl-4`}>
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-foreground/90 text-sm"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Expandable "See all skills" */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-muted-foreground/60 hover:text-primary transition-colors font-mono"
            >
              {showAll ? "— Show less" : "+ See all skills"}
            </button>

            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
              >
                {allSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs bg-muted/30 text-muted-foreground rounded border border-border/30"
                  >
                    {skill}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
