// Comprehensive equation bank covering physics, mathematics, finance, and machine learning

export interface Equation {
  latex: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export interface EquationCategory {
  name: string;
  equations: Equation[];
}

export const equationBank: EquationCategory[] = [
  // ==================== CLASSICAL MECHANICS ====================
  {
    name: 'Classical Mechanics',
    equations: [
      {
        latex: 'F = ma',
        description: "Newton's second law",
        complexity: 'simple'
      },
      {
        latex: 'E = \\frac{1}{2}mv^2 + V(x)',
        description: 'Total energy',
        complexity: 'simple'
      },
      {
        latex: 'L = T - V = \\frac{1}{2}m\\dot{q}^2 - V(q)',
        description: 'Lagrangian',
        complexity: 'medium'
      },
      {
        latex: '\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0',
        description: 'Euler-Lagrange equation',
        complexity: 'complex'
      },
      {
        latex: 'H = \\sum_i p_i\\dot{q}_i - L',
        description: 'Hamiltonian',
        complexity: 'medium'
      },
      {
        latex: '\\dot{q}_i = \\frac{\\partial H}{\\partial p_i}, \\quad \\dot{p}_i = -\\frac{\\partial H}{\\partial q_i}',
        description: "Hamilton's equations",
        complexity: 'medium'
      },
      {
        latex: '\\{f,g\\} = \\sum_i \\left(\\frac{\\partial f}{\\partial q_i}\\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial g}{\\partial q_i}\\right)',
        description: 'Poisson bracket',
        complexity: 'complex'
      },
      {
        latex: 'I = \\int_{t_1}^{t_2} L\\,dt',
        description: 'Action integral',
        complexity: 'medium'
      },
      {
        latex: '\\tau = r \\times F = I\\alpha',
        description: 'Torque',
        complexity: 'simple'
      },
      {
        latex: 'L = I\\omega = r \\times p',
        description: 'Angular momentum',
        complexity: 'simple'
      }
    ]
  },

  // ==================== QUANTUM MECHANICS ====================
  {
    name: 'Quantum Mechanics',
    equations: [
      {
        latex: 'i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi',
        description: 'Time-dependent Schrödinger equation',
        complexity: 'medium'
      },
      {
        latex: '\\hat{H}\\psi = E\\psi',
        description: 'Time-independent Schrödinger equation',
        complexity: 'medium'
      },
      {
        latex: '\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r})',
        description: 'Hamiltonian operator',
        complexity: 'medium'
      },
      {
        latex: '[\\hat{x}, \\hat{p}] = i\\hbar',
        description: 'Canonical commutation relation',
        complexity: 'simple'
      },
      {
        latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}',
        description: 'Heisenberg uncertainty principle',
        complexity: 'simple'
      },
      {
        latex: '\\langle \\psi | \\phi \\rangle = \\int \\psi^* \\phi\\, d^3r',
        description: 'Inner product',
        complexity: 'medium'
      },
      {
        latex: '\\hat{A}|a\\rangle = a|a\\rangle',
        description: 'Eigenvalue equation',
        complexity: 'simple'
      },
      {
        latex: '|\\psi\\rangle = \\sum_n c_n|n\\rangle',
        description: 'State expansion',
        complexity: 'simple'
      },
      {
        latex: '\\rho = |\\psi\\rangle\\langle\\psi|',
        description: 'Density matrix (pure state)',
        complexity: 'simple'
      },
      {
        latex: '\\frac{\\partial \\rho}{\\partial t} = -\\frac{i}{\\hbar}[\\hat{H}, \\rho]',
        description: 'Von Neumann equation',
        complexity: 'medium'
      }
    ]
  },

