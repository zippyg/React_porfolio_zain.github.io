const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://zippyg.github.io/React_porfolio_zain.github.io/',
  title: '(Mohammed) Zain Mughal.',
};

const about = {
  name: 'Zain Mughal',
  role: "Harnessing Physics for Data Mastery: Innovator and Technologist",
  description: `Welcome to my portfolio. As a Physics enthusiast and student (Imperial College London – MSci), I enjoy diving into complex datasets and turning them into some set of not so complex numbers and visions. My academic and personal journey has been a mix of stress followed by the relief of each eureka moment. All arming me with skills in Python, C/C++, JavaScript, machine learning and the deep seated theory behind it all. Here, you'll find a slight peek into my brain through my projects that not only showcase my technical abilities, but also my ability to tackle real-world challenges in any demanding sector. Take a look around, and see how my curiosity mixes with my ever evolving skillset. Please get in touch if you are even slightly curious.`,
  resume: `${process.env.PUBLIC_URL}/assets/Zain Mughal resume Quant.pdf`, // Adjusted path
  social: {
    linkedin: 'https://www.linkedin.com/in/mughalzain/',
    github: 'https://github.com/zippyg',
    email: 'zainmughal77@outlook.com'
  },
};


const education = [
  {
    institution: 'Imperial College London',
    degree: 'Physics MSci',
    from: 'Oct 2022',
    to: 'Jun 2026',
    description: "Predicted 1:1 (First Class Honours)\n" +
                 "  Comprehensive study of Differential Equations, Probability Analysis and Distributions, Monte Carlo methods, Regression Analysis, Multivariate Statistical methods, Data Science and Machine Learning.\n" +
                 "  Imperial BPES modules: Accounting & Finance completed; Business Economics ongoing\n" +
                 "  Investment Society (Securities Education Certificate course, based on CFA levels 1 & 2)\n" + 
                 "  Finance Society (Investment Banking Training Programme)\n" + 
                 "  AlgoTrading Society (AlgoCourse)"
  },
  {
    institution: 'Bishopshalt School',
    degree: 'A Levels',
    from: 'Sep 2020',
    to: 'Aug 2022',
    description: 'Mathematics - A*\nPhysics - A*\nComputer Science - A*',
  },  
  {
    institution: 'Rosedale College',
    degree: 'GCSE',
    from: 'Sep 2015',
    to: 'Aug 2020',
    description: "Achieved 13 GCSEs with grades 9 to 8, including Maths and English, and 2 distinctions\n" +
                 "Valedictorian, recognised for academic excellence and leadership qualities"
  }
];


