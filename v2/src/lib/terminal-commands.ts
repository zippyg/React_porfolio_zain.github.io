export interface CommandContext {
  scrollTo: (id: string) => void;
  toggleTheme: () => void;
  toggleFunMode: () => void;
  isFunMode: boolean;
  theme: string;
  discoverEgg: (id: string) => void;
}

export interface TerminalCommand {
  name: string;
  aliases: string[];
  description: string;
  handler: (args: string[], ctx: CommandContext) => string[];
}

const SECTIONS = ["about", "projects", "skills", "research", "contact"];

export const terminalCommands: TerminalCommand[] = [
  {
    name: "help",
    aliases: ["h", "?"],
    description: "List all available commands",
    handler: (_args, _ctx) => {
      return [
        "Available commands:",
        "",
        "  help          Show this help message",
        "  whoami        Display identity info",
        "  status        Current availability",
        "  about         Navigate to About section",
        "  projects      Navigate to Projects section",
        "  skills        Navigate to Skills section",
        "  research      Navigate to Research section",
        "  contact       Navigate to Contact section",
        "  resume        Open resume in new tab",
        "  ls            List available sections",
        "  pwd           Print working directory",
        "  cd <section>  Navigate to a section",
        "  cat <section> Show section info inline",
        "  echo <text>   Echo text back",
        "  date          Show current date/time",
        "  uname         Show system info",
        "  neofetch      System info with ASCII art",
        "  history       Show command history",
        "  fun           Toggle fun mode",
        "  theme         Toggle dark/light theme",
        "  clear         Clear terminal output",
        "",
        "  Type any command and press Enter.",
      ];
    },
  },
  {
    name: "whoami",
    aliases: [],
    description: "Display identity info",
    handler: () => [
      "> zain mughal",
      "> physics msci @ imperial college london",
      "> quant research · ml · full-stack",
    ],
  },
  {
    name: "status",
    aliases: [],
    description: "Current availability",
    handler: () => [
      "> open to opportunities",
      "> london, uk",
    ],
  },
  {
    name: "about",
    aliases: ["bio", "me"],
    description: "Navigate to About section",
    handler: (_args, ctx) => {
      ctx.scrollTo("about");
      return ["Navigating to about..."];
    },
  },
  {
    name: "projects",
    aliases: ["project", "work"],
    description: "Navigate to Projects section",
    handler: (_args, ctx) => {
      ctx.scrollTo("projects");
      return ["Navigating to projects..."];
    },
  },
  {
    name: "skills",
    aliases: ["tech"],
    description: "Navigate to Skills section",
    handler: (_args, ctx) => {
      ctx.scrollTo("skills");
      return ["Navigating to skills..."];
    },
  },
  {
    name: "research",
    aliases: ["papers", "publications"],
    description: "Navigate to Research section",
    handler: (_args, ctx) => {
      ctx.scrollTo("research");
      return ["Navigating to research..."];
    },
  },
  {
    name: "contact",
    aliases: ["email"],
    description: "Navigate to Contact section",
    handler: (_args, ctx) => {
      ctx.scrollTo("contact");
      return ["Navigating to contact..."];
    },
  },
  {
    name: "resume",
    aliases: ["cv"],
    description: "Open resume in new tab",
    handler: () => {
      window.open("/assets/Zain%20Mughal%20resume%20Quant.pdf", "_blank");
      return ["Opening resume..."];
    },
  },
  {
    name: "fun",
    aliases: ["easter", "egg"],
    description: "Toggle fun mode",
    handler: (_args, ctx) => {
      ctx.toggleFunMode();
      return [ctx.isFunMode ? "Fun mode disabled." : "Fun mode enabled!"];
    },
  },
  {
    name: "theme",
    aliases: ["dark", "light"],
    description: "Toggle dark/light theme",
    handler: (_args, ctx) => {
      ctx.toggleTheme();
      return [`Switched to ${ctx.theme === "dark" ? "light" : "dark"} theme.`];
    },
  },
  {
    name: "clear",
    aliases: ["cls"],
    description: "Clear terminal output",
    handler: () => [],
  },
  {
    name: "ls",
    aliases: ["dir"],
    description: "List available sections",
    handler: () => [
      "about/    projects/    skills/    research/    contact/",
    ],
  },
  {
    name: "pwd",
    aliases: [],
    description: "Print working directory",
    handler: () => ["~/zain/portfolio"],
  },
  {
    name: "cd",
    aliases: [],
    description: "Navigate to a section",
    handler: (args, ctx) => {
      const target = args[0]?.replace("/", "");
      if (!target) return ["Usage: cd <section>"];
      if (SECTIONS.includes(target)) {
        ctx.scrollTo(target);
        return [`Navigating to ${target}...`];
      }
      return [`cd: no such directory: ${target}`];
    },
  },
  {
    name: "cat",
    aliases: [],
    description: "Show section info inline",
    handler: (args) => {
      const target = args[0];
      if (!target) return ["Usage: cat <section>"];
      if (target === "about") {
        return [
          "Zain Mughal — Physics MSci @ Imperial College London",
          "Quant researcher, full-stack developer, ML engineer.",
          "Building trading bots, pricing engines, and AI tools.",
          "Currently targeting publications in ML & computational finance.",
        ];
      }
      if (target === "skills") {
        return [
          "Quantitative: Python, C++, Monte Carlo, Derivatives Pricing",
          "Engineering:   React/Next.js, TypeScript, Rust, Solidity",
          "ML:            PyTorch, JAX, Deep Learning, NLP, Transformers",
          "Physics/Math:  QM, Stat Mech, DiffEq, Probability, Numerics",
        ];
      }
      return [`cat: ${target}: use 'about' or 'skills'`];
    },
  },
  {
    name: "echo",
    aliases: [],
    description: "Echo text back",
    handler: (args) => [args.join(" ") || ""],
  },
  {
    name: "date",
    aliases: [],
    description: "Show current date/time",
    handler: () => [new Date().toString()],
  },
  {
    name: "uname",
    aliases: [],
    description: "Show system info",
    handler: () => ["ZainOS v2.0 · Next.js 14 · React 18 · TypeScript"],
  },
  {
    name: "neofetch",
    aliases: [],
    description: "System info with ASCII art",
    handler: () => [
      "        ╭──────╮       zain@portfolio",
      "        │ Z.M. │       ──────────────",
      "        ╰──────╯       OS: ZainOS v2.0",
      "     ╱╲    ╱╲          Framework: Next.js 14",
      "    ╱  ╲  ╱  ╲         UI: React 18 + Tailwind",
      "   ╱    ╲╱    ╲        Lang: TypeScript",
      "  ╱      ╲     ╲       Shell: terminal.tsx",
      " ╱────────╲─────╲      Theme: retro-futuristic",
      "                        Uptime: since 2022",
    ],
  },
  {
    name: "history",
    aliases: [],
    description: "Show command history",
    handler: () => ["__HISTORY__"], // special token handled by terminal
  },
  {
    name: "sudo",
    aliases: [],
    description: "",
    handler: (args) => {
      if (args.join(" ") === "rm -rf /") {
        return ["nice try. portfolio is immutable."];
      }
      return ["sudo: permission denied. this isn't your terminal."];
    },
  },
  {
    name: "vim",
    aliases: ["vi", "nano", "emacs"],
    description: "",
    handler: () => ["error: no escape. type 'help' instead."],
  },
  {
    name: "exit",
    aliases: ["quit", "logout"],
    description: "",
    handler: () => ["there's no escaping this portfolio."],
  },
  {
    name: "python",
    aliases: ["python3", "py"],
    description: "",
    handler: () => ['>>> import quant; quant.level → "cracked"'],
  },
];

export function executeCommand(
  input: string,
  ctx: CommandContext
): { command: string; output: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { command: "", output: [] };

  const parts = trimmed.split(/\s+/);
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const cmd = terminalCommands.find(
    (c) => c.name === cmdName || c.aliases.includes(cmdName)
  );

  if (cmd) {
    return { command: cmd.name, output: cmd.handler(args, ctx) };
  }

  return {
    command: cmdName,
    output: [`command not found: ${cmdName}. Type 'help' for available commands.`],
  };
}
