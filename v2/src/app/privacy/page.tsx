"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl text-center space-y-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mx-auto"
        >
          <Eye className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Main heading with glow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_3s_ease-in-out_infinite]">
            Privacy Policy
          </span>
        </motion.h1>

        {/* The joke */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-4"
        >
          <p className="text-2xl sm:text-3xl font-semibold text-foreground/90">
            You think you&apos;re private?
          </p>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            I&apos;m stealing <span className="text-primary font-mono font-bold glow-green">all</span> your data.
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 20 }}
            className="text-3xl sm:text-4xl pt-2"
          >
            Ha ha ha.
          </motion.p>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-sm text-muted-foreground/60 font-mono"
        >
          (it&apos;s a portfolio website. relax.)
        </motion.p>

        {/* Decorative terminal line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mx-auto max-w-md border-t border-primary/20"
        />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            back to safety
          </Link>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
