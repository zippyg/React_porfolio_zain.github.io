"use client";

import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Calendar, MapPin, BookOpen, Award } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "@/components/ui/image-modal";

const education = [
  {
    institution: "Imperial College London",
    degree: "Physics MSci",
    period: "2022 - 2026",
    grade: "Predicted 1:1 (First Class Honours)",
    highlights: [
      "Comprehensive study of Differential Equations, Probability Analysis, Monte Carlo methods",
      "BPES modules: Accounting & Finance, Business Economics",
      "Investment Society (Securities Education based on CFA)",
      "Finance Society (Investment Banking Training)",
      "AlgoTrading Society"
    ]
  },
  {
    institution: "Bishopshalt School",
    degree: "A Levels",
    period: "2020 - 2022",
    grade: "A*A*A* in Mathematics, Physics, Computer Science"
  },
  {
    institution: "Rosedale College",
    degree: "GCSEs",
    period: "2015 - 2020",
    grade: "13 GCSEs with grades 9 to 8 including Maths and English, and 2 Distinctions",
    highlights: [
      "Achieved 13 GCSEs with grades 9 to 8 including Maths and English, and 2 Distinctions",
      "Valedictorian, recognised for academic excellence and leadership qualities"
    ]
  }
];

const smoothEase = [0.22, 1, 0.36, 1] as const;

const paragraphContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const paragraphItem = {
  hidden: { opacity: 0, x: -40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: smoothEase },
  },
};

export function AboutSection() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <Section id="about" className="relative pt-8 sm:pt-10 lg:pt-12">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Introduction */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={paragraphContainer}
          >
            <motion.div variants={paragraphItem} className="flex items-center gap-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About <span className="text-primary">Me</span>
              </h2>

              {/* Headshot with gradient fade */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsImageModalOpen(true)}
                className="relative group cursor-pointer"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-full">
                  <Image
                    src="/assets/curl_headshot.png"
                    alt="Zain Mughal"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/30 via-transparent to-transparent" />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                    <span className="text-xs text-white/80">View</span>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.div>

            <div className="space-y-4 text-muted-foreground">
              <motion.p variants={paragraphItem} className="text-lg leading-relaxed">
                I am the most un-physicist physics student you'll ever meet.
                A simple, raw blend of curiosity, ability, and exposure has taken me a long way and
                will continue to drive me.
              </motion.p>

              <motion.p variants={paragraphItem} className="leading-relaxed">
                Practical programming skills unlock every barrier that has stood in my path so far,
                implementing math and physics into algorithms and even quantitative deployable algorithms
                at full scale. From simulating particle physics phenomena to deploying algorithmic trading
                models successfully and profitably. I, for some reason, find enjoyment in transforming
                seemingly abstract mathematical concepts into practical, profitable, high-performance
                solutions that other people - and even myself at some points - struggle to understand.
              </motion.p>

              <motion.p variants={paragraphItem} className="leading-relaxed">
                My work isn't just physics - it goes into research, machine learning, quant finance,
                full-stack development. Without hyping myself up too much, I am a jack of all trades,
                but a specialized one. Currently focused on machine learning applications in financial
                markets, advanced risk modeling, and actually deployable pipelines within this niche.
                As well as advanced mathematical techniques to reshape how the world really looks at
                irregular data.
              </motion.p>
            </div>

          </motion.div>

          {/* Right Column - Education Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Education
            </h3>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: smoothEase }}
                  className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-primary/20"
                >
                  <div className="absolute left-[-4px] top-2 w-[10px] h-[10px] bg-primary rounded-full" />

                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{edu.institution}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {edu.degree}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm text-primary">{edu.grade}</p>

                    {edu.highlights && (
                      <ul className="mt-2 space-y-1">
                        {edu.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease: smoothEase }}
              className="mt-8 flex items-center gap-2 text-muted-foreground"
            >
              <MapPin className="w-4 h-4" />
              <span>London, United Kingdom</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: smoothEase }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
        >
          <div className="bg-gray-100/40 dark:bg-gray-900/30 backdrop-blur-sm border border-gray-300/30 dark:border-gray-700/30 rounded-lg p-6 text-center shadow-sm hover:border-primary/30 transition-colors">
            <div className="text-3xl font-bold text-primary mb-2">12+</div>
            <div className="text-sm text-muted-foreground">Major Projects</div>
          </div>

          <div className="bg-gray-100/40 dark:bg-gray-900/30 backdrop-blur-sm border border-gray-300/30 dark:border-gray-700/30 rounded-lg p-6 text-center shadow-sm hover:border-primary/30 transition-colors">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Research Papers</div>
          </div>

          <div className="bg-gray-100/40 dark:bg-gray-900/30 backdrop-blur-sm border border-gray-300/30 dark:border-gray-700/30 rounded-lg p-6 text-center shadow-sm hover:border-primary/30 transition-colors">
            <div className="text-3xl font-bold text-primary mb-2">Coming Soon</div>
            <div className="text-sm text-muted-foreground">Published Papers</div>
          </div>
        </motion.div>
      </Container>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc="/assets/curl_headshot.png"
        imageAlt="Zain Mughal - Full View"
      />
    </Section>
  );
}
