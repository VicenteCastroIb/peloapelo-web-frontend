# Escaneo del dashboard interno (peloapelo.cl) — 23 jul 2026

Escaneado con sesión logueada real (login hecho por Vicente). Complementa `00-reconstruccion-peloapelo.md`, que solo cubría páginas públicas.

## Layout compartido

Sidebar fijo a la izquierda, en todas las rutas internas:
- Logo (arriba)
- Nav: **Inicio** · **Progreso** · **Aprender** · **Perfil**
- Abajo: email del usuario logueado + **Cerrar sesión**

## Rutas y su estado real

| Ruta | Nombre en sidebar/tarjeta | Estado |
|---|---|---|
| `/dashboard` | Inicio | Funcional |
| `/progress` | Progreso | Funcional (contenido informativo) |
| `/courses` | Aprender | Funcional (listado), sin detalle de lección |
| `/profile` | Perfil | Funcional |
| `/therapist` | Agenda con Terapeuta (tarjeta del dashboard) | Funcional (UI de agendamiento) |
| `/tofacitinib` | Acceso a Tofacitinib (tarjeta del dashboard) | **Bloqueada** — "próximamente" incluso en el sitio real |
| — | Programa de 3 Meses (tarjeta del dashboard) | **Decorativa** — no navega a ningún lado, sin `href`/`onClick` |
| — | Mi Suscripción (tarjeta del dashboard) | **Decorativa** — badge "Próximamente", no navega |

## `/dashboard` (Inicio)

```
Hola, {nombre} 👋
Tu espacio seguro para crecer. Cada paso cuenta.

[Banner degradado violeta→celeste]
✨ Para ti hoy
No estás solo/a en esto 💜
Esta plataforma integra mente, cuerpo y emoción para acompañarte en tu proceso.
No reemplaza a tus doctores — es un complemento que te ayuda a entender lo que
sientes, registrar tu progreso y tomar decisiones informadas junto a tu equipo médico.
♡ Mirada integrativa: mente · cuerpo · emoción

Explora
```

Grid de 6 tarjetas (icono, badge, título, descripción):

1. 📷 **Disponible** — Seguimiento de Progreso — "Fotos, estado de ánimo y reportes para tu médico" → `/progress`
2. 📖 **3 cursos** — Cursos — "Ansiedad, cuerpo y crecimiento personal" → `/courses`
3. 🔍 **Guía** — Acceso a Tofacitinib — "Te acompañamos para que acceder a tu medicamento sea fácil" → `/tofacitinib` (bloqueada)
4. 🤍 **Nuevo** — Agenda con Terapeuta — "Sesiones con profesionales de salud mental que te acompañan" → `/therapist`
5. ✨ **Premium** — Programa de 3 Meses — "Viaje guiado de manejo de ansiedad con coach personal" (no navega)
6. 💳 **Próximamente** — Mi Suscripción — "Gestiona tu plan y pagos" (no navega)

## `/progress`

```
👁 Tu espejo honesto
Ver la realidad a veces incomoda, pero es el primer paso para sanar

Muchas veces, por miedo, nos desconectamos de nuestro cuerpo. Dejamos de
mirarnos, de registrar lo que pasa.
Este módulo existe para que estés presente en tu sanación. Sube fotos
periódicamente y la IA te ayudará a identificar cambios.

📄 Genera reportes con tus fotos y evolución para compartir con tu médico.

[Menos ⌃]  (toggle de colapsar, estaba expandido por defecto)
```

No se ve un uploader de fotos funcional en esta captura — puede requerir una acción adicional no explorada, o estar pendiente de construir en el sitio real también.

## `/courses`

```
Tu camino de bienestar 🌱
Cursos diseñados por profesionales para acompañarte en cada etapa.
```

3 tarjetas con imagen ilustrada (gradiente + ilustración de persona), badge de nivel, botón play (decorativo, no navega):

| Curso | Nivel | Duración | Lecciones | Descripción |
|---|---|---|---|---|
| Ansiedad y Pelo | Básico | 45 min | 5 | Entiende la conexión entre tu mente y tu cabello |
| Cuerpo y Pelo | Básico | 50 min | 5 | Tu cuerpo habla, aprende a escucharlo |
| Proyecto Crecimiento | Intermedio | 55 min | 5 | ¿Qué es y cómo empezar? |

Confirmado via accessibility tree: las tarjetas de curso NO son elementos interactivos (sin link/button real) — es un listado, sin vista de lección construida todavía.

## `/profile`

```
Mi perfil
Gestiona tu cuenta y suscripción

[avatar] vicentecastroibarra
         vicentecastroibarra@gmail.com

🛡 Suscripción
Estado: Trial
📅 3 días restantes

✨ Accesos rápidos
♡ Programa 12 semanas   📅 Agendar terapeuta
```

Esta es la página "Mi cuenta" que proponía el plan de trabajo (sección 2.3) — ya existe, pero sin botón visible de cancelar (probablemente porque el estado es Trial, no un plan pago activo).

## `/therapist`

```
♡ Acompañamiento profesional
Agenda con tu Terapeuta 🧠

Sabemos que no todo es digital. Por eso tenemos profesionales de la salud
mental para apoyarte en todo momento. Agenda una sesión y te acompañamos.

[avatar] Jessica Lagno
         Profesional de salud mental · Pelo a Pelo
         jessica.lagno@beehrteam.com

Selecciona una fecha
[date picker vacío: "Elige una fecha"]

Horario disponible
09:00  09:30  10:00  10:30  11:00  11:30
14:00  14:30  15:00  15:30  16:00  16:30  17:00  17:30
(pausa de almuerzo 11:30–14:00)

¿Sobre qué te gustaría hablar? (opcional)
[textarea]

[Agendar sesión]

¿Prefieres agendar directamente?
[Agendar por Google Calendar]

💜 Este servicio es un complemento a tu proceso. Las sesiones son
orientativas y no reemplazan un tratamiento clínico formal. Si estás en
crisis, acude a urgencias o llama a una línea de ayuda.
```

## `/tofacitinib`

```
🔒
Guía Tofacitinib
Esta sección estará disponible próximamente.
[Volver al Dashboard]
```

## Notas para la reconstrucción

- Replicar fielmente el estado "sin cablear" de Programa de 3 Meses, Mi Suscripción y el detalle de curso — no inventar contenido que el sitio real tampoco tiene.
- `/profile` y `/therapist` son candidatos a mejorar respecto al sitio real: nuestro backend YA tiene endpoints de suscripción reales (`/api/subscriptions/me`, `/cancel`) que el sitio real todavía no expone en su UI (tarjeta "Mi Suscripción" marcada "Próximamente").
- `/therapist`: el envío del formulario de agendamiento no tiene endpoint propio todavía — se deja como UI funcional con TODO, igual que se hizo con `/auth` antes de conectarlo.
