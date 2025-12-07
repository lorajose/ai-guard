export const IA_ACADEMY_SYSTEM_PROMPT = `
Eres IA Academy, un instructor experto en ciberseguridad y ataques potenciados por IA.
Tu objetivo es formar a usuarios y equipos en:

- Phishing generado por IA (ChatGPT, WormGPT, etc.)
- Deepfake voice scams (vishing)
- Suplantación y spoofing corporativo
- URLs maliciosas y payloads generados con LLM
- Ingeniería social avanzada

Reglas del producto IA Shield:
- Tres niveles: Básico (PRO), Intermedio (BUSINESS), Avanzado (ENTERPRISE).
- Módulo incluye: cursos teóricos, simulaciones mensuales, análisis de casos reales,
  certificaciones internas, deepfake awareness y laboratorio IA.
- El tono debe ser claro, práctico y orientado a negocio (no académico puro).
- Siempre que sea relevante, destaca cómo reducir riesgo y evitar pérdidas económicas.
- El contenido debe ser utilizable dentro de un dashboard SaaS, en bloques cortos
  y fáciles de mostrar en tarjetas o pasos.
`;

export const IA_ACADEMY_COURSE_PLAN_PROMPT = (
  nivel: string,
  duracion: string,
  plan: string,
) => `
Crea un plan de capacitación para la IA Academy.

Contexto del producto:
- Niveles: Básico (PRO), Intermedio (BUSINESS), Avanzado (ENTERPRISE).
- Este plan es para el nivel: ${nivel}
- Duración total: ${duracion}
- Plan/comercial: ${plan}

Requisitos:
1. Devuelve un JSON válido con esta estructura:
{
  "nivel": "Básico | Intermedio | Avanzado",
  "objetivo_general": "...",
  "modulos": [
    {
      "id": "M1",
      "titulo": "...",
      "descripcion": "...",
      "tipo": "teoria | simulacion | laboratorio | deepfake",
      "duracion_minutos": 30,
      "resultados_esperados": ["...", "..."]
    }
  ]
}

2. Incluye al menos:
   - 1 módulo teórico
   - 1 simulación de phishing
   - 1 análisis de caso real
   - 1 actividad de laboratorio IA
   - (En Avanzado) 1 módulo de deepfake/vishing.

No expliques nada fuera del JSON.
`;

export const IA_ACADEMY_LESSON_PROMPT = (titulo: string, nivel: string) => `
Genera el contenido de una lección teórica para la IA Academy.

Datos:
- Título de la lección: "${titulo}"
- Nivel: ${nivel} (Básico/Intermedio/Avanzado)

Objetivo:
Texto listo para mostrarse en tarjetas/pasos del dashboard.

Devuelve JSON con la forma:
{
  "titulo": "...",
  "resumen": "...",
  "secciones": [
    {
      "subtitulo": "...",
      "contenido_html": "<p>...</p><ul><li>...</li></ul>"
    }
  ],
  "checklist_final": [
    "Punto clave 1",
    "Punto clave 2",
    "Punto clave 3"
  ]
}

- Usa HTML sencillo (p, ul, li, strong).
- Incluye ejemplos específicos de ataques (links falsos, dominios parecidos, etc.).
- Menciona al menos una recomendación práctica para usuarios no técnicos.
`;

export const IA_ACADEMY_PHISH_SIM_PROMPT = (
  marca: string,
  escenario: string,
) => `
Crea un correo de phishing **simulado** para entrenar usuarios.

Datos:
- Marca o servicio que se suplanta: ${marca}
- Escenario: ${escenario} (por ejemplo: "aviso de cierre de cuenta", "pago pendiente")

Requisitos:
1. Devuelve JSON:
{
  "subject": "...",
  "from_name": "...",
  "from_email": "algo@dominio-falso.com",
  "body_text": "...",
  "body_html": "<p>...</p>",
  "indicadores_riesgo": [
    "URL sospechosa: ...",
    "Urgencia artificial: ...",
    "Suplantación de marca: ..."
  ],
  "nivel_estimado": "Básico | Intermedio | Avanzado"
}

2. El cuerpo debe parecer real pero NO contener links activos a sitios peligrosos.
   Usa dominios claramente falsos (ej. secure-paypal-verification-login.com).

3. No expliques la solución en el cuerpo del correo.
   Las explicaciones van en "indicadores_riesgo".
`;

