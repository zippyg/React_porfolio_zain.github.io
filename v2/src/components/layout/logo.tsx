"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  onClick?: () => void;
  showFullName?: boolean;
}

export function Logo({ className, onClick, showFullName = false }: LogoProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      href="/"
      className={cn("relative inline-block group cursor-pointer", className)}
      onClick={handleClick}
    >
      <span className="relative text-2xl font-bold font-display text-primary flex items-center">
        <AnimatePresence mode="wait">
          {showFullName ? (
            <motion.span
              key="fullname"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden whitespace-nowrap"
            >
              {/* Main text */}
              <span className="relative z-10">Zain Mughal</span>
              
              {/* Glitch layers */}
              <span
                className="absolute top-0 left-0 -ml-[1px] text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
                aria-hidden="true"
              >
                Zain Mughal
              </span>
              <span
                className="absolute top-0 left-0 ml-[1px] text-pink-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
                style={{ animationDelay: "0.1s" }}
                aria-hidden="true"
              >
                Zain Mughal
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="initials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Main text */}
              <span className="relative z-10">ZM</span>
              
              {/* Glitch layers */}
              <span
                className="absolute top-0 left-0 -ml-[1px] text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
                aria-hidden="true"
              >
                ZM
              </span>
              <span
                className="absolute top-0 left-0 ml-[1px] text-pink-500 opacity-0 group-hover:opacity-70 group-hover:animate-glitch transition-opacity"
                style={{ animationDelay: "0.1s" }}
                aria-hidden="true"
              >
                ZM
              </span>
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Terminal cursor - only show with initials */}
        {!showFullName && (
          <span className="inline-block w-3 h-5 bg-primary ml-1 animate-terminal-blink" />
        )}
      </span>
    </Link>
  );
}