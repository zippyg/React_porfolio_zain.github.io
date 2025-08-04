import { useRef, useEffect } from 'react';
import { useInView, Variants } from 'framer-motion';

interface UseSmoothScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useSmoothScrollAnimation({
  threshold = 0.1,
  rootMargin = "-50px",
  triggerOnce = true
}: UseSmoothScrollAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold
  });

  return { ref, isInView };
}

// Animation variants for consistent scroll animations
export const scrollAnimationVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 30,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" // Smooth easing
      }
    }
  },
  fadeIn: {
    hidden: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },
  staggerChildren: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  }
};

// Utility function for stagger delay
export const getStaggerDelay = (index: number, baseDelay: number = 0.08) => {
  return Math.min(index * baseDelay, 0.5); // Cap at 0.5s to prevent too long delays
};