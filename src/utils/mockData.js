export const MOCK_CATEGORIES = [
  'All Courses',
  'Digital Products & AI',
  'Online Business',
];

export const MOCK_COURSES = [
  {
    id: '1',
    title: 'Create & Sell Your First Digital Product With AI',
    subtitle: 'A 3-Hour Practical Session to Take You From Idea to Your First Digital Product',
    description:
      'Learn how to find the right niche, identify a real problem, create a digital product with AI, host it online, create promotional content, and launch Meta Ads.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    instructor: 'AI Digital Product Academy',
    instructor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    instructor_bio:
      'Digital entrepreneur & AI creator helping creators, professionals, and freelancers monetize their knowledge and launch profitable digital assets.',
    category: 'Digital Products & AI',
    price: 2499,
    discounted_price: 499,
    rating: 4.98,
    total_ratings: 2840,
    total_students: 12500,
    total_lessons: 14,
    duration: '3 Hours',
    level: 'Beginner-Friendly',
    language: 'English / Hindi Friendly',
    certificate: true,
    last_updated: '2026-09',
    is_bestseller: true,
    tagline: 'Practical • Beginner-Friendly • AI-Powered',
    what_youll_learn: [
      'Find your profitable niche that fits your skills, interests, and goals',
      'Identify a real problem that people actively pay to solve',
      'Use AI to generate and package high-value digital products in hours',
      'Host your product online and set up seamless automated delivery',
      'Create high-converting video and graphic promo content with AI',
      'Set up and launch high-ROI Meta Ads from scratch',
      'Scale from an MVP product into recurring digital sales',
    ],
    requirements: [
      'No technical knowledge or coding needed',
      'No physical inventory or business setup required',
      'A computer or smartphone with an internet connection',
    ],
    modules: [
      {
        id: 'm1',
        title: 'Module 1 — Introduction to Digital Products',
        lessons: [
          { id: 'l1', title: 'Lesson 1.1 — The Power of Digital Assets & Zero Inventory Economics', description: 'This lesson introduces the fundamentals of digital products and explains how they are structured, created, and delivered to customers with zero inventory overhead.', duration: '12:30', is_preview: true, is_completed: true, is_locked: false },
          { id: 'l2', title: 'Lesson 1.2 — The 5-Step Formula: Problem → Solution → Package → Promote → Sell', description: 'Learn the proven 5-step framework to transform your industry knowledge into high-margin digital assets that sell on autopilot.', duration: '14:20', is_preview: true, is_completed: false, is_locked: false },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2 — Niche Discovery',
        lessons: [
          { id: 'l3', title: 'Lesson 2.1 — Discovering Your Profitable Knowledge Niche', description: 'Step-by-step breakdown to identify underserved market gaps where customers are actively paying for actionable solutions.', duration: '15:40', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l4', title: 'Lesson 2.2 — AI Prompts for Market & Competitor Analysis', description: 'Leverage bespoke AI prompts to quickly extract competitor strengths, weaknesses, customer pain points, and pricing strategies.', duration: '18:15', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3 — Solve Problems with Digital Products',
        lessons: [
          { id: 'l5', title: 'Lesson 3.1 — Identifying High-Pain Urgent Problems Customers Pay For', description: 'Discover how to isolate urgent, burning problems that convert casual visitors into immediate buyers.', duration: '16:10', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l6', title: 'Lesson 3.2 — Structuring Your High-Value Solution & Offer', description: 'Package your knowledge into an irresistible offer structure with clear deliverables and bonuses.', duration: '14:50', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4 — Create Your Digital Product with AI',
        lessons: [
          { id: 'l7', title: 'Lesson 4.1 — AI-Powered Research, Planning & Outlining SOPs', description: 'Use structured prompt workflows to plan and outline standard operating procedures, guides, and worksheets in minutes.', duration: '22:40', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l8', title: 'Lesson 4.2 — Generating Ebooks, Guides, Templates & Toolkits Fast', description: 'Rapidly format, generate, and polish ready-to-sell toolkits, Notion dashboards, and downloadable templates.', duration: '25:10', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
      {
        id: 'm5',
        title: 'Module 5 — Host Your Digital Product',
        lessons: [
          { id: 'l9', title: 'Lesson 5.1 — Instant Hosting & Zero-Code Landing Pages', description: 'Deploy conversion-optimized product landing pages in under 30 minutes without writing a single line of code.', duration: '17:30', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l10', title: 'Lesson 5.2 — Automated Checkout, Payments & Digital File Delivery', description: 'Connect instant payment gateways with automated email receipt dispatch and direct digital asset delivery.', duration: '19:40', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
      {
        id: 'm6',
        title: 'Module 6 — Create Content & Sell Your Digital Product',
        lessons: [
          { id: 'l11', title: 'Lesson 6.1 — AI Prompts for Viral Video Scripts, Hooks & Posters', description: 'Master viral short-form copywriting prompts tailored for Reels, YouTube Shorts, and high-CTR social posters.', duration: '20:15', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l12', title: 'Lesson 6.2 — Organic Audience Building & Content Distribution', description: 'A systematic blueprint to build an organic following that reliably feeds targeted traffic into your sales funnel.', duration: '18:00', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
      {
        id: 'm7',
        title: 'Module 7 — Set Up & Launch Meta Ads',
        lessons: [
          { id: 'l13', title: 'Lesson 7.1 — Beginner-Friendly Meta Ads Setup & Campaign Architecture', description: 'Complete walkthrough of Meta Business Manager setup, CAPI configuration, and audience targeting architecture.', duration: '24:20', is_preview: false, is_completed: false, is_locked: true },
          { id: 'l14', title: 'Lesson 7.2 — Launching, Testing & Scaling Profitable ₹499 Ad Sets', description: 'Launch and scale profitable ad sets with small daily test budgets while maintaining high ROAS.', duration: '26:30', is_preview: false, is_completed: false, is_locked: true },
        ],
      },
    ],
    faqs: [
      {
        q: 'Is this suitable for beginners?',
        a: 'Yes. The session starts from the basics and takes you through the complete process step by step.',
      },
      {
        q: 'Do I need technical knowledge?',
        a: 'No. The session is designed to be beginner-friendly.',
      },
      {
        q: 'What type of digital product can I create?',
        a: 'You can create ebooks, guides, templates, checklists, workbooks, toolkits, prompt packs, courses, and other digital resources.',
      },
      {
        q: 'Will I learn how to use AI?',
        a: 'Yes. You\'ll get practical AI prompts and learn how AI can help you with niche discovery, product creation, and marketing.',
      },
      {
        q: 'Will I learn Meta Ads?',
        a: 'Yes. The session covers the basic setup and process for launching Meta Ads to promote your digital product.',
      },
      {
        q: 'How long is the session?',
        a: 'The complete session is approximately 3 hours.',
      },
      {
        q: 'How much does it cost?',
        a: 'The session is available for just ₹499 as a one-time payment.',
      },
    ],
  },
];

export const MOCK_ENROLLMENTS = [
  {
    course_id: '1',
    progress_percentage: 15,
    completed_lessons: ['l1'],
    last_watched_lesson: { id: 'l1', title: 'Lesson 1.1 — The Power of Digital Assets & Zero Inventory Economics', module_title: 'Module 1 — Introduction to Digital Products' },
    last_position_seconds: 180,
    purchased_at: '2026-09-01',
  },
];

export const MOCK_PURCHASES = [
  {
    id: 'ord_ai_digital_499',
    course_id: '1',
    course_title: 'Create & Sell Your First Digital Product With AI',
    course_thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    purchase_date: '01 Sep 2026',
    amount: 499,
    status: 'Paid',
    payment_method: 'UPI / Online Instant',
    invoice_url: '#',
  },
];

export const MOCK_USER = {
  id: 'u1',
  name: 'Digital Creator',
  email: 'creator@digitalproduct.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  joined: '2026-09-01',
};

export const MOCK_RECENT_ACTIVITY = [
  {
    id: 'a1',
    type: 'lesson_completed',
    title: 'Completed Lesson 1.1: The Power of Digital Assets',
    course: 'Create & Sell Your First Digital Product With AI',
    timestamp: 'Just now',
  },
];
