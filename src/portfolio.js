const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://zippyg.github.io/React_porfolio_zain.github.io/',
  title: '(Mohammed) Zain Mughal.',
};

const about = {
  name: 'Zain Mughal',
  role: "Harnessing Physics for Data Mastery: Innovator and Technologist",
  description: `Welcome to my portfolio. As a Physics enthusiast and student (Imperial College London – MSci), I enjoy diving into complex datasets and turning them into some set of not so complex numbers and visions. My academic and personal journey has been a mix of stress followed by the relief of each eureka moment. All arming me with skills in Python, C/C++, JavaScript, machine learning and the deep seated theory behind it all. Here, you'll find a slight peek into my brain through my projects that not only showcase my technical abilities, but also my ability to tackle real-world challenges in any demanding sector. Take a look around, and see how my curiosity mixes with my ever evolving skillset. Please get in touch if you are even slightly curious.`,
  resume: `${process.env.PUBLIC_URL}/assets/Zain Mughal Resume NP - MSci.pdf`, // Adjusted path
  social: {
    linkedin: 'https://www.linkedin.com/feed/',
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
    description: "Expected first-class honors with a focus is on mathematical and statistical methods with applications in Data Science and Machine Learning, sharpening my analytical skills. I've also completed a module in Accounting and Finance and am an active member of the Imperial Investment and Finance Society.",
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
    description: 'Achieved 13 GCSEs with grades 9 to 8, including Maths and English, and 2 distinctions',
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
    detailedDescription: `The Portfolio Risk Management System (PRMS) aims to be a high-performance C++ application designed to quantify, monitor, and mitigate risks associated with diversified financial portfolios. The system will calculate key risk metrics such as Value at Risk (VaR), Conditional Value at Risk (CVaR), and perform stress testing to evaluate potential losses in extreme market conditions.`,
    technicalComplexity: [
      {
        title: "Data Acquisition",
        detail: `**Financial Market Data APIs:** Will utilize Bloomberg API or Thomson Reuters Eikon for real-time financial data, including prices, volumes, and historical data.\n**Boost.Asio for Asynchronous Networking:** To efficiently handle real-time data feeds.`
      },
      {
        title: "Risk Calculation Techniques",
        detail: `**QuantLib Library:** For pricing derivatives and calculating risk metrics, implementing features for day count conventions, interest rate instruments, and derivatives modeling.\n**Monte Carlo Simulation:** Custom C++ implementations leveraging modern C++ standards for performance optimization.\n**Statistical Tools:** Using Armadillo for matrix operations essential in risk computation.`
      },
      {
        title: "Machine Learning for Predictive Analytics",
        detail: `**TensorFlow C++ API:** For integrating deep learning models to forecast market trends affecting portfolio risks.\n**Machine Learning Models:** Regression models to predict risk factors, clustering for strategy analysis, and decision trees for analyzing potential scenarios and their impacts.`
      },
      {
        title: "Concurrency and Multithreading",
        detail: `**Modern C++ Concurrency:** Utilizes \`std::thread\` and \`std::async\` to manage concurrent operations, crucial for real-time risk assessment.`
      },
      {
        title: "Database and Storage",
        detail: `**SQL/NoSQL Databases:** Depending on the need for structured or unstructured data storage, integrating with PostgreSQL or MongoDB using respective C++ drivers.`
      },
      {
        title: "User Interface and Reporting",
        detail: `**Qt Framework:** For building robust user interfaces to display real-time data, risk metrics, and allow users to customize parameters.\n**Reporting Tools:** Development of detailed risk reports and dashboards using C++ integrated with Python for advanced graphical capabilities.`
      }
    ],
    keyComponents: [
      {
        title: "Data Acquisition",
        detail: `**Financial Market Data APIs:** Will utilize Bloomberg API or Thomson Reuters Eikon for real-time financial data, including prices, volumes, and historical data.\n**Boost.Asio for Asynchronous Networking:** To efficiently handle real-time data feeds.`
      },
      {
        title: "Risk Calculation Techniques",
        detail: `**QuantLib Library:** For pricing derivatives and calculating risk metrics, implementing features for day count conventions, interest rate instruments, and derivatives modeling.\n**Monte Carlo Simulation:** Custom C++ implementations leveraging modern C++ standards for performance optimization.\n**Statistical Tools:** Using Armadillo for matrix operations essential in risk computation.`
      },
      {
        title: "Machine Learning for Predictive Analytics",
        detail: `**TensorFlow C++ API:** For integrating deep learning models to forecast market trends affecting portfolio risks.\n**Machine Learning Models:** Regression models to predict risk factors, clustering for strategy analysis, and decision trees for analyzing potential scenarios and their impacts.`
      },
      {
        title: "Concurrency and Multithreading",
        detail: `**Modern C++ Concurrency:** Utilizes \`std::thread\` and \`std::async\` to manage concurrent operations, crucial for real-time risk assessment.`
      },
      {
        title: "Database and Storage",
        detail: `**SQL/NoSQL Databases:** Depending on the need for structured or unstructured data storage, integrating with PostgreSQL or MongoDB using respective C++ drivers.`
      },
      {
        title: "User Interface and Reporting",
        detail: `**Qt Framework:** For building robust user interfaces to display real-time data, risk metrics, and allow users to customize parameters.\n**Reporting Tools:** Development of detailed risk reports and dashboards using C++ integrated with Python for advanced graphical capabilities.`
      }
    ],
    developmentPhases: [
      {
        title: "Phase 1: Setup Data Ingestion",
        detail: `**Establish Financial API Integration:** Connect to Bloomberg or Thomson Reuters Eikon for real-time data acquisition.\n**Database Schema:** Design and implement the database schema for efficient data storage.`
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
];


const skills = [
  // Academic and Physics Skills
  'Quantum Mechanics',
  'Data Analysis',
  'Research Methodologies',
  'Scientific Computing',

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

  // Databases
  'PostgreSQL',
  'MongoDB',
  'SQL',

  // Version Control and CI/CD
  'Git',
  'CI/CD',

  // Testing
  'Jest',

  // Software and Tools
  'Arduino',
  'QuantLib',
  'Google API Client',

  // Development and Prototyping
  '3D Modeling and Printing',
  'Rapid Prototyping',

  // Project Management and Development Practices
  'Agile Methodologies',
  'API Integration',
  'Multithreading and Concurrency',
  'Algorithm Development',

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