const projects = [
  {
    id: 1,
    name: 'Higgs Boson Statistical Analysis',
    description: 'This project simulated the data analysis process that led to the discovery of the Higgs boson, using advanced statistical tools and Python programming.',
    detailedDescription: `Our project simulated the data analysis process that led to the discovery of the Higgs boson, using advanced statistical tools and Python programming. This was a collaborative work piece, within supervision at Imperial College.`,
    technicalComplexity: [
      {
        title: "Backend",
        detail: "**Flask Framework:** Built using Flask for rapid development and deployment.\n **Dynamic Routing and Templating:** Manages user flows with Flask's routing and Jinja2 templating for dynamic HTML generation.\n **WSGI Configuration:** Ensures efficient handling of web requests in a production environment."
      },
      {
        title: "Precision and Accuracy",
        detail: "**Decimal Module:** Ensures high precision in financial calculations, avoiding common floating-point arithmetic issues."
      },
      {
        title: "Frontend",
        detail: "**HTML5 and CSS3:** Developed with modern HTML5 and CSS3 for functionality and visual appeal.\n **Bootstrap 4.5:** Provides a responsive, mobile-friendly design with Bootstrap's grid system and component classes.\n **Responsive Design:** Seamlessly adjusts layout across different screen sizes."
      },
      {
        title: "Deployment",
        detail: "**PythonAnywhere:** Deployed on PythonAnywhere for reliability, scalability, and ease of access.\n **Environment Management:** Uses environment variables for sensitive configurations like the secret key.\n **Error Logging and Monitoring:** Utilizes PythonAnywhere's logging capabilities for performance monitoring and troubleshooting."
      },
    ],
    keyComponents: [
      {
        title: "Data Generation",
        detail: "We created a dataset using the `STOM_higgs_tools` module, simulating the H → γγ decay channel with a Gaussian signal (mean 125 GeV, σ 1.5 GeV) and an exponential background (decay parameter 30 GeV)."
      },
      {
        title: "Histogram Plotting",
        detail: "The rest mass values were visualized in a histogram (104-155 GeV range, 30 bins) to compare with historical data."
      },
      {
        title: "Background Parameterization",
        detail: "Maximum Likelihood Estimation (MLE) and Chi-Square (χ²) Method were used to optimize the background decay parameters and ensure the best fit model."
      },
      {
        title: "Goodness of Fit and Hypothesis Testing",
        detail: "Chi-Square Goodness of Fit tests and hypothesis testing were conducted, calculating chi-square values and p-values to test the significance of the Higgs boson signal, with over 10,000 simulations for robustness."
      }
    ],
    stack: ['Python', 'NumPy', 'Matplotlib', 'SciPy'],
    status: 'Completed'
  },
  {
    id: 2,
    name: 'Bedroom Rent Calculator',
    description: 'A sophisticated web-based application to accurately calculate and distribute rent among multiple bedrooms within a property.',
    detailedDescription: `The Bedroom Rent Calculator is a sophisticated web-based application designed to accurately calculate and distribute rent among multiple bedrooms within a property. Originally developed for personal use during a university housing search, it has since expanded to serve multiple users, providing a practical tool for managing shared housing costs.`,
    technicalComplexity: [
      {
        title: "Backend",
        detail: "**Flask Framework:** Built using Flask for rapid development and deployment.\n **Dynamic Routing and Templating:** Manages user flows with Flask's routing and Jinja2 templating for dynamic HTML generation.\n **WSGI Configuration:** Ensures efficient handling of web requests in a production environment."
      },
      {
        title: "Precision and Accuracy",
        detail: "**Decimal Module:** Ensures high precision in financial calculations, avoiding common floating-point arithmetic issues."
      },
      {
        title: "Frontend",
        detail: "**HTML5 and CSS3:** Developed with modern HTML5 and CSS3 for functionality and visual appeal.\n **Bootstrap 4.5:** Provides a responsive, mobile-friendly design with Bootstrap's grid system and component classes.\n **Responsive Design:** Seamlessly adjusts layout across different screen sizes."
      },
      {
        title: "Deployment",
        detail: "**PythonAnywhere:** Deployed on PythonAnywhere for reliability, scalability, and ease of access.\n **Environment Management:** Uses environment variables for sensitive configurations like the secret key.\n **Error Logging and Monitoring:** Utilizes PythonAnywhere's logging capabilities for performance monitoring and troubleshooting."
      },
    ],
    keyComponents: [
      {
        title: "Dynamic User Interface",
        detail: `**Greeting and Input:** Users are greeted and prompted to enter the number of bedrooms.\n **Responsive Form Generation:** Input fields for bedroom dimensions are dynamically generated based on the number of bedrooms entered.`
      },
      {
        title: "Precision Calculation",
        detail: `**High Precision Using Decimal Module:** Utilizes Python's \`decimal.Decimal\` for accurate financial calculations.\n **Complex Rent Formula Implementation:** Factors in total floor area and individual bedroom sizes to calculate each bedroom's weekly rent.`
      },
      {
        title: "User-Friendly Design",
        detail: `**Bootstrap Integration:** Uses Bootstrap for a modern, responsive design compatible with various devices.\n **Clear and Intuitive Navigation:** Guides users step-by-step from inputting bedroom details to viewing calculated results.`
      },
      {
        title: "Error Handling and Validation",
        detail: `**Robust Input Validation:** Ensures user inputs are numerical and within expected ranges.\n **Informative Flash Messages:** Provides feedback on errors or required corrections using Bootstrap-styled flash messages.`
      }
    ],
    stack: ['Python', 'Flask', 'Bootstrap', 'HTML5', 'CSS3'],

    status: 'Completed'
  },
  {
    id: 3,
    name: 'Personal Portfolio Website',
    description: 'A sophisticated and responsive portfolio website showcasing my projects, skills, and contact information, leveraging advanced web technologies.',
    detailedDescription: `This website serves as a comprehensive showcase of my personal portfolio, meticulously crafted to exhibit my projects, skills, and facilitate seamless communication. The site emphasizes modern design principles, responsiveness, and intuitive navigation, demonstrating advanced web development techniques.`,
    technicalComplexity: [
      {
        title: "Frontend Architecture",
        detail: `**React.js:** Utilized for its component-based architecture, enabling modularity and reusability. Employed hooks and state management for dynamic user interactions.\n**CSS3 with Flexbox/Grid:** Applied advanced layout techniques for a responsive and adaptable design that ensures a consistent user experience across all devices.\n**Material-UI:** Integrated Material Design principles to provide a cohesive and visually appealing UI with pre-built components, enhancing development efficiency.`
      },
      {
        title: "Backend Infrastructure",
        detail: `**Node.js & Express:** Established a robust server-side environment to handle dynamic routing and API requests, ensuring fast and secure data transactions.\n**RESTful API Design:** Architected a scalable API to manage project data, optimizing performance for data retrieval and manipulation.\n**Security Enhancements:** Implemented HTTPS, content security policies, and input sanitization to protect against vulnerabilities and ensure secure data handling.`
      },
      {
        title: "Deployment and DevOps",
        detail: `**GitHub Pages:** Leveraged for seamless deployment, providing reliable and fast hosting with continuous integration and delivery pipelines.\n**CI/CD with GitHub Actions:** Automated the testing, building, and deployment processes to maintain high code quality and streamline updates.\n**Performance Monitoring:** Integrated tools for real-time performance tracking and analytics, ensuring optimal site performance and user experience.`
      },
      {
        title: "Performance and Optimization",
        detail: `**Code Splitting:** Employed to reduce initial load times and enhance user experience by dynamically loading components as needed.\n**Lazy Loading:** Implemented for off-screen elements, improving initial load performance and resource management.\n**SEO Optimization:** Applied best practices for search engine visibility and accessibility, including metadata, structured data, and responsive design.`
      },
    ],
    keyComponents: [
      {
        title: "Responsive and Adaptive Design",
        detail: `**Mobile-First Development:** Ensured the website is fully responsive, delivering a seamless experience across all devices and screen sizes.\n**Interactive UI/UX:** Designed with a focus on user engagement and accessibility, featuring smooth animations and transitions for an enhanced user experience.`
      },
      {
        title: "Dark Mode Implementation",
        detail: `**Theme Toggle Functionality:** Integrated a user-friendly dark mode toggle, allowing users to switch between light and dark themes effortlessly.\n**Persisted State Management:** Utilized local storage to maintain user theme preferences across sessions, providing a personalized experience.`
      },
      {
        title: "Robust Contact Form",
        detail: `**EmailJS Integration:** Configured to facilitate direct email communication through the website, enabling users to send messages without exposing email addresses.\n**Comprehensive Form Validation:** Implemented to ensure data integrity and prevent invalid submissions, enhancing security and user experience.`
      },
      {
        title: "Scalability and Maintainability",
        detail: `**Modular Code Structure:** Developed with maintainability in mind, allowing for easy updates and scalability.\n**Reusable Components:** Created a library of reusable components to expedite development and ensure consistency across the site.`
      }
    ],
    stack: ['React', 'Node.js', 'Express', 'CSS3', 'Material-UI', 'EmailJS'],
    status: 'Completed'
  },
  {
    id: 4,
    name: 'Projectile Motion Simulation Game',
    description: 'An advanced educational tool designed to enhance the comprehension of physics principles through interactive simulations.',
    detailedDescription: `The Projectile Motion Simulation Game is an advanced educational tool designed to enhance the comprehension of physics principles. Developed in Python and Pygame, this application provides an interactive and engaging environment for teaching the concepts of projectile motion.`,
    technicalComplexity: [
      {
        title: "Backend",
        detail: `**Python:** Core language used for its versatility and ease of implementing complex algorithms.\n**Pygame:** Framework used to develop the game's graphics and handle real-time interactions.`
      },
      {
        title: "Physics Calculations",
        detail: `**SUVAT Equations:** Implements SUVAT equations to calculate projectile motion parameters such as initial velocity, angle of projection, and the effects of gravity.`
      },
      {
        title: "AI Adaptation",
        detail: `**Performance Monitoring:** AI continuously monitors player performance and adjusts the difficulty level accordingly.`
      },
      {
        title: "User Interface",
        detail: `**Dynamic Scaling:** Adjusts the viewport dynamically for different screen sizes.\n**Smooth Animations:** Ensures a visually appealing and seamless experience.\n**Real-Time Feedback:** Provides immediate feedback to enhance learning.`
      },
    ],
    keyComponents: [
      {
        title: "Real-Time Physics Simulation",
        detail: `**Accurate Modeling:** Accurately simulates projectile motion with real-time physics calculations, demonstrating the effects of gravity and motion dynamics.`
      },
      {
        title: "Adaptive AI Opponent",
        detail: `**Dynamic Difficulty:** AI adapts to the player's performance, maintaining an appropriate level of challenge.`
      },
      {
        title: "Input Validation and Test Mode",
        detail: `**Realistic Inputs:** Ensures user inputs are realistic.\n**Test Mode:** Displays correct answers for easy verification during tutoring sessions.`
      },
      {
        title: "Interactive Learning Modules",
        detail: `**Focused Levels:** Each level focuses on fundamental physics principles such as velocity, acceleration, and force components.\n**Guided Learning:** Interactive lessons with selected questions and explanations that guide students through the SUVAT equations.`
      },
      {
        title: "Engaging Visuals and User Interface",
        detail: `**Pygame Graphics:** Utilizes Pygame’s graphical capabilities for dynamic viewport scaling, smooth animations, and real-time feedback.\n**Intuitive Learning Environment:** Enhances the learning experience with visually appealing and interactive design.`
      }
    ],
    stack: ['Python', 'Pygame'],
    status: 'Completed'
  },
  {
    id: 5,
    name: 'Thermodynamics Snookered',
    description: 'A simulation to study gas behavior through classical thermodynamics and kinetic theory, modeling gas particles as hard spheres undergoing perfectly elastic collisions.',
    detailedDescription: `"Thermodynamics Snookered" aimed to develop a simulation to study gas behavior through classical thermodynamics and kinetic theory. By modeling gas particles as hard spheres undergoing perfectly elastic collisions, the project validated classical laws and explored gas behavior at a microscopic level. The simulation also investigated adiabatic and isothermal processes to understand their differences.`,
    technicalComplexity: [
      {
        title: "Advanced Computational Methods",
        detail: `**Python Libraries:** Utilized NumPy, Matplotlib, and SciPy for complex calculations, large datasets, and automated simulations.\n**Statistical Analysis:** Conducted thorough statistical analysis to validate the simulation results.`
      },
      {
        title: "Simulation Accuracy",
        detail: `**Algorithm Refinement:** Ensured accurate collision detection and handling, maintaining conservation laws over long simulations.\n**Dynamic Processes:** Implemented precise adjustments for adiabatic and isothermal processes, highlighting key thermodynamic differences.`
      },
      {
        title: "Integration of Tools",
        detail: `**Comprehensive Analysis:** Leveraged Python's computational and graphical capabilities to analyze and visualize gas behavior in detail.\n**Automated Simulations:** Enabled extensive testing and validation through automated simulation runs.`
      },
    ],
    keyComponents: [
      {
        title: "Collision Handling",
        detail: `**Precise Algorithms:** Determined collision times between particles and the container by solving quadratic equations, ensuring momentum and energy conservation.`
      },
      {
        title: "Energy and Momentum Conservation",
        detail: `**Post-Collision Velocities:** Calculated using frame transformations to maintain conservation laws.`
      },
      {
        title: "Adiabatic and Isothermal Processes",
        detail: `**Dynamic Adjustments:** Simulated these processes by dynamically adjusting the container's radius, revealing significant thermodynamic differences.`
      },
      {
        title: "Speed Distribution Analysis",
        detail: `**Maxwell-Boltzmann Distribution:** Compared the speed distribution of gas particles to the Maxwell-Boltzmann distribution using histograms and theoretical curves.`
      }
    ],
    stack: ['Python', 'NumPy', 'Matplotlib', 'SciPy'],

    status: 'Completed'
  },
  {
    id: 6,
    name: 'Advanced Gyroscopic Stabilization Systems',
    description: 'Applying gyroscopic principles to develop effective and affordable stabilizers for cameras and precision instruments.',
    detailedDescription: `The Advanced Gyroscopic Stabilization Systems project focuses on applying gyroscopic principles to develop mechanical stabilizers and dampers. This initiative aims to create effective and affordable stabilizers for cameras and other precision instruments, leveraging the inherent stability of spinning gyroscopes. The project's broader potential emerged through innovative design and research.`,
    technicalComplexity: [
      {
        title: "Theoretical and Computational Modeling",
        detail: `**Lagrangian Mechanics:** Provided a sophisticated approach to constructing accurate equations of motion.\n**Python Simulations:** Enabled real-time data analysis and solution of complex differential equations.`
      },
      {
        title: "Algorithm and Software Development",
        detail: `**Dynamic Algorithms:** Developed for real-time control and adaptation based on sensor feedback.\n**Integration with Hardware:** Ensured seamless communication between software algorithms and physical components.`
      },
      {
        title: "Embedded Systems",
        detail: `**Arduino Microcontrollers:** Facilitated real-time adjustments and control.\n**Sensor Feedback:** MPU-6050 provided critical data for maintaining stability and correcting motion.`
      },
      {
        title: "Prototyping and Testing",
        detail: `**3D Printing and CNC Machining:** Enabled rapid iteration and testing of designs.\n**Software and Hardware Synergy:** Combined advanced software simulations with practical hardware implementations for effective prototyping.`
      },
    ],
    keyComponents: [
      {
        title: "Theoretical Modeling",
        detail: `**Lagrangian Mechanics:** Utilized for constructing equations of motion based on the system's kinetic and potential energy.\n**Euler-Lagrange Equations:** Critical for obtaining torques and forces within gyroscopic systems, ensuring accurate stability adjustments.`
      },
      {
        title: "Programming and Real-Time Data Analysis",
        detail: `**Python Simulations:** Employed for real-time data analysis and numerical simulations, solving ordinary differential equations to model the behavior of the gyro-pendulum and self-balancing tumbler under various conditions.\n**Algorithm Development:** Designed a complex algorithm for the self-balancing tumbler to dynamically manage the reaction wheel operations based on sensor signals, enabling real-time stabilization and adaptation.`
      },
      {
        title: "Embedded Systems and Hardware Interaction",
        detail: `**Arduino Microcontrollers:** Programmed in C++ to interface between high-level computational tasks in Python and the mechanical components, enabling real-time control adjustments.\n**Sensor Integration:** Used MPU-6050 sensors (3-axis gyroscope and 3-axis accelerometer) to track motion and perform instantaneous corrections, providing crucial orientation and motion data for the feedback control system.`
      },
      {
        title: "Tools for Rapid Prototyping and Testing",
        detail: `**3D Modeling and Printing:** Accelerated design and testing through rapid prototyping, with iterations from concept to implementation.\n**Software and Hardware:** Combined Python for simulations, C++ for microcontroller programming, and hardware such as Arduino, MPU-6050 sensors, and various mechanical parts (3D-printed or CNC machined) to bring the project to fruition.`
      }
    ],
    stack: ['Python', 'C++', 'Arduino', 'MPU-6050', 'Pygame'],

    status: 'Completed'
  },
  {
    id: 7,
    name: 'Spotify YouTube Downloader',
    description: 'A powerful application designed to automatically download tracks from Spotify playlists and liked songs via YouTube.',
    detailedDescription: `The Spotify YouTube Downloader is a powerful application designed to automatically download tracks from Spotify playlists and liked songs via YouTube. Featuring a user-friendly dark-mode interface, this tool streamlines the process for users, making it easy to fetch and save their favorite music.`,
    technicalComplexity: [
      {
        title: "Programming and Libraries",
        detail: `**Python:** Core programming language for the application.\n**PyQt5:** Provides a sophisticated graphical user interface.\n**Spotipy:** A Python library for interacting with the Spotify Web API.\n**Google API Client:** Facilitates interactions with the YouTube Data API.\n**YT-DLP:** Handles downloading and audio extraction from YouTube videos.\n**Mutagen:** Manages audio metadata and embeds cover art.`
      },
      {
        title: "Integration and Data Handling",
        detail: `**OAuth and API Key Management:** Manages secure access to Spotify and YouTube services.\n**Pagination and Error Handling:** Effectively manages large playlists and ensures smooth operation.\n**File Management:** Ensures high-quality downloads with accurate metadata embedding.`
      },
      {
        title: "Multithreading",
        detail: `**Responsive GUI:** Uses Python's threading capabilities to keep the interface responsive during downloads.`
      },
      {
        title: "API Usage Efficiency",
        detail: `**Multiple API Keys:** Uses a pool of YouTube Data API keys to distribute the load and avoid usage limits, ensuring continuous service availability.`
      },
    ],
    keyComponents: [
      {
        title: "Spotify Integration",
        detail: `**Spotify Web API:** Fetches playlists and liked songs from the user's Spotify account.`
      },
      {
        title: "YouTube Integration",
        detail: `**YouTube Data API:** Searches for and downloads high-quality audio tracks corresponding to Spotify songs.`
      },
      {
        title: "Cover Art Embedding",
        detail: `**Mutagen:** Integrates cover art into MP3 files, ensuring each download is complete with metadata.`
      },
      {
        title: "User Interface",
        detail: `**Dark-Mode GUI:** Created with PyQt5, featuring bordered input fields, dropdown playlist selection, and progress tracking.`
      },
      {
        title: "Control Options",
        detail: `**Download Management:** Includes pause, resume, and cancel functionality for active downloads.`
      }
    ],
    stack: ['Python', 'PyQt5', 'Spotipy', 'Google API Client', 'YT-DLP', 'Mutagen'],

    status: 'Completed'
  },
  {
    id: 8,
    name: 'MarketSeer',
    description: 'A financial forecasting application integrating traditional market data with sentiment analysis to deliver real-time insights and predictive analytics.',
    detailedDescription: `MarketSeer is a cutting-edge financial forecasting application that will integrate traditional market data with sentiment analysis to deliver comprehensive, real-time market insights and predictive analytics. Designed to cater to users ranging from novices to financial experts, MarketSeer aims to empower users with interactive charts, customizable alerts, and advanced portfolio simulations. By incorporating market sentiment derived from news and social media, MarketSeer will provide a nuanced view of potential market movements.`,
    technicalComplexity: [
      {
        title: "Frontend",
        detail: `**React:** The user interface will be built using React to ensure a dynamic and responsive experience across devices.`
      },
      {
        title: "Backend",
        detail: `**Python Flask:** Flask will handle backend operations, including API integrations, data processing, and machine learning model deployment.`
      },
      {
        title: "Machine Learning",
        detail: `**TensorFlow and Scikit-Learn:** The application will leverage TensorFlow for deep learning and Scikit-Learn for traditional machine learning approaches, enhancing predictive capabilities by learning from extensive datasets of historical prices and sentiment data.`
      },
      {
        title: "Database",
        detail: `**PostgreSQL:** PostgreSQL will manage and store structured financial data and unstructured sentiment data efficiently.`
      },
      {
        title: "APIs",
        detail: `**Data Sources:** The application will source data from financial APIs such as Alpha Vantage, Yahoo Finance, and Bloomberg, supplemented with sentiment analysis derived from news and social media platforms.`
      }
    ],
    keyComponents: [
      {
        title: "Interactive Charts",
        detail: `**Real-Time Visualization:** Users will visualize financial data and sentiment trends in real-time through customizable and interactive charts.`
      },
      {
        title: "Customizable Alerts",
        detail: `**User-Defined Criteria:** Users will set up alerts based on price thresholds, sentiment shifts, or other custom criteria.`
      },
      {
        title: "Advanced Predictive Analytics",
        detail: `**Machine Learning Models:** The platform will utilize state-of-the-art machine learning models to analyze financial instruments, incorporating both quantitative data and qualitative sentiment measures.`
      },
      {
        title: "Portfolio Simulation",
        detail: `**Strategy Testing:** Users will be able to test potential trading strategies through simulation tools that incorporate market data and sentiment analysis, aiming to minimize financial risk.`
      },
      {
        title: "Integrated News and Sentiment Dashboard",
        detail: `**Real-Time Updates:** The application will keep users updated with the latest financial news and sentiment scores, directly linked to market predictions.`
      },
      {
        title: "Educational Resources",
        detail: `**In-Depth Tutorials:** Users will have access to resources explaining market dynamics, the impact of sentiment on markets, and the use of AI in trading.`
      }
    ],
    developmentPhases: [
      {
        title: "1. Project Scope Definition",
        detail: `**Identify Instruments and Metrics:** The project will start by defining financial instruments, prediction timeframes, and key performance metrics such as accuracy and profitability.`
      },
      {
        title: "2. Data Collection",
        detail: `**Aggregate Data:** The next phase will involve collecting historical financial data and real-time sentiment data from multiple sources, ensuring high data integrity and addressing anomalies.`
      },
      {
        title: "3. Data Processing",
        detail: `**Prepare Data:** Data cleaning, feature engineering, and normalization will be implemented to prepare data for analysis.`
      },
      {
        title: "4. Model Selection and Complexity Management",
        detail: `**Choose Models:** Appropriate machine learning models will be chosen based on data characteristics, balancing complexity to avoid overfitting.`
      },
      {
        title: "5. Model Training and Validation",
        detail: `**Train Models:** Historical data will be used to train models, employing cross-validation techniques tailored to time-series data to refine accuracy.`
      },
      {
        title: "6. Model Evaluation and Testing",
        detail: `**Evaluate Performance:** The model will be evaluated on separate datasets, focusing on financial-specific performance metrics.`
      },
      {
        title: "7. Deployment",
        detail: `**Integrate Models:** Models will be integrated and deployed within the app infrastructure, with automated data updates and model retraining routines.`
      },
      {
        title: "8. Monitoring and Maintenance",
        detail: `**Continuous Improvement:** The performance will be continuously monitored, with models and features updated based on user feedback and market changes.`
      }
    ],
    predictedOutcomes: [
      {
        title: "",
        detail: `MarketSeer is anticipated to successfully integrate advanced computational methods and machine learning with real-time data visualization and sentiment analysis. By leveraging Python Flask for backend operations, React for the frontend, and robust machine learning frameworks, the platform is expected to offer a comprehensive and user-friendly experience. Continuous monitoring and model updates will ensure that MarketSeer adapts to market changes, providing reliable and nuanced market insights for users. This project aims to effectively combine financial data analysis and sentiment tracking, delivering a powerful tool for market forecasting and strategy development.`
      }
    ],
    stack: ['Python', 'Flask', 'React', 'TensorFlow', 'Scikit-Learn', 'PostgreSQL', 'API'],

    status: 'In Progress'
  },
  {
    id: 9,
    name: 'Portfolio Risk Management System',
    description: 'A high-performance C++ application designed to quantify, monitor, and mitigate risks associated with diversified financial portfolios.',
    detailedDescription: `The Portfolio Risk Management System (PRMS) is designed to be a high-performance C++ application, built to quantify, monitor, and mitigate risks associated with diversified financial portfolios. It evaluates financial risk exposure by calculating key metrics such as Value at Risk (VaR) and Conditional Value at Risk (CVaR), along with performing stress testing to assess potential losses under extreme market conditions. By incorporating advanced statistical methods, machine learning for predictive insights, and robust data handling, PRMS aims to set new standards in the field of financial risk management.`,
    
    technicalComplexity: [
      {
        title: "Data Acquisition",
        detail: `**Financial Market Data APIs:** Integrates Bloomberg API or Thomson Reuters Eikon for real-time data feeds, supporting complex data types like prices, volumes, and historical records.\n**Boost.Asio for Asynchronous Networking:** Implements asynchronous networking to handle large volumes of incoming data with minimal latency, crucial for real-time monitoring.`
      },
      {
        title: "Risk Calculation Techniques",
        detail: `**QuantLib Library:** Uses QuantLib for precise pricing of complex financial instruments and risk metric computation, supporting features like day count conventions and multiple derivative types.\n**Monte Carlo Simulation:** Custom C++ Monte Carlo simulations optimized with the latest C++ standards to efficiently generate price path scenarios.\n**Statistical Tools:** Integrates the Armadillo library for high-speed matrix operations essential to computing multi-asset risk.`
      },
      {
        title: "Machine Learning for Predictive Analytics",
        detail: `**TensorFlow C++ API:** Integrates deep learning models for predicting market trends that affect portfolio risk.\n**Machine Learning Models:** Employs regression models to predict risk factors, clustering for market segmentation, and decision trees for scenario analysis and impact assessment.`
      },
      {
        title: "Concurrency and Multithreading",
        detail: `**Modern C++ Concurrency:** Utilizes \`std::thread\` and \`std::async\` for parallel computation, ensuring simultaneous processing of multiple tasks like data ingestion and risk calculation in real-time.`
      },
      {
        title: "Database and Storage",
        detail: `**SQL/NoSQL Databases:** Offers flexibility to store structured or unstructured data, using PostgreSQL for relational data and MongoDB for unstructured financial datasets.\n**C++ Database Drivers:** Integrates with C++ drivers to seamlessly manage financial data retrieval and updates.`
      },
      {
        title: "User Interface and Reporting",
        detail: `**Qt Framework:** Provides a robust user interface, enabling users to view risk metrics and control parameters.\n**Reporting Tools:** C++ integrated with Python to generate dynamic risk reports and dashboards, providing comprehensive data visualization.`
      }
    ],
    
    keyComponents: [
      {
        title: "Real-Time Data Integration",
        detail: `**Market Feed Management:** Manages high-volume, real-time data streams and ensures error-free handling of diverse data sources.\n**Data Aggregation:** Consolidates data from different sources, smoothing and interpolating where necessary to maintain data integrity for accurate risk calculation.`
      },
      {
        title: "Advanced Analytical Models",
        detail: `**Dynamic VaR and CVaR Calculation:** Implements dynamic Value at Risk and Conditional Value at Risk using high-performance algorithms to assess both short-term and long-term risk with low latency.\n**Scenario and Sensitivity Analysis:** Provides tools for stress testing, scenario analysis, and sensitivity testing of risk parameters under different market conditions.`
      },
      {
        title: "Predictive Analytics Engine",
        detail: `**Risk Prediction Models:** Develops proprietary algorithms that monitor evolving market trends and assess their likely impacts on portfolio risks, using unsupervised learning techniques to enhance model adaptability.\n**Anomaly Detection:** Detects irregular trading patterns or anomalies that could signify risk spikes, using threshold-based alerts and statistical outlier analysis.`
      },
      {
        title: "Efficient Multi-Threaded Processing",
        detail: `**Thread Pooling and Task Scheduling:** Uses an optimized thread pool to manage task scheduling, balancing between CPU load and latency.\n**Parallel Processing:** Runs risk assessments, model updates, and data fetching concurrently to enhance the application’s responsiveness.`
      },
      {
        title: "Data Management and Security",
        detail: `**Data Encryption:** Implements secure data encryption for sensitive financial data stored in both SQL and NoSQL databases.\n**Redundancy and Backup:** Ensures data reliability and recovery with redundancy across storage systems, avoiding data loss in case of system failures.`
      },
      {
        title: "User Dashboard and Risk Visualization",
        detail: `**Interactive Dashboard:** A user-friendly, interactive dashboard that allows users to set custom risk thresholds, view real-time risk metrics, and simulate risk exposure scenarios.\n**Dynamic Reporting:** Automated report generation based on current portfolio metrics, risk scores, and prediction outcomes, using built-in data visualizations and charts for easy interpretation.`
      }
    ],
    
    developmentPhases: [
      {
        title: "Phase 1: Setup Data Ingestion",
        detail: `**Establish Financial API Integration:** Connect to Bloomberg or Thomson Reuters Eikon for real-time data acquisition.\n**Database Schema:** Design and implement the database schema for efficient data storage and retrieval.`
      },
      {
        title: "Phase 2: Implement Risk Calculation Models",
        detail: `**QuantLib Integration:** Incorporate QuantLib functionalities for risk metrics computation.\n**Monte Carlo Simulation:** Develop custom implementations for performance-optimized risk calculations.`
      },
      {
        title: "Phase 3: Develop Machine Learning Models",
        detail: `**TensorFlow Integration:** Create machine learning models using TensorFlow C++ API to forecast market trends and predict risks.\n**Predictive Analytics:** Implement regression models, clustering, and decision trees for comprehensive risk analysis.`
      },
      {
        title: "Phase 4: Create User Interface",
        detail: `**Qt Framework Development:** Build the user interface to display real-time data and risk metrics, and allow user customization.\n**Reporting Dashboard:** Set up a reporting dashboard with detailed risk reports and graphical capabilities.`
      },
      {
        title: "Phase 5: Testing and Deployment",
        detail: `**Comprehensive Testing:** Perform extensive testing to ensure accuracy and reliability.\n**Deployment:** Deploy the system and establish post-deployment monitoring for continuous performance evaluation and updates.`
      }
    ],
    
    predictedOutcomes: [
      {
        title: "Predicted Outcomes",
        detail: `The Portfolio Risk Management System is expected to deliver a robust and high-performance solution for quantifying, monitoring, and mitigating financial portfolio risks. By integrating advanced computational methods, machine learning models, and real-time data processing, the system aims to provide accurate and actionable insights. The user-friendly interface and detailed reporting tools will empower users to make informed decisions, enhancing their ability to manage financial risks effectively. The project aims to set a new standard in portfolio risk management by leveraging cutting-edge technologies and methodologies.`
      }
    ],
    
    stack: ['C++', 'QuantLib', 'TensorFlow C++ API', 'Armadillo', 'Boost.Asio', 'Qt Framework', 'PostgreSQL', 'MongoDB'],

    status: 'In Progress'
},
{
  id: 10,
  name: 'Enhanced Black-Scholes Model with Adaptive Volatility',
  description: 'An advanced options pricing model integrating stochastic volatility methods and machine learning for dynamic volatility, improving pricing accuracy and adaptability in varied market conditions.',
  detailedDescription: `This project builds on the traditional Black-Scholes Model (BSM) for options pricing by incorporating adaptive volatility predictions through stochastic volatility models (GARCH, Heston, SABR, Lévy) and machine learning techniques (LSTM, GRU, GAN hybrid, ARIMA). By capturing dynamic market conditions, this approach aims to improve accuracy and adaptability in options pricing. The project includes Monte Carlo simulations for stress-testing, evaluating each model's robustness under extreme market conditions and ability to capture collective market behaviors.`,
  
  technicalComplexity: [
    {
      title: "Volatility Modeling",
      detail: `**Stochastic Models:** Implements advanced volatility models (GARCH, Heston, SABR, Lévy) to capture market volatility more realistically, each contributing unique features like volatility clustering, mean reversion, or jump diffusion.\n**Machine Learning Models:** Uses LSTM, GRU, GAN hybrid, and ARIMA to predict volatility based on past data patterns, dynamically adapting to market trends.`
    },
    {
      title: "Enhanced Black-Scholes Calculations",
      detail: `**Dynamic Volatility Substitution:** Replaces constant volatility in the BSM with dynamic predictions from stochastic and ML models, adjusting for market shifts.\n**Monte Carlo Simulations:** Performs stress testing of the enhanced BSM using MC simulations to evaluate model robustness under extreme conditions and collective market behavior.`
    },
    {
      title: "Predictive Analytics and Model Integration",
      detail: `**TensorFlow and Python Integration:** Utilizes TensorFlow for implementing LSTM and GAN models in Python to process volatility predictions in real-time.\n**QuantLib for Financial Modeling:** Uses QuantLib for option pricing and financial calculations, including complex derivative instruments that need adaptive volatility input.`
    },
    {
      title: "Evaluation Metrics and Testing Framework",
      detail: `**Comprehensive Evaluation Metrics:** Includes RMSE, MAE, and R² for accuracy, as well as Precision Score for ML models, and specialized metrics like Path Stability and Event Frequency in stress tests.\n**Data Logging and Visualization:** Logs each model's performance over time with statistical visualization tools, comparing their effectiveness in different market scenarios.`
    }
  ],
  
  keyComponents: [
    {
      title: "Dynamic Volatility Adaptation",
      detail: `**Adaptive Volatility Predictions:** Incorporates multiple volatility models that can adjust dynamically based on real-time market conditions.\n**Data Integration:** Ensures that each volatility model adapts to live financial data, continually updating the model’s view of volatility trends.`
    },
    {
      title: "Multi-Layered Risk Analysis",
      detail: `**Sequential and Parallel Analysis Layers:** Analyzes risk at different levels by combining short- and long-term predictions from stochastic and ML models.\n**Quantitative and Qualitative Risk Assessment:** Uses both data-driven models and market sentiment analysis to provide a comprehensive view of potential risks.`
    },
    {
      title: "Efficient Computation Framework",
      detail: `**Optimized Python Codebase:** Utilizes optimized Python and TensorFlow code to handle large-scale simulations and real-time calculations efficiently.\n**Concurrency and Parallel Processing:** Implements multithreading to run simulations and updates concurrently, ensuring fast and scalable performance.`
    },
    {
      title: "Stress Testing for Robustness",
      detail: `**Monte Carlo Path Simulation:** Generates diverse market scenarios to test the resilience of each model, focusing on extreme market events.\n**Event-Based Monitoring:** Tracks rare, high-impact events to evaluate how each model variant manages volatility spikes and abrupt market changes.`
    },
    {
      title: "Predictive Model Evaluation and Refinement",
      detail: `**Precision Tracking and Adjustment:** Continuously monitors prediction precision to make model refinements, adjusting parameters to enhance accuracy.\n**Real-Time Predictive Adjustments:** Allows models to self-correct in response to live data trends, adapting predictions for better accuracy.`
    },
    {
      title: "Comprehensive Data Output and Visualization",
      detail: `**Error Distributions and Evaluation Plots:** Visualizes model errors and prediction accuracy with tools like KDE plots and RMSE charts.\n**Comparative Volatility Plots:** Allows side-by-side comparisons of stochastic and ML predictions against actual market data for immediate insight.`
    }
  ],
  
  developmentPhases: [
    {
      title: "Phase 1: Volatility Model Setup",
      detail: `**Implement Stochastic Models:** Integrate GARCH, Heston, SABR, and Lévy for volatility predictions.\n**Machine Learning Model Preparation:** Set up LSTM, GRU, GAN hybrid, and ARIMA models, configuring them for time-series data.`
    },
    {
      title: "Phase 2: BSM and Volatility Integration",
      detail: `**Dynamic Volatility Application:** Replace constant volatility in BSM with outputs from stochastic and ML models.\n**Monte Carlo Stress Testing:** Apply MC simulations to test volatility models under various extreme conditions.`
    },
    {
      title: "Phase 3: Testing and Model Evaluation",
      detail: `**Accuracy Metrics Analysis:** Assess models with RMSE, MAE, and R² for prediction accuracy.\n**Stress Test Analysis:** Track model stability under high-stress scenarios using MC simulations and event-based metrics.`
    },
    {
      title: "Phase 4: Real-Time Implementation",
      detail: `**Live Data Integration:** Connect models to real-time financial data feeds.\n**Adaptive Volatility Adjustment:** Continuously update models in response to changing market data for real-time predictions.`
    },
    {
      title: "Phase 5: Dashboard and Reporting",
      detail: `**Data Visualization Dashboard:** Create a comprehensive dashboard to visualize prediction metrics, volatility trends, and error distributions.\n**Detailed Reports:** Generate performance reports, summarizing evaluation metrics, model comparison, and stress-testing results.`
    }
  ],
  
  predictedOutcomes: [
    {
      title: "Predicted Outcomes",
      detail: `The Enhanced Black-Scholes Model is expected to improve options pricing accuracy by integrating adaptive volatility predictions that reflect real-time market conditions. By combining stochastic models with machine learning, the project aims to achieve superior predictive performance, with resilience demonstrated through Monte Carlo simulations. This approach is anticipated to provide more realistic pricing under volatile conditions, especially during market stress events, making it a valuable tool for options pricing and financial risk management.`
    }
  ],
  
  stack: [
    'Python', 
    'QuantLib', 
    'TensorFlow', 
    'LSTM', 
    'GRU', 
    'GAN hybrid', 
    'ARIMA', 
    'GARCH', 
    'Heston Model', 
    'SABR', 
    'Lévy Process', 
    'Monte Carlo Simulations', 
    'Optuna',  
    'yfinance', 
    'pandas', 
    'NumPy', 
    'scikit-learn', 
    'Matplotlib', 
    'Plotly'
  ],

  status: 'In Progress'
},

{
  id: 11,
  name: 'Extraction of Neutrino Oscillation Parameters',
  description: 'A computational study to extract key neutrino oscillation parameters using advanced optimization techniques.',
  detailedDescription: `
    This project delves into the extraction of neutrino oscillation parameters θ23 and ∆m²23 using computational methods. By minimizing the Negative Log-Likelihood (NLL) function with optimization techniques (Grid Search, Simulated Annealing, and Nelder-Mead), I was able to achieve precise parameter fits. Detector resolution effects were modeled with Gaussian smearing, and cross-section normalization uncertainties were integrated into the fit using a scaling factor. The Nelder-Mead method emerged as the most efficient algorithm, achieving θ23 = 0.685 ± 0.02 and ∆m²23 = 0.0022378 ± 0.01 eV². 
    
    This work demonstrates a blend of theoretical physics, statistical modeling, and computational efficiency to tackle one of the most challenging problems in particle physics.`,
  technicalComplexity: [
    {
      title: "Optimization Algorithms",
      detail: `
        - **Grid Search:** Exhaustive parameter search with guaranteed global minimum.
        - **Simulated Annealing:** Stochastic exploration inspired by Monte Carlo methods.
        - **Nelder-Mead:** A simplex-based method for efficient minimization of non-differentiable functions.`
    },
    {
      title: "Detector Resolution",
      detail: `
        - **Gaussian Smearing:** Applied to model energy uncertainties.
        - **Fourier Convolution Validation:** Ensures numerical robustness.`
    },
    {
      title: "Cross-Section Scaling",
      detail: `Introduced a scaling factor to address normalization uncertainties, improving residual consistency.`
    },
    {
      title: "Programming Tools",
      detail: `
        - Implemented in Python and C++.
        - Leveraged libraries like NumPy, SciPy, and GSL for precision and computational performance.`
    }
  ],
  keyComponents: [
    {
      title: "NLL Minimization",
      detail: `Used advanced algorithms to find best-fit neutrino oscillation parameters with minimized computational cost.`
    },
    {
      title: "Validation",
      detail: `Cross-validated methods and results with global neutrino physics benchmarks.`
    },
    {
      title: "Visual Insights",
      detail: `Generated topographical maps and convergence paths for comparative algorithm analysis.`
    }
  ],
  stack: ['Python', 'C++', 'NumPy', 'SciPy', 'GSL'],
  status: 'Completed'
},
{
  id: 12,
  name: 'Detecting Market Data Feed Issues',
  description: 'A project addressing data feed anomalies in fast-moving fixed-income markets using machine learning and statistical methods.',
  detailedDescription: `
    This project focuses on detecting and addressing two key anomalies in market data feeds: staleness (lagging updates) and false jumps (spurious spikes). These issues can distort trading decisions and risk assessments, making real-time detection critical. For single-feed environments, ARIMA and LSTM models were used to identify anomalies through residual analysis, supplemented by synthetic anomaly generation and volatility-adaptive thresholds. Multi-feed setups leveraged cross-feed consistency checks, including correlation analysis, consensus pricing, and attention-based neural architectures. Beyond detection, actionable insights transformed anomaly data into strategic trading tools, improving execution timing, reducing slippage, and enhancing profitability.`,
  technicalComplexity: [
    {
      title: "Single-Feed Techniques",
      detail: `
        - **Time-Series Models:** ARIMA and LSTM for expected price dynamics.
        - **Synthetic Anomaly Training:** Generated staleness and jump distortions.
        - **Volatility-Adaptive Thresholds:** Adjusted anomaly triggers based on market conditions.`
    },
    {
      title: "Multi-Feed Redundancy",
      detail: `
        - **Consensus Pricing:** Weighted averages for outlier detection.
        - **Cross-Feed Models:** Neural architectures treating each feed as a separate channel.
        - **Dynamic Weighting:** Reinforcement learning for trust-based feed reliability.`
    },
    {
      title: "Strategic Insights",
      detail: `Integrated detection insights into trading strategies for better execution timing and risk management.`
    }
  ],
  keyComponents: [
    {
      title: "Anomaly Detection",
      detail: `Developed methods to distinguish genuine market signals from feed issues.`
    },
    {
      title: "Multi-Feed Models",
      detail: `Enhanced reliability through inter-feed consistency checks and dynamic weighting.`
    },
    {
      title: "Actionable Insights",
      detail: `Transformed detection outputs into strategic tools for traders, improving decision-making.`
    }
  ],
  stack: ['Python', 'ARIMA', 'LSTM', 'Reinforcement Learning', 'Attention Models', 'Time-Series Analysis'],
  status: 'Completed'
}
];


