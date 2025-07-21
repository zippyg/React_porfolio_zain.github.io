"use client";

import { motion } from "framer-motion";
import { Egg } from "lucide-react";
import { useEasterEggs } from "@/contexts/easter-egg-context";
import { useFunMode } from "@/contexts/fun-mode-context";

export function EasterEggCounter() {
  const { discoveredCount, totalEggs } = useEasterEggs();
  const { isFunMode } = useFunMode();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3, duration: 0.5 }}
      className="fixed bottom-4 left-4 z-20"
    >
      <div className="group relative flex items-center gap-3">
        {/* Easter egg counter */}
        <motion.div
          animate={isFunMode ? {
            y: [0, -5, 0],
            rotate: [0, 5, -5, 0]
          } : {
            y: [0, -2, 0]
          }}
          transition={{
            duration: isFunMode ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 bg-background/80 dark:bg-black/60 backdrop-blur-sm border border-border/50 rounded-full shadow-lg cursor-pointer hover:border-primary/50 transition-all duration-300"
        >
          <Egg className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">
            {discoveredCount} / {totalEggs}
          </span>
        </motion.div>
        
        {/* Fun mode indicator - positioned to the right */}
        {isFunMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group cursor-help"
            title="Fun mode is active! 🎮"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:bg-primary/50 transition-colors" />
              
              {/* Icon */}
              <div className="relative w-8 h-8 bg-black/80 dark:bg-black/80 border border-primary/50 rounded-full flex items-center justify-center">
                <span className="text-sm">🎮</span>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Easter eggs discovered
        </div>
        
        {/* Glow effect when eggs are discovered */}
        {discoveredCount > 0 && (
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}