"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunMode } from '@/contexts/fun-mode-context';
import { useTheme } from '@/contexts/theme-context';
import { useEasterEggs, EASTER_EGGS } from '@/contexts/easter-egg-context';
import { useTerminal } from '@/contexts/terminal-context';
import { terminalCommands, executeCommand, CommandContext } from '@/lib/terminal-commands';

interface Command {
  id: string;
  name: string;
  description: string;
  action: () => void;
  aliases?: string[];
}

interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CommandPalette({ isOpen: externalIsOpen, onClose }: CommandPaletteProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (externalIsOpen !== undefined && onClose && !value) {
      onClose();
    } else {
      setInternalIsOpen(value);
    }
  };

  const [input, setInput] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleFunMode, isFunMode } = useFunMode();
  const { theme, toggleTheme } = useTheme();
  const { discoverEgg } = useEasterEggs();
  const { addLine, addToHistory, clearLines } = useTerminal();

  // Build command context
  const ctx: CommandContext = useMemo(() => ({
    scrollTo: (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    },
    toggleTheme,
    toggleFunMode,
    isFunMode,
    theme,
    discoverEgg,
  }), [toggleTheme, toggleFunMode, isFunMode, theme, discoverEgg]);

  // Process command output: pipe to shared session + handle special tokens
  const processOutput = useCallback((output: string[]) => {
    for (const line of output) {
      if (line === "__HISTORY__") {
        addLine("output", "(see terminal for history)");
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
      } else if (line === "__TMUX_TOGGLE__" || line === "__TMUX_KILL__") {
        addLine("output", "(tmux only available in main terminal)");
      } else {
        addLine("output", line);
      }
    }
  }, [addLine]);

  // Execute a raw command string through the shared terminal system
  const executeRawCommand = useCallback((cmdString: string) => {
    const trimmed = cmdString.trim().replace(/^\//, '');
    if (!trimmed) return;

    addLine("prompt", `$ ${trimmed}`);
    addToHistory(trimmed);

    const result = executeCommand(trimmed, ctx);

    if (result.command === "clear") {
      clearLines();
    } else {
      processOutput(result.output);
    }

    if (trimmed === 'fun' && !isFunMode) {
      discoverEgg(EASTER_EGGS.FUN_MODE);
    }

    setIsOpen(false);
  }, [ctx, addLine, addToHistory, clearLines, processOutput, isFunMode, discoverEgg]);

  // Build palette commands from ALL terminal commands
  const commands: Command[] = useMemo(() => {
    return terminalCommands.map((cmd) => {
      let description = cmd.description;
      if (cmd.name === 'fun') description = isFunMode ? 'Disable fun mode' : 'Enable fun mode (easter egg!)';
      if (cmd.name === 'theme') description = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      return {
        id: cmd.name,
        name: `/${cmd.name}`,
        description,
        aliases: cmd.aliases,
        action: () => executeRawCommand(cmd.name),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFunMode, theme, executeRawCommand]);

  // Filter commands based on input
  useEffect(() => {
    if (input.length === 0) {
      setFilteredCommands(commands);
    } else {
      const query = input.toLowerCase().replace(/^\//, '');
      const filtered = commands.filter(cmd =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.aliases?.some(alias => alias.toLowerCase().includes(query))
      );
      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [input, commands]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev =>
        filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands.length > 0 && filteredCommands[selectedIndex]) {
        // If input has args beyond the matched command, execute as raw
        const query = input.trim().replace(/^\//, '');
        const matchedName = filteredCommands[selectedIndex].id;
        if (query.toLowerCase() !== matchedName && query.includes(' ')) {
          // User typed something like "open linkedin" — execute raw
          executeRawCommand(query);
        } else {
          filteredCommands[selectedIndex].action();
        }
      } else {
        // No filtered matches — try executing input as a raw command
        executeRawCommand(input);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [filteredCommands, selectedIndex, input, executeRawCommand]);

  // Global keyboard listener for CMD+Z (Mac) or CTRL+Z (Windows/Linux)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile && (e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (externalIsOpen === undefined) {
          setInternalIsOpen(true);
        }
        setInput('');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [externalIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.command-palette')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/30 backdrop-blur-sm z-50"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="command-palette fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="w-[90vw] max-w-2xl bg-background/90 dark:bg-black/70 backdrop-blur-sm border border-primary/30 rounded-lg shadow-2xl ring-1 ring-primary/10 shadow-[0_0_50px_rgba(34,197,94,0.1)] pointer-events-auto flex flex-col">
              {/* Input */}
              <div className="p-4 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-lg">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..."
                    className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none font-mono text-lg"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Commands */}
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(60vh - 8rem)" }}>
                {filteredCommands.length > 0 ? (
                  <ul className="py-2">
                    {filteredCommands.map((cmd, index) => (
                      <li key={cmd.id}>
                        <button
                          className={`w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors ${
                            index === selectedIndex ? 'bg-primary/20' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            cmd.action();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-primary font-mono">{cmd.name}</span>
                              <span className="text-muted-foreground ml-3 text-sm">{cmd.description}</span>
                            </div>
                            {index === selectedIndex && (
                              <span className="text-muted-foreground/60 text-xs">↵</span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-muted-foreground text-sm mb-2">No matching commands</p>
                    <p className="text-muted-foreground/60 text-xs">Press Enter to run as terminal command</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-primary/10 text-xs text-muted-foreground flex justify-between">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>esc Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
