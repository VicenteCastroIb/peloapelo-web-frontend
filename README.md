# Pelo a Pelo — Frontend

Reconstrucción del sitio de la fundación Pelo a Pelo con Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, usando el copy y los tokens de diseño reales extraídos del sitio en producción (ver `../docs/scan-22-07-2026/00-reconstruccion-peloapelo.md`).

## Requisitos

- Node.js 20+
- npm

## Getting started

```bash
npm install
cp .env.local.example .env.local   # editar NEXT_PUBLIC_API_URL si el backend no corre en localhost:8080
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para que `/auth` funcione de verdad necesitas el backend corriendo (ver `../backend/README.md`).

## Estructura

```
app/
  page.tsx          Home (14 secciones, orden 1:1 con el sitio original)
  pricing/page.tsx  Planes y tabla comparativa
  auth/page.tsx     Login / registro conectado a la API real
  layout.tsx        Header + Footer globales, fuente Lato, AuthProvider
components/
  layout/           Header, Footer, HeaderAuthCta (estado de sesión)
  sections/         Una sección del Home por archivo
  shared/           SectionBadge, FadeInOnScroll, AnimatedCounter
  ui/               Button
lib/data/           Contenido tipado (FAQ, planes, testimonios, stats, etc.)
lib/api/            Cliente HTTP hacia el backend (auth, users)
lib/auth/           AuthContext + hook useAuth (sesión, JWT en localStorage)
public/downloads/   Ebook real (PDF) para descarga
public/images/      Foto de la fundadora, portada del ebook
```

Principio: el contenido vive en `lib/data/*.ts`, separado de los componentes. `lib/data/plans.ts` es la única fuente de verdad para los planes, usada tanto en Home como en `/pricing`.

## Autenticación

`/auth` llama a `POST /api/auth/register` y `/api/auth/login` del backend. El JWT se guarda en `localStorage` (ver nota de seguridad en `lib/auth/AuthContext.tsx`: para producción con datos sensibles conviene migrar a una cookie httpOnly). `useAuth()` expone `user`, `status`, `login`, `register`, `logout` a cualquier componente cliente.

## Pendiente

- Diagrama del manifiesto: sigue siendo un placeholder (no se consiguió el asset original).
- Rutas internas (dashboard, quiz, progreso) no fueron escaneadas — requieren login en el sitio real.
- Conectar el flujo de suscripción (`/pricing`) a `POST /api/subscriptions/subscribe`.

## Deploy

Pensado para desplegar en Vercel (build estándar de Next.js). Configurar `NEXT_PUBLIC_API_URL` como variable de entorno del proyecto en Vercel, apuntando al backend desplegado (Render/Railway).