const skills = [
  // Academic and Physics Skills
  'Quantum Mechanics',
  'Data Analysis',
  'Research Methodologies',
  'Scientific Computing',
  'Stochastic Processes',
  'Statistical Analysis',

  // Financial Modeling and Quantitative Skills
  'QuantLib',
  'Monte Carlo Simulations',
  'Value at Risk (VaR)',
  'Conditional Value at Risk (CVaR)',
  'Options Pricing',
  'Risk Management',
  'GARCH Models',
  'Heston Model',
  'SABR Model',
  'Lévy Processes',

  // Frontend Development
  'HTML5',
  'CSS3',
  'JavaScript',
  'React',
  'Material UI',

  // Backend Development
  'Node.js',
  'Python',
  'Flask',
  'C++',

  // Data Science and Machine Learning
  'NumPy',
  'TensorFlow',
  'Scikit-Learn',
  'Pandas',
  'Machine Learning',
  'LSTM',
  'GRU',
  'ARIMA',
  'GANs',
  'Optuna (Hyperparameter Tuning)',
  'Time-Series Analysis',
  
  // Databases
  'PostgreSQL',
  'MongoDB',
  'SQL',

  // Networking and Asynchronous Programming
  'Boost.Asio',
  'Asynchronous Networking',
  'API Integration',
  
  // Version Control and CI/CD
  'Git',
  'Continuous Integration (CI)',
  'Continuous Deployment (CD)',

  // Software and Tools
  'Arduino',
  'Google API Client',
  'Bloomberg API',
  'Thomson Reuters Eikon API',
  
  // Project Management and Development Practices
  'Agile Methodologies',
  'Multithreading and Concurrency',
  'Data Visualization',
  
  // Soft Skills
  'Problem-Solving',
  'Analytical Thinking',
  'Collaboration and Teamwork',
  'Project Management',
  'Communication',
  'Adaptability',
  'Attention to Detail',
  'Time Management'
];




const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'zainmughal77@outlook.com',
};



export { header, about, education, projects, skills, contact };
