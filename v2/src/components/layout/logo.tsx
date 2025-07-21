"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className, onClick }: LogoProps) {
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
      <span className="relative text-2xl font-bold font-display text-primary">
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
      </span>
      
      {/* Terminal cursor */}
      <span className="inline-block w-3 h-5 bg-primary ml-1 animate-terminal-blink" />
    </Link>
  );
}