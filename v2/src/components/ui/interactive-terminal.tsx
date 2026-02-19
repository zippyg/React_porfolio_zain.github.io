"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { executeCommand, CommandContext } from "@/lib/terminal-commands";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useTheme } from "@/contexts/theme-context";
import { useEasterEggs } from "@/contexts/easter-egg-context";

interface TerminalLine {
  id: number;
  type: "command" | "output" | "prompt";
  text: string;
}

type TerminalState = "embedded" | "floating" | "minimized" | "fullscreen" | "closed";

interface InteractiveTerminalProps {
  initialDelay?: number;
}

export function InteractiveTerminal({ initialDelay = 500 }: InteractiveTerminalProps) {
  const [terminalState, setTerminalState] = useState<TerminalState>("embedded");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 420, height: 300 });

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { toggleFunMode, isFunMode } = useFunMode();
  const { theme, toggleTheme } = useTheme();
  const { discoverEgg } = useEasterEggs();

  const addLine = useCallback((type: TerminalLine["type"], text: string) => {
    const id = lineIdRef.current++;
    setLines((prev) => [...prev, { id, type, text }]);
  }, []);

  // Command context for shared command registry
  const getCommandContext = useCallback((): CommandContext => ({
    scrollTo: (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    },
    toggleTheme,
    toggleFunMode,
    isFunMode,
    theme,
    discoverEgg,
  }), [toggleTheme, toggleFunMode, isFunMode, theme, discoverEgg]);

  // Typewriter intro
  useEffect(() => {
    const introLines = [
      { text: "$ whoami", type: "command" as const, delay: 0 },
      { text: "> zain mughal", type: "output" as const, delay: 200 },
      { text: "> physics msci @ imperial", type: "output" as const, delay: 400 },
      { text: "> quant research · ml · full-stack", type: "output" as const, delay: 600 },
      { text: "", type: "output" as const, delay: 800 },
      { text: "$ status", type: "command" as const, delay: 1100 },
      { text: "> open to opportunities", type: "output" as const, delay: 1300 },
      { text: "> london, uk", type: "output" as const, delay: 1500 },
    ];

    const timeouts: NodeJS.Timeout[] = [];
    introLines.forEach((line) => {
      const t = setTimeout(() => {
        addLine(line.type, line.text);
      }, (initialDelay || 0) + line.delay);
      timeouts.push(t);
    });

    const doneTimeout = setTimeout(() => {
      setIsTyping(false);
    }, (initialDelay || 0) + 1800);
    timeouts.push(doneTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [initialDelay, addLine]);

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when typing phase ends
  useEffect(() => {
    if (!isTyping && terminalState !== "closed" && terminalState !== "minimized") {
      inputRef.current?.focus();
    }
  }, [isTyping, terminalState]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addLine("prompt", `$ ${trimmed}`);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput("");

    const ctx = getCommandContext();
    const { command, output } = executeCommand(trimmed, ctx);

    if (command === "clear") {
      setLines([]);
      return;
    }

    if (output.length === 1 && output[0] === "__HISTORY__") {
      // Special: show command history
      commandHistory.forEach((cmd, i) => {
        addLine("output", `  ${i + 1}  ${cmd}`);
      });
      addLine("output", `  ${commandHistory.length + 1}  ${trimmed}`);
      return;
    }

    output.forEach((line) => addLine("output", line));
  }, [input, addLine, getCommandContext, commandHistory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    },
    [handleSubmit, commandHistory, historyIndex]
  );

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Only drag from title bar, not traffic lights
      if ((e.target as HTMLElement).closest(".traffic-light")) return;

      if (terminalState === "embedded") {
        // Switch to floating
        const rect = terminalRef.current?.getBoundingClientRect();
        if (rect) {
          setPosition({ x: rect.left, y: rect.top });
          setSize({ width: rect.width, height: rect.height });
        }
        setTerminalState("floating");
        // Start drag immediately
        const rect2 = terminalRef.current?.getBoundingClientRect();
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          posX: rect2?.left || 0,
          posY: rect2?.top || 0,
        };
      } else if (terminalState === "floating") {
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          posX: position.x,
          posY: position.y,
        };
      }
    },
    [terminalState, position]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setPosition({
          x: dragRef.current.posX + dx,
          y: dragRef.current.posY + dy,
        });
      }
      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        setSize({
          width: Math.max(350, Math.min(window.innerWidth * 0.9, resizeRef.current.w + dx)),
          height: Math.max(200, Math.min(window.innerHeight * 0.8, resizeRef.current.h + dy)),
        });
      }
    };
    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Resize handler
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (terminalState !== "floating") return;
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        w: size.width,
        h: size.height,
      };
    },
    [terminalState, size]
  );

  // Click terminal body to focus input
  const handleBodyClick = useCallback(() => {
    if (!isTyping) inputRef.current?.focus();
  }, [isTyping]);

  // Closed state → small restore button
  if (terminalState === "closed") {
    return (
      <button
        onClick={() => setTerminalState("floating")}
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-black/80 border border-green-500/30 rounded text-green-500 text-xs font-mono hover:border-green-500/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all"
      >
        ~/zain ↗
      </button>
    );
  }

  // Minimized state → small bar
  if (terminalState === "minimized") {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-green-500/20 rounded text-xs font-mono cursor-pointer hover:border-green-500/40 transition-all"
        onClick={() => setTerminalState("floating")}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <span className="text-muted-foreground/60">~/zain</span>
      </div>
    );
  }

  const isFloatingOrFullscreen = terminalState === "floating" || terminalState === "fullscreen";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const terminalStyle: React.CSSProperties =
    terminalState === "fullscreen"
      ? {
          position: "fixed",
          top: "5vh",
          left: "5vw",
          width: "90vw",
          height: "90vh",
          zIndex: 50,
        }
      : terminalState === "floating"
      ? {
          position: "fixed",
          left: position.x,
          top: position.y,
          width: isMobile ? "90vw" : size.width,
          height: isMobile ? "auto" : size.height,
          zIndex: 50,
        }
      : {};

  return (
    <>
      {/* Backdrop for fullscreen */}
      {terminalState === "fullscreen" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setTerminalState("floating")} />
      )}

      <div
        ref={terminalRef}
        style={terminalStyle}
        className={`relative font-mono text-sm bg-black/90 border border-green-500/20 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.08)] flex flex-col ${
          isFloatingOrFullscreen ? "backdrop-blur-md" : "backdrop-blur-sm"
        } ${terminalState === "embedded" ? "min-h-[220px]" : ""}`}
        onClick={handleBodyClick}
      >
        {/* Title bar */}
        <div
          className={`flex items-center gap-1.5 px-4 py-3 border-b border-green-500/10 select-none ${
            terminalState !== "embedded" || !isMobile ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={!isMobile ? handleDragStart : undefined}
        >
          {/* Traffic lights */}
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalState("closed");
            }}
          />
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalState("minimized");
            }}
          />
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalState(terminalState === "fullscreen" ? "floating" : "fullscreen");
            }}
          />
          <span className="ml-2 text-xs text-muted-foreground/40">~/zain</span>
          {/* Drag handle dots */}
          {!isMobile && terminalState !== "embedded" && (
            <span className="ml-auto text-muted-foreground/20 text-xs tracking-widest">⠿</span>
          )}
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto p-4 space-y-0.5 min-h-0"
          style={terminalState === "embedded" ? { minHeight: "160px", maxHeight: "300px" } : undefined}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={
                line.type === "command" || line.type === "prompt"
                  ? "text-green-400"
                  : line.text === ""
                  ? "h-3"
                  : "text-muted-foreground/70"
              }
            >
              {line.text}
            </div>
          ))}

          {/* Input line */}
          {!isTyping && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-400 outline-none caret-transparent font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <span
                className={`inline-block w-2 h-4 bg-green-400 ${
                  showCursor ? "opacity-100" : "opacity-0"
                } transition-opacity`}
              />
            </div>
          )}

          {/* Typing phase cursor */}
          {isTyping && (
            <span
              className={`inline-block w-2 h-4 bg-green-400 ${
                showCursor ? "opacity-100" : "opacity-0"
              } transition-opacity`}
            />
          )}
        </div>

        {/* Resize handle — only in floating state on desktop */}
        {terminalState === "floating" && !isMobile && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
            onMouseDown={handleResizeStart}
          >
            <svg className="w-3 h-3 text-muted-foreground/30 absolute bottom-1 right-1" viewBox="0 0 12 12">
              <path d="M11 1v10H1" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 5v6H5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 9v2H9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}
