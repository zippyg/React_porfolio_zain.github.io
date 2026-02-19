"use client";

import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const publications = [
  {
    title: "FinLLM-HALO-500: A Financial Q&A Benchmark with Novel Metrics for Evaluating and Mitigating LLM Hallucinations",
    venue: "EMNLP 2026 (Target)",
    year: 2026,
    type: "In Progress",
    abstract: "Manually curated and open-sourced FinHALO-500, a 500-pair SEC finance Q&A benchmark and mitigation library, introducing two novel evaluation metrics: NIWH (materiality-weighted errors) and BAHE (cost-performance optimisation). Developed end-to-end mitigation pipeline combining RAG with QLoRA fine-tuning, reducing GPT-4o hallucinations by >20pp on SEC filing numeric tasks while slashing inference costs by 78%."
  },
  {
    title: "Advanced Volatility Modeling using Deep Learning",
    venue: "Journal of Financial Data Science (Target)",
    year: 2026,
    type: "In Progress",
    abstract: "Novel approach to volatility forecasting combining LSTM networks with traditional GARCH models. Emphasis on high-frequency trading data and market microstructure."
  },
  {
    title: "Rough Path Theory Applications in Neural Network Optimisation",
    venue: "JMLR / NeurIPS 2026 (Target)",
    year: 2026,
    type: "In Progress",
    abstract: "Theoretical framework connecting path integrals from physics to neural network training dynamics. Applications to understanding loss landscape geometry and optimisation trajectories."
  }
];

function WordRevealTitle({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.3,
            ease: smoothEase,
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function ResearchCard({ pub, index }: { pub: typeof publications[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: smoothEase }}
      className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300 shadow-sm group"
    >
      {/* Orange glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-1">
              <WordRevealTitle text={`${pub.title} - Coming Soon`} delay={index * 0.15} />
            </h4>
            <p className="text-sm text-muted-foreground">
              {pub.venue} • {pub.year}
            </p>
          </div>
          <span className="px-3 py-1 text-xs bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20 whitespace-nowrap">
            {pub.type}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{pub.abstract}</p>
        <motion.div className="flex items-center text-sm text-orange-500 font-medium group-hover:translate-x-1 transition-transform">
          <FileText className="w-4 h-4 mr-1" />
          Manuscript in preparation
        </motion.div>
      </div>
    </motion.article>
  );
}

export function ResearchSection() {
  return (
    <Section id="research" className="relative">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Research & <span className="text-primary">Publications</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exploring the intersection of physics, mathematics, and computational finance
            through rigorous research and innovative solutions
          </p>
        </motion.div>

        {/* Papers in Progress */}
        <div className="space-y-6">
            {publications.map((pub, index) => (
              <ResearchCard
                key={pub.title}
                pub={pub}
                index={index}
              />
            ))}
          </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.6, ease: smoothEase }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
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
