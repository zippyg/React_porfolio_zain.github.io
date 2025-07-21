"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FunModeContextType {
  isFunMode: boolean;
  toggleFunMode: () => void;
  setFunMode: (enabled: boolean) => void;
}

const FunModeContext = createContext<FunModeContextType | undefined>(undefined);

export function FunModeProvider({ children }: { children: ReactNode }) {
  const [isFunMode, setIsFunMode] = useState(false);

  // Add/remove body class for CSS effects
  useEffect(() => {
    if (isFunMode) {
      document.body.classList.add('fun-mode-active');
    } else {
      document.body.classList.remove('fun-mode-active');
    }
  }, [isFunMode]);

  const toggleFunMode = () => {
    setIsFunMode(prev => !prev);
  };

  const setFunMode = (enabled: boolean) => {
    setIsFunMode(enabled);
  };

  return (
    <FunModeContext.Provider value={{ isFunMode, toggleFunMode, setFunMode }}>
      {children}
    </FunModeContext.Provider>
  );
}

export function useFunMode() {
  const context = useContext(FunModeContext);
  if (context === undefined) {
    throw new Error('useFunMode must be used within a FunModeProvider');
  }
  return context;
}