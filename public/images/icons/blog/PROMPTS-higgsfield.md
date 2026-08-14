# Prompts para íconos de "Herramientas con respaldo científico"

Actualizado (ago 2026): se descarta la version linea-plana de mas abajo -- el
diagrama del circulo ya se genero en acuarela (Leonardo AI) y quedo mejor que
cualquier version plana, asi que estos 5 tambien van en acuarela, mismo
tratamiento (trazo navy + mancha de acuarela + ramitas/bayas), para que todo
el articulo comparta un solo lenguaje visual.

## Bloque de estilo (pegar al final de cada prompt, cambiando {WASH_COLOR})

```
Delicate watercolor icon illustration, thin hand-drawn line-art in deep navy
(#2B3D4F) for the subject, with a soft translucent watercolor wash bleeding
gently behind it in {WASH_COLOR}, a few small delicate leaf sprigs and tiny
scattered dots/berries as botanical accents, gentle whimsical wellness
aesthetic, no bold outlines, no flat vector look, no cartoon style, white or
cream background, centered composition with generous padding, square 1:1
canvas, no text, no watermark.
```

Implementado (ago 2026): los 5 quedaron integrados en ManejoAnsiedadCaida.tsx
como circulo de 80-96px al lado de cada tarjeta de herramienta, mismo trato
que el diagrama del circulo mas abajo (se descarto zigzag e imagen de fondo
con degrade -- ver decision en el componente).

## 1. Respiración cíclica → `respiracion-ciclica.jpg` (mancha celeste suave, #89CFEB)

```
A calm person's side-profile bust, eyes closed, with two soft curved wave lines
flowing gently from the nose representing slow cyclical breathing, chest
subtly rising. [pegar bloque de estilo con {WASH_COLOR} = soft sky blue
#89CFEB]
```

## 2. Anclaje 5-4-3-2-1 → `anclaje-5-4-3-2-1.jpg` (mancha lavanda suave, #8F7CB6)

```
A single open eye with soft radiating awareness lines around it and a few small
scattered dots nearby suggesting the senses (sight, sound, touch), calm and
grounded feeling. [pegar bloque de estilo con {WASH_COLOR} = soft
lavender-purple #8F7CB6]
```

## 3. Autocompasión → `autocompasion.jpg` (mancha rosa polvo suave)

```
Two gentle hands cupped together over a small heart shape, in a self-embracing,
comforting gesture. [pegar bloque de estilo con {WASH_COLOR} = soft dusty pink]
```

## 4. Escritura expresiva → `escritura-expresiva.jpg` (mancha verde salvia suave)

```
An open notebook with a pen resting on its page, with a few soft flowing curved
lines above the page representing written thoughts. [pegar bloque de estilo
con {WASH_COLOR} = soft sage green]
```

## 5. Terapia psicológica → `terapia-psicologica.jpg` (mancha lavanda-celeste)

```
Two simple seated figures facing each other in conversation, with a small heart
shape floating between them representing supportive dialogue. [pegar bloque de
estilo con {WASH_COLOR} = soft blend of lavender-purple and sky blue]
```

---

## (Descartado) Version linea-plana original de estos 5

Se deja abajo solo como referencia, ya no es la que se esta usando.



---

## Diagrama "el círculo que se retroalimenta" (4 íconos, acuarela -- Leonardo AI, 1:1)

A diferencia de los 5 de arriba (línea plana sin acuarela), estos 4 van en el
mismo tratamiento acuarelado que ya usa el sitio (ver `fondo-preguntas.jpg` y
la portada del blog `manejo-ansiedad-caida.jpg`): trazo fino navy + mancha de
acuarela translúcida detrás, no íconos planos. El color de la mancha sigue la
narrativa del diagrama (neutro → alerta → alerta → calma).

### Bloque de estilo (pegar al final de cada prompt, cambiando {WASH_COLOR})

```
Delicate watercolor icon illustration, thin hand-drawn line-art in deep navy
(#2B3D4F) for the subject outline, with a soft translucent watercolor wash
bleeding gently behind it in {WASH_COLOR}, a few tiny scattered dots/berries as
accents, gentle whimsical wellness aesthetic, no bold outlines, no flat vector
look, no cartoon style, cream or white background, centered composition with
generous padding, square 1:1 canvas, no text, no watermark.
```

### Cae más pelo → `cae-mas-pelo.png` (mancha lavanda suave, #8F7CB6)

```
A single strand of hair drifting gently downward from a simple stylized hand,
calm falling motion, not distressing. [pegar bloque de estilo con {WASH_COLOR}
= soft lavender-purple #8F7CB6]
```

### Sube la ansiedad → `sube-ansiedad.png` (mancha coral tenue, #EF4343 pastel)

```
A heart shape with a jagged, irregular heartbeat line running through it,
suggesting a racing, anxious pulse. [pegar bloque de estilo con {WASH_COLOR} =
soft muted coral #EF4343]
```

### Sube el cortisol → `sube-cortisol.png` (mancha coral-ámbar)

```
A small upward-rising flame shape at the tip of an upward arrow, suggesting an
internal alarm/hormone spike. [pegar bloque de estilo con {WASH_COLOR} = warm
coral fading to soft amber]
```

### El folículo se duerme → `foliculo-duerme.png` (mancha celeste suave, #89CFEB)

```
A single hair follicle bulb (small teardrop root under a short hair strand)
beside a crescent moon and a couple of soft curved "zzz" sleep lines, calm and
dormant. [pegar bloque de estilo con {WASH_COLOR} = soft sky blue #89CFEB]
```

---

Cuando tengas los 9 PNG (5 de herramientas + 4 del diagrama), guárdalos en
esta misma carpeta (`public/images/icons/blog/`) con esos nombres exactos y
avísame para reemplazar los íconos de lucide-react en
`ManejoAnsiedadCaida.tsx` por estas imágenes.