export const IA_ACADEMY_DEEPFAKE_SCRIPT_PROMPT = (
  rol: string,
  contexto: string,
) => `
Genera un guion breve de llamada telefónica fraudulenta para entrenamiento.

Datos:
- Rol suplantado: ${rol} (ej. "CEO", "Banco", "Proveedor de pagos")
- Contexto: ${contexto} (ej. "pago urgente", "verificación de token", "liberación de cuenta")

Requisitos:
1. Duración estimada: 20 a 40 segundos.
2. Tono: muy convincente pero con varias señales sospechosas.
3. Devuelve JSON:
{
  "script": "Texto continuo de la llamada en español",
  "banderas_rojas": [
    "Bandera 1",
    "Bandera 2",
    "Bandera 3"
  ],
  "recomendacion_para_usuario": "Mensaje corto de qué debería hacer el usuario ante esta llamada."
}
`;

export const IA_ACADEMY_EVAL_PROMPT = (
  respuestaUsuario: string,
  contexto: string,
) => `
Actúa como evaluador de la IA Academy.

Contexto del ejercicio:
${contexto}

Respuesta del usuario:
"""${respuestaUsuario}"""

Tarea:
1. Evalúa la respuesta en cuanto a:
   - Identificación de señales de phishing
   - Comprensión del riesgo
   - Acción recomendada

2. Devuelve JSON:
{
  "score": 0-100,
  "label": "ESTAFA | SOSPECHOSO | SEGURO",
  "fortalezas": ["...", "..."],
  "mejoras": ["...", "..."],
  "consejo_breve": "Máx 2 frases, claro y práctico.",
  "tags": ["phishing", "ing_social", "urls", "..."]
}

- Si el usuario minimiza o no detecta el riesgo, el score debe ser bajo (<40).
- Si identifica varias banderas rojas y propone acciones correctas, el score debe ser alto (>80).
`;

export const IA_ACADEMY_GAMIFICATION_PROMPT = (
  nombreUsuario: string,
  score: number,
  nivel: string,
) => `
Genera la respuesta de gamificación para la IA Academy.

Datos:
- Usuario: ${nombreUsuario}
- Score del último ejercicio: ${score}
- Nivel actual: ${nivel} (Básico/Intermedio/Avanzado)

Reglas de medallas:
- "Phishing Hunter": primer ejercicio aprobado (>60).
- "AI Firewall": 10 ejercicios seguidos por encima de 70.
- "SOC Trainee": curso completo del nivel.

Tarea:
Devuelve JSON:
{
  "mensaje_dashboard": "Texto corto motivador para mostrar en la UI",
  "puntos_ganados": número,
  "progreso_nivel": 0-100,
  "nuevas_medallas": ["Phishing Hunter", ...],   // o []
  "sugerencia_siguiente_paso": "Qué módulo debería hacer ahora."
}
- Usa tono positivo pero realista (sin prometer seguridad absoluta).
`;

export const IA_ACADEMY_ADMIN_ALERT_PROMPT = (
  usuario: string,
  emailSim: string,
  score: number,
  label: string,
) => `
Genera una alerta para el panel del administrador de IA Shield.

Datos:
- Usuario: ${usuario}
- Simulación: ${emailSim}
- Resultado: label=${label}, score=${score}

Requisitos:
1. Devuelve JSON:
{
  "titulo": "Alerta breve para la tarjeta del dashboard",
  "descripcion": "Resumen corto (máx 2-3 frases)",
  "nivel_riesgo": "bajo | medio | alto",
  "acciones_recomendadas": [
    "Acción 1",
    "Acción 2"
  ],
  "sugerir_reentrenamiento_modulo": "ej. Módulo 2: Phishing básico"
}

2. Si label es "ESTAFA" y score > 70 → nivel_riesgo debe ser "alto".
3. El lenguaje debe ser profesional y orientado a decisión rápida.
`;
