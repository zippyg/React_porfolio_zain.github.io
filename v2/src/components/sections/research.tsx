"use client";

import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Brain, Atom } from "lucide-react";

const researchAreas = [
  {
    icon: Atom,
    title: "Particle Physics",
    description: "Computational studies in neutrino oscillations and Higgs boson analysis",
    papers: ["Neutrino Oscillation Parameter Extraction", "Higgs Boson Statistical Analysis"]
  },
  {
    icon: TrendingUp,
    title: "Quantitative Finance",
    description: "Advanced options pricing models and market anomaly detection systems",
    papers: ["Enhanced Black-Scholes with Adaptive Volatility", "Detecting Market Data Feed Issues"]
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Applications of deep learning in financial markets and physics simulations",
    papers: ["LSTM Models for Volatility Prediction", "GAN-based Market Generation"]
  }
];

const publications = [
  {
    title: "Extraction of Neutrino Oscillation Parameters Using Advanced Optimization",
    venue: "Imperial College Physics Department",
    year: 2024,
    type: "Thesis",
    abstract: "Computational extraction of θ23 and Δm²23 using Grid Search, Simulated Annealing, and Nelder-Mead optimization."
  },
  {
    title: "Detecting Staleness and False Jumps in Fixed-Income Market Data",
    venue: "Quantitative Finance Research",
    year: 2024,
    type: "Working Paper",
    abstract: "ML-powered anomaly detection for high-frequency trading environments with sub-10ms latency."
  },
  {
    title: "Thermodynamic Simulation of Gas Behavior Through Kinetic Theory",
    venue: "Computational Physics Lab",
    year: 2023,
    type: "Research Project",
    abstract: "Validation of Maxwell-Boltzmann distribution through hard-sphere collision simulations."
  }
];

export function ResearchSection() {
  return (
    <Section id="research" className="relative">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Research & <span className="text-primary">Publications</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Exploring the intersection of physics, mathematics, and computational finance
            through rigorous research and innovative solutions
          </p>
        </motion.div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <area.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{area.description}</p>
              <div className="space-y-1">
                {area.papers.map((paper) => (
                  <p key={paper} className="text-xs text-gray-500">• {paper}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Recent Publications
          </h3>

          <div className="space-y-6">
            {publications.map((pub, index) => (
              <motion.article
                key={pub.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{pub.title}</h4>
                    <p className="text-sm text-gray-400">
                      {pub.venue} • {pub.year}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                    {pub.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{pub.abstract}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Interested in collaboration or discussing research opportunities?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}