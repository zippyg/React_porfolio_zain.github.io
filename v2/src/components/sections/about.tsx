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
  }
];

export function AboutSection() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <Section id="about" className="relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-6 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                About <span className="text-primary">Me</span>
              </h2>
              
              {/* Headshot with gradient fade */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
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
                  {/* Gradient mask for fading transparency */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/30 via-transparent to-transparent" />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                    <span className="text-xs text-white/80">View</span>
                  </div>
                </div>
                
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                I'm a Physics MSci student at Imperial College London with a passion for 
                quantitative research and software development. My unique blend of theoretical 
                physics knowledge and practical programming skills enables me to tackle complex 
                problems at the intersection of science and technology.
              </p>
              
              <p className="leading-relaxed">
                From simulating particle physics phenomena to building sophisticated financial 
                models, I thrive on transforming abstract mathematical concepts into practical, 
                high-performance solutions. My work spans across physics research, quantitative 
                finance, and full-stack development.
              </p>
              
              <p className="leading-relaxed">
                Currently focused on machine learning applications in financial markets, 
                advanced risk modeling, and exploring the fascinating world of particle physics 
                through computational methods.
              </p>
            </div>

          </motion.div>

          {/* Right Column - Education Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Education
            </h3>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.institution}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
                      <ul className="mt-3 space-y-1">
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
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-2 text-muted-foreground"
            >
              <MapPin className="w-4 h-4" />
              <span>London, United Kingdom</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
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