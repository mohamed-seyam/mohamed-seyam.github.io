// English content. Mirror this shape in ar.js for the Arabic version.
const en = {
  ui: {
    greeting: "Hi, I'm",
    available: 'Available for new opportunities',
    resume: 'Resume',
    viewProject: 'View →',
    viewDemo: 'Visualization',
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
      openSource: 'Open Source',
      publications: 'Publications',
      education: 'Education',
    },
  },

  profile: {
    name: 'Mohamed Seyam',
    title: 'AI Engineer | LLMs, Agentic Systems & Voice AI',
    photo: '/assets/images/me.jpeg',
    summary:
      'AI Engineer with 4+ years of experience shipping production AI systems: on-premise Arabic voice agents, grounded RAG platforms with integrated guardrails, and computer vision models. Focused on self-hosted, sovereign deployments where data never leaves the client.',
    email: 'mohamedseyam099@gmail.com',
    phone: '+20 109 098 2078',
    location: 'Cairo, Egypt',
    resume: '/assets/mohamed_seyam_cv.pdf',
    links: {
      linkedin: 'https://www.linkedin.com/in/mohamed-seyam-bb185a230/',
      github: 'https://github.com/mohamed-seyam',
    },
  },

  navLinks: [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Open Source', href: '/#open-source' },
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
      groups: [
        {
          title: 'Agentic AI Projects',
          items: [
            {
              title: 'Baleegh',
              demo: 'baleegh',
              subtitle: 'Najdi Arabic Voice Agent Platform',
              points: [
                'Engineered a self-hosted, real-time Najdi Arabic voice agent: Arabic STT (Cohere Transcribe), gemma-4-12b on vLLM with a RAG tool over Naseh, and a LoRA-tuned Najdi TTS (Fasee7 on VoxCPM2) with voice cloning.',
                'Built on FastAPI and a self-hosted LiveKit server, with Silero VAD and turn detection running locally in the agent; STT, TTS and the LLM share a single 24 GB GPU.',
                'Cut time to first audio by 56%, from 2.27 s to a 1.0 s median, by streaming TTS audio as it is generated; a parallel model warm-up while the room connects removes the 10.8 s cold first turn.',
                'Added a deterministic speakable-text step that rewrites numbers, codes and markdown into Najdi words, so the synthesizer never drops part of a reply.',
              ],
            },
            {
              title: 'Naseh',
              demo: 'naseh',
              subtitle: 'Sovereign Arabic/English RAG Platform',
              points: [
                'Architected a self-hosted RAG platform as 5 microservices (FastAPI, Qdrant, Docling, Next.js).',
                'Runs fully on-premise with a local LLM (Ollama, vLLM) and no external AI API, designed for Saudi data-residency rules.',
                'Added layout-aware parsing of 33 formats and hybrid dense + BM25 retrieval fused with RRF.',
                'AI safety: strict grounding with refusal, numbered citations, and tenant isolation enforced inside the vector search.',
                'Designed a layered guardrail stack: prompt-injection detection, PII masking, and groundedness checks.',
              ],
            },
            {
              title: 'PPGen',
              demo: 'ppgen',
              subtitle: 'AI Presentation Generator',
              points: [
                'Shipped a self-hosted, end-to-end tool that produces a full slide deck from a single prompt.',
                'Grounds content with PDF parsing, web search, and RAG, and maps it to slides with LLM structured output.',
                'A routing agent decides per slide whether to reuse document images, search online, or generate new ones via VLMs.',
              ],
            },
            {
              title: 'APA',
              demo: 'apa',
              subtitle: 'Agentic Process Automation',
              points: [
                'Launched a system that lets users build complete executable workflows through chat, going well beyond rule-based RPA.',
                'Orchestrates LLM agents with LangGraph and stateful checkpointing through structured reasoning and decision-making pipelines.',
                'Integrates external services such as Salla, WhatsApp, and Slack.',
              ],
            },
          ],
        },
        {
          title: 'Computer Vision Projects',
          items: [
            'Fine-tuned open-source Vision-Language Models and foundation models for land cover mapping and environmental monitoring.',
            'Delivered satellite image segmentation, object detection, and change detection systems, plus deblurring/dehazing generative models.',
            'Optimized deep learning models for NVIDIA Jetson edge deployment, containerized with Docker.',
            'Led the annotation team: gathered requirements, delegated and reviewed work, and automated data collection, preprocessing, and validation.',
          ],
        },
      ],
      keywords: ['Voice AI', 'LiveKit', 'vLLM', 'RAG', 'Guardrails', 'LangGraph', 'Agentic AI', 'Qdrant', 'VLMs', 'Docker'],
    },
    {
      role: 'Artificial Intelligence Engineer',
      company: 'Medsoft',
      location: 'Remote',
      date: 'Jan 2023 - Jan 2025',
      logo: '/assets/logos/medsoft.jpeg',
      logoColor: '#7c3aed',
      groups: [
        {
          title: 'Virtual Surgical Planning (VSP) Projects',
          intro:
            'Built the AI side of a virtual surgical planning workflow: turning patient scans into segmented 3D anatomy, anatomical landmarks, and reconstructed shapes that surgeons use to plan procedures before entering the operating room.',
          items: [
            {
              title: '3D Individual Teeth Segmentation',
              subtitle: 'Intraoral Scans',
              demo: 'teeth',
              points: [
                'Built 3D segmentation models that detect and label each tooth directly on intraoral scan meshes, giving the planning workflow a separate, editable 3D model per tooth.',
                'Enabled per-tooth analysis and movement planning for orthodontic and surgical cases.',
                'Trained and evaluated large-scale models in TensorFlow on AWS SageMaker with S3 storage.',
                'Added 3D landmark detection with a 2D U-Net model, combining computer graphics with deep learning; the landmarks serve as reference points for measurements and planning.',
                'Reduced the training overhead of 3D landmarking.',
              ],
            },
            {
              title: 'Generative Shape Reconstruction',
              subtitle: 'Statistical Shape Modeling',
              points: [
                'Combined Statistical Shape Modeling with deep autoencoders (VAEs, GANs) for generative reconstruction of anatomical shapes.',
                'Estimated a plausible healthy shape for missing or damaged anatomy, giving surgeons a reference to plan the reconstruction against.',
                'Generated synthetic data to expand limited medical training sets.',
              ],
            },
          ],
        },
        {
          title: 'Collaboration',
          items: [
            'Collaborated closely with international teams, including the DePuy Synthes R&D team at Johnson & Johnson, on medical imaging and reconstruction for surgical planning.',
          ],
        },
      ],
      keywords: ['Virtual Surgical Planning', '3D Segmentation', '3D Landmarks', 'Statistical Shape Modeling', 'U-Net', 'GANs', 'VAEs', 'TensorFlow', 'AWS SageMaker'],
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
      id: 'baleegh',
      title: 'Baleegh — Najdi Arabic Voice Agent',
      categoryKey: 'llm',
      category: 'LLM & Agentic AI',
      link: '#',
      description:
        'A self-hosted, real-time Najdi Arabic voice agent. The browser talks to a self-hosted LiveKit room; the agent detects the end of each turn locally (Silero VAD), transcribes with Cohere Transcribe Arabic, answers with gemma-4-12b on vLLM using a RAG tool over Naseh, rewrites numbers into Najdi words, and streams a Najdi TTS voice back — all on one 24 GB GPU, with time to first audio cut from 2.27 s to a 1.0 s median. Follow a real benchmark turn through the stack below.',
      keywords: ['Voice AI', 'LiveKit', 'vLLM', 'gemma-4', 'Silero VAD', 'STT', 'TTS', 'RAG', 'FastAPI'],
      demo: 'baleegh',
    },
    {
      id: 'naseh',
      title: 'Naseh — Sovereign Arabic/English RAG',
      categoryKey: 'llm',
      category: 'LLM & Agentic AI',
      link: '#',
      description:
        'A self-hosted RAG platform that runs fully on-premise with a local LLM and no external AI API, built for Saudi data-residency rules. Docling parses 33 formats into layout-aware chunks, each chunk is stored in Qdrant as a dense and a BM25 vector, and every question runs hybrid retrieval fused with RRF inside its own project\'s partition. Answers come only from the retrieved passages, with numbered citations back to the page, and when the documents don\'t hold the answer Naseh says so instead of guessing. Watch a project get indexed and questioned below.',
      keywords: ['RAG', 'Qdrant', 'Hybrid Search', 'BM25', 'RRF', 'Docling', 'vLLM', 'Next.js', 'On-premise'],
      demo: 'naseh',
    },
    {
      id: 'ppgen',
      title: 'ppgen — AI Presentation Generator',
      categoryKey: 'llm',
      category: 'LLM & Agentic AI',
      link: '#',
      description:
        'A self-hosted agentic tool that turns a single prompt into a full slide deck — combining PDF parsing, web search, RAG grounding, LLM structured output for slide mapping, and a routing agent that decides per slide whether to reuse images, search online, or generate new ones with VLMs. Try the interactive demo below.',
      keywords: ['LLM', 'Agentic AI', 'RAG', 'LangGraph', 'VLMs'],
      demo: 'ppgen',
    },
    {
      id: 'apa',
      title: 'APA — Agentic Process Automation',
      categoryKey: 'llm',
      category: 'LLM & Agentic AI',
      link: '#',
      description:
        'A full Agentic Process Automation platform: describe an automation in plain language and a LangGraph agent pipeline analyzes the prompt, retrieves matching services via RAG, plans the steps, extracts conditions, and wires a validated, executable workflow — advancing well beyond rule-based RPA. Watch a generated automation build and run on the canvas below.',
      keywords: ['Agentic AI', 'LangGraph', 'LLMs', 'RAG', 'Workflow Automation', 'Salla', 'Odoo'],
      demo: 'apa',
    },
    {
      id: 'teeth',
      title: '3D Individual Teeth Segmentation',
      categoryKey: 'medical',
      category: 'Medical',
      link: '#',
      description:
        'Instance segmentation of individual teeth from 3D intraoral scan meshes. Each tooth is detected and labeled directly on the raw mesh, enabling per-tooth analysis for orthodontic and dental workflows. 3D landmarks are detected with a 2D U-Net, combining computer graphics with deep learning to cut training overhead. Rotate and zoom a real lower-jaw scan below.',
      keywords: ['3D Mesh', 'Instance Segmentation', 'PointNet', '3D Landmarks', '2D U-Net', 'Dental AI', 'PyTorch'],
      model: '/assets/models/teeth-lower.obj',
    },
  ],

  openSource: [
    {
      title: 'Needle — Necessary Elements for Deep Learning',
      link: 'https://github.com/mohamed-seyam/needle',
      description:
        'A PyTorch-style deep learning framework built from scratch in Python and C++ — autograd, tensor operations, backpropagation, and neural network primitives.',
      keywords: ['Python', 'C++', 'Autograd', 'Deep Learning'],
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
