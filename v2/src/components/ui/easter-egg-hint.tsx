"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunMode } from '@/contexts/fun-mode-context';

export function EasterEggHint() {
  const { isFunMode } = useFunMode();
  const [showHint, setShowHint] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect OS and mobile
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacOS = userAgent.includes('mac');
    setIsMac(isMacOS);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Console easter egg message
  useEffect(() => {
    if (!hasShownHint) {
      const shortcut = isMac ? '⌘Z' : 'Ctrl+Z';
      console.log(
        `%c🎮 Easter Egg Detected! %c\nPress %c${shortcut} %cto open the command palette...\nThere might be something %cfun %cin there.`,
        'color: #22c55e; font-size: 20px; font-weight: bold;',
        'color: #888; font-size: 14px;',
        'color: #22c55e; background: #000; padding: 2px 6px; border-radius: 4px; font-family: monospace;',
        'color: #888; font-size: 14px;',
        'color: #22c55e; font-weight: bold;',
        'color: #888; font-size: 14px;'
      );
      setHasShownHint(true);
    }
  }, [hasShownHint, isMac]);

  // Show a subtle hint after 3 seconds, only once (not on mobile)
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenEasterEggHint');
    
    if (!hasSeenHint && !isFunMode && !isMobile) {
      const timer = setTimeout(() => {
        setShowHint(true);
        localStorage.setItem('hasSeenEasterEggHint', 'true');
        
        // Hide the hint after 5 seconds
        setTimeout(() => {
          setShowHint(false);
        }, 5000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isFunMode, isMobile]);

  return (
    <>
      {/* Subtle visual hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 z-50 pointer-events-none"
          >
            <div className="relative">
              {/* Glowing orb */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
              />
              
              {/* Hint text */}
              <div className="relative bg-black/80 border border-primary/20 rounded-lg px-4 py-2">
                <p className="text-xs text-gray-400">
                  Try pressing <kbd className="px-1.5 py-0.5 text-[10px] bg-primary/10 rounded border border-primary/20 font-mono">{isMac ? '⌘Z' : 'Ctrl+Z'}</kbd>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fun mode indicator removed - now in easter-egg-counter */}
    </>
  );
}