  // ==================== GENERAL RELATIVITY ====================
  {
    name: 'General Relativity',
    equations: [
      {
        latex: 'R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}',
        description: 'Einstein field equations',
        complexity: 'complex'
      },
      {
        latex: 'ds^2 = g_{\\mu\\nu}dx^\\mu dx^\\nu',
        description: 'Metric tensor',
        complexity: 'medium'
      },
      {
        latex: '\\Gamma^\\lambda_{\\mu\\nu} = \\frac{1}{2}g^{\\lambda\\rho}(\\partial_\\mu g_{\\nu\\rho} + \\partial_\\nu g_{\\mu\\rho} - \\partial_\\rho g_{\\mu\\nu})',
        description: 'Christoffel symbols',
        complexity: 'complex'
      },
      {
        latex: 'R^\\rho_{\\sigma\\mu\\nu} = \\partial_\\mu\\Gamma^\\rho_{\\nu\\sigma} - \\partial_\\nu\\Gamma^\\rho_{\\mu\\sigma} + \\Gamma^\\rho_{\\mu\\lambda}\\Gamma^\\lambda_{\\nu\\sigma} - \\Gamma^\\rho_{\\nu\\lambda}\\Gamma^\\lambda_{\\mu\\sigma}',
        description: 'Riemann curvature tensor',
        complexity: 'complex'
      },
      {
        latex: '\\nabla_\\mu T^{\\mu\\nu} = 0',
        description: 'Energy-momentum conservation',
        complexity: 'medium'
      },
      {
        latex: '\\frac{d^2x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\tau}\\frac{dx^\\beta}{d\\tau} = 0',
        description: 'Geodesic equation',
        complexity: 'complex'
      },
      {
        latex: 'R = g^{\\mu\\nu}R_{\\mu\\nu}',
        description: 'Ricci scalar',
        complexity: 'medium'
      },
      {
        latex: 'G_{\\mu\\nu} = R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R',
        description: 'Einstein tensor',
        complexity: 'medium'
      }
    ]
  },

  // ==================== WAVE EQUATIONS ====================
  {
    name: 'Wave Equations',
    equations: [
      {
        latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2\\nabla^2 u',
        description: 'Wave equation',
        complexity: 'medium'
      },
      {
        latex: '\\nabla^2\\phi - \\frac{1}{c^2}\\frac{\\partial^2\\phi}{\\partial t^2} = 0',
        description: "D'Alembert equation",
        complexity: 'medium'
      },
      {
        latex: 'u(x,t) = A\\sin(kx - \\omega t + \\phi)',
        description: 'Plane wave solution',
        complexity: 'simple'
      },
      {
        latex: 'k = \\frac{2\\pi}{\\lambda}, \\quad \\omega = 2\\pi f',
        description: 'Wave vector and angular frequency',
        complexity: 'simple'
      },
      {
        latex: 'v_g = \\frac{d\\omega}{dk}',
        description: 'Group velocity',
        complexity: 'simple'
      },
      {
        latex: 'v_p = \\frac{\\omega}{k}',
        description: 'Phase velocity',
        complexity: 'simple'
      },
      {
        latex: '\\frac{\\partial u}{\\partial t} = \\alpha\\frac{\\partial^2 u}{\\partial x^2}',
        description: 'Heat equation',
        complexity: 'medium'
      },
      {
        latex: '\\nabla^2\\phi = 0',
        description: 'Laplace equation',
        complexity: 'simple'
      }
    ]
  },

