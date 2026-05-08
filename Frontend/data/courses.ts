export interface Module {
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  short: string;
  description: string;
  duration: string;
  fees: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  syllabus: string[];
  modules?: Module[];
  projects?: string[];
  outcomes: string[];
  prerequisites?: string[];
  schedule?: string;
  image?: string;
  certificate?: string;
  demoVideo?: string;
  color?: string;
  bgColor?: string;
}

export const courses: Course[] = [
  {
    id: "crt-coding-lecture",
    title: "CRT (Coding Lecture)",
    short: "Campus Recruitment Training - Coding Mastery",
    description:
      "Comprehensive Campus Recruitment Training (CRT) program focused on coding skills, aptitude building, and interview preparation. Master problem-solving techniques, crack coding rounds, and ace technical interviews with our structured CRT program designed for campus placements.",
    duration: "2 Months",
    fees: "",
    level: "Beginner",
    category: "Placement Training",
    syllabus: [
      "Aptitude & Logical Reasoning",
      "Quantitative Aptitude",
      "Verbal & Non-Verbal Reasoning",
      "C Programming Fundamentals",
      "Data Structures & Algorithms",
      "Object-Oriented Programming Concepts",
      "Database & SQL Queries",
      "Technical Interview Preparation",
      "Mock Coding Tests",
      "Group Discussion Practice",
      "Resume Building Workshop",
      "Soft Skills & Communication",
    ],
    modules: [
      { 
        title: "Aptitude Training", 
        topics: [
          "Number Systems & Algebra",
          "Percentages, Profit & Loss",
          "Time, Speed & Distance",
          "Permutations & Combinations",
          "Probability",
          "Logical Puzzles",
          "Data Interpretation"
        ] 
      },
      { 
        title: "Coding Fundamentals", 
        topics: [
          "C Language Basics",
          "Control Structures",
          "Functions & Pointers",
          "Arrays & Strings",
          "Structures & Unions",
          "File Handling"
        ] 
      },
      {
        id: "fullstack-java",
        title: "Full-Stack Java Developer",
        short: "Enterprise Java, Spring Boot & Microservices",
        description:
          "Become a backend & full-stack Java developer with hands-on projects, REST APIs, Microservices, and deployment workflows.",
        duration: "5 Months",
        fees: "",
        level: "Advanced",
        category: "Fullstack",
        syllabus: [
          "Core Java & OOPs",
          "Collections & Generics",
          "Spring & Spring Boot",
          "REST APIs & Microservices",
          "Hibernate/JPA",
          "SQL & NoSQL Databases",
          "Testing & CI/CD",
          "Cloud Basics (AWS/GCP)",
        ],
        modules: [
          { title: "Java Core", topics: ["OOPs", "Collections", "Concurrency"] },
          { title: "Spring Ecosystem", topics: ["Spring Core", "Spring Boot", "Spring Security"] },
          { title: "Data & Persistence", topics: ["JPA/Hibernate", "SQL", "MongoDB"] },
          { title: "Microservices", topics: ["Design", "Gateway", "Service Discovery"] },
        ],
        projects: [
          "E-commerce REST API with Spring Boot",
          "Microservice-based Order Processing System",
        ],
        outcomes: [
          "Build production-ready backend services",
          "Understand microservice architecture",
          "Prepare for interviews and placements",
        ],
        prerequisites: ["Basic programming knowledge", "Familiarity with Linux/CLI"],
        schedule: "Weekday / Weekend batches available",
        image: "https://www.vcubesoftsolutions.com/wp-content/uploads/2023/11/image.jpg",
        certificate: "Certificate of Completion: Full-Stack Java Developer",
        demoVideo: "/videos/fullstack-java-demo.mp4",
        color: "from-blue-500 to-blue-700",
        bgColor: "from-blue-500/10 to-blue-700/10",
      },
      {
        id: "python-dsa",
        title: "Python & DSA",
        short: "Master Data Structures & Algorithms with Python",
        description:
          "Learn problem-solving and coding fundamentals through Python, focusing on Data Structures & Algorithms (DSA). Build strong foundations for interviews, competitive programming, and real-world applications.",
        duration: "3 Months",
        fees: "",
        level: "Beginner",
        category: "Programming",
        syllabus: [
          "Python Basics & OOP",
          "Arrays & Strings",
          "Linked Lists",
          "Stacks & Queues",
          "Recursion & Backtracking",
          "Trees & Graphs",
          "Sorting & Searching Algorithms",
          "Dynamic Programming",
          "Problem-Solving & Interview Prep",
        ],
        modules: [
          { title: "Python Foundations", topics: ["Syntax", "Loops", "Functions", "OOP"] },
          { title: "Core DSA", topics: ["Arrays", "Strings", "Linked Lists", "Stacks", "Queues"] },
          { title: "Advanced DSA", topics: ["Trees", "Graphs", "Dynamic Programming", "Greedy Algorithms"] },
        ],
        projects: ["Mini Coding Challenges", "Algorithm Visualizer", "Problem-Solving Portfolio"],
        outcomes: [
          "Write efficient algorithms",
          "Crack coding interviews",
          "Build strong problem-solving mindset",
        ],
        prerequisites: ["Basic knowledge of Python programming"],
        schedule: "Weekday & Weekend batches",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        certificate: "Certificate of Completion: Python & DSA",
        demoVideo: "/videos/python-dsa-demo.mp4",
        color: "from-green-500 to-green-700",
        bgColor: "from-green-500/10 to-green-700/10",
      },
    ],
    projects: [
      "Coding Challenge Portfolio (50+ Problems)",
      "Mock Placement Test Series",
      "Technical Presentation Project",
    ],
    outcomes: [
      "Crack campus placement coding rounds",
      "Master aptitude and reasoning for placement tests",
      "Build confidence for technical interviews",
      "Develop strong problem-solving abilities",
      "Create impressive resume and portfolio",
    ],
    prerequisites: ["Basic understanding of mathematics", "Interest in coding"],
    schedule: "Daily batches (Morning & Evening)",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    certificate: "Certificate of Completion: CRT - Coding Lecture",
    demoVideo: "/videos/crt-coding-demo.mp4",
    color: "from-yellow-500 to-orange-600",
    bgColor: "from-yellow-500/10 to-orange-600/10",
  },
  {
    id: "servicenow",
    title: "ServiceNow",
    short: "Enterprise Service Management Platform",
    description:
      "Master ServiceNow, the leading enterprise service management platform. Learn to automate IT services, streamline workflows, and build custom applications. Gain expertise in ITSM, ITOM, and ServiceNow development with hands-on projects and real-world scenarios.",
    duration: "3.5 Months",
    fees: "",
    level: "Intermediate",
    category: "IT Service Management",
    syllabus: [
      "ServiceNow Platform Overview",
      "IT Service Management (ITSM)",
      "IT Operations Management (ITOM)",
      "ServiceNow Scripting & Development",
      "Flow Designer & Automation",
      "Service Portal Development",
      "Integration Hub & REST APIs",
      "Performance Analytics",
      "Security Operations (SecOps)",
      "Custom Application Development",
      "ServiceNow Administration",
      "Best Practices & Governance",
    ],
    modules: [
      { 
        title: "Platform Fundamentals", 
        topics: [
          "ServiceNow Architecture",
          "Navigation & UI",
          "Tables & Schema",
          "Users, Groups & Roles",
          "Import Sets & Transform Maps"
        ] 
      },
      { 
        title: "ITSM & ITOM", 
        topics: [
          "Incident Management",
          "Problem Management",
          "Change Management",
          "Service Catalog",
          "CMDB & Discovery",
          "Event Management"
        ] 
      },
      { 
        title: "Development & Scripting", 
        topics: [
          "Client Scripts",
          "Business Rules",
          "Script Includes",
          "UI Policies & Actions",
          "GlideRecord API",
          "ServiceNow APIs"
        ] 
      },
      { 
        title: "Automation & Integration", 
        topics: [
          "Flow Designer",
          "Workflow Editor",
          "Integration Hub",
          "REST & SOAP Integration",
          "Email Notifications",
          "Scheduled Jobs"
        ] 
      },
      { 
        title: "Advanced Features", 
        topics: [
          "Service Portal",
          "Virtual Agent",
          "Performance Analytics",
          "Reporting & Dashboards",
          "Mobile App Development",
          "ATF Testing"
        ] 
      },
    ],
    projects: [
      "ITSM Implementation Project",
      "Custom Service Portal Development",
      "Automated Workflow for HR Onboarding",
      "Integration with Third-Party Tools",
    ],
    outcomes: [
      "Become a certified ServiceNow professional",
      "Implement ITSM solutions for enterprises",
      "Develop custom ServiceNow applications",
      "Automate complex business workflows",
      "Integrate ServiceNow with external systems",
    ],
    prerequisites: ["Basic understanding of IT processes", "JavaScript fundamentals recommended"],
    schedule: "Weekday / Weekend batches available",
    image: "https://fabrikbrands.com/wp-content/uploads/ServiceNow-Logo-History-1.png",
    certificate: "Certificate of Completion: ServiceNow Developer",
    demoVideo: "/videos/servicenow-demo.mp4",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-500/10 to-teal-600/10",
  },
  {
    id: "databricks",
    title: "DataBricks",
    short: "Unified Data Analytics Platform",
    description:
      "Master DataBricks, the unified data analytics platform built on Apache Spark. Learn big data processing, machine learning, and real-time analytics. Build scalable data pipelines, implement MLOps, and work with Delta Lake for enterprise-grade data solutions.",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Big Data & Analytics",
    syllabus: [
      "Introduction to DataBricks Platform",
      "Apache Spark Architecture",
      "Spark SQL & DataFrames",
      "Delta Lake Fundamentals",
      "Data Engineering Pipelines",
      "Streaming Analytics",
      "Machine Learning with MLflow",
      "Feature Store & Model Registry",
      "DataBricks SQL Analytics",
      "Performance Optimization",
      "Cloud Integration (AWS/Azure/GCP)",
      "Security & Governance",
      "CI/CD for Data Pipelines",
    ],
    modules: [
      { 
        title: "Platform & Spark Basics", 
        topics: [
          "DataBricks Workspace",
          "Notebooks & Clusters",
          "Spark Architecture",
          "RDDs, DataFrames & Datasets",
          "Spark SQL",
          "Catalyst Optimizer"
        ] 
      },
      { 
        title: "Delta Lake & Data Engineering", 
        topics: [
          "Delta Lake Architecture",
          "ACID Transactions",
          "Time Travel",
          "Schema Evolution",
          "Change Data Capture",
          "Data Pipeline Patterns"
        ] 
      },
      { 
        title: "Streaming & Real-Time Analytics", 
        topics: [
          "Structured Streaming",
          "Window Operations",
          "Watermarking",
          "Output Modes",
          "Checkpointing",
          "Stream-Stream Joins"
        ] 
      },
      { 
        title: "Machine Learning & MLOps", 
        topics: [
          "MLflow Tracking",
          "Model Registry",
          "Feature Store",
          "AutoML",
          "Model Serving",
          "A/B Testing"
        ] 
      },
      { 
        title: "Advanced Features", 
        topics: [
          "Photon Engine",
          "DataBricks SQL",
          "Dashboards & Alerts",
          "Unity Catalog",
          "Workflows & Jobs",
          "Git Integration"
        ] 
      },
    ],
    projects: [
      "Real-Time ETL Pipeline with Delta Live Tables",
      "Customer Churn Prediction Model",
      "Streaming IoT Data Analytics Dashboard",
      "Data Lakehouse Implementation",
    ],
    outcomes: [
      "Design and implement data lakehouse solutions",
      "Build production-grade data pipelines",
      "Deploy machine learning models at scale",
      "Optimize Spark performance",
      "Implement real-time analytics solutions",
    ],
    prerequisites: ["SQL knowledge", "Basic Python or Scala programming"],
    schedule: "Weekday / Weekend batches available",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjD9h7WQJjdLdSWMd5SVLeWEIeYnk4940gyQ&s",
    certificate: "Certificate of Completion: DataBricks Professional",
    demoVideo: "/videos/databricks-demo.mp4",
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-500/10 to-red-600/10",
  },
  {
    id: "german-language",
    title: "German Language",
    short: "Comprehensive German Language Training",
    description:
      "Master the German language with our structured program covering all proficiency levels (A1 to C2). Learn from certified instructors, practice with native speakers, and prepare for Goethe-Zertifikat exams. Open doors to study, work, and settle in Germany with confidence.",
    duration: "3-6 Months (Level-wise)",
    fees: "",
    level: "Beginner",
    category: "Foreign Language",
    syllabus: [
      "German Alphabet & Pronunciation",
      "Basic Grammar & Sentence Structure",
      "Vocabulary Building",
      "Conversational German",
      "Reading Comprehension",
      "Writing Skills Development",
      "Listening Practice",
      "German Culture & Etiquette",
      "Business German",
      "Exam Preparation (A1-C2)",
      "Interview Preparation",
      "Visa Interview Practice",
    ],
    modules: [
      { 
        title: "A1 - Beginner Level", 
        topics: [
          "Introductions & Greetings",
          "Numbers, Time & Dates",
          "Family & Friends",
          "Food & Shopping",
          "Daily Routines",
          "Basic Grammar (Articles, Cases)",
          "Simple Conversations"
        ] 
      },
      { 
        title: "A2 - Elementary Level", 
        topics: [
          "Travel & Transportation",
          "Work & Professions",
          "Health & Body",
          "Past Tense (Perfekt)",
          "Modal Verbs",
          "Connectors & Subordinate Clauses",
          "Everyday Situations"
        ] 
      },
      { 
        title: "B1 - Intermediate Level", 
        topics: [
          "Complex Grammar Structures",
          "Future Tense & Konjunktiv II",
          "Passive Voice",
          "Expressing Opinions",
          "Formal Letters & Emails",
          "Current Affairs Discussions",
          "Exam Preparation - Goethe B1"
        ] 
      },
      { 
        title: "B2 - Upper Intermediate", 
        topics: [
          "Advanced Grammar Mastery",
          "Business Communication",
          "Technical German",
          "Academic Writing",
          "Literature & Media",
          "Debate & Presentation Skills",
          "Exam Preparation - Goethe B2"
        ] 
      },
      { 
        title: "C1/C2 - Advanced & Mastery", 
        topics: [
          "Native-Level Fluency",
          "Professional & Academic German",
          "Complex Text Analysis",
          "Idiomatic Expressions",
          "Cultural Nuances",
          "Specialized Vocabulary",
          "Exam Preparation - Goethe C1/C2"
        ] 
      },
    ],
    projects: [
      "German Language Portfolio",
      "Cultural Presentation Project",
      "Mock Goethe Exam Series",
      "German Video Blog Creation",
    ],
    outcomes: [
      "Achieve fluency in German language",
      "Clear Goethe-Zertifikat exams (A1-C2)",
      "Communicate confidently in professional settings",
      "Prepare for study or work in Germany",
      "Understand German culture and business etiquette",
      "Qualify for German visa requirements",
    ],
    prerequisites: ["No prior German knowledge required for A1", "Interest in language learning"],
    schedule: "Weekday & Weekend batches (Morning/Evening)",
    image: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    certificate: "Certificate of Completion: German Language Proficiency",
    demoVideo: "/videos/german-language-demo.mp4",
    color: "from-amber-500 to-red-700",
    bgColor: "from-amber-500/10 to-red-700/10",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    short: "Cutting-edge Cybersecurity Training",
    description:
      "Enroll in our cutting-edge cybersecurity training program, expertly crafted to combat the ever-changing landscape of digital threats. No matter your level of experience, our all-inclusive curriculum empowers you with the most current techniques and information to safeguard against cyber attacks. Don't lag behind – take part in our program and remain ahead of the game in the world of cybersecurity!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Cybersecurity",
    syllabus: [
      "Network Security Fundamentals",
      "Cryptography Techniques",
      "Threat Detection & Prevention",
      "Incident Response & Recovery",
      "Ethical Hacking Basics",
      "Security Compliance & Standards",
    ],
    modules: [
      { title: "Network Security", topics: ["Fundamentals", "Firewalls", "VPNs"] },
      { title: "Cryptography", topics: ["Encryption", "Key Management"] },
      { title: "Threat Management", topics: ["Detection", "Prevention", "Response"] },
    ],
    projects: ["Network Security Audit", "Simulated Cyber Attack Defense"],
    outcomes: [
      "Protect systems from digital threats",
      "Apply current cybersecurity techniques",
      "Stay ahead in the cybersecurity field",
    ],
    prerequisites: ["Basic IT knowledge", "Interest in security"],
    schedule: "Weekday / Weekend batches available",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    certificate: "Certificate of Completion: Cyber Security",
    demoVideo: "/videos/cyber-security-demo.mp4",
    color: "from-red-500 to-red-700",
    bgColor: "from-red-500/10 to-red-700/10",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    short: "Expert-Led Digital Marketing Training",
    description:
      "Join our expert-led training program covering vital topics like SEO, PPC advertising, social media strategies, email campaigns, and web analytics. Gain actionable knowledge through practical exercises and real-world examples to excel in the digital landscape. Whether you're a beginner or experienced marketer, our program equips you to thrive in the digital world. Enroll today!",
    duration: "2.5 Months",
    fees: "",
    level: "Beginner",
    category: "Digital Marketing",
    syllabus: [
      "Search Engine Optimization (SEO)",
      "Pay-Per-Click (PPC) Advertising",
      "Social Media Strategies",
      "Email Campaign Management",
      "Web Analytics & Reporting",
    ],
    modules: [
      { title: "SEO & PPC", topics: ["SEO Basics", "PPC Campaigns"] },
      { title: "Social Media", topics: ["Strategy", "Advertising"] },
      { title: "Email & Analytics", topics: ["Campaigns", "Web Analytics"] },
    ],
    projects: ["SEO Optimization Project", "Social Media Marketing Campaign"],
    outcomes: [
      "Master digital marketing techniques",
      "Apply skills in real-world scenarios",
      "Thrive in the digital marketing field",
    ],
    prerequisites: ["Basic computer skills"],
    schedule: "Evening & Weekend batches",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    certificate: "Certificate of Completion: Digital Marketing",
    demoVideo: "/videos/digital-marketing-demo.mp4",
    color: "from-purple-500 to-purple-700",
    bgColor: "from-purple-500/10 to-purple-700/10",
  },
  {
    id: "microsoft-azure",
    title: "Microsoft Azure",
    short: "Mastery in Microsoft Azure",
    description:
      "Gain mastery of Microsoft Azure through our dynamic training program. Our experienced instructors will guide you through key services such as cloud computing, virtual machines, and storage, allowing you to apply your knowledge through hands-on projects. Take your career in cloud solutions to the next level - enroll with us now!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "Cloud Computing",
    syllabus: [
      "Cloud Computing Basics",
      "Virtual Machines",
      "Storage Solutions",
    ],
    modules: [
      { title: "Cloud Fundamentals", topics: ["Basics", "Services"] },
      { title: "Virtual Machines", topics: ["Setup", "Management"] },
      { title: "Storage", topics: ["Blob", "File Storage"] },
    ],
    projects: ["Azure Virtual Machine Setup", "Cloud Storage Solution"],
    outcomes: [
      "Master Azure cloud services",
      "Apply skills in hands-on projects",
      "Elevate your cloud career",
    ],
    prerequisites: ["Basic IT knowledge", "Interest in cloud"],
    schedule: "Evening batches",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    certificate: "Certificate of Completion: Microsoft Azure",
    demoVideo: "/videos/microsoft-azure-demo.mp4",
    color: "from-blue-600 to-blue-800",
    bgColor: "from-blue-600/10 to-blue-800/10",
  },
  {
    id: "salesforce",
    title: "Salesforce",
    short: "Comprehensive Salesforce Training",
    description:
      "Embrace the full potential of Salesforce with our all-inclusive training program. From administration and customization to automation, our program covers it all. Put your skills into action and elevate your career with hands-on experience. Don't wait, unleash the power of Salesforce by joining us today!",
    duration: "3 Months",
    fees: "",
    level: "Intermediate",
    category: "CRM",
    syllabus: [
      "Salesforce Administration",
      "Customization",
      "Automation",
    ],
    modules: [
      { title: "Administration", topics: ["Setup", "Users"] },
      { title: "Customization", topics: ["Fields", "Page Layouts"] },
      { title: "Automation", topics: ["Workflows", "Process Builder"] },
    ],
    projects: ["Salesforce CRM Customization", "Automation Workflow"],
    outcomes: [
      "Master Salesforce administration",
      "Implement customizations and automation",
      "Elevate your career with hands-on skills",
    ],
    prerequisites: ["Basic CRM knowledge"],
    schedule: "Weekend batches",
    image: "https://www.resco.net/app/uploads/what-is-salesforce.jpg",
    certificate: "Certificate of Completion: Salesforce",
    demoVideo: "/videos/salesforce-demo.mp4",
    color: "from-teal-500 to-teal-700",
    bgColor: "from-teal-500/10 to-teal-700/10",
  },
  {
    id: "itil",
    title: "ITIL",
    short: "Mastery in ITIL Training",
    description:
      "Unlock your mastery of ITIL through our immersive training program. Immerse yourself in key concepts and best practices of IT service management. Develop practical skills for streamlined service delivery that aligns with business goals. Enroll now and elevate your understanding and application of ITIL!",
    duration: "2.5 Months",
    fees: "",
    level: "Intermediate",
    category: "IT Service Management",
    syllabus: [
      "ITIL Foundations",
      "Service Strategy",
      "Service Design",
      "Service Transition",
      "Service Operation",
      "Continual Service Improvement",
    ],
    modules: [
      { title: "Foundations", topics: ["Basics", "Key Concepts"] },
      { title: "Service Lifecycle", topics: ["Strategy", "Design", "Transition", "Operation", "Improvement"] },
    ],
    projects: ["IT Service Management Plan", "Service Improvement Proposal"],
    outcomes: [
      "Understand ITIL best practices",
      "Streamline service delivery",
      "Align IT services with business goals",
    ],
    prerequisites: ["Basic IT service knowledge"],
    schedule: "Evening batches",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    certificate: "Certificate of Completion: ITIL",
    demoVideo: "/videos/itil-demo.mp4",
    color: "from-indigo-500 to-indigo-700",
    bgColor: "from-indigo-500/10 to-indigo-700/10",
  },
  {
    id: "ai-data-analytics",
    title: "AI-Powered Data Analytics",
    short: "Master AI-Driven Data Analysis",
    description:
      "Unlock the power of AI to analyze and interpret complex datasets. This course covers machine learning, data visualization, and predictive analytics, empowering you to derive actionable insights from data using cutting-edge AI tools and techniques.",
    duration: "3.5 Months",
    fees: "",
    level: "Intermediate",
    category: "Data Science",
    syllabus: [
      "Introduction to Data Analytics",
      "Python for Data Analysis",
      "Machine Learning Fundamentals",
      "Predictive Analytics",
      "Data Visualization with Tableau",
      "AI Tools (TensorFlow, PyTorch)",
      "Big Data Integration",
      "Real-World Case Studies",
    ],
    modules: [
      { title: "Data Analytics Basics", topics: ["Data Types", "Statistics", "Data Cleaning"] },
      { title: "Machine Learning", topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"] },
      { title: "Visualization & AI", topics: ["Tableau", "TensorFlow", "PyTorch"] },
      { title: "Advanced Analytics", topics: ["Predictive Models", "Big Data", "Case Studies"] },
    ],
    projects: [
      "Predictive Sales Forecasting Model",
      "Customer Segmentation with AI",
    ],
    outcomes: [
      "Apply AI to analyze complex datasets",
      "Create predictive models for business applications",
      "Visualize data effectively with modern tools",
    ],
    prerequisites: ["Basic Python programming", "Familiarity with statistics"],
    schedule: "Weekday / Weekend batches available",
    image: "https://www.hashstudioz.com/blog/wp-content/uploads/2025/01/How-AI-Powered-Analytics-is-Changing-the-Game-for-Businesses.png",
    certificate: "Certificate of Completion: AI-Powered Data Analytics",
    demoVideo: "../../videos/DAPreview.mp4",
    color: "from-orange-500 to-orange-700",
    bgColor: "from-orange-500/10 to-orange-700/10",
  },
];

export function getCourseById(id: string) {
  return courses.find((c) => c.id === id) || null;
}