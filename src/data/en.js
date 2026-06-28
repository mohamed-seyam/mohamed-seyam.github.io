// English content. Mirror this shape in ar.js for the Arabic version.
const en = {
  ui: {
    greeting: "Hi, I'm",
    available: 'Available for new opportunities',
    resume: 'Resume',
    viewProject: 'View →',
    langButton: 'العربية',
    model3dCta: 'View interactive 3D',
    model3dHint: 'drag to rotate · scroll to zoom',
    model3dLoading: 'Loading 3D…',
    allProjects: 'Interactive Projects',
    projectsIntro: 'A growing collection of my work in AI, computer vision, and 3D.',
    allCategory: 'All',
    sections: {
      experience: 'Experience',
      projects: 'Projects',
      publications: 'Publications',
      education: 'Education',
    },
  },

  profile: {
    name: 'Mohamed Seyam',
    title: 'Artificial Intelligence Engineer',
    photo: '/assets/images/me.jpeg',
    summary:
      'AI Engineer building LLM & Agentic AI systems, RAG pipelines, and computer vision solutions. From self-hosted agentic automation to satellite analytics and medical imaging — I turn research into production systems that solve real-world problems.',
    email: 'mohamedseyam099@gmail.com',
    phone: '(+20) 010 9098 2078',
    location: 'Cairo, Egypt',
    resume: '/assets/mohamed_Seyam_cv.pdf',
    links: {
      linkedin: 'https://www.linkedin.com/in/mohamed-seyam-bb185a230/',
      github: 'https://github.com/mohamed-seyam',
    },
  },

  navLinks: [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Publications', href: '/#publications' },
    { label: 'Education', href: '/#education' },
  ],

  stats: [
    { value: '4+', label: 'Years in AI' },
    { value: '10+', label: 'Production Models' },
    { value: '1', label: 'Publication' },
  ],

  experience: [
    {
      role: 'Artificial Intelligence Engineer',
      company: 'Wakeb Data',
      location: 'Cairo, Egypt',
      date: 'Jan 2025 - Present',
      current: true,
      logo: '/assets/logos/wakeb.jpeg',
      logoColor: '#0ea5e9',
      points: [
        'Built a self-hosted, end-to-end, prompt-based AI presentation generation tool that produces full decks from a single prompt — integrating PDF parsing, web search, and RAG for grounded content, LLM structured output for slide mapping, and a routing agent that decides per slide whether to reuse document images, search online, or generate new ones via VLMs.',
        'Built and launched a full Agentic Process Automation (APA) system that lets users build complete executable workflows through chat — orchestrating LLM agents with LangGraph and stateful checkpointing, integrating external services (Salla, WhatsApp, Slack), advancing well beyond traditional rule-based RPA.',
        'Built a production RAG pipeline with dense vector retrieval over pgvector and Qdrant, enabling semantic search and factual grounding for LLM-generated outputs.',
        'Delivered end-to-end computer vision and geospatial analytics systems, including satellite image segmentation, object detection, and change detection for land cover mapping and environmental monitoring.',
        'Fine-tuned open-source Vision-Language Models and foundational models for domain-specific remote-sensing tasks, and optimized them for production deployment on edge devices (NVIDIA Jetson) with Docker.',
        'Led the annotation team: gathered requirements, delegated and reviewed tasks for accuracy, and automated data collection, preprocessing, and validation to deliver model-ready datasets.',
      ],
      keywords: ['LangGraph', 'RAG', 'Agentic AI', 'LLMs', 'VLMs', 'pgvector', 'Qdrant', 'Docker'],
    },
    {
      role: 'Artificial Intelligence Engineer',
      company: 'Medsoft',
      location: 'Remote',
      date: 'Jan 2023 - Jan 2025',
      logo: '/assets/logos/medsoft.jpeg',
      logoColor: '#7c3aed',
      points: [
        'Built advanced 3D segmentation models in TensorFlow to enhance accuracy in medical imaging; trained and evaluated large-scale models on AWS SageMaker with S3 storage.',
        'Applied Statistical Shape Modeling combined with deep autoencoders (VAEs, GANs) for generative reconstruction and synthetic data creation.',
        'Implemented an innovative 3D landmarking approach using a 2D U-Net model, integrating computer graphics with deep learning to reduce training overhead.',
        'Collaborated closely with international teams, including the DePuy Synthes R&D team at Johnson & Johnson, to deliver innovative solutions in medical imaging and reconstruction.',
      ],
      keywords: ['TensorFlow', 'AWS SageMaker', 'U-Net', 'GANs', 'VAEs', '3D Segmentation'],
    },
    {
      role: 'Computer Vision Engineer',
      company: 'DevisionX',
      location: 'Remote',
      date: 'Nov 2022 - Jan 2023',
      logo: '/assets/logos/devisionx.jpeg',
      logoColor: '#059669',
      points: [
        'Developed an automated machine learning pipeline for image classification, object detection, and segmentation using TensorFlow AutoML, streamlining model training and benchmarking.',
      ],
      keywords: ['AutoML', 'YOLO', 'TensorFlow', 'Keras-tuner'],
    },
  ],

  // Each project may set categoryKey (stable id used by the filter) and
  // category (the localized label shown on the filter button).
  projects: [
    {
      title: '3D Individual Teeth Segmentation',
      categoryKey: 'medical',
      category: 'Medical',
      link: '#',
      description:
        'Instance segmentation of individual teeth from 3D intraoral scan meshes. Each tooth is detected and labeled directly on the raw mesh, enabling per-tooth analysis for orthodontic and dental workflows. Rotate and zoom a real lower-jaw scan below.',
      keywords: ['3D Mesh', 'Instance Segmentation', 'PointNet', 'Dental AI', 'PyTorch'],
      model: '/assets/models/teeth-lower.obj',
    },
  ],

  publications: [
    {
      title:
        'AI-Powered Toolkit for Automated Swallowing Kinematic Analysis in X-Ray Videofluoroscopy',
      year: '2022',
      image: '/assets/images/publicatoin2022_1.jpg',
      description:
        'An AI-powered toolkit for automated identification of swallowing kinematics in Videofluoroscopic Swallowing Study (VFSS). Uses optical flow, action recognition, object tracking, and image segmentation to assist doctors in diagnosing dysphagia. The pipeline reduces initial examination time by over 50% and provides objective measurements for hyoid bone displacement and bolus tracking.',
      keywords: ['Medical Imaging', 'Deep Learning', 'Computer Vision', 'Healthcare AI'],
    },
  ],

  education: [
    {
      school: 'Cairo University',
      faculty: 'Faculty of Engineering',
      degree: "Bachelor's in Biomedical Engineering",
      date: '2017 - 2022',
    },
  ],
}

export default en
