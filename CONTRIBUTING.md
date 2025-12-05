# Contribuir a IA Shield

Gracias por tu interés en contribuir. Este documento describe el flujo de trabajo, estilo de código y proceso de PRs.

## 💡 Cómo contribuir

1. Haz fork del repo y crea una rama desde `dev` (`feature/nombre`).
2. Instala dependencias con `pnpm install`.
3. Ejecuta tests (`pnpm test`, `pnpm test:e2e` si aplica).
4. Asegúrate de formatear/lint (`pnpm lint`).
5. Abre un PR contra `dev` describiendo cambios y pruebas ejecutadas.

## 🎯 Code style

- **TypeScript estricto**: evita `any`. Usa helper types cuando sea posible.
- **React**: Favor hooks y componentes tipo función. Usa `"use client"` cuando corresponda.
- **CSS**: Tailwind + clases utilitarias. Componentes base en `src/components/ui`.
- **Naming**: camelCase para funciones/variables, PascalCase para componentes.
- **Comentarios**: solo cuando aporten contexto relevante.

## 🧾 Convención de commits

Sigue un formato tipo Conventional Commits:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `test: ...`
- `refactor: ...`
- `chore: ...`

## 🔁 Pull Requests

- Describe qué problema resuelves y cómo lo probaste.
- Adjunta capturas si son cambios visuales.
- Mantén los PRs pequeños y enfocados.
- El PR debe pasar CI (lint, test, build).

Gracias por mantener IA Shield confiable para todos 🚀