  // ==================== ELECTROMAGNETISM ====================
  {
    name: 'Electromagnetism',
    equations: [
      {
        latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}',
        description: "Gauss's law",
        complexity: 'medium'
      },
      {
        latex: '\\nabla \\cdot \\mathbf{B} = 0',
        description: "Gauss's law for magnetism",
        complexity: 'medium'
      },
      {
        latex: '\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}',
        description: "Faraday's law",
        complexity: 'medium'
      },
      {
        latex: '\\nabla \\times \\mathbf{B} = \\mu_0\\mathbf{J} + \\mu_0\\epsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}',
        description: "Ampère-Maxwell law",
        complexity: 'complex'
      },
      {
        latex: 'F_{\\mu\\nu} = \\partial_\\mu A_\\nu - \\partial_\\nu A_\\mu',
        description: 'Electromagnetic field tensor',
        complexity: 'medium'
      },
      {
        latex: '\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})',
        description: 'Lorentz force',
        complexity: 'simple'
      },
      {
        latex: 'S = \\frac{1}{\\mu_0}\\mathbf{E} \\times \\mathbf{B}',
        description: 'Poynting vector',
        complexity: 'medium'
      }
    ]
  },

  // ==================== FINANCIAL MATHEMATICS ====================
  {
    name: 'Financial Mathematics',
    equations: [
      {
        latex: '\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0',
        description: 'Black-Scholes PDE',
        complexity: 'complex'
      },
      {
        latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)',
        description: 'Black-Scholes call option price',
        complexity: 'medium'
      },
      {
        latex: 'd_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}',
        description: 'Black-Scholes d1 parameter',
        complexity: 'medium'
      },
      {
        latex: 'd_2 = d_1 - \\sigma\\sqrt{T}',
        description: 'Black-Scholes d2 parameter',
        complexity: 'simple'
      },
      {
        latex: 'dV_t = \\kappa(\\theta - V_t)dt + \\xi\\sqrt{V_t}dW_t',
        description: 'Heston model volatility',
        complexity: 'complex'
      },
      {
        latex: '\\sigma_{SABR} = \\frac{\\alpha}{(FK)^{(1-\\beta)/2}\\left[1 + \\frac{(1-\\beta)^2}{24}\\ln^2(F/K)\\right]}\\frac{z}{\\chi(z)}',
        description: 'SABR implied volatility',
        complexity: 'complex'
      },
      {
        latex: 'dX_t = \\mu(X_t, t)dt + \\sigma(X_t, t)dW_t',
        description: "Itô's stochastic differential equation",
        complexity: 'medium'
      },
      {
        latex: 'df(X_t) = \\left(\\frac{\\partial f}{\\partial t} + \\mu\\frac{\\partial f}{\\partial x} + \\frac{1}{2}\\sigma^2\\frac{\\partial^2 f}{\\partial x^2}\\right)dt + \\sigma\\frac{\\partial f}{\\partial x}dW_t',
        description: "Itô's lemma",
        complexity: 'complex'
      },
      {
        latex: '\\text{VaR}_\\alpha = \\mu - \\sigma\\Phi^{-1}(\\alpha)',
        description: 'Value at Risk',
        complexity: 'simple'
      },
      {
        latex: '\\text{CVaR}_\\alpha = \\mu - \\frac{\\sigma}{\\alpha}\\phi(\\Phi^{-1}(\\alpha))',
        description: 'Conditional Value at Risk',
        complexity: 'medium'
      }
    ]
  },

  // ==================== STOCHASTIC CALCULUS ====================
  {
    name: 'Stochastic Calculus',
    equations: [
      {
        latex: 'W_t \\sim \\mathcal{N}(0, t)',
        description: 'Brownian motion distribution',
        complexity: 'simple'
      },
      {
        latex: '\\mathbb{E}[W_s W_t] = \\min(s, t)',
        description: 'Brownian motion covariance',
        complexity: 'simple'
      },
      {
        latex: '\\int_0^t W_s dW_s = \\frac{1}{2}W_t^2 - \\frac{1}{2}t',
        description: 'Itô integral of Brownian motion',
        complexity: 'medium'
      },
      {
        latex: 'X_t = X_0 + \\int_0^t \\mu_s ds + \\int_0^t \\sigma_s dW_s',
        description: 'Itô process',
        complexity: 'medium'
      },
      {
        latex: '\\langle X \\rangle_t = \\int_0^t \\sigma_s^2 ds',
        description: 'Quadratic variation',
        complexity: 'medium'
      },
      {
        latex: 'M_t = \\exp\\left(\\sigma W_t - \\frac{1}{2}\\sigma^2 t\\right)',
        description: 'Geometric Brownian motion',
        complexity: 'medium'
      },
      {
        latex: 'dX_t = -\\lambda X_t dt + \\sigma dW_t',
        description: 'Ornstein-Uhlenbeck process',
        complexity: 'medium'
      },
      {
        latex: '\\mathbb{E}[f(X_T)] = f(x) + \\mathbb{E}\\left[\\int_0^T \\mathcal{A}f(X_s)ds\\right]',
        description: 'Feynman-Kac formula',
        complexity: 'complex'
      }
    ]
  },

  // ==================== ROUGH PATH THEORY ====================
  {
    name: 'Rough Path Theory',
    equations: [
      {
        latex: '\\|\\mathbf{X}\\|_{p\\text{-var};[s,t]} = \\sup_{\\mathcal{D}} \\left(\\sum_{[t_i,t_{i+1}]\\in\\mathcal{D}} |X_{t_{i+1}} - X_{t_i}|^p\\right)^{1/p}',
        description: 'p-variation norm',
        complexity: 'complex'
      },
      {
        latex: '\\mathbb{X}_{s,t} = (1, X_{s,t}, \\mathbb{X}_{s,t}^2, \\ldots, \\mathbb{X}_{s,t}^{[p]})',
        description: 'Rough path signature',
        complexity: 'complex'
      },
      {
        latex: '\\mathbb{X}_{s,t}^2 = \\int_s^t (X_{s,r} - X_{s,s}) \\otimes dX_r',
        description: 'Second level of rough path',
        complexity: 'complex'
      },
      {
        latex: 'Y_t = Y_s + \\int_s^t f(Y_r)dX_r',
        description: 'Rough differential equation',
        complexity: 'medium'
      },
      {
        latex: '\\mathcal{S}_n(X)_{s,t} = \\int_{s<t_1<\\cdots<t_n<t} dX_{t_1} \\otimes \\cdots \\otimes dX_{t_n}',
        description: 'Signature of path',
        complexity: 'complex'
      },
      {
        latex: '\\|\\mathbb{X}\\|_{\\gamma} = \\|X\\|_{\\gamma} + \\|\\mathbb{X}^2\\|_{\\gamma/2}',
        description: 'Rough path norm',
        complexity: 'medium'
      }
    ]
  },

  // ==================== NUMERICAL METHODS ====================
  {
    name: 'Numerical Methods',
    equations: [
      {
        latex: 'y_{n+1} = y_n + hf(t_n, y_n)',
        description: 'Euler method',
        complexity: 'simple'
      },
      {
        latex: 'y_{n+1} = y_n + \\frac{h}{2}[f(t_n, y_n) + f(t_{n+1}, y_{n+1})]',
        description: 'Trapezoidal rule',
        complexity: 'medium'
      },
      {
        latex: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
        description: 'Runge-Kutta 4th order',
        complexity: 'complex'
      },
      {
        latex: 'X_{n+1} = X_n + \\mu(X_n)\\Delta t + \\sigma(X_n)\\sqrt{\\Delta t}Z_n',
        description: 'Euler-Maruyama scheme',
        complexity: 'medium'
      },
      {
        latex: 'X_{n+1} = X_n + \\mu\\Delta t + \\sigma\\Delta W_n + \\frac{1}{2}\\sigma\\sigma\'(\\Delta W_n^2 - \\Delta t)',
        description: 'Milstein scheme',
        complexity: 'complex'
      },
      {
        latex: 'y_{n+1} = y_n + hf(t_{n+1}, y_{n+1})',
        description: 'Backward Euler (implicit)',
        complexity: 'medium'
      },
      {
        latex: '\\nabla^2 u_{i,j} \\approx \\frac{u_{i+1,j} + u_{i-1,j} + u_{i,j+1} + u_{i,j-1} - 4u_{i,j}}{h^2}',
        description: 'Finite difference Laplacian',
        complexity: 'medium'
      },
      {
        latex: 'u_i^{n+1} = u_i^n + \\frac{\\Delta t}{\\Delta x^2}(u_{i+1}^n - 2u_i^n + u_{i-1}^n)',
        description: 'Explicit heat equation scheme',
        complexity: 'medium'
      }
    ]
  },

  // ==================== LINEAR ALGEBRA ====================
  {
    name: 'Linear Algebra',
    equations: [
      {
        latex: 'Ax = b',
        description: 'Linear system',
        complexity: 'simple'
      },
      {
        latex: 'A^{-1}A = AA^{-1} = I',
        description: 'Matrix inverse',
        complexity: 'simple'
      },
      {
        latex: '\\det(A - \\lambda I) = 0',
        description: 'Characteristic equation',
        complexity: 'medium'
      },
      {
        latex: 'Av = \\lambda v',
        description: 'Eigenvalue equation',
        complexity: 'simple'
      },
      {
        latex: 'A = U\\Sigma V^T',
        description: 'Singular value decomposition',
        complexity: 'medium'
      },
      {
        latex: 'A = QR',
        description: 'QR decomposition',
        complexity: 'simple'
      },
      {
        latex: '\\|x\\|_2 = \\sqrt{\\sum_i x_i^2}',
        description: 'Euclidean norm',
        complexity: 'simple'
      },
      {
        latex: '\\langle x, y \\rangle = \\sum_i x_i y_i',
        description: 'Inner product',
        complexity: 'simple'
      },
      {
        latex: '\\text{tr}(A) = \\sum_i A_{ii}',
        description: 'Matrix trace',
        complexity: 'simple'
      },
      {
        latex: '\\|A\\|_F = \\sqrt{\\text{tr}(A^TA)}',
        description: 'Frobenius norm',
        complexity: 'medium'
      }
    ]
  },

  // ==================== TENSOR CALCULUS ====================
  {
    name: 'Tensor Calculus',
    equations: [
      {
        latex: 'T^{\\mu\\nu} = T^{\\nu\\mu}',
        description: 'Symmetric tensor',
        complexity: 'simple'
      },
      {
        latex: 'T^{\\mu\\nu} = -T^{\\nu\\mu}',
        description: 'Antisymmetric tensor',
        complexity: 'simple'
      },
      {
        latex: '\\nabla_\\mu V^\\nu = \\partial_\\mu V^\\nu + \\Gamma^\\nu_{\\mu\\lambda}V^\\lambda',
        description: 'Covariant derivative of vector',
        complexity: 'complex'
      },
      {
        latex: '\\nabla_\\mu T^{\\alpha\\beta} = \\partial_\\mu T^{\\alpha\\beta} + \\Gamma^\\alpha_{\\mu\\lambda}T^{\\lambda\\beta} + \\Gamma^\\beta_{\\mu\\lambda}T^{\\alpha\\lambda}',
        description: 'Covariant derivative of tensor',
        complexity: 'complex'
      },
      {
        latex: 'g^{\\mu\\nu}g_{\\nu\\lambda} = \\delta^\\mu_\\lambda',
        description: 'Metric tensor property',
        complexity: 'medium'
      },
      {
        latex: '\\epsilon_{\\mu\\nu\\rho\\sigma} = \\sqrt{-g}[\\mu\\nu\\rho\\sigma]',
        description: 'Levi-Civita tensor',
        complexity: 'medium'
      },
      {
        latex: 'T = T^{\\mu_1\\cdots\\mu_p}_{\\nu_1\\cdots\\nu_q}',
        description: 'General tensor notation',
        complexity: 'medium'
      }
    ]
  },

  // ==================== DIFFERENTIAL GEOMETRY ====================
  {
    name: 'Differential Geometry',
    equations: [
      {
        latex: 'ds^2 = \\sum_{i,j} g_{ij}dx^i dx^j',
        description: 'Line element',
        complexity: 'medium'
      },
      {
        latex: '\\kappa = \\frac{|\\dot{\\mathbf{r}} \\times \\ddot{\\mathbf{r}}|}{|\\dot{\\mathbf{r}}|^3}',
        description: 'Curvature',
        complexity: 'medium'
      },
      {
        latex: '\\tau = \\frac{(\\dot{\\mathbf{r}} \\times \\ddot{\\mathbf{r}}) \\cdot \\dddot{\\mathbf{r}}}{|\\dot{\\mathbf{r}} \\times \\ddot{\\mathbf{r}}|^2}',
        description: 'Torsion',
        complexity: 'complex'
      },
      {
        latex: 'K = \\frac{\\det(II)}{\\det(I)}',
        description: 'Gaussian curvature',
        complexity: 'medium'
      },
      {
        latex: 'H = \\frac{1}{2}\\text{tr}(I^{-1}II)',
        description: 'Mean curvature',
        complexity: 'medium'
      },
      {
        latex: '\\omega = dx^1 \\wedge dx^2 \\wedge \\cdots \\wedge dx^n',
        description: 'Volume form',
        complexity: 'medium'
      },
      {
        latex: 'd\\omega = 0',
        description: 'Closed form',
        complexity: 'simple'
      },
      {
        latex: '\\omega = d\\alpha',
        description: 'Exact form',
        complexity: 'simple'
      }
    ]
  },

  // ==================== TOPOLOGY ====================
  {
    name: 'Topology',
    equations: [
      {
        latex: '\\chi(M) = \\sum_{k=0}^n (-1)^k b_k',
        description: 'Euler characteristic',
        complexity: 'medium'
      },
      {
        latex: 'H_k(M) = \\ker(\\partial_k) / \\text{im}(\\partial_{k+1})',
        description: 'Homology group',
        complexity: 'complex'
      },
      {
        latex: 'H^k(M) = \\ker(d^k) / \\text{im}(d^{k-1})',
        description: 'Cohomology group',
        complexity: 'complex'
      },
      {
        latex: '\\pi_1(S^1) = \\mathbb{Z}',
        description: 'Fundamental group of circle',
        complexity: 'medium'
      },
      {
        latex: 'f_*: \\pi_1(X) \\to \\pi_1(Y)',
        description: 'Induced homomorphism',
        complexity: 'medium'
      },
      {
        latex: '\\int_M d\\omega = \\int_{\\partial M} \\omega',
        description: "Stokes' theorem",
        complexity: 'medium'
      }
    ]
  },

  // ==================== POLYNOMIALS & SERIES ====================
  {
    name: 'Polynomials & Series',
    equations: [
      {
        latex: 'P_n(x) = \\sum_{k=0}^n a_k x^k',
        description: 'General polynomial',
        complexity: 'simple'
      },
      {
        latex: 'f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n',
        description: 'Taylor series',
        complexity: 'medium'
      },
      {
        latex: 'e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}',
        description: 'Exponential series',
        complexity: 'simple'
      },
      {
        latex: '\\sin(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!}',
        description: 'Sine series',
        complexity: 'medium'
      },
      {
        latex: '\\ln(1+x) = \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}x^n}{n}',
        description: 'Logarithm series',
        complexity: 'medium'
      },
      {
        latex: 'L_n(x) = \\prod_{j=0,j\\neq i}^n \\frac{x-x_j}{x_i-x_j}',
        description: 'Lagrange basis polynomial',
        complexity: 'complex'
      },
      {
        latex: 'P(x) = \\sum_{i=0}^n y_i L_i(x)',
        description: 'Lagrange interpolation',
        complexity: 'medium'
      },
      {
        latex: 'T_n(x) = \\cos(n\\arccos(x))',
        description: 'Chebyshev polynomial',
        complexity: 'medium'
      }
    ]
  },

  // ==================== FOURIER ANALYSIS ====================
  {
    name: 'Fourier Analysis',
    equations: [
      {
        latex: 'f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty [a_n\\cos(nx) + b_n\\sin(nx)]',
        description: 'Fourier series',
        complexity: 'medium'
      },
      {
        latex: 'a_n = \\frac{1}{\\pi}\\int_{-\\pi}^\\pi f(x)\\cos(nx)dx',
        description: 'Fourier cosine coefficient',
        complexity: 'medium'
      },
      {
        latex: 'F(\\omega) = \\int_{-\\infty}^\\infty f(t)e^{-i\\omega t}dt',
        description: 'Fourier transform',
        complexity: 'medium'
      },
      {
        latex: 'f(t) = \\frac{1}{2\\pi}\\int_{-\\infty}^\\infty F(\\omega)e^{i\\omega t}d\\omega',
        description: 'Inverse Fourier transform',
        complexity: 'medium'
      },
      {
        latex: '\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty f(t)e^{-st}dt',
        description: 'Laplace transform',
        complexity: 'medium'
      },
      {
        latex: '\\mathcal{Z}\\{x[n]\\} = \\sum_{n=-\\infty}^\\infty x[n]z^{-n}',
        description: 'Z-transform',
        complexity: 'medium'
      }
    ]
  },

  // ==================== MACHINE LEARNING ====================
  {
    name: 'Machine Learning',
    equations: [
      {
        latex: 'J(\\theta) = \\frac{1}{2m}\\sum_{i=1}^m (h_\\theta(x^{(i)}) - y^{(i)})^2',
        description: 'Mean squared error',
        complexity: 'medium'
      },
      {
        latex: '\\theta := \\theta - \\alpha\\nabla_\\theta J(\\theta)',
        description: 'Gradient descent',
        complexity: 'simple'
      },
      {
        latex: '\\theta := \\theta - \\alpha\\nabla_\\theta J(\\theta; x^{(i)}, y^{(i)})',
        description: 'Stochastic gradient descent',
        complexity: 'medium'
      },
      {
        latex: 'h_\\theta(x) = \\frac{1}{1 + e^{-\\theta^T x}}',
        description: 'Logistic function',
        complexity: 'simple'
      },
      {
        latex: 'J(\\theta) = -\\frac{1}{m}\\sum_{i=1}^m [y^{(i)}\\log(h_\\theta(x^{(i)})) + (1-y^{(i)})\\log(1-h_\\theta(x^{(i)}))]',
        description: 'Cross-entropy loss',
        complexity: 'complex'
      },
      {
        latex: '\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}',
        description: 'Softmax function',
        complexity: 'medium'
      },
      {
        latex: 'a^{(l)} = \\sigma(W^{(l)}a^{(l-1)} + b^{(l)})',
        description: 'Neural network forward pass',
        complexity: 'medium'
      },
      {
        latex: '\\delta^{(l)} = ((W^{(l)})^T\\delta^{(l+1)}) \\odot \\sigma\'(z^{(l)})',
        description: 'Backpropagation',
        complexity: 'complex'
      },
      {
        latex: 'f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)',
        description: 'LSTM forget gate',
        complexity: 'medium'
      },
      {
        latex: 'i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)',
        description: 'LSTM input gate',
        complexity: 'medium'
      },
      {
        latex: '\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)',
        description: 'LSTM candidate values',
        complexity: 'medium'
      },
      {
        latex: 'C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t',
        description: 'LSTM cell state',
        complexity: 'medium'
      },
      {
        latex: 'o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)',
        description: 'LSTM output gate',
        complexity: 'medium'
      },
      {
        latex: 'h_t = o_t * \\tanh(C_t)',
        description: 'LSTM hidden state',
        complexity: 'simple'
      }
    ]
  },

  // ==================== NEURAL DIFFERENTIAL EQUATIONS ====================
  {
    name: 'Neural Differential Equations',
    equations: [
      {
        latex: '\\frac{dh(t)}{dt} = f_\\theta(h(t), t)',
        description: 'Neural ODE',
        complexity: 'medium'
      },
      {
        latex: 'h(T) = h(0) + \\int_0^T f_\\theta(h(t), t)dt',
        description: 'Neural ODE solution',
        complexity: 'medium'
      },
      {
        latex: 'dh_t = f_\\theta(h_t, t)dt + g_\\theta(h_t, t)dW_t',
        description: 'Neural SDE',
        complexity: 'complex'
      },
      {
        latex: '\\frac{\\partial p(z,t)}{\\partial t} = -\\text{tr}\\left(\\frac{\\partial f_\\theta}{\\partial z}\\right)',
        description: 'Continuous normalizing flow',
        complexity: 'complex'
      },
      {
        latex: 'L = \\mathbb{E}_{p(x)}\\left[\\log p(x) - \\log p(z(0)) - \\int_0^T \\text{tr}\\left(\\frac{\\partial f_\\theta}{\\partial z}\\right)dt\\right]',
        description: 'CNF loss function',
        complexity: 'complex'
      }
    ]
  },

  // ==================== REGRESSION & STATISTICS ====================
  {
    name: 'Regression & Statistics',
    equations: [
      {
        latex: 'y = \\beta_0 + \\beta_1 x + \\epsilon',
        description: 'Simple linear regression',
        complexity: 'simple'
      },
      {
        latex: 'y = X\\beta + \\epsilon',
        description: 'Multiple linear regression',
        complexity: 'simple'
      },
      {
        latex: '\\hat{\\beta} = (X^TX)^{-1}X^Ty',
        description: 'OLS estimator',
        complexity: 'medium'
      },
      {
        latex: 'R^2 = 1 - \\frac{\\sum_i (y_i - \\hat{y}_i)^2}{\\sum_i (y_i - \\bar{y})^2}',
        description: 'Coefficient of determination',
        complexity: 'medium'
      },
      {
        latex: '\\text{AIC} = 2k - 2\\ln(\\hat{L})',
        description: 'Akaike information criterion',
        complexity: 'simple'
      },
      {
        latex: '\\text{BIC} = k\\ln(n) - 2\\ln(\\hat{L})',
        description: 'Bayesian information criterion',
        complexity: 'simple'
      },
      {
        latex: 'L(\\theta) = \\prod_{i=1}^n f(x_i|\\theta)',
        description: 'Likelihood function',
        complexity: 'medium'
      },
      {
        latex: 'p(\\theta|x) = \\frac{p(x|\\theta)p(\\theta)}{p(x)}',
        description: "Bayes' theorem",
        complexity: 'medium'
      }
    ]
  },

  // ==================== OPTIMIZATION ====================
  {
    name: 'Optimization',
    equations: [
      {
        latex: '\\nabla f(x^*) = 0',
        description: 'First-order optimality',
        complexity: 'simple'
      },
      {
        latex: '\\nabla^2 f(x^*) \\succeq 0',
        description: 'Second-order optimality',
        complexity: 'medium'
      },
      {
        latex: 'x_{k+1} = x_k - \\alpha_k \\nabla f(x_k)',
        description: 'Gradient descent iteration',
        complexity: 'simple'
      },
      {
        latex: 'x_{k+1} = x_k - H^{-1}(x_k)\\nabla f(x_k)',
        description: "Newton's method",
        complexity: 'medium'
      },
      {
        latex: '\\mathcal{L}(x,\\lambda) = f(x) + \\sum_i \\lambda_i g_i(x)',
        description: 'Lagrangian',
        complexity: 'medium'
      },
      {
        latex: '\\nabla f(x^*) + \\sum_i \\lambda_i^* \\nabla g_i(x^*) = 0',
        description: 'KKT conditions',
        complexity: 'complex'
      },
      {
        latex: 'v_{t+1} = \\beta v_t + (1-\\beta)\\nabla f(x_t)',
        description: 'Momentum update',
        complexity: 'medium'
      },
      {
        latex: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t',
        description: 'Adam first moment',
        complexity: 'medium'
      },
      {
        latex: 'v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2',
        description: 'Adam second moment',
        complexity: 'medium'
      }
    ]
  },

  // ==================== INFORMATION THEORY ====================
  {
    name: 'Information Theory',
    equations: [
      {
        latex: 'H(X) = -\\sum_i p(x_i)\\log p(x_i)',
        description: 'Shannon entropy',
        complexity: 'medium'
      },
      {
        latex: 'H(X|Y) = -\\sum_{i,j} p(x_i,y_j)\\log p(x_i|y_j)',
        description: 'Conditional entropy',
        complexity: 'medium'
      },
      {
        latex: 'I(X;Y) = H(X) - H(X|Y)',
        description: 'Mutual information',
        complexity: 'medium'
      },
      {
        latex: 'D_{KL}(P||Q) = \\sum_i p(i)\\log\\frac{p(i)}{q(i)}',
        description: 'KL divergence',
        complexity: 'medium'
      },
      {
        latex: 'C = \\max_{p(x)} I(X;Y)',
        description: 'Channel capacity',
        complexity: 'simple'
      },
      {
        latex: 'H(X_1,\\ldots,X_n) \\leq \\sum_{i=1}^n H(X_i)',
        description: 'Subadditivity of entropy',
        complexity: 'medium'
      }
    ]
  },

  // ==================== COMPLEX ANALYSIS ====================
  {
    name: 'Complex Analysis',
    equations: [
      {
        latex: 'f(z) = u(x,y) + iv(x,y)',
        description: 'Complex function',
        complexity: 'simple'
      },
      {
        latex: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}',
        description: 'Cauchy-Riemann equations',
        complexity: 'medium'
      },
      {
        latex: 'f(z) = \\sum_{n=0}^\\infty a_n(z-z_0)^n',
        description: 'Taylor series (complex)',
        complexity: 'medium'
      },
      {
        latex: 'f(z) = \\sum_{n=-\\infty}^\\infty a_n(z-z_0)^n',
        description: 'Laurent series',
        complexity: 'medium'
      },
      {
        latex: '\\oint_C f(z)dz = 2\\pi i \\sum \\text{Res}(f, z_k)',
        description: 'Residue theorem',
        complexity: 'complex'
      },
      {
        latex: 'f(a) = \\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{z-a}dz',
        description: "Cauchy's integral formula",
        complexity: 'medium'
      }
    ]
  }
];

