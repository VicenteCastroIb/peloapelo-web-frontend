import { BadgeCheck, Dna, LifeBuoy, Timer, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/constants";

// Segundo articulo real del blog (ago 2026), mismo criterio que
// ManejoAnsiedadCaida.tsx: cada afirmacion con cita [n] esta respaldada por
// una fuente medica/dermatologica real verificada por busqueda (StatPearls,
// Mayo Clinic, Cleveland Clinic, AAD, guias clinicas europeas y revisiones
// sistematicas en PMC), nunca un dato inventado -- ver REFERENCIAS al final.
const MYTHS = [
  {
    myth: "El estrés es la causa de toda caída de pelo.",
    reality: (
      <>
        El estrés puede gatillar el efluvio telógeno -una caída difusa y
        temporal que suele resolverse en 6 a 9 meses una vez que pasa el
        evento que la disparó- pero no es la causa de la alopecia
        androgenética, que es genética y hormonal, ni de la alopecia areata,
        que es autoinmune. <Cite n={2} /> <Cite n={4} />
      </>
    ),
  },
  {
    myth: "Afeitarte o cortarte el pelo hace que vuelva más grueso o más rápido.",
    reality: (
      <>
        Décadas de estudios, desde uno de 1928 hasta revisiones más recientes,
        no encuentran diferencias reales en grosor, color o velocidad de
        crecimiento entre pelo afeitado y sin afeitar. La sensación de "más
        grueso" es la punta roma del pelo recién cortado, que roza distinto al
        tacto -no un cambio en el folículo. <Cite n={12} />
      </>
    ),
  },
  {
    myth: "La calvicie se hereda solo del lado materno.",
    reality: (
      <>
        Es un mito a medias: el gen del receptor de andrógenos, uno de los más
        relevantes, sí está en el cromosoma X que se hereda de la madre, pero
        hoy se conocen más de 250 variantes genéticas asociadas a la caída, la
        mayoría en cromosomas no sexuales que se heredan de ambos lados de la
        familia. <Cite n={7} />
      </>
    ),
  },
  {
    myth: "Los champús, vitaminas o suplementos \"milagrosos\" hacen crecer el pelo.",
    reality: (
      <>
        Una revisión sistemática no encontró evidencia de que la biotina
        mejore el crecimiento del pelo en personas sin una deficiencia real
        -y esa deficiencia es rara en una dieta occidental balanceada. Ningún
        champú de venta libre revierte la alopecia androgenética o areata:
        pueden mejorar la salud del cuero cabelludo, no regenerar folículos.{" "}
        <Cite n={9} />
      </>
    ),
  },
  {
    myth: "Usar gorro, casco o el pelo tomado causa calvicie.",
    reality: (
      <>
        El uso normal de gorros o cascos no causa alopecia hereditaria. Distinto
        es el peinado tirante sostenido en el tiempo -colas muy apretadas,
        trenzas, extensiones-, que sí puede causar alopecia por tracción; a
        diferencia de la androgenética, esta es reversible si se afloja el
        peinado a tiempo. <Cite n={13} />
      </>
    ),
  },
  {
    myth: "Lavarte el pelo todos los días hace que se caiga más.",
    reality: (
      <>
        Perder entre 50 y 100 pelos al día es parte normal del ciclo capilar,
        pase lo que pase con la frecuencia de lavado. Si lavas menos seguido,
        esos mismos pelos se acumulan y aparecen todos juntos la próxima vez
        -da la impresión de que "se cae más", pero es el mismo pelo que
        ibas a perder de todos modos. <Cite n={4} />
      </>
    ),
  },
];

// Imagenes acuareladas a medida (ago 2026, ya integradas): alopecia-
// androgenetica.jpg / efluvio-telogeno.jpg, generadas con los prompts
// entregados en chat (misma paleta que el resto del articulo: lavanda para
// lo genetico/permanente, celeste para lo temporal/reversible). El icono de
// lucide-react se deja como fallback por si `image` llega null.
const HAIR_TYPES = [
  {
    icon: Dna,
    image: "/images/icons/blog/alopecia-androgenetica.jpg" as string | null,
    title: "Alopecia androgenética",
    tag: "Genética · progresiva",
    tint: "var(--color-accent)",
    description:
      "La más común. Genética y hormonal (sensibilidad a la DHT), progresiva, con patrón reconocible -entradas y coronilla en hombres, ensanchamiento de la raya en mujeres. No se revierte sola, pero sí se puede frenar y, en parte, recuperar con tratamiento.",
    cite: 1,
  },
  {
    icon: Timer,
    image: "/images/icons/blog/efluvio-telogeno.jpg" as string | null,
    title: "Efluvio telógeno",
    tag: "Temporal · reversible",
    tint: "var(--color-gradient-to)",
    description:
      "Caída difusa en todo el cuero cabelludo, gatillada por un evento puntual -estrés agudo, posparto, fiebre alta, cirugía, dietas muy restrictivas. No daña el folículo: el pelo suele recuperarse solo en unos meses una vez que pasa el gatillante.",
    cite: 2,
  },
];

// confidence: nivel de confianza de la evidencia (1-3, ver ConfidenceDots
// mas abajo) -- no es lo mismo que "que tan invasivo es" ni "que tan
// popular es", es especificamente cuanta evidencia clinica solida respalda
// el tratamiento hoy. Imagenes acuareladas a medida (ago 2026, generadas en
// Leonardo AI, ver prompts en el historial de esta tarea), mismo circulo
// grande que ya se uso en HAIR_TYPES arriba.
const TREATMENTS = [
  {
    image: "/images/icons/blog/minoxidil.jpg",
    title: "Minoxidil",
    evidence: "Aprobado, evidencia sólida",
    confidence: 3,
    tint: "#89CFEB",
    description: (
      <>
        Mejora el flujo sanguíneo del folículo y extiende su fase de
        crecimiento. Es, junto al finasteride, uno de los dos únicos
        tratamientos farmacológicos autorizados para la alopecia
        androgenética según las guías clínicas europeas. <Cite n={5} />{" "}
        <Cite n={6} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/finasteride.jpg",
    title: "Finasteride / dutasteride",
    evidence: "Aprobado, evidencia sólida (uso médico)",
    confidence: 3,
    tint: "#8F7CB6",
    description: (
      <>
        Reduce los niveles de DHT, la hormona responsable de la miniaturización
        progresiva del folículo. De uso oral y bajo indicación médica; la
        combinación con minoxidil mostró mejores resultados que cualquiera de
        los dos por separado. <Cite n={6} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/laser-lllt.jpg",
    title: "Láser de baja intensidad (LLLT)",
    evidence: "Evidencia moderada, en crecimiento",
    confidence: 2,
    tint: "#9CB8DE",
    description: (
      <>
        Revisiones sistemáticas muestran un aumento estadísticamente
        significativo en la densidad capilar con el uso de dispositivos de
        LLLT, aunque los estudios siguen siendo más pequeños que los de
        minoxidil y finasteride. <Cite n={11} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/prp.png",
    title: "Plasma rico en plaquetas (PRP)",
    evidence: "Evidencia prometedora, aún no estandarizada",
    confidence: 1,
    tint: "#D9A3B0",
    description: (
      <>
        Consiste en inyectar en el cuero cabelludo una concentración de las
        propias plaquetas del paciente. Los resultados son alentadores -en
        algunas revisiones, comparables a minoxidil y finasteride- pero los
        protocolos varían mucho entre clínicas y todavía faltan ensayos
        grandes y estandarizados. <Cite n={10} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/trasplante-capilar.png",
    title: "Trasplante capilar",
    evidence: "Quirúrgico, resultados permanentes",
    confidence: 3,
    tint: "#A3C08B",
    description: (
      <>
        Redistribuye folículos de una zona donante (resistente a la DHT) hacia
        el área afectada. Es la opción más invasiva y costosa, y su éxito
        depende mucho de la técnica y la selección del paciente -no es un
        primer paso, sino una opción a evaluar con un especialista. <Cite n={3} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/inhibidores-jak.png",
    title: "Inhibidores de JAK (solo alopecia areata)",
    evidence: "Aprobado por la FDA desde 2022",
    confidence: 3,
    tint: "#E8B979",
    description: (
      <>
        Para alopecia areata extensa, no para la androgenética. El baricitinib
        fue el primer tratamiento sistémico aprobado por la FDA para casos
        severos: en sus ensayos clínicos, un tercio de los pacientes logró
        recuperar el 80% o más del cuero cabelludo a las 36 semanas. <Cite n={8} />
      </>
    ),
  },
];

const REFERENCES = [
  {
    text: "Ho, C.H., Sood, T., Zito, P.M. Androgenetic Alopecia. StatPearls, NCBI Bookshelf.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK430924/",
  },
  {
    text: "Telogen Effluvium. StatPearls, NCBI Bookshelf.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK430848/",
  },
  {
    text: "Hair Transplantation. StatPearls, NCBI Bookshelf.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK547740/",
  },
  {
    text: "Mayo Clinic. Hair loss - Symptoms and causes.",
    url: "https://www.mayoclinic.org/diseases-conditions/hair-loss/symptoms-causes/syc-20372926",
  },
  {
    text: "Mayo Clinic. Hair loss - Diagnosis and treatment.",
    url: "https://www.mayoclinic.org/diseases-conditions/hair-loss/diagnosis-treatment/drc-20372932",
  },
  {
    text: "European Dermatology Forum. S3 Guideline for the Treatment of Androgenetic Alopecia.",
    url: "https://turkderm.org.tr/turkdermData/Uploads/files/S3_guideline_androgenetic_alopecia_update_final-version.pdf",
  },
  {
    text: "Genetic Variation in the Human Androgen Receptor Gene Is the Major Determinant of Common Early-Onset Androgenetic Alopecia. PMC.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1226186/",
  },
  {
    text: "National Alopecia Areata Foundation (NAAF). FDA-Approved JAK Inhibitors.",
    url: "https://www.naaf.org/navigation-toolkit/fda-approved-jak-inhibitors/",
  },
  {
    text: "Effectiveness of Biotin Supplementation for Hair Growth in Patients with Alopecia: A Systematic Review. MDPI.",
    url: "https://www.mdpi.com/2673-6179/6/2/17",
  },
  {
    text: "Systematic Review of Platelet-Rich Plasma Use in Androgenetic Alopecia Compared with Minoxidil, Finasteride, and Adult Stem Cell-Based Therapy. PMC.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7216252/",
  },
  {
    text: "Gentile, P., Garcovich, S. The Effectiveness of Low-Level Light/Laser Therapy on Hair Loss: A Systematic Review.",
    url: "https://journals.sagepub.com/doi/10.1089/fpsam.2021.0151",
  },
  {
    text: "Cleveland Clinic. Will Shaving Make Your Hair Grow Back Thicker?",
    url: "https://health.clevelandclinic.org/does-shaving-make-hair-thicker",
  },
  {
    text: "American Academy of Dermatology (AAD). Hairstyles that pull can lead to hair loss.",
    url: "https://www.aad.org/public/diseases/hair-loss/causes/hairstyles",
  },
];

function Cite({ n }: { n: number }) {
  return (
    <sup>
      <a href={`#ref-${n}`} className="text-accent hover:underline">
        [{n}]
      </a>
    </sup>
  );
}

// Indicador de confianza de 3 niveles (ago 2026, "UX UI senior"): antes la
// etiqueta de evidencia era texto plano identico en color/peso para las 6
// cards, sin importar si la evidencia era solida o apenas prometedora --
// exactamente el dato que mas interesa distinguir de un vistazo. 3 puntos
// llenos = evidencia solida/aprobada, 2 = moderada, 1 = prometedora/aun sin
// estandarizar (ver campo `confidence` en TREATMENTS).
function ConfidenceDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle" aria-hidden>
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full ${dot <= level ? "bg-accent" : "bg-navy/15"}`}
        />
      ))}
    </span>
  );
}

export default function MitosComunesAlopecia() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Disclaimer clinico: mismo criterio que ManejoAnsiedadCaida.tsx --
          informa, no reemplaza una evaluacion dermatologica real. */}
      <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small text-navy/70">
        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          Este artículo es educativo y está basado en evidencia científica
          disponible a la fecha de publicación (fuentes citadas al final). No
          reemplaza una evaluación dermatológica: el tratamiento correcto
          depende de identificar primero qué tipo de caída tienes.
        </p>
      </div>

      <p className="mt-8 text-p-lead text-navy/80">
        Entre el champú que promete "recuperar tu pelo en 30 días" y el
        consejo de la tía de que "es puro estrés, se te va a pasar", es fácil
        perderse. La buena noticia es que la ciencia sobre la caída de cabello
        avanzó mucho -sabemos bastante sobre qué la causa realmente y qué
        tratamientos tienen respaldo real, y qué es solo marketing.
      </p>
      <p className="mt-4 text-p-lead text-navy/80">
        Este artículo repasa los mitos más comunes que vas a encontrar dando
        vueltas, con lo que dice la evidencia sobre cada uno, y qué muestran
        los estudios sobre los tratamientos disponibles hoy -sin promesas
        vacías.
      </p>

      <h2 className="mt-12 text-h2-md text-navy">
        Primero: no toda caída de pelo es la misma
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Buena parte de la confusión sobre causas y tratamientos viene de tratar
        toda caída de pelo como si fuera un solo problema. Los dos tipos más
        frecuentes se comportan -y se tratan- de forma distinta:
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        {HAIR_TYPES.map(({ icon: Icon, image, title, tag, tint, description, cite }) => (
          <div
            key={title}
            className="flex-1 overflow-hidden rounded-card-lg border border-navy/10 bg-white text-center shadow-sm"
          >
            {/* Franja de color a modo de "header" de la card (ago 2026, a
                pedido explicito): da presencia de banner sin tener que
                estirar la imagen acuarelada -- que se genera con harto
                padding blanco alrededor del sujeto y se veria vacia si se
                recortara a lo ancho sin marco. El circulo se superpone al
                borde inferior de la franja con -mt calculado para quedar
                centrado exacto (mitad de su propio alto). */}
            <div
              className="h-20 w-full"
              style={{ backgroundColor: `color-mix(in srgb, ${tint} 16%, white)` }}
            />
            <div className="px-6 pb-6 sm:px-7 sm:pb-7">
              <span
                className="relative -mt-14 mx-auto flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm sm:-mt-16 sm:h-32 sm:w-32"
              >
                {image ? (
                  <Image src={image} alt="" aria-hidden fill sizes="128px" className="object-cover" />
                ) : (
                  <Icon size={30} style={{ color: tint }} />
                )}
              </span>
              <h3 className="mt-4 text-h3-sm text-navy">{title}</h3>
              <p
                className="mt-1 text-p-caption font-bold uppercase tracking-wide"
                style={{ color: tint }}
              >
                {tag}
              </p>
              <p className="mt-3 text-left text-p-small text-navy/70">
                {description} <Cite n={cite} />
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-p-body text-navy/75">
        También existe la alopecia areata -de origen autoinmune, en parches-,
        que ya revisamos en detalle, incluida su fuerte conexión con la
        ansiedad, en{" "}
        <Link
          href="/blog/manejo-ansiedad-caida"
          className="font-bold text-accent hover:underline"
        >
          este otro artículo
        </Link>
        .
      </p>

      <h2 className="mt-12 text-h2-md text-navy">
        Mitos comunes, con lo que dice la evidencia
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Estos son los mitos que más se repiten -algunos completamente falsos,
        otros con algo de verdad a medias.
      </p>

      {/* Grid de 2 columnas en desktop (ago 2026, "diseniador senior" --
          consistente con el grid de tratamientos mas abajo, corta el scroll
          a la mitad) y zona del mito con fondo coral-soft + texto tachado
          para que se lea "esto es falso" de un vistazo, sin tener que leer
          el parrafo completo -- la realidad queda en zona blanca separada,
          el bloque que realmente importa retener. */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {MYTHS.map(({ myth, reality }) => (
          <div
            key={myth}
            className="flex h-full flex-col overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm"
          >
            {/* min-h fija en la zona del mito (ago 2026, "todo simetrico"):
                sin esto, cada mito tiene un largo de texto distinto y la
                linea que separa mito/realidad queda a una altura distinta
                en cada card -- con min-h todas las cards de una misma fila
                del grid parten la realidad exactamente a la misma altura. */}
            {/* Estructura simetrica (ago 2026, "UX UI senior"): mito y
                realidad llevan el mismo patron (label + texto), solo
                diferenciados por color -- antes la realidad no tenia ningun
                marcador y quedaba con menos peso visual que el mito, al
                reves de lo que interesa que la gente retenga. */}
            <div className="flex min-h-[92px] flex-col gap-1.5 bg-coral-soft px-5 py-4">
              <p className="flex items-center gap-1.5 text-p-caption font-bold uppercase tracking-wide text-coral">
                <XCircle size={14} className="shrink-0" />
                Mito
              </p>
              <p className="text-p-body font-semibold text-navy/90">
                &quot;{myth}&quot;
              </p>
            </div>
            <div className="flex-1 bg-accent/5 px-5 py-4">
              <p className="text-p-caption font-bold uppercase tracking-wide text-accent">
                Realidad
              </p>
              <p className="mt-1.5 text-p-body text-navy/75">{reality}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        Qué sí muestra la evidencia: tratamientos con respaldo científico
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        No todos los tratamientos tienen el mismo nivel de evidencia detrás, y
        eso es importante para decidir en qué invertir tiempo y dinero. Esta
        es una fotografía honesta de lo que muestran los estudios hoy -no un
        ranking de "mejor a peor", porque la opción correcta depende del tipo
        de caída y de tu caso particular.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {TREATMENTS.map(({ image, title, evidence, confidence, description, tint }) => (
          <div
            key={title}
            className="overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm"
          >
            {/* Franja de color detras del circulo (ago 2026, "queda muy
                vacio a la derecha"): mismo patron que HAIR_TYPES mas arriba
                -- el tinte usa el mismo color de la mancha de acuarela de
                cada icono, asi la franja se lee como el fondo "natural" de
                la ilustracion en vez de un color desconectado. */}
            <div
              className="h-16 w-full"
              style={{ backgroundColor: `color-mix(in srgb, ${tint} 16%, white)` }}
            />
            <div className="px-6 pb-6">
              <span
                className="relative -mt-[42px] flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm"
                style={{ height: 85, width: 85 }}
              >
                <Image src={image} alt="" aria-hidden fill sizes="85px" className="object-cover" />
              </span>
              <h3 className="mt-3 text-h3-sm text-navy">{title}</h3>
              <p
                className="mt-1 flex items-center gap-1.5 text-p-caption font-bold uppercase tracking-wide"
                style={{ color: tint }}
              >
                <ConfidenceDots level={confidence} />
                {evidence}
              </p>
              <p className="mt-2 text-p-body text-navy/70">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 flex items-center gap-2.5 text-h2-md text-navy">
        <LifeBuoy size={30} className="shrink-0 text-accent" />
        Entonces, ¿por dónde empezar?
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Antes de comprar cualquier producto, el paso con más evidencia detrás
        es simple: identificar qué tipo de caída tienes. Un mismo tratamiento
        puede ser la opción correcta para un tipo de alopecia y completamente
        inútil para otro -por eso una evaluación con un dermatólogo, antes de
        gastar en soluciones milagrosas, es el paso que más tiempo (y dinero)
        te va a ahorrar en el camino.
      </p>

      {/* Foto real de Jessica (ago 2026, "UX UI senior") en vez de una
          acuarela generada: es el unico CTA del articulo que pide agendar
          con una persona real, y ahi la autenticidad de una cara real pesa
          mas que la consistencia con las ilustraciones. CTAs unificados
          (antes el link a la comunidad vivia suelto, 2 parrafos mas abajo,
          compitiendo sin jerarquia con el boton principal) -- ahora ambos
          viven en el mismo bloque, boton como accion principal y el link
          como secundaria justo debajo. */}
      <div className="relative mt-8 overflow-hidden rounded-card-lg border-2 border-accent/25 border-t-4 border-t-accent bg-[linear-gradient(160deg,#ffffff,rgba(96,73,141,0.10))] p-6 text-center shadow-md sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--color-gradient-to)" }}
        />
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 sm:h-[104px] sm:w-[104px]">
          <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full border-2 border-white shadow-sm">
            <Image
              src="/images/founder/jessica-lagno.png"
              alt="Jessica Lagno, fundadora de Pelo a Pelo"
              fill
              sizes="88px"
              className="object-cover"
            />
          </div>
        </div>
        <p className="relative mt-3 text-h3-md text-navy">
          ¿No sabes qué tipo de caída tienes o por dónde partir?
        </p>
        <p className="relative mx-auto mt-2 max-w-md text-p-body text-navy/75">
          Conversarlo con Jessica, fundadora de Pelo a Pelo, puede ser un buen
          primer paso para no navegar esto sola ni a ciegas.
        </p>
        <Button href={CALENDLY_URL} target="_blank" variant="gradient" className="relative mt-5">
          Agendar sesión con Jessica →
        </Button>
        <div className="relative mt-3">
          <Link href="/#comunidad" className="text-a-inline font-bold text-accent hover:underline">
            O conoce la comunidad de Pelo a Pelo →
          </Link>
        </div>
      </div>

      <p className="mt-10 text-p-body text-navy/75">
        No necesitas memorizar diez estudios para tomar buenas decisiones
        sobre tu pelo: solo desconfiar de las promesas demasiado rápidas y
        buscar el criterio de un profesional cuando algo importa de verdad.
        Esa es, de por sí, la mejor defensa contra el champú milagroso.
      </p>

      {/* Referencias: mismo patron que ManejoAnsiedadCaida.tsx -- cada cita
          [n] en el cuerpo apunta aca via anchor #ref-N, todas fuentes reales
          verificadas por busqueda, ninguna inventada. */}
      <div className="mt-16 border-t border-navy/10 pt-8">
        <h2 className="text-h3-lg text-navy">Referencias</h2>
        <ol className="mt-4 flex flex-col gap-2 text-p-small text-navy/60">
          {REFERENCES.map((ref, index) => (
            <li key={ref.url} id={`ref-${index + 1}`} className="flex gap-2 scroll-mt-24">
              <span className="shrink-0 text-navy/40">[{index + 1}]</span>
              <span>
                {ref.text}{" "}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {new URL(ref.url).hostname.replace("www.", "")}
                </a>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
