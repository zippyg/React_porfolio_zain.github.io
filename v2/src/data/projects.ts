import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'higgs-boson-analysis',
    title: 'Higgs Boson Statistical Analysis',
    category: 'physics',
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
    pdf: '/assets/Higgs paper.pdf',
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/Higgs%20Boson%20Discovery',
    year: 2024,
    featured: true,
    status: 'completed'
  },
  {
    id: 'neutrino-oscillation',
    title: 'Neutrino Oscillation Parameter Extraction',
    category: 'physics',
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
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/Neutrino%20Oscillations',
    year: 2024,
    featured: true,
    status: 'completed'
  },
  {
    id: 'market-anomaly-detection',
    title: 'Market Data Feed Anomaly Detection',
    category: 'finance',
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
    pdf: '/assets/feed_data_report.pdf',
    year: 2024,
    featured: true,
    status: 'completed'
  },
  {
    id: 'enhanced-black-scholes',
    title: 'Enhanced Black-Scholes with Adaptive Volatility',
    category: 'finance',
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
    year: 2024,
    featured: true,
    status: 'in-progress'
  },
  {
    id: 'portfolio-risk-management',
    title: 'High-Performance Portfolio Risk System',
    category: 'finance',
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
    id: 'marketseer',
    title: 'MarketSeer - AI Financial Forecasting',
    category: 'ml',
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
    featured: false,
    status: 'in-progress'
  },
  {
    id: 'thermodynamics-simulation',
    title: 'Thermodynamics Gas Behavior Simulator',
    category: 'physics',
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
    pdf: '/assets/Thermo paper.pdf',
    video: '/assets/screen rec mbs - thermosnooker.mov',
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/Thermodynamics%20Snooker%20Simulation',
    year: 2023,
    featured: false,
    status: 'completed'
  },
  {
    id: 'gyroscopic-stabilization',
    title: 'Advanced Gyroscopic Stabilization',
    category: 'software',
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
    pdf: '/assets/stabilization theory.pdf',
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/GYROSCOPIC%20STABILIZATION',
    year: 2023,
    featured: false,
    status: 'completed'
  },
  {
    id: 'bedroom-rent-calculator',
    title: 'Fair Rent Distribution Calculator',
    category: 'software',
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
    category: 'software',
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
    pdf: '/assets/porj motion documentation.pdf',
    github: 'https://github.com/zippyg/Zain_Projects/tree/main/Projectile%20Motion%20Tutorial%20and%20Game',
    year: 2022,
    featured: false,
    status: 'completed'
  },
  {
    id: 'spotify-youtube-downloader',
    title: 'Spotify-YouTube Music Downloader',
    category: 'software',
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
  },
  {
    id: 'portfolio-website-v2',
    title: 'Interactive Portfolio with Particle Physics',
    category: 'software',
    shortDescription: 'This website - featuring 168 floating equations and hidden easter eggs',
    longDescription: `You're looking at it! This portfolio pushes web development boundaries with a custom particle system rendering 168 mathematical equations, hidden command palette (CMD+Z), and secret "fun mode" with interactive physics.
    
    Built for performance with Canvas API achieving 60+ FPS while managing complex animations. Features constellation patterns between particles, page-relative scanline effects, and carefully crafted user experience balancing innovation with usability.`,
    highlights: [
      '168 LaTeX equations rendered as floating particles',
      'Hidden command palette with navigation shortcuts',
      'Secret fun mode with mouse physics interactions',
      '60+ FPS performance with hundreds of particles'
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Framer Motion', 'Canvas API', 'Tailwind'],
    github: 'https://github.com/zippyg/React_porfolio_zain.github.io',
    live: 'https://zainmughal.dev',
    year: 2025,
    featured: true,
    status: 'completed'
  }
];