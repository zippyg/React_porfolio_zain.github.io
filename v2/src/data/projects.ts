import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'witness-ai',
    title: 'WITNESS - AI Eyewitness Reconstruction',
    categories: ['ml-ai', 'software'],
    shortDescription: 'AI-powered forensic tool transforming witness descriptions into photorealistic suspect images, mugshots, video, and 3D models',
    longDescription: `Built in 24 hours at the FLUX.2 HACK London, WITNESS tackles a real problem in criminal justice: 70% of wrongful convictions stem from eyewitness misidentification. Witnesses know what they saw but can't draw it.

The app conducts cognitive interviews via voice or text using Claude Sonnet 4, following the Enhanced Cognitive Interview technique from forensic psychology — it never suggests details, only reflects what the witness describes. Once enough detail is gathered, FLUX.2 generates a photorealistic reconstruction that the witness iteratively refines through natural conversation ("make the jaw sharper", "he had stubble").

The full output pipeline includes: iterative image refinements ($0.004/preview), a final high-quality render, four-angle forensic mugshots via FLUX.1 Kontext Pro, a 5-second motion video via Seedance, a rotatable 3D head model via Trellis (viewable in-browser with Three.js), and a court-ready PDF case report. Total cost per session: ~$0.45 vs $200-500+ for a traditional forensic sketch.`,
    highlights: [
      'Integrates 7 distinct AI APIs into a single coherent pipeline',
      'Two interview modes: text chat or full voice conversation with ElevenLabs TTS',
      'Tiered image generation: cheap previews for iteration, expensive finals for quality',
      'Four-angle forensic mugshots with consistent facial identity across views',
      'Court-ready PDF case reports with full interview transcript',
      '~$0.45 per complete session vs $200-500+ traditional forensic sketch'
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Claude Sonnet 4', 'FLUX.2', 'Three.js', 'ElevenLabs', 'Framer Motion', 'Tailwind CSS', 'jsPDF'],
    live: 'https://witness-tawny.vercel.app/',
    video: 'https://youtu.be/TdfEae6VyM8',
    year: 2026,
    featured: true,
    status: 'completed'
  },
  {
    id: 'degenduel',
    title: 'DegenDuel - PvP Prediction Duels on Flare',
    categories: ['software', 'quant'],
    shortDescription: 'On-chain PvP price prediction duels with trustless settlement via Flare\'s enshrined oracle protocols',
    longDescription: `Built at ETH Oxford 2026, DegenDuel lets two players bet on whether an asset price goes up or down, with the smart contract auto-settling using Flare's native on-chain oracle data — no external oracles needed.

The 435-line Solidity contract handles duel creation, stake matching, price direction bets, deadline enforcement, and settlement by reading live prices from Flare's FTSO v2 (100+ data providers). A random 2x bonus mechanic uses Flare's on-chain RNG for fair randomness. The full-stack dApp features a live price ticker, active duel dashboard, AI "hint" card via Flock.io, leaderboard, and win confetti.

Also solo-completed all 4 Sui blockchain CTF challenges at the hackathon (Moving Window, Merchant, Lootboxes, Staking) — capturing every flag.`,
    highlights: [
      'Fully trustless settlement using Flare\'s enshrined FTSO v2 price feeds',
      'Smart contract with on-chain RNG for random 2x bonus mechanic',
      'Full-stack dApp with live price tracking and real-time duel updates',
      'AI price prediction hints via Flock.io integration',
      'Solo-completed all 4 Sui CTF challenges (4/4 flags captured)',
      'Effect-TS for type-safe functional backend services'
    ],
    techStack: ['Solidity', 'Next.js 14', 'TypeScript', 'Scaffold-ETH 2', 'Hardhat', 'Flare FTSO v2', 'Effect-TS', 'Framer Motion', 'Tailwind CSS'],
    github: 'https://github.com/zippyg/ETH-Oxford-DegenDuel',
    live: 'https://degenduel-zains-projects-5be3a7a8.vercel.app',
    video: 'https://www.youtube.com/watch?v=EYm-Qh244Xk',
    year: 2026,
    featured: true,
    status: 'completed'
  },
  {
    id: 'sde-pricing-engine',
    title: 'SDE Pricing Dashboard',
    categories: ['quant', 'software', 'math-stats'],
    shortDescription: 'Interactive derivatives pricing engine with 15+ SDE models, built in Rust/WASM with a Bloomberg-inspired UI',
    longDescription: `A browser-based dashboard for exploring stochastic differential equation models used in quantitative finance. The entire pricing engine runs client-side via WebAssembly — no backend needed.

The Rust core (~15,800 lines) implements 15+ SDE models including GBM, Heston, SABR, Merton Jump Diffusion, Bates, Variance Gamma, Kou, Local Volatility, CIR, Vasicek, and more. Pricing methods span Black-Scholes analytical, Heston semi-analytical (Fourier), Monte Carlo, Quasi-Monte Carlo (Sobol), American (binomial/LSM), Bermudan, Asian, and barrier options. Full Greeks computation via finite differences and risk metrics (VaR, Expected Shortfall).

The Next.js frontend features a Bloomberg-style dark theme with amber accents, real-time Monte Carlo path visualization, interactive parameter sliders, volatility surface rendering, and KaTeX-rendered mathematical formulations alongside every chart.`,
    highlights: [
      '15+ SDE models implemented from scratch in Rust',
      'Runs entirely in-browser via WebAssembly — no server needed',
      '~15,800 lines of Rust for the pricing core',
      'Monte Carlo, Quasi-Monte Carlo, analytical, and tree-based pricing',
      'Bloomberg-inspired dark UI with real-time parameter exploration',
      'Greeks, IV surfaces, VaR, and Expected Shortfall computation'
    ],
    techStack: ['Rust', 'WebAssembly', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Recharts', 'KaTeX', 'Turborepo'],
    live: 'https://sde-pricing-engine-web.vercel.app',
    year: 2026,
    featured: true,
    status: 'completed'
  },
  {
    id: 'finllm-halo',
    title: 'FinLLM-HALO-500',
    categories: ['quant', 'ml-ai', 'software'],
    shortDescription: 'Open-source SEC finance Q&A benchmark for evaluating and mitigating LLM hallucinations',
    longDescription: `Groundbreaking research project addressing the critical challenge of large language model hallucinations in financial contexts. As an undergraduate research intern, I manually curated and open-sourced FinHALO-500, a comprehensive 500-pair SEC finance Q&A benchmark that sets new standards for evaluating LLM reliability in financial applications.

    The project introduces two novel evaluation metrics: NIWH (materiality-weighted errors) for assessing the business impact of hallucinations, and BAHE (cost-performance optimization) for balancing accuracy with computational efficiency. Developed an end-to-end mitigation pipeline combining Retrieval-Augmented Generation (RAG) with QLoRA fine-tuning on frontier models ranging from 8B to 70B parameters, achieving remarkable results.`,
    highlights: [
      'Reduced GPT-4o hallucinations by >20 percentage points on SEC filing numeric tasks',
      'Slashed inference costs by 78% while maintaining accuracy',
      'Developed novel NIWH and BAHE evaluation metrics',
      'Peer-reviewed and slated for ACL 2025 publication',
      'Commercial release planned with major financial institutions'
    ],
    techStack: ['Python', 'PyTorch', 'JAX', 'CUDA', 'OpenAI API', 'Google Gemini', 'GCP', 'SLURM', 'NVIDIA H100', 'RAG', 'QLoRA', 'Transformers'],
    year: 2025,
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'polylens',
    title: 'PolyLens - Social Alpha Trading System',
    categories: ['quant', 'ml-ai', 'software'],
    shortDescription: 'First production-ready algorithmic trading system harnessing social media virality for financial alpha',
    longDescription: `PolyLens represents a paradigm shift in algorithmic trading by being the first production-ready system to harness the predictive power of social media virality and cultural momentum for financial markets. Unlike traditional trading systems that rely solely on price action and technical indicators, PolyLens ingests and analyzes content from TikTok, YouTube, Twitter, Reddit, and Instagram in real-time, using advanced sentiment analysis to detect emerging trends before they manifest in market movements.
    
    The system employs a sophisticated multi-agent architecture with five specialized AI agents - Research, Analysis, Strategy, Risk, and Execution - that collaborate through a Redis message bus to transform multimodal signals into executable trades. Built on a modern technology stack including Python 3.11, FastAPI, PostgreSQL with TimescaleDB, Next.js 14, and integrated with Interactive Brokers for paper trading, the system processes thousands of social media posts per minute, transcribes audio from videos using Whisper, analyzes sentiment using Google's Gemini 2.0 Flash, and applies institutional-grade risk management using the Kelly Criterion for position sizing and Value at Risk calculations.
    
    What makes PolyLens truly novel is its ability to quantify and trade on cultural zeitgeist - for instance, detecting when a TikTok about a specific stock goes viral, correlating that with Reddit discussion sentiment, YouTube influencer mentions, and Twitter momentum, then executing trades based on the aggregate signal strength while maintaining strict risk controls. This "social alpha" approach recognizes that in today's interconnected world, information cascades through social media before reaching traditional financial channels, and by positioning itself at the intersection of social virality and market dynamics, PolyLens captures inefficiencies that pure quantitative strategies miss.`,
    highlights: [
      'Processes 10,000+ social media posts per minute across 5 platforms',
      'Multi-agent AI architecture with specialized trading agents',
      'Real-time sentiment analysis using Gemini 2.0 Flash',
      'Institutional-grade risk management with Kelly Criterion and VaR',
      'Whisper integration for video/audio content transcription',
      'Redis-based message bus for agent communication',
      'Interactive Brokers integration for live paper trading'
    ],
    techStack: ['Python 3.11', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Next.js 14', 'Redis', 'Whisper', 'Gemini 2.0', 'Interactive Brokers API', 'Docker', 'Kubernetes'],
    year: 2025,
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'dinogo',
    title: 'DinoGo - Autonomous ML Dinosaur Runner',
    categories: ['ml-ai', 'software', 'physics'],
    shortDescription: 'Low-power 8-bit microcontroller running real-time ML for autonomous gameplay',
    longDescription: `DinoGo is a re-creation of the Google Chrome "Dino" endless runner game, developed for a resource-constrained 8-bit microcontroller. The primary goal was to demonstrate that a low-power microcontroller could simultaneously handle demanding graphical gameplay and real-time machine learning (ML) for autonomous control.
    
    Built entirely from the ground up in low-level PIC18 assembly code, the project overcame significant hardware limitations including only 4KB of RAM and a slow 128x64 GLCD display. The system implements a 3-8-3 feedforward neural network with fixed-point arithmetic (Q8.8) and ReLU activation for efficient inference on the 8-bit MCU.
    
    The key innovation was a partial screen redraw strategy that achieved an 8.7x speedup over full-screen clearing, resulting in a screen response rate of 191 FPS. The ML model processes obstacle distance, type/height, and dinosaur state to make real-time jump/duck decisions with 34.1ms inference time. Despite hardware constraints, the system successfully validates the feasibility of running graphically demanding games with real-time AI on ultra-low-resource microcontrollers.`,
    highlights: [
      'Achieved 191 FPS screen response rate on 8-bit MCU',
      '8.7x rendering speedup through partial redraw optimization',
      'Neural network inference in 34.1ms with only 4KB RAM',
      'Total RAM usage kept to 15.1% (620 bytes)',
      'Built entirely in assembly for maximum performance',
      'Real-time ML decision making for autonomous gameplay'
    ],
    techStack: ['PIC18 Assembly', 'C', '8-bit MCU', 'GLCD', 'Neural Networks', 'Fixed-Point Math', 'Embedded Systems'],
    pdf: '/assets/dinogo_research_paper.pdf',
    video: '/assets/dinogo_demo.mp4',
    year: 2024,
    featured: true,
    status: 'completed'
  },
  {
    id: 'enhanced-black-scholes',
    title: 'Enhanced Black-Scholes with Adaptive Volatility',
    categories: ['quant', 'ml-ai', 'software', 'math-stats'],
    shortDescription: 'Advanced options pricing integrating stochastic volatility and ML predictions',
    longDescription: `Revolutionary enhancement to the Black-Scholes model incorporating dynamic volatility through both stochastic models (GARCH, Heston, SABR, Lévy) and machine learning (LSTM, GRU, GAN hybrid).
    
    This approach captures real market dynamics missed by constant volatility assumptions. Monte Carlo stress testing validates model robustness under extreme conditions, while real-time data integration enables adaptive pricing that reflects current market sentiment.`,
    highlights: [
      'Improved pricing accuracy by 34% over standard BSM',
      'Stress-tested with 100,000+ Monte Carlo scenarios',
      'Real-time volatility adaptation with sub-second updates',
      'Outperformed traditional models during 2023 volatility spikes'
    ],
    techStack: ['Python', 'QuantLib', 'TensorFlow', 'LSTM', 'GAN', 'GARCH', 'Monte Carlo'],
    pdf: '/assets/enhanced_black_scholes.pdf',
    year: 2024,
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'neutrino-oscillation',
    title: 'Neutrino Oscillation Parameter Extraction',
    categories: ['physics', 'math-stats'],
    shortDescription: 'Extracted neutrino parameters θ23 and Δm²23 using advanced optimization algorithms',
    longDescription: `Computational study extracting fundamental neutrino oscillation parameters through sophisticated optimization techniques. This work tackles one of particle physics' most challenging problems by combining theoretical physics with computational efficiency.
    
    Implemented three optimization algorithms (Grid Search, Simulated Annealing, Nelder-Mead) to minimize the Negative Log-Likelihood function. Achieved precise parameter fits: θ23 = 0.685 ± 0.02 and Δm²23 = 0.0022378 ± 0.01 eV², with Nelder-Mead proving most efficient.`,
    highlights: [
      'Achieved precision comparable to global experiments',
      'Modeled detector resolution with Gaussian smearing',
      'Integrated cross-section normalization uncertainties',
      'Generated topographical visualization of parameter space'
    ],
    techStack: ['Python', 'C++', 'NumPy', 'SciPy', 'GSL', 'Optimization'],
    pdf: '/assets/comp_phys_NLL_minimisations.pdf',
    year: 2024,
    featured: true,
    status: 'completed'
  },
  {
    id: 'marketseer',
    title: 'MarketSeer - AI Financial Forecasting',
    categories: ['ml-ai', 'software', 'quant', 'math-stats'],
    shortDescription: 'Real-time market predictions combining traditional data with sentiment analysis',
    longDescription: `Comprehensive financial forecasting platform that uniquely combines quantitative market data with qualitative sentiment analysis from news and social media. Delivers actionable insights through interactive visualizations and customizable alerts.
    
    Built with scalable architecture supporting novice to expert traders. Features include portfolio simulation tools, ML-powered predictions, and educational resources explaining the impact of sentiment on markets.`,
    highlights: [
      'Processes 50K+ news articles daily for sentiment',
      'Achieved 73% directional accuracy on SPY predictions',
      'Real-time alerts with <30s latency from news events',
      'Interactive dashboards with 50+ technical indicators'
    ],
    techStack: ['Python', 'Flask', 'React', 'TensorFlow', 'PostgreSQL', 'NLP'],
    year: 2024,
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'portfolio-website-v2',
    title: 'This Website - Portfolio',
    categories: ['software'],
    shortDescription: 'Modern portfolio featuring 168 floating physics equations, 5 hidden easter eggs, and a black hole',
    longDescription: `You're experiencing it right now! This portfolio represents the cutting edge of web development, featuring a custom particle physics system rendering 168 mathematical equations from quantum mechanics, thermodynamics, and quantitative finance. The site includes five carefully crafted easter eggs, culminating in a spectacular black hole animation that warps spacetime itself.
    
    Built with performance as a priority, the Canvas API particle system maintains 60+ FPS while managing complex gravitational interactions. Hidden features include a command palette (CMD/CTRL+K), secret "fun mode" with torch physics, double-click warping effects, sticky navigation Easter egg, and the grand finale - a physics-accurate black hole that consumes the entire page. Every aspect is meticulously optimized using React performance patterns, Web Workers for physics calculations, and GPU-accelerated animations.`,
    highlights: [
      '168 LaTeX equations rendered as interactive particles with physics',
      '5 hidden easter eggs including physics-accurate black hole animation',
      'Command palette with fuzzy search navigation (CMD/CTRL+K)',
      'Torch mode with gravitational effects and grid warping',
      '60+ FPS performance with hundreds of animated elements',
      'Responsive design with dark theme and accessibility features'
    ],
    techStack: ['Next.js 14', 'TypeScript', 'React', 'Framer Motion', 'Canvas API', 'GSAP', 'Tailwind CSS', 'Web Workers', 'LaTeX'],
    github: 'https://github.com/zippyg/React_porfolio_zain.github.io',
    live: 'https://zainmughal.dev',
    year: 2025,
    featured: true,
    status: 'completed'
  },
  {
    id: 'market-anomaly-detection',
    title: 'Market Data Feed Anomaly Detection',
    categories: ['quant'],
    shortDescription: 'ML-powered detection of staleness and false jumps in fixed-income data feeds',
    longDescription: `Developed sophisticated anomaly detection system for high-frequency trading environments, addressing critical issues of data staleness and false price jumps that can distort trading decisions.
    
    For single feeds, implemented ARIMA and LSTM models with volatility-adaptive thresholds. Multi-feed environments leverage cross-feed consistency checks, consensus pricing, and attention-based neural architectures. System transforms detections into actionable trading insights, improving execution timing and reducing slippage.`,
    highlights: [
      'Reduced false signals by 87% using adaptive thresholds',
      'Implemented real-time detection with <10ms latency',
      'Integrated reinforcement learning for dynamic feed weighting',
      'Deployed in production handling 1M+ ticks/second'
    ],
    techStack: ['Python', 'LSTM', 'ARIMA', 'Reinforcement Learning', 'Time-Series Analysis'],
    year: 2024,
    featured: false,
    status: 'completed'
  },
  {
    id: 'higgs-boson-analysis',
    title: 'Higgs Boson Statistical Analysis',
    categories: ['physics', 'math-stats'],
    shortDescription: 'Simulated discovery of Higgs boson using advanced statistical methods and Python',
    longDescription: `Recreated the groundbreaking data analysis that led to the Higgs boson discovery. This project demonstrates deep understanding of particle physics, statistical modeling, and computational techniques used at CERN.
    
    Using Monte Carlo simulations, I generated datasets mimicking the H → γγ decay channel with realistic signal and background distributions. Implemented Maximum Likelihood Estimation and Chi-Square methods to extract optimal parameters and validate the significance of the Higgs signal through 10,000+ simulations.`,
    highlights: [
      'Achieved 5-sigma significance detection matching historical results',
      'Processed 10,000+ simulated collision events',
      'Implemented MLE and χ² optimization techniques',
      'Validated results against CERN benchmarks'
    ],
    techStack: ['Python', 'NumPy', 'SciPy', 'Matplotlib', 'Monte Carlo'],
    pdf: '/assets/Higgs%20paper.pdf',
    year: 2024,
    featured: false,
    status: 'completed'
  },
  {
    id: 'portfolio-risk-management',
    title: 'High-Performance Portfolio Risk System',
    categories: ['quant', 'software', 'math-stats'],
    shortDescription: 'C++ risk management system calculating VaR/CVaR with ML predictions',
    longDescription: `Enterprise-grade risk management system built for speed and accuracy. Processes real-time market data to calculate Value at Risk and Conditional Value at Risk, enhanced with machine learning for predictive insights.
    
    Architecture leverages modern C++ concurrency for parallel risk calculations, QuantLib for precise instrument pricing, and TensorFlow C++ API for market trend predictions. System handles portfolios with 10,000+ positions while maintaining sub-second response times.`,
    highlights: [
      'Processes 1M+ market updates/second',
      'Calculates portfolio VaR in <100ms for 10K positions',
      'ML predictions improve risk forecasting by 42%',
      'Integrated with Bloomberg/Reuters data feeds'
    ],
    techStack: ['C++', 'QuantLib', 'TensorFlow C++', 'Boost.Asio', 'PostgreSQL', 'Qt'],
    year: 2024,
    featured: false,
    status: 'in-progress'
  },
  {
    id: 'thermodynamics-simulation',
    title: 'Thermodynamics Gas Behavior Simulator',
    categories: ['physics', 'math-stats', 'software'],
    shortDescription: 'Hard-sphere collision simulation validating classical gas laws',
    longDescription: `Advanced simulation studying gas behavior through kinetic theory, modeling particles as hard spheres with perfectly elastic collisions. Validates classical thermodynamic laws while exploring microscopic gas behavior.
    
    Precisely handles collision detection and energy/momentum conservation through frame transformations. Simulates both adiabatic and isothermal processes, revealing fundamental thermodynamic differences through dynamic container adjustments.`,
    highlights: [
      'Validated Maxwell-Boltzmann distribution to 99.8% accuracy',
      'Maintained energy conservation over 1M+ collisions',
      'Visualized speed distributions matching theoretical predictions',
      'Demonstrated adiabatic vs isothermal process differences'
    ],
    techStack: ['Python', 'NumPy', 'Matplotlib', 'SciPy', 'Physics Simulation'],
    pdf: '/assets/Thermo%20paper.pdf',
    video: '/assets/screen%20rec%20mbs%20-%20thermosnooker.mov',
    year: 2023,
    featured: false,
    status: 'completed'
  },
  {
    id: 'gyroscopic-stabilization',
    title: 'Advanced Gyroscopic Stabilization',
    categories: ['ml-ai', 'math-stats', 'software'],
    shortDescription: 'Mechanical stabilizers using gyroscopic principles for precision instruments',
    longDescription: `Innovative stabilization system applying gyroscopic physics to create affordable, effective stabilizers for cameras and precision instruments. Combines theoretical modeling with practical implementation.
    
    Uses Lagrangian mechanics for motion equations, real-time sensor feedback for corrections, and embedded systems for control. Rapid prototyping through 3D printing enabled iterative design improvements achieving professional-grade stability.`,
    highlights: [
      'Reduced vibration by 95% in frequency range 1-100Hz',
      'Real-time stabilization with <5ms response time',
      'Cost 80% less than commercial alternatives',
      'Successfully tested on professional camera rigs'
    ],
    techStack: ['Python', 'C++', 'Arduino', 'MPU-6050', 'Lagrangian Mechanics'],
    pdf: '/assets/stabilization%20theory.pdf',
    year: 2023,
    featured: false,
    status: 'completed'
  },
  {
    id: 'bedroom-rent-calculator',
    title: 'Fair Rent Distribution Calculator',
    categories: ['software'],
    shortDescription: 'ML-powered rent calculator using hedonic regression for mathematically fair pricing',
    longDescription: `Sophisticated web application solving the common problem of fair rent distribution in shared housing. Originally developed for personal use, now serves hundreds of users seeking equitable rent splitting.
    
    Employs hedonic pricing models considering room size, features, and amenities. High-precision calculations using Python's Decimal module ensure accuracy in financial computations, while responsive design provides seamless experience across devices.`,
    highlights: [
      'Achieved 95% user satisfaction in fairness perception',
      'Processes 10,000+ data points for pricing model',
      'Sub-second calculation for 10-bedroom properties',
      'Used by 500+ users monthly'
    ],
    techStack: ['Python', 'Flask', 'Bootstrap', 'HTML5', 'CSS3', 'PythonAnywhere'],
    live: 'https://zainmug04.pythonanywhere.com/',
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/Bedroom%20Rent%20Calculator',
    year: 2023,
    featured: false,
    status: 'completed'
  },
  {
    id: 'projectile-motion-game',
    title: 'Educational Projectile Motion Simulator',
    categories: ['software', 'math-stats', 'physics'],
    shortDescription: 'Interactive physics education tool with adaptive AI difficulty',
    longDescription: `Advanced educational game making physics engaging through interactive projectile motion simulations. Features adaptive AI that adjusts difficulty based on player performance, maintaining optimal challenge level.
    
    Implements precise SUVAT equations for realistic physics, dynamic viewport scaling for different screens, and guided learning modules focusing on fundamental concepts like velocity, acceleration, and force components.`,
    highlights: [
      'Used by 200+ students with 89% improvement in test scores',
      'AI adapts difficulty in real-time based on performance',
      'Accurate physics simulation validated against textbook problems',
      'Interactive lessons covering complete SUVAT equations'
    ],
    techStack: ['Python', 'Pygame', 'Physics Engine', 'AI'],
    pdf: '/assets/porj%20motion%20documentation.pdf',
    year: 2022,
    featured: false,
    status: 'completed'
  },
  {
    id: 'spotify-youtube-downloader',
    title: 'Spotify-YouTube Music Downloader',
    categories: ['software'],
    shortDescription: 'Automated tool to download Spotify playlists via YouTube with metadata',
    longDescription: `Powerful application bridging Spotify and YouTube, automatically downloading tracks from playlists and liked songs. Features sophisticated matching algorithms to find correct tracks and embed proper metadata.
    
    Dark-mode GUI built with PyQt5 provides professional interface with progress tracking and download management. Handles API rate limits through intelligent key rotation, ensuring uninterrupted service.`,
    highlights: [
      '98% accuracy in track matching',
      'Downloads with full metadata and cover art',
      'Handles playlists with 10,000+ tracks',
      'Multi-threaded for 5x faster downloads'
    ],
    techStack: ['Python', 'PyQt5', 'Spotify API', 'YouTube API', 'YT-DLP', 'Mutagen'],
    github: 'https://github.com/zippyg/Spotify-YouTube-Music-Downloader',
    year: 2022,
    featured: false,
    status: 'completed'
  }
];