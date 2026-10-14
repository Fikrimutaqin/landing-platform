import { BlockItem } from '../builder/ElementorSidebar';

export const ALEX_TRAVIS_TEMPLATE: BlockItem[] = [
  // 1. STICKY NAV
  {
    id: 'blk_navbar_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'navbar',
      brandName: 'Alex Travis',
      logoInitials: 'AT',
      ctaText: 'Hire Me!',
      navLinks: [
        { label: 'About', href: '#about' },
        { label: 'Project', href: '#projects' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Store', href: '#store' },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#111111' },
  },

  // 2. HERO SECTION
  {
    id: 'blk_hero_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'hero',
      badgeText: 'Hi, Alex Travis Here',
      headlineDark: 'A creative product designer',
      headlineMuted: 'with modern touch based in San Francisco.',
      subheadline:
        'Transforming ambitious ideas into clean, functional, and user-centric digital experiences with high attention to detail and conversion performance.',
      primaryCta: 'Hire Me!',
      secondaryCta: 'See My Portfolio',
      designerName: 'Alex Travis',
      designerTitle: 'Principal Product Designer',
      designerLocation: 'NY, New York',
      rating: '★ 4.9 (120+ reviews)',
      roiGrowth: '+140% Avg. ROI',
      topBadge: 'Available for work',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    styles: { backgroundColor: '#ffffff', textColor: '#111111' },
  },

  // 3. STATS ROW (4 columns: 90%, 200+, 2018, 80+)
  {
    id: 'blk_stats_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'stats',
      stats: [
        { value: '90%', label: 'Client Satisfaction' },
        { value: '200+', label: 'Projects Completed' },
        { value: '2018', label: 'Year Established' },
        { value: '80+', label: 'Global Clients' },
      ],
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 4. ABOUT (Ring Graphic & Bio)
  {
    id: 'blk_performance_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'performance',
      score: '98%',
      scoreLabel: 'Tools Performance',
      headlineDark: 'Designing digital experiences',
      headlineMuted: 'that balance beauty with business metrics.',
      desc1:
        'I am a senior product designer and design engineer with over 8 years of experience building scalable design systems and conversion-focused applications.',
      desc2:
        'My approach pairs deep qualitative user research with rigorous front-end implementation, ensuring every prototype looks stunning and functions flawlessly in production.',
      ctaText: 'About Me',
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 5. TOOLS ROW (Webflow 46%, Figma 32%, ChatGPT 22%)
  {
    id: 'blk_trust_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'trust',
      tools: [
        { name: 'Webflow', percentage: '46%' },
        { name: 'Figma', percentage: '32%' },
        { name: 'ChatGPT', percentage: '22%' },
      ],
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 6. SERVICES (Left List + Right Figma Card)
  {
    id: 'blk_services_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'services',
      headlineDark: 'Comprehensive',
      headlineMuted: 'design & development services.',
      intro:
        'From initial research and wireframes to production-grade component tokens and interactive websites.',
      services: [
        {
          number: '01.1',
          title: 'UI/UX Design',
          desc: 'User research, interactive wireframing, high-fidelity prototypes, and usability testing.',
        },
        {
          number: '01.2',
          title: 'Design Systems',
          desc: 'Component tokens, variable architecture, responsive layout rules, and documentation.',
        },
        {
          number: '01.3',
          title: 'Web Development',
          desc: 'Clean semantic HTML, modern CSS architecture, Next.js / Webflow, and micro-interactions.',
        },
      ],
      cardTitle: 'UI/UX Design',
      cardBadge: 'Figma',
      cardSubtitle: 'End-to-end design execution tailored for scalable venture-backed startups.',
      cardCta: 'Start a Project',
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 7. TRUST BAR (Avatars + Rating + Logos)
  {
    id: 'blk_process_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'process',
      proofTitle: 'Trusted by 200+ clients worldwide',
      proofRating: '★★★★★ 4.8 Rating',
      logos: ['STRIPE', 'LINEAR', 'VERCEL', 'RAYCAST', 'SUPABASE', 'AIRBNB'],
    },
    styles: { backgroundColor: '#fafafa' },
  },

  // 8. PROJECTS (Selected Projects 23' <-> 25')
  {
    id: 'blk_portfolio_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'portfolio',
      headlineDark: 'Selected',
      headlineMuted: "Projects 23' ↔ 25'",
      projects: [
        {
          name: 'Finova Mobile Banking',
          year: '2024',
          tag: 'Fintech UI/UX',
          imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Orbital DeFi Protocol',
          year: '2024',
          tag: 'Web3 Dashboard',
          hoverBadge: '+ View',
          imgUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Lumix Creative Canvas',
          year: '2023',
          tag: 'AI Studio System',
          imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 9. PRICING (Basic $4,650 Light & Business $2,940 Dark + 3-column perks)
  {
    id: 'blk_pricing_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'pricing',
      headlineDark: 'Flexible plans',
      headlineMuted: 'tailored to your exact scale.',
      standard: {
        name: 'Basic',
        price: '$4,650',
        period: '/ month',
        badge: 'Basic',
        sprint: 'MONTHLY SPRINT',
        desc: 'Ideal for fast-moving startups needing consistent design execution.',
        features: [
          '1 active request at a time',
          'Fast 48-hour typical delivery',
          'Unlimited design revisions',
          'Figma source files & assets',
        ],
        cta: 'Get Started',
      },
      enterprise: {
        name: 'Business',
        price: '$2,940',
        period: '/ bi-weekly',
        badge: 'Business',
        sprint: 'DEDICATED CAPACITY',
        desc: 'For established teams scaling multiple product features simultaneously.',
        features: [
          '2 active requests at a time',
          'Priority 24-hour delivery',
          'Dedicated Slack channel access',
          'Production Next.js / CSS code',
        ],
        cta: 'Get Started',
      },
      perks: [
        { title: 'No Lock-in', text: 'Pause or cancel your subscription anytime with zero friction.' },
        { title: 'Fast Turnaround', text: 'Consistent delivery updates delivered every 24 to 48 hours.' },
        { title: '100% IP Ownership', text: 'All designs, tokens, and code belong entirely to your company.' },
      ],
    },
    styles: { backgroundColor: '#fafafa' },
  },

  // 10. TESTIMONIALS (Tab names row + Photo + Quote)
  {
    id: 'blk_testimonial_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'testimonial',
      tabs: ['Horizon AI', 'Linear Systems', 'Stripe Ecosystem', 'Raycast Labs'],
      activeTab: 'Horizon AI',
      badge: 'Client Review',
      quote:
        '“Alex completely transformed our product experience. Our conversion rate surged by 140% within 90 days after redesign. Highly recommended!”',
      author: 'David Sterling',
      role: 'VP of Product, Horizon AI',
      companyLogo: 'HORIZON',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 11. BLOG (Latest thoughts + 3 post rows)
  {
    id: 'blk_articles_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'articles',
      headlineDark: 'Latest thoughts',
      headlineMuted: '& design insights.',
      ctaText: 'Read All Blogs',
      featured: {
        tag: 'Design Engineering',
        title: 'How to Build High-Converting SaaS Landing Pages in 2024',
        imgUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
      },
      articles: [
        { date: 'April 2024', title: 'The subtle art of micro-interactions in design systems', linkText: 'Read More →' },
        { date: 'March 2024', title: 'Why typography is 90% of your visual brand identity', linkText: 'Read More →' },
        { date: 'February 2024', title: 'Future of AI-assisted UI tools for solo agency founders', linkText: 'Read More →' },
      ],
    },
    styles: { backgroundColor: '#fafafa' },
  },

  // 12. FAQ (4 Accordions using details)
  {
    id: 'blk_faq_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'faq',
      headlineDark: 'Frequently',
      headlineMuted: 'asked questions.',
      faqs: [
        {
          question: 'How quickly can we start on our first project?',
          answer:
            'Usually within 24 to 48 hours of onboarding. Once you subscribe, you receive access to your private Trello/Linear board to start requesting tasks immediately.',
        },
        {
          question: 'What does the typical turnaround time look like?',
          answer:
            'Most design requests and UI components are completed in 48 hours or less. Complex web apps or full landing pages are delivered in milestone-based sprints.',
        },
        {
          question: 'How does the monthly subscription work?',
          answer:
            'You pay a flat monthly fee with no hidden costs or long-term lock-in. You can pause or cancel your subscription at any time with a single click.',
        },
        {
          question: 'What tools and tech stack do you use?',
          answer:
            'Figma for UI/UX and design systems; Webflow and clean HTML5/CSS/JavaScript for responsive, performant websites.',
        },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#111111' },
  },

  // 13. SOCIAL ROW (Behance, Dribbble, LinkedIn, Instagram)
  {
    id: 'blk_guarantees_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'guarantees',
      socials: [
        { name: 'Behance', url: 'https://behance.net' },
        { name: 'Dribbble', url: 'https://dribbble.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com' },
        { name: 'Instagram', url: 'https://instagram.com' },
      ],
    },
    styles: { backgroundColor: '#ffffff' },
  },

  // 14. FOOTER (Dark #121212 with giant faded "Alex Travis.")
  {
    id: 'blk_footer_alex',
    type: 'CONTAINER',
    content: {
      alexSection: 'footer',
      brandName: 'Alex Travis',
      logoInitials: 'AT',
      badge: 'Available for work',
      text: 'Have a project in mind or want to consult on design systems? Let’s create something extraordinary together.',
      ctaText: 'Hire Me!',
      email: 'hello@alextravis.design',
      watermark: 'Alex Travis.',
      copyright: '© 2025 Alex Travis. All rights reserved.',
    },
    styles: { backgroundColor: '#121212', textColor: '#ffffff' },
  },
];
