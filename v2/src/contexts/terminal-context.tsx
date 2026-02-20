"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

export interface TerminalLine {
  id: number;
  type: "command" | "output" | "prompt";
  text: string;
}

interface TerminalContextType {
  commandHistory: string[];
  addToHistory: (cmd: string) => void;
  lines: TerminalLine[];
  addLine: (type: TerminalLine["type"], text: string) => void;
  clearLines: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const lineIdRef = useRef(0);

  const addToHistory = useCallback((cmd: string) => {
    setCommandHistory((prev) => [...prev, cmd]);
  }, []);

  const addLine = useCallback((type: TerminalLine["type"], text: string) => {
    const id = lineIdRef.current++;
    setLines((prev) => [...prev, { id, type, text }]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  return (
    <TerminalContext.Provider value={{ commandHistory, addToHistory, lines, addLine, clearLines }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used within TerminalProvider");
  return ctx;
}
