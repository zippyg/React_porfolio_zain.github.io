"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { executeCommand, CommandContext } from "@/lib/terminal-commands";
import { useFunMode } from "@/contexts/fun-mode-context";
import { useTheme } from "@/contexts/theme-context";
import { useEasterEggs } from "@/contexts/easter-egg-context";
import { useTerminal } from "@/contexts/terminal-context";

type TerminalState = "embedded" | "floating" | "minimized" | "fullscreen" | "closed" | "transitioning" | "restoring";

interface InteractiveTerminalProps {
  initialDelay?: number;
  heroVisible?: boolean;
}

// ── Color markup renderer ────────────────────────────────────
// Parses {{color:text}} patterns into themed <span> elements
const COLOR_MAP: Record<string, string> = {
  green: "text-green-600 dark:text-green-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  red: "text-red-600 dark:text-red-400",
  magenta: "text-pink-600 dark:text-pink-400",
  blue: "text-blue-600 dark:text-blue-400",
  white: "text-foreground",
  gray: "text-gray-500",
};

function renderColoredLine(text: string): React.ReactNode {
  if (!text) return null;

  const regex = /\{\{(\w+):([^}]*)\}\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    const color = match[1];
    const content = match[2];
    parts.push(
      <span key={key++} className={COLOR_MAP[color] || ""}>
        {content}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

// Check if a line has color markup
function hasColorMarkup(text: string): boolean {
  return /\{\{\w+:[^}]*\}\}/.test(text);
}

// ── Glass classes ────────────────────────────────────────────
const GLASS_BG = "bg-white/30 dark:bg-black/15 backdrop-blur-md backdrop-saturate-150";
const GLASS_BORDER = "border border-white/[0.15] dark:border-green-500/30";
const GLASS_SHADOW = "shadow-[0_0_40px_rgba(34,197,94,0.15)]";
const GLASS = `${GLASS_BG} ${GLASS_BORDER} ${GLASS_SHADOW}`;
const MINI_BAR = "bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-300/50 dark:border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.15)]";

export function InteractiveTerminal({ initialDelay = 500, heroVisible }: InteractiveTerminalProps) {
  // ── All state hooks ──────────────────────────────────────
  const [terminalState, setTerminalState] = useState<TerminalState>("embedded");
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 420, height: 300 });
  const [isMobile, setIsMobile] = useState(false);
  const [tmuxEnabled, setTmuxEnabled] = useState(false);
  const [tmuxPrefix, setTmuxPrefix] = useState(false);
  const [tmuxTime, setTmuxTime] = useState(new Date());
  const [capturedRect, setCapturedRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [restoreTarget, setRestoreTarget] = useState({ x: 0, y: 0, width: 420, height: 300 });

  // ── All refs ─────────────────────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startPageX: number; startPageY: number; posX: number; posY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const autoMinimizedRef = useRef(false);
  const userOverrodeRef = useRef(false);
  const tmuxPrefixTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionZoneRef = useRef<"hero" | "elsewhere" | null>(null);
  const heroFloatingPositionRef = useRef<{ x: number; y: number } | null>(null);
  const heroFloatingSizeRef = useRef<{ width: number; height: number } | null>(null);
  const heroWasVisibleRef = useRef<boolean | undefined>(undefined);
  const positionRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ width: 420, height: 300 });

  // ── Context hooks ────────────────────────────────────────
  const { toggleFunMode, isFunMode } = useFunMode();
  const { theme, toggleTheme } = useTheme();
  const { discoverEgg } = useEasterEggs();
  const { commandHistory, addToHistory, lines, addLine, clearLines } = useTerminal();

  // ── Reactive isMobile check ──────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const terminalStateRef = useRef<TerminalState>("embedded");

  // ── Sync refs to mirror state (avoids re-attaching listeners) ─
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { sizeRef.current = size; }, [size]);
  useEffect(() => { terminalStateRef.current = terminalState; }, [terminalState]);

  // ── Portal container for floating/fullscreen ──────────────
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "terminal-portal";
    el.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none";
    document.body.appendChild(el);
    portalRef.current = el;
    return () => {
      document.body.removeChild(el);
      portalRef.current = null;
    };
  }, []);

  // ── Hero zone check (DOM-only, no React state) ──────────
  const isInHeroZone = (): boolean => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return false;
    const heroRect = heroEl.getBoundingClientRect();
    return heroRect.bottom > 100 && heroRect.top < window.innerHeight;
  };

  // ── Command context ──────────────────────────────────────
  const getCommandContext = useCallback(
    (): CommandContext => ({
      scrollTo: (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      },
      toggleTheme,
      toggleFunMode,
      isFunMode,
      theme,
      discoverEgg,
    }),
    [toggleTheme, toggleFunMode, isFunMode, theme, discoverEgg]
  );

  // ── Typewriter intro ────────────────────────────────────
  // No ref guard — React 18 Strict Mode runs effects twice:
  // mount → cleanup (clears timeouts) → mount (creates fresh timeouts)
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

  // ── Blink cursor ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-scroll output ───────────────────────────────────
  useEffect(() => {
    requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
  }, [lines]);

  // ── Focus input when typing ends ─────────────────────────
  useEffect(() => {
    if (!isTyping && terminalState !== "closed" && terminalState !== "minimized" && terminalState !== "transitioning" && terminalState !== "restoring") {
      inputRef.current?.focus();
    }
  }, [isTyping, terminalState]);

  // ── Auto-minimize embedded + zone-aware auto-restore ─────
  useEffect(() => {
    if (heroVisible === undefined) return;

    const heroJustBecameVisible = heroVisible && heroWasVisibleRef.current === false;
    heroWasVisibleRef.current = heroVisible;

    // Scrolling AWAY from hero — auto-minimize embedded terminal
    if (!heroVisible && terminalState === "embedded" && !userOverrodeRef.current) {
      const rect = terminalRef.current?.getBoundingClientRect();
      if (rect) {
        setCapturedRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
        autoMinimizedRef.current = true;
        setTerminalState("transitioning");
      } else {
        autoMinimizedRef.current = true;
        setTerminalState("minimized");
      }
    }
    // Scrolling BACK to hero — restore any minimized terminal to hero position
    // heroJustBecameVisible: catches all minimized terminals on hero entry (incl. manually minimized)
    // autoMinimizedRef: catches auto-minimized floating terminals that transitioned while hero was still partially visible
    else if (heroVisible &&
             (terminalState === "minimized" || terminalState === "transitioning" || terminalState === "restoring") &&
             (heroJustBecameVisible || autoMinimizedRef.current)) {
      autoMinimizedRef.current = false;
      userOverrodeRef.current = false;

      if (heroFloatingPositionRef.current && heroFloatingSizeRef.current) {
        // Had a floating position in hero → animate restore to that position+size
        setRestoreTarget({
          x: heroFloatingPositionRef.current.x,
          y: heroFloatingPositionRef.current.y,
          width: heroFloatingSizeRef.current.width,
          height: heroFloatingSizeRef.current.height,
        });
        setTerminalState("restoring");
      } else {
        // Never floated (pristine) → restore to embedded
        setTerminalState("embedded");
      }
    }
  }, [heroVisible, terminalState]);

  // ── Auto-minimize floating terminal when scrolled off-screen ─
  useEffect(() => {
    if (terminalState !== "floating") return;

    const checkVisibility = () => {
      if (dragRef.current || resizeRef.current) return;

      const pos = positionRef.current;
      const sz = sizeRef.current;
      const viewportX = pos.x - window.scrollX;
      const viewportY = pos.y - window.scrollY;

      const isOffScreen =
        viewportY + sz.height < -50 ||
        viewportY > window.innerHeight + 50 ||
        viewportX + sz.width < -50 ||
        viewportX > window.innerWidth + 50;

      if (isOffScreen) {
        setCapturedRect({
          left: viewportX,
          top: viewportY,
          width: sz.width,
          height: sz.height,
        });
        autoMinimizedRef.current = true;
        setTerminalState("transitioning");
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [terminalState]);

  // ── Track user-initiated state changes ───────────────────
  const setTerminalStateWithTracking = useCallback((newState: TerminalState) => {
    if (newState === "floating" || newState === "fullscreen" || newState === "closed") {
      userOverrodeRef.current = true;
      autoMinimizedRef.current = false;
    }
    if (newState === "minimized" && !autoMinimizedRef.current) {
      userOverrodeRef.current = true;
    }
    if (newState === "embedded") {
      userOverrodeRef.current = false;
    }
    setTerminalState(newState);
  }, []);

  // ── Tmux clock ───────────────────────────────────────────
  useEffect(() => {
    if (!tmuxEnabled) return;
    setTmuxTime(new Date());
    const interval = setInterval(() => setTmuxTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [tmuxEnabled]);

  // ── Command submission ───────────────────────────────────
  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addLine("prompt", `$ ${trimmed}`);
    addToHistory(trimmed);
    setHistoryIndex(-1);
    setInput("");

    const ctx = getCommandContext();
    const { command, output } = executeCommand(trimmed, ctx);

    if (command === "clear") {
      clearLines();
      return;
    }

    for (const line of output) {
      if (line === "__HISTORY__") {
        commandHistory.forEach((cmd, i) => {
          addLine("output", `  ${i + 1}  ${cmd}`);
        });
        addLine("output", `  ${commandHistory.length + 1}  ${trimmed}`);
      } else if (line.startsWith("__OPEN__:")) {
        const url = line.slice("__OPEN__:".length);
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        const pretty = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        addLine("output", `opening ${pretty}...`);
      } else if (line === "__TMUX_TOGGLE__") {
        setTmuxEnabled((prev) => {
          if (!prev) {
            addLine("output", "starting tmux session [zain:0]...");
            addLine("output", "tmux mode enabled. Ctrl+B is your prefix key.");
            addLine("output", "type 'tmux help' for tmux-specific commands.");
          } else {
            addLine("output", "tmux mode disabled.");
          }
          return !prev;
        });
      } else if (line === "__TMUX_KILL__") {
        setTmuxEnabled(false);
        addLine("output", "killing session zain... bye.");
      } else {
        addLine("output", line);
      }
    }
  }, [input, addLine, getCommandContext, commandHistory, addToHistory, clearLines]);

  // ── Key handler (with tmux prefix) ───────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Tmux prefix key handling
      if (tmuxEnabled) {
        if (e.ctrlKey && e.key === "b") {
          e.preventDefault();
          setTmuxPrefix(true);
          if (tmuxPrefixTimeoutRef.current) clearTimeout(tmuxPrefixTimeoutRef.current);
          tmuxPrefixTimeoutRef.current = setTimeout(() => setTmuxPrefix(false), 2000);
          return;
        }
        if (tmuxPrefix) {
          e.preventDefault();
          setTmuxPrefix(false);
          if (tmuxPrefixTimeoutRef.current) clearTimeout(tmuxPrefixTimeoutRef.current);

          switch (e.key) {
            case "d":
              setTerminalStateWithTracking("minimized");
              break;
            case "z":
              setTerminalState((prev) => (prev === "fullscreen" ? "floating" : "fullscreen"));
              break;
            case "c":
              clearLines();
              break;
            case "x":
              setTmuxEnabled(false);
              setTerminalStateWithTracking("closed");
              break;
          }
          return;
        }
      }

      // Tab completion
      if (e.key === "Tab") {
        e.preventDefault();
        return;
      }

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
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        clearLines();
      }
    },
    [handleSubmit, commandHistory, historyIndex, tmuxEnabled, tmuxPrefix, setTerminalStateWithTracking, clearLines]
  );

  // ── Drag handlers ────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".traffic-light")) return;

      if (terminalState === "embedded") {
        const rect = terminalRef.current?.getBoundingClientRect();
        if (rect) {
          // Convert viewport rect to page coordinates
          setPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
          setSize({ width: rect.width, height: rect.height });
        }
        setTerminalStateWithTracking("floating");
        lastInteractionZoneRef.current = "hero";
        heroFloatingPositionRef.current = {
          x: (rect?.left || 0) + window.scrollX,
          y: (rect?.top || 0) + window.scrollY,
        };
        heroFloatingSizeRef.current = {
          width: rect?.width || 420,
          height: rect?.height || 300,
        };
        dragRef.current = {
          startPageX: e.pageX,
          startPageY: e.pageY,
          posX: (rect?.left || 0) + window.scrollX,
          posY: (rect?.top || 0) + window.scrollY,
        };
      } else if (terminalState === "floating") {
        const pos = positionRef.current;
        dragRef.current = {
          startPageX: e.pageX,
          startPageY: e.pageY,
          posX: pos.x,
          posY: pos.y,
        };
      }
    },
    [terminalState, setTerminalStateWithTracking]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.pageX - dragRef.current.startPageX;
        const dy = e.pageY - dragRef.current.startPageY;
        setPosition({ x: dragRef.current.posX + dx, y: dragRef.current.posY + dy });
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
    const handleMouseUp = (e: MouseEvent) => {
      if (dragRef.current) {
        const finalX = dragRef.current.posX + (e.pageX - dragRef.current.startPageX);
        const finalY = dragRef.current.posY + (e.pageY - dragRef.current.startPageY);
        if (isInHeroZone()) {
          lastInteractionZoneRef.current = "hero";
          heroFloatingPositionRef.current = { x: finalX, y: finalY };
          heroFloatingSizeRef.current = { ...sizeRef.current };
        } else {
          lastInteractionZoneRef.current = "elsewhere";
        }
      }
      if (resizeRef.current && isInHeroZone()) {
        heroFloatingSizeRef.current = { ...sizeRef.current };
      }
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

  // ── Resize handler ───────────────────────────────────────
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (terminalState !== "floating") return;
      const sz = sizeRef.current;
      resizeRef.current = { startX: e.clientX, startY: e.clientY, w: sz.width, h: sz.height };
    },
    [terminalState]
  );

  // ── Click to focus ───────────────────────────────────────
  const handleBodyClick = useCallback(() => {
    if (!isTyping) inputRef.current?.focus();
  }, [isTyping]);

  // ── Helper: compute restore target from minimized/closed bar ─
  const triggerRestore = useCallback(() => {
    autoMinimizedRef.current = false;

    if (isInHeroZone()) {
      // In hero zone → restore to hero state
      userOverrodeRef.current = false;

      if (heroFloatingPositionRef.current && heroFloatingSizeRef.current) {
        // Had a floating position in hero → animate to saved hero position+size
        lastInteractionZoneRef.current = "hero";
        setRestoreTarget({
          x: heroFloatingPositionRef.current.x,
          y: heroFloatingPositionRef.current.y,
          width: heroFloatingSizeRef.current.width,
          height: heroFloatingSizeRef.current.height,
        });
        setTerminalState("restoring");
      } else {
        // Pristine → restore to embedded
        setTerminalState("embedded");
      }
      return;
    }

    // Outside hero → animate to center at 60% viewport size
    userOverrodeRef.current = true;
    lastInteractionZoneRef.current = "elsewhere";
    const targetW = Math.min(window.innerWidth * 0.6, 800);
    const targetH = Math.min(window.innerHeight * 0.6, 500);
    const targetX = window.scrollX + (window.innerWidth - targetW) / 2;
    const targetY = window.scrollY + (window.innerHeight - targetH) / 2;
    setRestoreTarget({ x: targetX, y: targetY, width: targetW, height: targetH });
    setTerminalState("restoring");
  }, []);

  // ══════════════════════════════════════════════════════════
  // EARLY RETURN: mobile → null (all hooks called above)
  // ══════════════════════════════════════════════════════════
  if (isMobile) return null;

  // ── Transitioning state: spring animation to minimized ───
  if (terminalState === "transitioning") {
    const rightOffset = typeof window !== "undefined" && window.innerWidth >= 640 ? 108 : 96;
    const targetLeft = typeof window !== "undefined" ? window.innerWidth - 200 - rightOffset : 0;
    const targetTop = typeof window !== "undefined" ? window.innerHeight - 44 - 16 : 0;

    const content = (
      <motion.div
        initial={{
          left: capturedRect.left,
          top: capturedRect.top,
          width: capturedRect.width,
          height: capturedRect.height,
          borderRadius: 8,
        }}
        animate={{
          left: targetLeft,
          top: targetTop,
          width: 200,
          height: 44,
          borderRadius: 8,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        onAnimationComplete={() => {
          if (terminalStateRef.current === "transitioning") {
            setTerminalState("minimized");
          }
        }}
        className={`pointer-events-auto fixed z-[10001] overflow-hidden ${MINI_BAR}`}
        style={{ position: "fixed" }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 h-full text-xs font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-gray-500">~/zain</span>
        </div>
      </motion.div>
    );
    return portalRef.current ? createPortal(content, portalRef.current) : content;
  }

  // ── Closed state ─────────────────────────────────────────
  if (terminalState === "closed") {
    const content = (
      <button
        onClick={() => triggerRestore()}
        className={`pointer-events-auto fixed bottom-4 right-[96px] sm:right-[108px] z-[10001] flex items-center gap-2 px-4 py-2.5 ${MINI_BAR} rounded-lg text-xs font-mono hover:border-green-500/40 dark:hover:border-green-500/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all`}
      >
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-gray-500">~/zain</span>
        <span className="text-green-600 dark:text-green-500/60 ml-1">↗</span>
      </button>
    );
    return portalRef.current ? createPortal(content, portalRef.current) : content;
  }

  // ── Restoring state (animated pop-up from minimized bar) ─
  if (terminalState === "restoring") {
    // Bar position (bottom-right, same as minimized bar)
    const barRight = window.innerWidth <= 640 ? 96 : 108;
    const barBottom = 16;
    const barLeft = window.innerWidth - barRight - 200;
    const barTop = window.innerHeight - barBottom - 44;

    const content = (
      <motion.div
        initial={{
          position: "fixed",
          left: barLeft,
          top: barTop,
          width: 200,
          height: 44,
          opacity: 0.8,
          borderRadius: 8,
        }}
        animate={{
          left: restoreTarget.x - window.scrollX,
          top: restoreTarget.y - window.scrollY,
          width: restoreTarget.width,
          height: restoreTarget.height,
          opacity: 1,
          borderRadius: 8,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        onAnimationComplete={() => {
          if (terminalStateRef.current === "restoring") {
            setPosition({ x: restoreTarget.x, y: restoreTarget.y });
            setSize({ width: restoreTarget.width, height: restoreTarget.height });
            setTerminalState("floating");
          }
        }}
        className={`pointer-events-auto fixed z-[10001] overflow-hidden ${MINI_BAR}`}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 h-[44px] text-xs font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-gray-500">~/zain</span>
        </div>
      </motion.div>
    );
    return portalRef.current ? createPortal(content, portalRef.current) : content;
  }

  // ── Minimized state ──────────────────────────────────────
  if (terminalState === "minimized") {
    const content = (
      <div
        className={`pointer-events-auto fixed bottom-4 right-[96px] sm:right-[108px] z-[10001] flex items-center gap-2 px-4 py-2.5 ${MINI_BAR} rounded-lg text-xs font-mono cursor-pointer hover:border-green-500/40 dark:hover:border-green-500/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all`}
        onClick={() => triggerRestore()}
      >
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-gray-500">~/zain</span>
        <span className="text-green-600 dark:text-green-500/60 ml-1">↗</span>
      </div>
    );
    return portalRef.current ? createPortal(content, portalRef.current) : content;
  }

  // ── Main terminal render (embedded / floating / fullscreen) ─
  const isFloatingOrFullscreen = terminalState === "floating" || terminalState === "fullscreen";

  const terminalStyle: React.CSSProperties =
    terminalState === "fullscreen"
      ? { position: "fixed", top: "5vh", left: "5vw", width: "90vw", height: "90vh", zIndex: 10001 }
      : terminalState === "floating"
        ? { position: "absolute", left: position.x, top: position.y, width: size.width, height: size.height, zIndex: 10001, pointerEvents: "auto" }
        : {};

  const mainTerminal = (
    <>
      {/* Fullscreen backdrop */}
      {terminalState === "fullscreen" && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
          onClick={() => setTerminalStateWithTracking("floating")}
        />
      )}

      <div
        ref={terminalRef}
        style={terminalStyle}
        className={`relative font-mono text-sm ${GLASS} rounded-lg flex flex-col overflow-x-hidden ${
          terminalState === "embedded" ? "h-[320px]" : ""
        }`}
        onClick={handleBodyClick}
      >
        {/* ── Title bar ─────────────────────────────────── */}
        <div
          className={`flex items-center gap-1.5 px-4 py-3 border-b border-green-600/10 dark:border-green-500/10 select-none shrink-0 ${
            terminalState !== "embedded" ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={handleDragStart}
        >
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalStateWithTracking("closed");
            }}
          />
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalStateWithTracking("minimized");
            }}
          />
          <button
            className="traffic-light w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setTerminalStateWithTracking(terminalState === "fullscreen" ? "floating" : "fullscreen");
            }}
          />
          <span className="ml-2 text-xs text-gray-500">~/zain</span>
          {tmuxEnabled && (
            <span className="ml-1 text-[10px] text-green-600 dark:text-green-500/60">[tmux]</span>
          )}
          {terminalState !== "embedded" && (
            <span className="ml-auto text-gray-600 dark:text-gray-600 text-xs tracking-widest">⠿</span>
          )}
        </div>

        {/* ── Output area (scrollable, Lenis-exempt) ──── */}
        <div
          ref={outputRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 space-y-0.5 min-h-0 [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)] dark:[text-shadow:_0_1px_3px_rgba(0,0,0,0.5)]"
        >
          {lines.map((line) => {
            const isCommand = line.type === "command" || line.type === "prompt";
            const isEmpty = line.text === "";
            const colored = !isCommand && hasColorMarkup(line.text);

            return (
              <div
                key={line.id}
                className={
                  isCommand
                    ? "text-green-700 dark:text-green-400"
                    : isEmpty
                      ? "h-3"
                      : colored
                        ? "whitespace-pre"
                        : "text-gray-600 dark:text-gray-400"
                }
              >
                {colored ? renderColoredLine(line.text) : line.text}
              </div>
            );
          })}

          {/* Input line (measuring span technique for cursor position) */}
          {!isTyping && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-700 dark:text-green-400">$</span>
              <div className="relative flex-1 min-w-0">
                <span className="invisible whitespace-pre font-mono text-sm">{input}</span>
                <span
                  className={`inline-block w-2 h-4 bg-green-700 dark:bg-green-400 align-middle ${
                    showCursor ? "opacity-100" : "opacity-0"
                  } transition-opacity`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full h-full p-0 bg-transparent text-green-700 dark:text-green-400 outline-none caret-transparent font-mono text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Typing phase cursor */}
          {isTyping && (
            <div className="flex items-center mt-1">
              <span
                className={`inline-block w-2 h-4 bg-green-700 dark:bg-green-400 ${
                  showCursor ? "opacity-100" : "opacity-0"
                } transition-opacity`}
              />
            </div>
          )}
        </div>

        {/* ── Tmux status bar ───────────────────────────── */}
        {tmuxEnabled && (
          <div className="flex items-center justify-between px-2 py-1 bg-green-900/15 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-mono border-t border-green-600/10 dark:border-green-500/20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-green-600/15 dark:bg-green-500/30 px-1.5 py-0.5 rounded">[0] zain</span>
              <span>0:terminal*</span>
            </div>
            <div className="flex items-center gap-3">
              {tmuxPrefix && (
                <span className="text-yellow-600 dark:text-yellow-500 font-bold">^B</span>
              )}
              <span>{tmuxTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <span>{tmuxTime.toLocaleDateString([], { day: "2-digit", month: "short" })}</span>
            </div>
          </div>
        )}

        {/* ── Resize handle (floating only) ─────────────── */}
        {terminalState === "floating" && (
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" onMouseDown={handleResizeStart}>
            <svg className="w-3 h-3 text-gray-600 absolute bottom-1 right-1" viewBox="0 0 12 12">
              <path d="M11 1v10H1" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 5v6H5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 9v2H9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>
    </>
  );

  // Portal floating/fullscreen to document.body so position:absolute uses page coordinates
  if ((terminalState === "floating" || terminalState === "fullscreen") && portalRef.current) {
    return createPortal(mainTerminal, portalRef.current);
  }
  return mainTerminal;
}
