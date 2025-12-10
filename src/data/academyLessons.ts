export type AcademyLesson = {
  id: string;
  title: string;
  tag: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  xp: number;
  summary: string;
  objectives: string[];
  sections: {
    title: string;
    bullets: string[];
  }[];
  quiz: {
    id: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
};

export const levelOneLessons: AcademyLesson[] = [
  {
    id: "lesson-phishing-core",
    title: "Decode the Phish",
    tag: "Mission 1 · 10 min",
    difficulty: "Básico",
    xp: 120,
    summary:
      "Aprende a identificar dominios impostores, urgencia artificial y llamadas a la acción sospechosas en correos y chats.",
    objectives: [
      "Detectar dominios falsos",
      "Reconocer lenguaje de urgencia",
      "Reportar evidencia rápidamente",
    ],
    sections: [
      {
        title: "Dominios similares",
        bullets: [
          "Comparte siempre la URL real con tu equipo antes de iniciar sesión.",
          "Busca pequeños cambios: reemplazo de letras, subdominios raros o dominios de soporte inventados.",
        ],
      },
      {
        title: "Urgencia para presionar",
        bullets: [
          "Frases como 'último aviso' o 'tiempo limitado' buscan que ignores los protocolos.",
          "Recuerda pausar y validar por un canal oficial antes de responder.",
        ],
      },
    ],
    quiz: [
      {
        id: "phish-core-q1",
        question:
          "El correo incluye un link a https://secure-paypal-support.com/login. ¿Qué haces primero?",
        options: [
          "Ingresas y cambias la contraseña",
          "Abres el link en tu teléfono",
          "Copias la URL y la validas con IA Shield",
          "Ignoras el correo",
        ],
        answer: "Copias la URL y la validas con IA Shield",
        explanation:
          "La URL imita PayPal. Validar con IA Shield o con tu equipo evita entregar credenciales.",
      },
      {
        id: "phish-core-q2",
        question:
          "Un mensaje de texto dice: 'Transferir hoy para mantener el servicio, último aviso'. ¿Qué bandera roja ves?",
        options: [
          "No hay emojis",
          "Lenguaje de urgencia y presión para pagar",
          "El mensaje menciona tu nombre",
          "El remitente es un número internacional",
        ],
        answer: "Lenguaje de urgencia y presión para pagar",
        explanation:
          "Los atacantes usan urgencia para forzar decisiones rápidas sin validar.",
      },
    ],
  },
  {
    id: "lesson-voice-ops",
    title: "Voice Scam Ops",
    tag: "Mission 2 · 8 min",
    difficulty: "Básico",
    xp: 90,
    summary:
      "Practica cómo responder a llamadas clonadas (deepfake) que piden acciones urgentes o transferencias.",
    objectives: [
      "Validar identidad verbal",
      "Aplicar palabra clave segura",
      "Escalar alertas críticas",
    ],
    sections: [
      {
        title: "Verificación verbal",
        bullets: [
          "Establece frases o códigos con tus contactos para confirmar identidad.",
          "Si escuchas audio robótico o pausas raras, cuelga y llama tú.",
        ],
      },
      {
        title: "Escenarios comunes",
        bullets: [
          "CEO falso que pide transferir fondos.",
          "Soporte técnico que solicita código 2FA.",
        ],
      },
    ],
    quiz: [
      {
        id: "voice-ops-q1",
        question:
          "Un supuesto gerente te llama y pide el código 2FA enviado a tu móvil. ¿Cuál es la respuesta correcta?",
        options: [
          "Compartir el código por confianza",
          "Solicitar que envíe un email",
          "Negarse y reportar inmediatamente",
          "Esperar a ver si insiste",
        ],
        answer: "Negarse y reportar inmediatamente",
        explanation:
          "Nadie debe solicitar códigos 2FA por voz. Reporta al instante para cortar el intento.",
      },
      {
        id: "voice-ops-q2",
        question: "¿Qué indicador sugiere deepfake en una llamada?",
        options: [
          "La voz es demasiado clara",
          "Hay eco o latencia poco natural",
          "La llamada llega en horario laboral",
          "El número está en tus contactos",
        ],
        answer: "Hay eco o latencia poco natural",
        explanation:
          "Los modelos de voz suelen dejar artefactos como eco o pausas. Usa eso como alerta.",
      },
    ],
  },
  {
    id: "lesson-screenshots",
    title: "Screenshot Sleuth",
    tag: "Mission 3 · 12 min",
    difficulty: "Básico",
    xp: 150,
    summary:
      "Convierte capturas de pantalla de chats o correos en evidencia accionable que IA Shield puede analizar.",
    objectives: [
      "Resaltar partes críticas",
      "Ocultar datos sensibles",
      "Compartir la captura correcta",
    ],
    sections: [
      {
        title: "Preparar la captura",
        bullets: [
          "Incluye la barra del navegador para ver la URL, remitente y fecha.",
          "Marca la parte sospechosa con anotaciones o emojis.",
        ],
      },
      {
        title: "Enviar al flujo correcto",
        bullets: [
          "Sube la captura al dashboard o envíala al bot de IA Shield.",
          "Describe qué te preocupa para acelerar el veredicto.",
        ],
      },
    ],
    quiz: [
      {
        id: "shot-q1",
        question:
          "¿Qué elemento es imprescindible en una captura de pantalla para detección?",
        options: [
          "Fondo desenfocado",
          "Barra del navegador con la URL visible",
          "Solo el cuerpo del correo",
          "Emoji de alerta",
        ],
        answer: "Barra del navegador con la URL visible",
        explanation:
          "La URL muestra si el dominio es legítimo. Sin ella es difícil validar.",
      },
      {
        id: "shot-q2",
        question:
          "¿Qué haces si la captura incluye datos sensibles de un cliente?",
        options: [
          "La envías tal cual",
          "La borras",
          "Cubres los datos sensibles antes de enviarla",
          "La compartes por WhatsApp",
        ],
        answer: "Cubres los datos sensibles antes de enviarla",
        explanation:
          "Ocultar datos personales protege privacidad sin perder contexto del fraude.",
      },
    ],
  },
];
