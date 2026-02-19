"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFunMode } from '@/contexts/fun-mode-context';
import { useTheme } from '@/contexts/theme-context';
import { useEasterEggs, EASTER_EGGS } from '@/contexts/easter-egg-context';
import { terminalCommands, CommandContext } from '@/lib/terminal-commands';

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

  // Build commands from shared registry
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

  // Only show navigational + utility commands in palette (skip jokes/unix)
  const paletteCommandNames = ['about', 'projects', 'skills', 'research', 'contact', 'resume', 'fun', 'theme'];

  const commands: Command[] = useMemo(() => {
    return terminalCommands
      .filter((cmd) => paletteCommandNames.includes(cmd.name))
      .map((cmd) => {
        let description = cmd.description;
        if (cmd.name === 'fun') description = isFunMode ? 'Disable fun mode' : 'Enable fun mode (easter egg!)';
        if (cmd.name === 'theme') description = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        return {
          id: cmd.name,
          name: `/${cmd.name}`,
          description,
          aliases: cmd.aliases,
          action: () => {
            cmd.handler([], ctx);
            if (cmd.name === 'fun' && !isFunMode) {
              discoverEgg(EASTER_EGGS.FUN_MODE);
            }
            setIsOpen(false);
          },
        };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFunMode, theme, ctx]);

  // Filter commands based on input
  useEffect(() => {
    if (input.length === 0) {
      setFilteredCommands(commands);
    } else {
      const query = input.toLowerCase().replace('/', '');
      const filtered = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.aliases?.some(alias => alias.toLowerCase().includes(query))
      );
      setFilteredCommands(filtered);
    }
    setSelectedIndex(0);
  }, [input, isFunMode, theme]); // Re-filter when fun mode or theme changes

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [filteredCommands, selectedIndex]);

  // Global keyboard listener for CMD+Z (Mac) or CTRL+Z (Windows/Linux)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check for CMD+Z (Mac) or CTRL+Z (Windows/Linux)
      // Ignore on mobile devices
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
          {/* Backdrop - less blur, more transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/30 backdrop-blur-sm z-50"
          />
          
          {/* Command Palette - PROPERLY centered using transform */}
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
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No commands found
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