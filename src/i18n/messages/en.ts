export const en = {
  common: {
    language: "Language",
    english: "English",
    spanish: "Spanish",
  },
  hero: {
    badges: [
      "🛡️ Built for the U.S.",
      "⚡ Fast",
      "🔒 Private",
      "✅ No PHI",
    ],
    title: "Protect your family and business from AI scams — in seconds",
    subtitle:
      "Forward any suspicious message, audio, or email. We tell you if it's a scam and what to do next.",
    primaryCta: "Start Free Trial",
    secondaryCta: "Watch 60s Demo",
    demoLabel: "Watch demo",
  },
  featuresSection: {
    eyebrow: "Total protection",
    heading: "What makes IA Shield unique",
    description:
      "Every verification combines multiple defensive layers to deliver a clear, actionable response no matter the attack channel.",
    items: [
      {
        title: "🎯 Instant Detection",
        bullets: [
          "Analyzes messages, emails, and audio in seconds",
          "AI trained on thousands of real scams",
        ],
      },
      {
        title: "📊 Clear Explanations",
        bullets: [
          "No technical jargon",
          "Specific reasons and actionable advice",
        ],
      },
      {
        title: "🔔 Intelligent Alerts",
        bullets: [
          "Email, Telegram, and Slack",
          "Only when it truly matters",
        ],
      },
    ],
  },
  pricing: {
    title: "One clear plan, total protection",
    subtitle: "All plans include a 7-day free trial.",
    foundersBadge: "FOUNDERS - $10/mo for life (first 100)",
    toggle: {
      personal: "Personal",
      business: "Business",
    },
    note: "Switch to {plan} anytime.",
    plans: {
      personal: {
        label: "Personal · Lite",
        title: "AI Scam Detector Lite",
        subtitle: "Instant protection for your family",
        price: "$10/mo",
        badge: "FOUNDERS - $10/mo for life (first 100)",
        features: [
          "AI Scam Detector Lite",
          "Telegram bot",
          "Basic detection",
          "Email alerts",
          "7-day free trial",
        ],
      },
      business: {
        label: "Business · Pro",
        title: "IA Shield Pro",
        subtitle: "Full visibility for your team",
        price: "$20/mo",
        features: [
          "IA Shield Pro",
          "Advanced email phishing detection",
          "Full web dashboard",
          "Multi-channel alerts (Email, Telegram, Slack)",
          "30-day history",
          "7-day free trial",
        ],
      },
    },
  },
  dashboard: {
    welcome: "Welcome back",
    title: "Verification dashboard",
    planLabel: "Plan {plan}",
    statusLabel: "Status: {status}",
    loading: "Loading dashboard...",
    unauthenticated: {
      title: "Sign in to continue",
      description: "You need an IA Shield account to review your verifications.",
      cta: "Go to login",
    },
    sidebar: {
      brand: "IA Shield",
      title: "Dashboard",
      nav: {
        dashboard: "Dashboard",
        history: "History",
        viajard: "ViajaRD",
        settings: "Settings",
        logout: "Logout",
      },
    },
    stats: {
      total: "Total checks",
      scams: "Scams detected",
      safe: "Safe",
      pending: "Pending",
    },
    filters: {
      all: "All",
      estafa: "Scam",
      sospechoso: "Suspicious",
      seguro: "Safe",
    },
    searchPlaceholder: "Search by source or text",
    table: {
      date: "Date",
      source: "Source",
      label: "Label",
      score: "Score",
      actions: "Actions",
      viewDetails: "View details",
      status: "Status",
      messageAnalyzed: "Analyzed message",
      updated: "Updated",
      modalTitle: "Verification details",
      unknownSource: "Unknown",
      noContent: "No content",
      completed: "Completed",
    },
    empty: {
      title: "No verifications yet",
      description:
        "Send your first suspicious message to see live detections here.",
      cta: "Start verification",
      secondaryCta: "Explore plans",
    },
    academy: {
      title: "IA Academy",
      description:
        "Interactive lessons, phishing simulations, and deepfake drills for subscribers.",
      locked: {
        eyebrow: "Subscribers only",
        title: "Unlock IA Academy",
        description:
          "Upgrade your plan to access training modules, gamified challenges, and monthly simulations.",
        cta: "Upgrade plan",
      },
      freePreview: {
        eyebrow: "Level 1 unlocked",
        title: "Try the first mission",
        description:
          "Complete the intro lesson and run your first phishing simulation. Upgrade to unlock the full academy.",
      },
      levels: {
        free: "Free tier",
        basic: "Basic · PRO",
        business: "Intermediate · BUSINESS",
        enterprise: "Advanced · ENTERPRISE",
      },
      gamification: {
        streakLabel: "Day streak",
        xpLabel: "XP earned",
        badgeLabel: "Current badge",
        medalsLabel: "Medals unlocked",
      },
      medals: {
        hunter: "Phishing Hunter",
        firewall: "AI Firewall",
        trainee: "SOC Trainee",
      },
      modules: [
        {
          id: "phishing-basics",
          title: "Phishing fundamentals",
          tag: "Theory · 10 min",
          summary: "Spot spoofed domains, urgent language, and fake login flows.",
        },
        {
          id: "sim-drill",
          title: "Monthly phishing simulation",
          tag: "Simulation · 5 min",
          summary: "Practice with realistic scam emails crafted by IA Shield.",
        },
        {
          id: "deepfake-alert",
          title: "Deepfake & voice scams",
          tag: "Vishing · 8 min",
          summary: "Train your ear to detect urgent voice cloning attempts.",
        },
      ],
      actions: {
        startLesson: "Open lesson card",
        startSimulation: "Run phishing simulation",
        generating: "Generating simulation...",
        lastSimulation: "Latest phishing simulation",
        empty: "Run a simulation to get a sample training email.",
        error: "Could not generate training. Try again soon.",
        indicators: "Risk indicators",
        levelTag: "Estimated level",
      },
    },
  },
  navbar: {
    public: {
      how: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      demo: "Watch demo",
      authTrigger: "Log in / Register",
      mobileTrigger: "Sign in",
    },
    private: {
      dashboard: "Dashboard",
      pricing: "Pricing",
      support: "Support",
    },
    account: {
      account: "My account",
      password: "Change password",
      logout: "Sign out",
      userFallback: "User",
    },
  },
  howItWorks: {
    hero: {
      eyebrow: "How it works",
      title: "See how IA Shield dissects every message before you tap",
      subtitle:
        "From the moment you forward a suspicious email, audio, or DM, our layered defenses go to work. Here’s what happens behind the scenes.",
      primaryCta: "Start a free check",
      secondaryCta: "View pricing",
    },
    steps: [
      {
        title: "1. Submit any suspicious content",
        description:
          "Forward the email, upload a screenshot, paste a WhatsApp chat, or send an audio note directly from Telegram or the web dashboard.",
      },
      {
        title: "2. Multi-channel enrichment",
        description:
          "We fingerprint links, extract metadata, transcribe audio with Whisper, and compare against thousands of known scam patterns.",
      },
      {
        title: "3. AI verdict + human guidance",
        description:
          "Our GPT‑4o classification, heuristics, and VirusTotal checks combine into a clear verdict, score, and next-action advice.",
      },
      {
        title: "4. Instant alerts everywhere",
        description:
          "Receive the result in under a minute via email, Telegram, Slack, or inside the dashboard—plus escalation for high-risk cases.",
      },
    ],
    highlights: {
      title: "Built for every channel your family or team uses",
      cards: [
        {
          title: "Omnichannel intake",
          description:
            "Web dashboard, Telegram bot, email forwarding, and IMAP worker for corporate inboxes.",
        },
        {
          title: "Layered analysis",
          description:
            "OpenAI GPT-4o-mini, heuristics, VirusTotal, SPF/DKIM parsing, and our proprietary scam graph.",
        },
        {
          title: "Actionable responses",
          description:
            "Plain-language explanation, reasons in EN/ES, verification score, and recommended next steps.",
        },
      ],
    },
    coverage: {
      title: "Channels we cover today",
      items: ["Email phishing", "SMS / WhatsApp", "Social DMs", "Audio notes", "Links & attachments"],
    },
    cta: {
      title: "Ready to see IA Shield in action?",
      description:
        "Spin up a 7-day free trial, connect your preferred channels, and stop scams before they hit your family or business.",
      primary: "Launch dashboard",
      secondary: "Talk to our team",
    },
  },
};
