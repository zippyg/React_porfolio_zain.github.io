"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  typewriter?: boolean;
}

export function AnimatedText({ text, className, delay = 0, typewriter = false }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState(typewriter ? "" : text);

  useEffect(() => {
    if (!typewriter) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, typewriter]);

  if (typewriter) {
    return (
      <span className={cn("font-mono", className)}>
        {displayText}
        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-terminal-blink" />
      </span>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <m.span
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ delay, duration: 0.5 }}
        className={className}
      >
        {text}
      </m.span>
    </AnimatePresence>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <span className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 -ml-[2px] text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 ml-[2px] text-pink-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
        style={{ animationDelay: "0.1s" }}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}