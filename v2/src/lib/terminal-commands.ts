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
        "  open <target> Open link (github/linkedin/pfp/email)",
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
        "  tmux          Start tmux session (Ctrl+B prefix)",
        "  tmux help     Show tmux keybindings",
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
    handler: () => ["__OPEN__:/assets/Zain%20Mughal%20resume%20Quant.pdf"],
  },
  {
    name: "open",
    aliases: ["xdg-open", "start"],
    description: "Open a link in new tab",
    handler: (args) => {
      const target = args[0]?.toLowerCase();
      if (!target) {
        return [
          "Usage: open <target>",
          "",
          "Available targets:",
          "  github     GitHub profile",
          "  linkedin   LinkedIn profile",
          "  resume     Resume / CV (PDF)",
          "  email      Send an email",
          "  pfp        Profile picture",
        ];
      }
      const urls: Record<string, string> = {
        github: "https://github.com/zippyg",
        gh: "https://github.com/zippyg",
        linkedin: "https://www.linkedin.com/in/mughalzain/",
        li: "https://www.linkedin.com/in/mughalzain/",
        resume: "/assets/Zain%20Mughal%20resume%20Quant.pdf",
        cv: "/assets/Zain%20Mughal%20resume%20Quant.pdf",
        email: "mailto:zainmughal77@outlook.com",
        mail: "mailto:zainmughal77@outlook.com",
        pfp: "/assets/curl_headshot.png",
        headshot: "/assets/curl_headshot.png",
        photo: "/assets/curl_headshot.png",
      };
      const url = urls[target];
      if (url) return [`__OPEN__:${url}`];
      return [`open: ${target}: unknown target. Type 'open' for available targets.`];
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
    handler: (args) => {
      if (args.includes("-la") || args.includes("-a") || args.includes("-al")) {
        return [
          "total 42",
          "drwxr-xr-x  zain zain  4096  .git/ (read-only, obviously)",
          "drwx------  zain zain  4096  .env (wouldn't you like to know)",
          "drwx------  zain zain  4096  .secrets/ (you wish)",
          "-rw-r--r--  zain zain  1337  .bashrc",
          "drwxr-xr-x  zain zain  4096  about/",
          "drwxr-xr-x  zain zain  4096  projects/",
          "drwxr-xr-x  zain zain  4096  skills/",
          "drwxr-xr-x  zain zain  4096  research/",
          "drwxr-xr-x  zain zain  4096  contact/",
        ];
      }
      return [
        "about/    projects/    skills/    research/    contact/",
      ];
    },
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
    description: "Navigate to a section or open a link",
    handler: (args, ctx) => {
      const target = args[0]?.replace("/", "").toLowerCase();
      if (!target || target === "~") return ["~/zain/portfolio"];
      if (target === "..") return ["already at root. there's no escaping."];
      if (SECTIONS.includes(target)) {
        ctx.scrollTo(target);
        return [`Navigating to ${target}...`];
      }
      const external: Record<string, string> = {
        github: "https://github.com/zippyg",
        gh: "https://github.com/zippyg",
        linkedin: "https://www.linkedin.com/in/mughalzain/",
        li: "https://www.linkedin.com/in/mughalzain/",
        resume: "/assets/Zain%20Mughal%20resume%20Quant.pdf",
        cv: "/assets/Zain%20Mughal%20resume%20Quant.pdf",
        email: "mailto:zainmughal77@outlook.com",
        pfp: "/assets/curl_headshot.png",
      };
      const url = external[target];
      if (url) return [`__OPEN__:${url}`];
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
      if (target === "/etc/passwd") {
        return ["root:x:nice try"];
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
      "{{cyan:███████╗███╗   ███╗}}  {{white:zain}}{{gray:@}}{{white:portfolio}}",
      "{{cyan:╚══███╔╝████╗ ████║}}  {{gray:──────────────────}}",
      "{{cyan:  ███╔╝ ██╔████╔██║}}  {{green:OS:}}       {{white:ZainOS v2.0}}",
      "{{cyan: ███╔╝  ██║╚██╔╝██║}}  {{green:Host:}}     {{white:Imperial College London}}",
      "{{cyan:███████╗██║ ╚═╝ ██║}}  {{green:Kernel:}}   {{white:Next.js 14 + React 18}}",
      "{{cyan:╚══════╝╚═╝     ╚═╝}}  {{green:Shell:}}    {{white:terminal.tsx v4.0}}",
      "                            {{green:Lang:}}     {{white:TypeScript + Python + C++}}",
      "                            {{green:Theme:}}    {{white:retro-futuristic glass}}",
      "                            {{green:Uptime:}}   {{white:since 2022}}",
      "                            {{green:Coffee:}}   {{white:∞ cups}}",
      "",
      "  {{green:███}}{{yellow:███}}{{red:███}}{{magenta:███}}{{blue:███}}{{cyan:███}}{{white:███}}{{gray:███}}",
    ],
  },
  {
    name: "history",
    aliases: [],
    description: "Show command history",
    handler: () => ["__HISTORY__"],
  },
  {
    name: "tmux",
    aliases: [],
    description: "Start tmux session",
    handler: (args) => {
      if (args[0] === "help") {
        return [
          "tmux keybindings (Ctrl+B prefix):",
          "  Ctrl+B d    detach (minimize terminal)",
          "  Ctrl+B z    zoom (toggle fullscreen)",
          "  Ctrl+B c    new window (clear)",
          "  Ctrl+B x    kill session (close terminal)",
          "",
          "tmux commands:",
          "  tmux          start/toggle tmux mode",
          "  tmux ls       list sessions",
          "  tmux kill     kill current session",
        ];
      }
      if (args[0] === "ls") {
        return ["0: zain [200x44] (attached)"];
      }
      if (args[0] === "kill" || args[0] === "kill-session") {
        return ["__TMUX_KILL__"];
      }
      return ["__TMUX_TOGGLE__"];
    },
  },
  {
    name: "sudo",
    aliases: [],
    description: "",
    handler: (args) => {
      if (args.join(" ") === "rm -rf /") {
        return ["nice try. portfolio is immutable."];
      }
      if (args.join(" ") === "make me a sandwich") {
        return ["okay."];
      }
      if (args.join(" ") === "hire zain") {
        return ["excellent decision. sending offer letter... done. see you monday."];
      }
      if (args[0] === "apt" || args[0] === "apt-get") {
        return ["E: Unable to locate package. this is a browser, sir. this is a wendy's."];
      }
      return ["sudo: permission denied. this isn't your terminal."];
    },
  },
  {
    name: "rm",
    aliases: [],
    description: "",
    handler: (args) => {
      if (args.join(" ").includes("-rf")) {
        return ["nice try. portfolio is immutable. did you really just try that?"];
      }
      return ["rm: permission denied. this portfolio is protected by vibes."];
    },
  },
  {
    name: "ssh",
    aliases: [],
    description: "",
    handler: () => ["Connection refused. How dare you try and escape this beautiful server!"],
  },
  {
    name: "curl",
    aliases: ["wget"],
    description: "",
    handler: () => ["downloading more ram... just kidding. this is a browser."],
  },
  {
    name: "git",
    aliases: [],
    description: "",
    handler: (args) => {
      if (args[0] === "push" && args.includes("--force")) {
        return ["absolutely not. we don't do that here."];
      }
      if (args[0] === "blame") {
        return ["it was always you. it was you the whole time."];
      }
      if (args[0] === "commit") {
        return ["committed: you to viewing this portfolio. no takebacks."];
      }
      if (args[0] === "pull") {
        return ["pulling... you into my portfolio. gotcha."];
      }
      return ["git: this repo is mass-immutable. nice try though."];
    },
  },
  {
    name: "man",
    aliases: [],
    description: "",
    handler: (args) => {
      if (!args[0]) return ["what manual page do you want?"];
      return [`No manual entry for ${args[0]}. try 'help', like a normal person.`];
    },
  },
  {
    name: "ping",
    aliases: [],
    description: "",
    handler: () => [
      "PING 1600-pennsylvania-ave.gov (38.8977° N, 77.0365° W)",
      "64 bytes from the-white-house: icmp_seq=1 ttl=64 time=4.2ms",
      "64 bytes from the-white-house: icmp_seq=2 ttl=64 time=3.8ms",
      "--- also tried Big Ben (51.5007° N, 0.1246° W): time=∞ (they don't pick up) ---",
    ],
  },
  {
    name: "top",
    aliases: ["htop"],
    description: "",
    handler: () => [
      "  PID  COMMAND            CPU%    MEM%",
      "  001  next-server        12.3    8.2",
      "  002  react-dom          4.1     15.6",
      "  003  framer-motion      2.8     3.4",
      "  004  three.js           18.9    24.1",
      "  005  lenis              0.4     0.8",
      "  006  ambition.exe       99.9    ∞",
      "  007  procrastination.sh 0.1     0.2  (somehow still running)",
    ],
  },
  {
    name: "alias",
    aliases: [],
    description: "",
    handler: () => ["alias success='hard-work && persistence && coffee'"],
  },
  {
    name: "chmod",
    aliases: [],
    description: "",
    handler: () => ["chmod: you don't have permission to change permissions. inception."],
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
