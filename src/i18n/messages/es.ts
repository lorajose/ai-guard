export const es = {
  common: {
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
  },
  hero: {
    badges: [
      "🛡️ Hecho para EE.UU.",
      "⚡ Rápido",
      "🔒 Privado",
      "✅ Sin PHI",
    ],
    title: "Protege a tu familia y tu negocio de estafas con IA — en segundos",
    subtitle:
      "Reenvía cualquier mensaje, audio o email sospechoso. Te decimos si es estafa y qué hacer.",
    primaryCta: "Comenzar gratis",
    secondaryCta: "Ver demo de 60s",
  },
  featuresSection: {
    eyebrow: "Protección total",
    heading: "Lo que hace a IA Shield único",
    description:
      "Cada verificación combina múltiples capas defensivas para darte una respuesta clara y accionable sin importar el canal.",
    items: [
      {
        title: "🎯 Detección instantánea",
        bullets: [
          "Analiza mensajes, emails y audios en segundos",
          "IA entrenada en miles de estafas reales",
        ],
      },
      {
        title: "📊 Explicación clara",
        bullets: [
          "Sin jerga técnica",
          "Razones específicas y consejos accionables",
        ],
      },
      {
        title: "🔔 Alertas inteligentes",
        bullets: [
          "Email, Telegram y Slack",
          "Solo cuando realmente importa",
        ],
      },
    ],
  },
  pricing: {
    title: "Un plan claro, protección total",
    subtitle: "Todos los planes incluyen 7 días de prueba gratis.",
    foundersBadge: "FOUNDERS - $10/mes de por vida (primeros 100)",
    toggle: {
      personal: "Personal",
      business: "Business",
    },
    note: "Cambia a {plan} en cualquier momento.",
    plans: {
      personal: {
        label: "Plan Personal · Lite",
        title: "AI Scam Detector Lite",
        subtitle: "Protección instantánea para tu familia",
        price: "$10/mes",
        badge: "FOUNDERS - $10/mes de por vida (primeros 100)",
        features: [
          "AI Scam Detector Lite",
          "Telegram bot",
          "Detección básica",
          "Alertas por email",
          "7 días de prueba gratis",
        ],
      },
      business: {
        label: "Plan Business · Pro",
        title: "IA Shield Pro",
        subtitle: "Visibilidad total para tu equipo",
        price: "$20/mes",
        features: [
          "IA Shield Pro",
          "Detección avanzada de phishing en emails",
          "Panel web completo",
          "Alertas múltiples (Email, Telegram, Slack)",
          "Histórico 30 días",
          "7 días de prueba gratis",
        ],
      },
    },
  },
  dashboard: {
    welcome: "Bienvenido de nuevo",
    title: "Panel de verificaciones",
    planLabel: "Plan {plan}",
    statusLabel: "Estado: {status}",
    loading: "Cargando dashboard...",
    unauthenticated: {
      title: "Inicia sesión para continuar",
      description: "Necesitas una cuenta de IA Shield para ver tus verificaciones.",
      cta: "Ir a login",
    },
    sidebar: {
      brand: "IA Shield",
      title: "Dashboard",
      nav: {
        dashboard: "Dashboard",
        history: "Historial",
        settings: "Configuración",
        logout: "Cerrar sesión",
      },
    },
    stats: {
      total: "Verificaciones totales",
      scams: "Estafas detectadas",
      safe: "Seguras",
      pending: "Pendientes",
    },
    filters: {
      all: "Todas",
      estafa: "Estafa",
      sospechoso: "Sospechoso",
      seguro: "Seguro",
    },
    searchPlaceholder: "Buscar por origen o texto",
    table: {
      date: "Fecha",
      source: "Origen",
      label: "Label",
      score: "Score",
      actions: "Acciones",
      viewDetails: "Ver detalles",
      status: "Estado",
      messageAnalyzed: "Mensaje analizado",
      updated: "Actualizado",
      modalTitle: "Detalles de verificación",
      unknownSource: "Desconocido",
      noContent: "Sin contenido",
      completed: "Completado",
    },
    empty: {
      title: "Sin verificaciones todavía",
      description:
        "Envía tu primer mensaje sospechoso para verlo reflejado aquí en tiempo real.",
      cta: "Comenzar verificación",
    },
  },
  navbar: {
    public: {
      how: "Cómo funciona",
      pricing: "Precios",
      faq: "FAQ",
      demo: "Ver demo",
      authTrigger: "Login / Registro",
      mobileTrigger: "Entrar",
    },
    private: {
      dashboard: "Dashboard",
      pricing: "Planes",
      support: "Soporte",
    },
    account: {
      account: "Mi cuenta",
      password: "Cambiar contraseña",
      logout: "Cerrar sesión",
      userFallback: "Usuario",
    },
  },
  howItWorks: {
    hero: {
      eyebrow: "Cómo funciona",
      title: "Así analiza IA Shield cada mensaje antes de que respondas",
      subtitle:
        "En cuanto reenvías un email, audio o chat sospechoso, nuestras defensas multinivel se activan. Este es el proceso paso a paso.",
      primaryCta: "Enviar primer check",
      secondaryCta: "Ver planes",
    },
    steps: [
      {
        title: "1. Envía el contenido sospechoso",
        description:
          "Reenvía el email, sube un screenshot, pega un chat de WhatsApp o comparte un audio desde Telegram o el panel web.",
      },
      {
        title: "2. Enriquecimiento multicanal",
        description:
          "Extraemos metadatos, analizamos links, transcribimos audio con Whisper y comparamos con miles de estafas conocidas.",
      },
      {
        title: "3. Veredicto IA + guía humana",
        description:
          "La clasificación GPT‑4o, heurísticas y VirusTotal se combinan en un veredicto claro, score y consejo accionable.",
      },
      {
        title: "4. Alertas en segundos",
        description:
          "Recibes la respuesta en menos de un minuto por email, Telegram, Slack o directamente en el dashboard.",
      },
    ],
    highlights: {
      title: "Diseñado para cada canal que usa tu familia o equipo",
      cards: [
        {
          title: "Ingreso omnicanal",
          description:
            "Dashboard web, bot de Telegram, reenvío de emails y worker IMAP para cuentas corporativas.",
        },
        {
          title: "Análisis en capas",
          description:
            "OpenAI GPT-4o-mini, heurísticas, VirusTotal, análisis SPF/DKIM y nuestro grafo propietario de estafas.",
        },
        {
          title: "Respuestas accionables",
          description:
            "Explicación sin jerga, razones en EN/ES, puntaje de riesgo y siguientes pasos recomendados.",
        },
      ],
    },
    coverage: {
      title: "Cobertura actual de canales",
      items: [
        "Phishing por email",
        "SMS / WhatsApp",
        "DMs sociales",
        "Notas de voz",
        "Links y adjuntos",
      ],
    },
    cta: {
      title: "¿Listo para ver IA Shield en vivo?",
      description:
        "Activa la prueba gratis de 7 días, conecta tus canales y detén las estafas antes de que afecten a tu familia o negocio.",
      primary: "Abrir dashboard",
      secondary: "Hablar con el equipo",
    },
  },
};