// Helper function to get all equations as a flat array
export function getAllEquations(): Equation[] {
  return equationBank.flatMap(category => category.equations);
}

// Helper function to get equations by complexity
export function getEquationsByComplexity(complexity: 'simple' | 'medium' | 'complex'): Equation[] {
  return getAllEquations().filter(eq => eq.complexity === complexity);
}

// Helper function to get random equations
export function getRandomEquations(count: number): Equation[] {
  const allEquations = getAllEquations();
  const shuffled = [...allEquations].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper function to get equations from specific categories
export function getEquationsFromCategories(categoryNames: string[]): Equation[] {
  return equationBank
    .filter(cat => categoryNames.includes(cat.name))
    .flatMap(cat => cat.equations);
}

// Simple math symbols for lighter weight rendering
export const mathSymbols = [
  // Greek letters
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ",
  "ν", "ξ", "π", "ρ", "σ", "τ", "φ", "χ", "ψ", "ω",
  "Γ", "Δ", "Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "Ω",
  
  // Mathematical operators
  "∂", "∇", "∫", "∬", "∭", "∮", "∑", "∏", "√", "∛", "∜",
  "±", "∓", "×", "÷", "≈", "≠", "≤", "≥", "≪", "≫", "∈", "∉",
  "⊂", "⊃", "⊆", "⊇", "∪", "∩", "∧", "∨", "¬", "∀", "∃",
  
  // Special symbols
  "∞", "ℵ", "ℏ", "ℓ", "℘", "ℜ", "ℑ", "∅", "⊗", "⊕", "⊖",
  
  // Arrows
  "→", "←", "↑", "↓", "↔", "⇒", "⇐", "⇔", "↦", "⟶", "⟵"
];