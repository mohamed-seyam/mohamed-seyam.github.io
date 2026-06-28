// Arabic content. Same shape as en.js. Technical terms are kept in English
// (RAG, prompt, agent, pipeline, segmentation...) as engineers read them.
const ar = {
  ui: {
    greeting: 'مرحبًا، أنا',
    available: 'متاح لفرص جديدة',
    resume: 'السيرة الذاتية',
    viewProject: 'عرض ←',
    langButton: 'English',
    model3dCta: 'استعرض المجسم ثلاثي الأبعاد',
    model3dHint: 'اسحب للتدوير · مرّر للتكبير',
    model3dLoading: 'جارٍ تحميل المجسم…',
    allProjects: 'المشاريع التفاعلية',
    projectsIntro: 'مجموعة متنامية من أعمالي في الذكاء الاصطناعي والرؤية الحاسوبية والـ 3D.',
    allCategory: 'الكل',
    sections: {
      experience: 'الخبرة العملية',
      projects: 'المشاريع',
      publications: 'المنشورات',
      education: 'التعليم',
    },
  },

  profile: {
    name: 'محمد صيام',
    title: 'مهندس ذكاء اصطناعي',
    photo: '/assets/images/me.jpeg',
    summary:
      'مهندس ذكاء اصطناعي أبني أنظمة LLM & Agentic AI وRAG pipelines وحلول computer vision جاهزة للإنتاج. من الـ agentic automation ذاتية الاستضافة إلى satellite analytics والـ medical imaging — أحوّل الأبحاث إلى production systems تحلّ مشكلات واقعية.',
    email: 'mohamedseyam099@gmail.com',
    phone: '(+20) 010 9098 2078',
    location: 'القاهرة، مصر',
    resume: '/assets/mohamed_Seyam_cv.pdf',
    links: {
      linkedin: 'https://www.linkedin.com/in/mohamed-seyam-bb185a230/',
      github: 'https://github.com/mohamed-seyam',
    },
  },

  navLinks: [
    { label: 'نبذة', href: '/#about' },
    { label: 'الخبرة', href: '/#experience' },
    { label: 'المشاريع', href: '/#projects' },
    { label: 'المنشورات', href: '/#publications' },
    { label: 'التعليم', href: '/#education' },
  ],

  stats: [
    { value: '+4', label: 'سنوات خبرة' },
    { value: '+10', label: 'نماذج إنتاجية' },
    { value: '1', label: 'منشور علمي' },
  ],

  experience: [
    {
      role: 'مهندس ذكاء اصطناعي',
      company: 'Wakeb Data',
      location: 'القاهرة، مصر',
      date: 'يناير 2025 — حتى الآن',
      current: true,
      logo: '/assets/logos/wakeb.jpeg',
      logoColor: '#0ea5e9',
      points: [
        'بنيت أداة متكاملة ذاتية الاستضافة لتوليد العروض التقديمية كاملةً من خلال prompt واحد — بدمج PDF parsing وweb search وتقنية RAG لإسناد المحتوى، وLLM structured output لتوزيع الشرائح، وrouting agent يقرر لكل شريحة إعادة استخدام صور المستند أو البحث online أو توليد صور جديدة عبر VLMs.',
        'أطلقت نظام Agentic Process Automation (APA) متكامل يتيح للمستخدمين بناء executable workflows كاملة عبر الـ chat — بتنسيق LLM agents باستخدام LangGraph مع stateful checkpointing، ودمج خدمات خارجية (Salla وWhatsApp وSlack)، متجاوزًا الـ rule-based RPA التقليدي.',
        'بنيت production RAG pipeline مع dense vector retrieval عبر pgvector وQdrant، يتيح semantic search وfactual grounding لمخرجات الـ LLM.',
        'طوّرت أنظمة computer vision وgeospatial analytics متكاملة، تشمل satellite image segmentation وobject detection وchange detection لـ land cover mapping والمراقبة البيئية.',
        'أجريت fine-tuning لنماذج VLMs ونماذج foundational مفتوحة المصدر لمهام remote-sensing، وحسّنتها للنشر على edge devices (NVIDIA Jetson) باستخدام Docker.',
        'قُدت فريق الـ annotation: جمع المتطلبات وتوزيع المهام ومراجعتها للدقة، وأتمتة data collection وpreprocessing وvalidation لتجهيز datasets جاهزة للنماذج.',
      ],
      keywords: ['LangGraph', 'RAG', 'Agentic AI', 'LLMs', 'VLMs', 'pgvector', 'Qdrant', 'Docker'],
    },
    {
      role: 'مهندس ذكاء اصطناعي',
      company: 'Medsoft',
      location: 'عن بُعد',
      date: 'يناير 2023 — يناير 2025',
      logo: '/assets/logos/medsoft.jpeg',
      logoColor: '#7c3aed',
      points: [
        'بنيت نماذج 3D segmentation متقدمة باستخدام TensorFlow لتحسين دقة الـ medical imaging؛ ودرّبتها وقيّمتها على AWS SageMaker مع S3 storage.',
        'طبّقت Statistical Shape Modeling مع deep autoencoders (VAEs وGANs) لإجراء generative reconstruction وإنشاء synthetic data.',
        'نفّذت أسلوب 3D landmarking مبتكر باستخدام 2D U-Net، يدمج computer graphics مع deep learning لتقليل الـ training overhead.',
        'تعاونت عن قرب مع فرق دولية، من بينها فريق DePuy Synthes R&D في Johnson & Johnson، لتقديم حلول مبتكرة في الـ medical imaging والـ reconstruction.',
      ],
      keywords: ['TensorFlow', 'AWS SageMaker', 'U-Net', 'GANs', 'VAEs', '3D Segmentation'],
    },
    {
      role: 'مهندس رؤية حاسوبية',
      company: 'DevisionX',
      location: 'عن بُعد',
      date: 'نوفمبر 2022 — يناير 2023',
      logo: '/assets/logos/devisionx.jpeg',
      logoColor: '#059669',
      points: [
        'طوّرت automated machine learning pipeline لـ image classification وobject detection وsegmentation باستخدام TensorFlow AutoML، مبسّطًا training وbenchmarking النماذج.',
      ],
      keywords: ['AutoML', 'YOLO', 'TensorFlow', 'Keras-tuner'],
    },
  ],

  projects: [
    {
      title: '3D Individual Teeth Segmentation',
      categoryKey: 'medical',
      category: 'طبي',
      link: '#',
      description:
        'تجزئة instance لكل سنّة على حدة من مجسمات المسح الفموي ثلاثي الأبعاد (intraoral scans). يتم اكتشاف كل سنّة وتمييزها مباشرةً على الـ mesh الخام، مما يتيح تحليلًا لكل سنّة في تطبيقات تقويم الأسنان. يمكنك تدوير وتكبير مسح حقيقي للفك السفلي بالأسفل.',
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
        'مجموعة أدوات مدعومة بالـ AI لتحديد swallowing kinematics آليًا في Videofluoroscopic Swallowing Study (VFSS). تستخدم optical flow وaction recognition وobject tracking وimage segmentation لمساعدة الأطباء في تشخيص الـ dysphagia، مع تقليل زمن الفحص الأولي بأكثر من 50%.',
      keywords: ['Medical Imaging', 'Deep Learning', 'Computer Vision', 'Healthcare AI'],
    },
  ],

  education: [
    {
      school: 'جامعة القاهرة',
      faculty: 'كلية الهندسة',
      degree: 'بكالوريوس الهندسة الطبية الحيوية',
      date: '2017 - 2022',
    },
  ],
}

export default ar
