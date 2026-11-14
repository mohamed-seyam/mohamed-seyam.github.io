// Arabic content. Same shape as en.js. Technical terms are kept in English
// (RAG, prompt, agent, pipeline, segmentation...) as engineers read them.
const ar = {
  ui: {
    greeting: 'مرحبًا، أنا',
    available: 'متاح لفرص جديدة',
    resume: 'السيرة الذاتية',
    viewProject: 'عرض ←',
    viewDemo: 'عرض تفاعلي',
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
      openSource: 'مفتوح المصدر',
      publications: 'المنشورات',
      education: 'التعليم',
    },
  },

  profile: {
    name: 'محمد صيام',
    title: 'مهندس ذكاء اصطناعي | النماذج اللغوية والأنظمة الوكيلة والذكاء الصوتي',
    photo: '/assets/images/me.jpeg',
    summary:
      'مهندس ذكاء اصطناعي بخبرة تزيد عن 4 سنوات في إطلاق أنظمة AI إنتاجية: voice agents عربية تعمل on-premise، ومنصات RAG مُسندة (grounded) مع guardrails مدمجة، ونماذج computer vision. أركّز على النشر الذاتي والسيادي (sovereign) حيث لا تغادر البيانات بيئة العميل.',
    email: 'mohamedseyam099@gmail.com',
    phone: '+20 109 098 2078',
    location: 'القاهرة، مصر',
    resume: '/assets/mohamed_seyam_cv.pdf',
    links: {
      linkedin: 'https://www.linkedin.com/in/mohamed-seyam-bb185a230/',
      github: 'https://github.com/mohamed-seyam',
    },
  },

  navLinks: [
    { label: 'نبذة', href: '/#about' },
    { label: 'الخبرة', href: '/#experience' },
    { label: 'مفتوح المصدر', href: '/#open-source' },
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
      groups: [
        {
          title: 'مشاريع Agentic AI',
          items: [
            {
              title: 'بليغ',
              demo: 'baleegh',
              subtitle: 'منصة Voice Agent باللهجة النجدية',
              points: [
                'صمّمت voice agent نجديًا فوريًا ذاتي الاستضافة: STT عربي (Cohere Transcribe)، وgemma-4-12b على vLLM مع أداة RAG فوق ناصح، وTTS نجدي مضبوط بـ LoRA (Fasee7 على VoxCPM2) مع voice cloning.',
                'مبني على FastAPI وخادم LiveKit ذاتي الاستضافة، مع Silero VAD وturn detection يعملان محليًا داخل الوكيل؛ ويتشارك الـ STT والـ TTS والـ LLM معالج GPU واحدًا بسعة 24 GB.',
                'خفّضت زمن أول صوت بنسبة 56% من 2.27 إلى 1.0 ثانية (median) ببثّ صوت الـ TTS أثناء توليده؛ ويُزيل warm-up متوازٍ للنماذج أثناء اتصال الغرفة بطء أول دور البالغ 10.8 ثانية.',
                'أضفت خطوة حتمية لتحويل النص إلى صيغة قابلة للنطق تكتب الأرقام والرموز والـ markdown كلمات نجدية، فلا يُسقط المُركِّب الصوتي أي جزء من الرد.',
              ],
            },
            {
              title: 'ناصح',
              demo: 'naseh',
              subtitle: 'منصة RAG سيادية بالعربية والإنجليزية',
              points: [
                'صمّمت منصة RAG ذاتية الاستضافة من 5 microservices (FastAPI وQdrant وDocling وNext.js).',
                'تعمل بالكامل on-premise مع LLM محلي (Ollama وvLLM) دون أي AI API خارجي، ومتوافقة مع قواعد إقامة البيانات في السعودية.',
                'أضفت layout-aware parsing لـ 33 صيغة وhybrid retrieval (dense + BM25) مدمجًا عبر RRF.',
                'أمان الـ AI: ‏grounding صارم مع الرفض، واستشهادات مرقّمة، وtenant isolation مطبّق داخل الـ vector search.',
                'صمّمت طبقات guardrails متعددة: كشف prompt injection، وإخفاء PII، وgroundedness checks.',
              ],
            },
            {
              title: 'PPGen',
              demo: 'ppgen',
              subtitle: 'مولّد العروض التقديمية بالذكاء الاصطناعي',
              points: [
                'أطلقت أداة متكاملة ذاتية الاستضافة تولّد عرضًا تقديميًا كاملًا من prompt واحد.',
                'تُسند المحتوى عبر PDF parsing وweb search وRAG، وتوزّعه على الشرائح باستخدام LLM structured output.',
                'يقرر routing agent لكل شريحة إعادة استخدام صور المستند أو البحث online أو توليد صور جديدة عبر VLMs.',
              ],
            },
            {
              title: 'APA',
              demo: 'apa',
              subtitle: 'Agentic Process Automation',
              points: [
                'أطلقت نظامًا يتيح للمستخدمين بناء executable workflows كاملة عبر الـ chat، متجاوزًا الـ rule-based RPA التقليدي.',
                'ينسّق LLM agents باستخدام LangGraph مع stateful checkpointing عبر pipelines للاستدلال واتخاذ القرار.',
                'يدمج خدمات خارجية مثل Salla وWhatsApp وSlack.',
              ],
            },
          ],
        },
        {
          title: 'مشاريع Computer Vision',
          items: [
            'أجريت fine-tuning لنماذج Vision-Language ونماذج foundation مفتوحة المصدر لـ land cover mapping والمراقبة البيئية.',
            'طوّرت أنظمة satellite image segmentation وobject detection وchange detection، إضافةً إلى generative models لإزالة الضبابية (deblurring/dehazing).',
            'حسّنت نماذج deep learning للنشر على NVIDIA Jetson، وحزّمتها باستخدام Docker.',
            'قُدت فريق الـ annotation: جمع المتطلبات وتوزيع المهام ومراجعتها، وأتمتة data collection وpreprocessing وvalidation.',
          ],
        },
      ],
      keywords: ['Voice AI', 'LiveKit', 'vLLM', 'RAG', 'Guardrails', 'LangGraph', 'Agentic AI', 'Qdrant', 'VLMs', 'Docker'],
    },
    {
      role: 'مهندس ذكاء اصطناعي',
      company: 'Medsoft',
      location: 'عن بُعد',
      date: 'يناير 2023 — يناير 2025',
      logo: '/assets/logos/medsoft.jpeg',
      logoColor: '#7c3aed',
      groups: [
        {
          title: 'مشاريع التخطيط الجراحي الافتراضي (VSP)',
          intro:
            'بنيت جانب الذكاء الاصطناعي في منظومة virtual surgical planning: تحويل صور المريض إلى تشريح ثلاثي الأبعاد مُجزّأ، ومعالم تشريحية، وأشكال مُعاد بناؤها يستخدمها الجرّاحون لتخطيط العملية قبل دخول غرفة العمليات.',
          items: [
            {
              title: 'تجزئة الأسنان ثلاثية الأبعاد',
              subtitle: 'مسح فموي (Intraoral Scans)',
              demo: 'teeth',
              points: [
                'بنيت نماذج 3D segmentation تكتشف كل سنّة وتميّزها مباشرةً على mesh المسح الفموي، فتحصل منظومة التخطيط على نموذج ثلاثي الأبعاد مستقل وقابل للتعديل لكل سنّة.',
                'أتاحت تحليل كل سنّة وتخطيط حركتها في حالات التقويم والجراحة.',
                'درّبت وقيّمت نماذج كبيرة باستخدام TensorFlow على AWS SageMaker مع S3 storage.',
                'أضفت 3D landmark detection باستخدام نموذج 2D U-Net، بدمج computer graphics مع deep learning؛ وتُستخدم المعالم نقاطًا مرجعية للقياسات والتخطيط.',
                'قلّلت الـ training overhead لعملية الـ 3D landmarking.',
              ],
            },
            {
              title: 'إعادة البناء التوليدية للأشكال',
              subtitle: 'Statistical Shape Modeling',
              points: [
                'دمجت Statistical Shape Modeling مع deep autoencoders (VAEs وGANs) لإعادة بناء الأشكال التشريحية توليديًا.',
                'قدّرت الشكل السليم المرجّح للأجزاء التشريحية المفقودة أو المتضرّرة، ليكون مرجعًا للجرّاح عند تخطيط إعادة البناء.',
                'ولّدت synthetic data لتوسيع مجموعات التدريب الطبية المحدودة.',
              ],
            },
          ],
        },
        {
          title: 'التعاون',
          items: [
            'تعاونت عن قرب مع فرق دولية، من بينها فريق DePuy Synthes R&D في Johnson & Johnson، في الـ medical imaging والـ reconstruction للتخطيط الجراحي.',
          ],
        },
      ],
      keywords: ['Virtual Surgical Planning', '3D Segmentation', '3D Landmarks', 'Statistical Shape Modeling', 'U-Net', 'GANs', 'VAEs', 'TensorFlow', 'AWS SageMaker'],
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
      id: 'baleegh',
      title: 'بليغ — Voice Agent باللهجة النجدية',
      categoryKey: 'llm',
      category: 'نماذج لغوية ووكلاء',
      link: '#',
      description:
        'وكيل صوتي نجدي فوري ذاتي الاستضافة. يتحدّث المتصفح مع غرفة LiveKit ذاتية الاستضافة؛ ويكتشف الوكيل نهاية كل دور محليًا (Silero VAD)، ويحوّل الكلام إلى نص عبر Cohere Transcribe Arabic، ويجيب بـ gemma-4-12b على vLLM مستعينًا بأداة RAG فوق ناصح، ثم يكتب الأرقام كلمات نجدية ويبثّ صوتًا نجديًا — كل ذلك على GPU واحد 24 GB، مع خفض زمن أول صوت من 2.27 إلى 1.0 ثانية. تابع دورًا حقيقيًا من الـ benchmark عبر المنظومة بالأسفل.',
      keywords: ['Voice AI', 'LiveKit', 'vLLM', 'gemma-4', 'Silero VAD', 'STT', 'TTS', 'RAG', 'FastAPI'],
      demo: 'baleegh',
    },
    {
      id: 'naseh',
      title: 'ناصح — منصة RAG سيادية',
      categoryKey: 'llm',
      category: 'نماذج لغوية ووكلاء',
      link: '#',
      description:
        'منصة RAG ذاتية الاستضافة تعمل بالكامل on-premise مع LLM محلي ودون أي AI API خارجي، متوافقة مع قواعد إقامة البيانات في السعودية. يحلّل Docling ‏33 صيغة إلى مقاطع تراعي التخطيط، ويُخزَّن كل مقطع في Qdrant كمتجه dense ومتجه BM25، ويمر كل سؤال عبر hybrid retrieval مدمج بـ RRF داخل نطاق مشروعه فقط. الإجابات من المقاطع المسترجعة وحدها مع استشهادات مرقّمة تعود إلى الصفحة، وإن لم تحتوِ المستندات على الإجابة يقول ناصح ذلك بدل التخمين. شاهد فهرسة مشروع والإجابة عن أسئلته بالأسفل.',
      keywords: ['RAG', 'Qdrant', 'Hybrid Search', 'BM25', 'RRF', 'Docling', 'vLLM', 'Next.js', 'On-premise'],
      demo: 'naseh',
    },
    {
      id: 'ppgen',
      title: 'ppgen — AI Presentation Generator',
      categoryKey: 'llm',
      category: 'نماذج لغوية ووكلاء',
      link: '#',
      description:
        'أداة agentic ذاتية الاستضافة تحوّل prompt واحد إلى عرض تقديمي كامل — بدمج PDF parsing وweb search وRAG grounding وLLM structured output لتوزيع الشرائح، وrouting agent يقرر لكل شريحة إعادة استخدام الصور أو البحث online أو توليد صور جديدة عبر VLMs. جرّب العرض التفاعلي بالأسفل.',
      keywords: ['LLM', 'Agentic AI', 'RAG', 'LangGraph', 'VLMs'],
      demo: 'ppgen',
    },
    {
      id: 'apa',
      title: 'APA — Agentic Process Automation',
      categoryKey: 'llm',
      category: 'نماذج لغوية ووكلاء',
      link: '#',
      description:
        'منصة Agentic Process Automation متكاملة: تصف الأتمتة التي تريدها بلغة طبيعية، فيقوم LangGraph agent pipeline بتحليل الـ prompt، واسترجاع الخدمات المناسبة عبر RAG، وتخطيط الخطوات، واستخراج الشروط، وربط workflow قابل للتنفيذ ومُتحقَّق منه — متجاوزًا الـ rule-based RPA التقليدي. شاهد بناء وتشغيل أتمتة مُولّدة على الـ canvas بالأسفل.',
      keywords: ['Agentic AI', 'LangGraph', 'LLMs', 'RAG', 'Workflow Automation', 'Salla', 'Odoo'],
      demo: 'apa',
    },
    {
      id: 'teeth',
      title: '3D Individual Teeth Segmentation',
      categoryKey: 'medical',
      category: 'طبي',
      link: '#',
      description:
        'تجزئة instance لكل سنّة على حدة من مجسمات المسح الفموي ثلاثي الأبعاد (intraoral scans). يتم اكتشاف كل سنّة وتمييزها مباشرةً على الـ mesh الخام، مما يتيح تحليلًا لكل سنّة في تطبيقات تقويم الأسنان. وتُحدَّد المعالم ثلاثية الأبعاد باستخدام 2D U-Net بدمج computer graphics مع deep learning لتقليل الـ training overhead. يمكنك تدوير وتكبير مسح حقيقي للفك السفلي بالأسفل.',
      keywords: ['3D Mesh', 'Instance Segmentation', 'PointNet', '3D Landmarks', '2D U-Net', 'Dental AI', 'PyTorch'],
      model: '/assets/models/teeth-lower.obj',
    },
  ],

  openSource: [
    {
      title: 'Needle — Necessary Elements for Deep Learning',
      link: 'https://github.com/mohamed-seyam/needle',
      description:
        'إطار deep learning على غرار PyTorch مبني من الصفر بلغتي Python وC++ — يشمل autograd وtensor operations وbackpropagation وneural network primitives.',
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
