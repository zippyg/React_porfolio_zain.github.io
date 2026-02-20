"use client";

import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

interface LenisContextValue {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  stop: () => {},
  start: () => {},
});

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  useEffect(() => {
    // Defer Lenis initialization so the page paints first
    const timerId = setTimeout(() => {
      const lenis = new Lenis({
        lerp: 0.12,
        duration: 0.9,
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Allow programmatic scrollTo to work with Lenis
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]');
        if (anchor) {
          const href = anchor.getAttribute("href");
          if (href && href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) {
              e.preventDefault();
              lenis.scrollTo(el as HTMLElement);
            }
          }
        }
      };
      document.addEventListener("click", handleAnchorClick);

      // Pause Lenis when tab is hidden to prevent scroll-jump on return
      const handleVisibilityChange = () => {
        if (document.hidden) {
          lenis.stop();
        } else {
          // Small delay lets the browser settle before resuming
          setTimeout(() => lenis.start(), 50);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Store cleanup ref
      (lenisRef as any)._cleanup = () => {
        document.removeEventListener("click", handleAnchorClick);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        lenis.destroy();
      };
    }, 100);

    return () => {
      clearTimeout(timerId);
      if ((lenisRef as any)._cleanup) {
        (lenisRef as any)._cleanup();
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={{ stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
