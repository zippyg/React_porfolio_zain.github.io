"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface EasterEggContextType {
  discoveredEggs: Set<string>;
  discoverEgg: (eggId: string) => void;
  totalEggs: number;
  discoveredCount: number;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export const EASTER_EGGS = {
  FUN_MODE: "fun_mode",
  TORCH_LIGHT: "torch_light",
  DOUBLE_CLICK_WARP: "double_click_warp",
  EQUATION_COLLISION: "equation_collision",
  FINAL_SECRET: "final_secret",
} as const;

// No longer enforcing order - eggs can be discovered in any sequence

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());

  const discoverEgg = (eggId: string) => {
    if (!discoveredEggs.has(eggId)) {
      const newEggs = new Set(discoveredEggs);
      newEggs.add(eggId);
      setDiscoveredEggs(newEggs);
      
      // Show a subtle notification
      if (typeof window !== "undefined") {
        console.log(`🎉 Easter egg discovered: ${eggId}!`);
      }
      
      // Don't auto-trigger 5th egg - we'll build it properly later
      // Just celebrate finding all 4
      const mainEggs = [
        EASTER_EGGS.FUN_MODE,
        EASTER_EGGS.TORCH_LIGHT,
        EASTER_EGGS.DOUBLE_CLICK_WARP,
        EASTER_EGGS.EQUATION_COLLISION
      ];
      
      const foundCount = mainEggs.filter(egg => newEggs.has(egg)).length;
      if (foundCount === 4 && !newEggs.has(EASTER_EGGS.FINAL_SECRET)) {
        console.log(`🎊 Amazing! You found all 4 easter eggs! Stay tuned for the final secret...`);
      }
    }
  };

  return (
    <EasterEggContext.Provider
      value={{
        discoveredEggs,
        discoverEgg,
        totalEggs: 5, // All 5 easter eggs are now implemented
        discoveredCount: discoveredEggs.size,
      }}
    >
      {children}
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs() {
  const context = useContext(EasterEggContext);
  if (context === undefined) {
    throw new Error("useEasterEggs must be used within an EasterEggProvider");
  }
  return context;
}