# Pelo a Pelo — Frontend

Reconstrucción del sitio de la fundación Pelo a Pelo con Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, usando el copy y los tokens de diseño reales extraídos del sitio en producción (ver `../docs/scan-22-07-2026/00-reconstruccion-peloapelo.md`).

## Requisitos

- Node.js 20+
- npm

## Getting started

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
app/
  page.tsx          Home (14 secciones, orden 1:1 con el sitio original)
  pricing/page.tsx  Planes y tabla comparativa
  auth/page.tsx     Login / registro (UI only, sin backend aún)
  layout.tsx        Header + Footer globales, fuente Lato
components/
  layout/           Header, Footer
  sections/         Una sección del Home por archivo
  shared/           SectionBadge, FadeInOnScroll, AnimatedCounter
  ui/               Button
lib/data/           Contenido tipado (FAQ, planes, testimonios, stats, etc.)
```

Principio: el contenido vive en `lib/data/*.ts`, separado de los componentes. `lib/data/plans.ts` es la única fuente de verdad para los planes, usada tanto en Home como en `/pricing`.

## Pendiente

- Reemplazar 3 placeholders de imagen (diagrama del manifiesto, foto de la fundadora, portada del ebook) — URLs originales documentadas en el scan.
- Conectar `/auth` a un backend real (Spring Boot, aún no iniciado).
- Rutas internas (dashboard, quiz, progreso) no fueron escaneadas — requieren login.

## Deploy

Pensado para desplegar en Vercel (build estándar de Next.js, sin configuración adicional).
