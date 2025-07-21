import { cn } from "@/lib/utils";
import React from "react";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: "green" | "cyan" | "pink" | "purple";
}

export function GlowCard({
  children,
  className,
  glowColor = "green",
  ...props
}: GlowCardProps) {
  const glowColors = {
    green: "rgba(34, 197, 94, 0.15)",
    cyan: "rgba(6, 182, 212, 0.15)",
    pink: "rgba(236, 72, 153, 0.15)",
    purple: "rgba(168, 85, 247, 0.15)",
  };

  const borderColors = {
    green: "hover:border-green-500/30",
    cyan: "hover:border-cyan-500/30",
    pink: "hover:border-pink-500/30",
    purple: "hover:border-purple-500/30",
  };

  return (
    <div className="relative group">
      {/* Glow effect layer */}
      <div
        className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
        style={{ background: glowColors[glowColor] }}
      />
      
      {/* Card content */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border/30 bg-card/50 dark:bg-black/40 p-6 backdrop-blur-sm transition-all duration-300",
          "group-hover:-translate-y-0.5",
          borderColors[glowColor],
          "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}