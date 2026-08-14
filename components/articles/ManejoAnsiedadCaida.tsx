import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  LifeBuoy,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import RadialProgress from "@/components/shared/RadialProgress";
import { CALENDLY_URL } from "@/lib/constants";

// Contenido del primer articulo real del blog (ago 2026): antes las 3
// tarjetas de /blog eran mock data sin pagina de detalle (ver
// lib/data/articles.ts). Este es el primer articulo con cuerpo real,
// investigado en fuentes medicas/psicologicas/dermatologicas (ver REFERENCIAS
// al final -- cada afirmacion con numero de cita esta respaldada por un link
// real, no un dato inventado). Los otros 2 articulos del blog quedan
// pendientes de la misma investigacion (ver app/blog/[slug]/page.tsx, que ya
// deja el registro listo para sumarlos sin tocar la estructura).
//
// Herramientas ordenadas de mas inmediata (respiracion, algo que se hace en
// el momento) a mas estructural (terapia): mismo criterio "a tu ritmo" que
// el resto del sitio, no se abre con "anda a terapia" como primer consejo.
//
// Iconos acuarelados a medida (ago 2026, generados en Leonardo AI, ver
// public/images/icons/blog/PROMPTS-higgsfield.md) -- mismo tratamiento
// circular que ya se uso en LOOP_STEPS mas abajo, en vez de badges de
// lucide-react. Decision de diseno (ver hilo ago 2026): se descarto tanto el
// layout zigzag (imagen alternando de lado en cada card) como la imagen de
// fondo con degrade -- estas 5 acuarelas tienen el sujeto centrado y
// reconocible (el ojo, las manos, las 2 figuras), asi que recortarlas como
// fondo de card arriesgaba tapar justo la parte con mas detalle. El circulo
// grande y siempre al mismo lado mantiene consistencia con el diagrama del
// circulo de arriba y no arriesga recortes raros.
const TOOLS = [
  {
    image: "/images/icons/blog/respiracion-ciclica.jpg",
    title: "Respiración cíclica (cyclic sighing)",
    how: "Dos inhalaciones seguidas por la nariz -la segunda, corta, hasta llenar del todo los pulmones- y una exhalación larga y lenta por la boca. Repite durante 1 a 5 minutos.",
    why: (
      <>
        Un ensayo de Stanford (2023) comparó esta técnica con mindfulness y otros
        patrones de respiración durante un mes: la respiración cíclica bajó más el
        estrés fisiológico y mejoró más el ánimo que la meditación de mindfulness
        de la misma duración. <Cite n={8} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/anclaje-5-4-3-2-1.jpg",
    title: "Anclaje 5-4-3-2-1",
    how: "Nombra -para ti o en voz alta- 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que puedes saborear.",
    why: (
      <>
        Técnica de anclaje sensorial que ayuda a desactivar la respuesta de
        alerta del sistema nervioso; forma parte de los protocolos de primera
        línea en programas clínicos de salud conductual. <Cite n={11} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/autocompasion.jpg",
    title: "Autocompasión, en vez de autocrítica",
    how: "Cuando te sorprendas pensando \"no puedo con esto\" o \"algo está mal conmigo\", prueba decirte -en silencio o en voz baja-: \"esto es difícil de verdad\" (validación), \"no soy la única a la que le pasa\" (humanidad compartida), \"¿qué necesito ahora mismo?\" (amabilidad).",
    why: (
      <>
        Un metaanálisis con 14 estudios encontró una asociación fuerte entre
        mayor autocompasión y menores síntomas de ansiedad, depresión y estrés.{" "}
        <Cite n={9} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/escritura-expresiva.jpg",
    title: "Escritura expresiva",
    how: "Escribe 15-20 minutos, sin editar ni pensar en la ortografía, sobre lo que sientes respecto a tu pelo y tu cuerpo en este momento. Repetirlo 3-4 días seguidos suele funcionar mejor que hacerlo una sola vez.",
    why: (
      <>
        Décadas de investigación desde el trabajo original de James Pennebaker
        muestran que poner en palabras lo que sientes reduce la ansiedad, mejora
        el ánimo y baja la tensión física asociada al estrés. <Cite n={10} />
      </>
    ),
  },
  {
    image: "/images/icons/blog/terapia-psicologica.jpg",
    title: "Terapia psicológica (TCC / mindfulness)",
    how: "Conversarlo con un psicólogo, idealmente con experiencia en salud dermatológica o en manejo de ansiedad -presencial, online, o como primer paso agendando una sesión de orientación.",
    why: (
      <>
        La terapia cognitivo-conductual ha mostrado beneficios en el manejo del
        impulso de tocarse o arrancarse el pelo, y programas de reducción de
        estrés basados en mindfulness (MBSR) mostraron mejoras en calidad de
        vida y menor ansiedad en personas con alopecia areata. <Cite n={7} />
      </>
    ),
  },
];

// Diagrama del circulo estres-cortisol (ago 2026, complemento pedido): antes
// esto era una quote-card de puro texto con flechas en italica -- como es,
// literalmente, un loop que se retroalimenta, un diagrama de 4 pasos se lee
// mucho mas rapido que una oracion larga. RotateCcw al final cierra el circulo
// de vuelta al primer paso en vez de dejarlo como una linea recta.
//
// Iconos acuarelados a medida (ago 2026, generados en Leonardo AI, ver
// public/images/icons/blog/PROMPTS-higgsfield.md) -- mismo tratamiento que
// fondo-preguntas.jpg y la portada del blog (trazo navy + mancha de acuarela),
// reemplazan los iconos planos de lucide-react que estaban aca antes.
const LOOP_STEPS = [
  { image: "/images/icons/blog/cae-mas-pelo.jpg", label: "Cae más pelo" },
  { image: "/images/icons/blog/sube-ansiedad.jpg", label: "Sube la ansiedad" },
  { image: "/images/icons/blog/sube-cortisol.jpg", label: "Sube el cortisol" },
  { image: "/images/icons/blog/foliculo-duerme.jpg", label: "El folículo se \"duerme\"" },
];

const SIGNALS = [
  "La ansiedad no baja después de varias semanas probando estas herramientas.",
  "Evitas actividades sociales, fotos o lugares con espejos por tu pelo.",
  "Te cuesta dormir, concentrarte o disfrutar cosas que antes disfrutabas.",
  "Los pensamientos sobre tu pelo ocupan gran parte del día.",
  "Sientes que no puedes con esto sola.",
];

const REFERENCES = [
  {
    text: "Choi, S. et al. (2021). Corticosterone inhibits GAS6 to govern hair follicle stem-cell quiescence. Nature, 592, 428–432.",
    url: "https://www.nature.com/articles/s41586-021-03417-2",
  },
  {
    text: "Harvard Stem Cell Institute. How chronic stress leads to hair loss (resumen del estudio anterior).",
    url: "https://www.hsci.harvard.edu/news/how-chronic-stress-leads-to-hair-loss",
  },
  {
    text: "Mayo Clinic. Stress and hair loss: Are they related?",
    url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/expert-answers/stress-and-hair-loss/faq-20057820",
  },
  {
    text: "StatPearls (NCBI Bookshelf). Telogen Effluvium.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK430848/",
  },
  {
    text: "Layegh, P. et al. Prevalence of Psychological Disorders in Patients with Alopecia Areata in Comparison with Normal Subjects.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3966411/",
  },
  {
    text: "The association between alopecia areata and anxiety, depression, schizophrenia, and bipolar disorder: a population-based study.",
    url: "https://pubmed.ncbi.nlm.nih.gov/34089375/",
  },
  {
    text: "The role of psychological stress in hair loss: A review. JAAD Reviews.",
    url: "https://www.jaadreviews.org/article/S2950-1989(25)00094-7/fulltext",
  },
  {
    text: "Stanford Medicine. Cyclic sighing tops other breathing methods for calming down.",
    url: "https://stanmed.stanford.edu/cyclic-sighing-stress-relief/",
  },
  {
    text: "MacBeth, A., & Gumley, A. (2012). Exploring compassion: a meta-analysis of the association between self-compassion and psychopathology. Clinical Psychology Review, 32(6).",
    url: "https://pubmed.ncbi.nlm.nih.gov/22796446/",
  },
  {
    text: "Research on Expressive Writing in Psychology: A Forty-year Bibliometric Analysis.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9611203/",
  },
  {
    text: "5-4-3-2-1 Grounding Technique for Anxiety (revisión médica, con referencia al ensayo clínico en estudiantes de enfermería).",
    url: "https://www.healthline.com/health/anxiety/5-4-3-2-1-grounding-technique-for-anxiety",
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

// Version chica de StatCard (Estadisticas.tsx) para destacar las 2 cifras mas
// citables del articulo (66,7% / 73,3%), que antes vivian enterradas en medio
// de un parrafo. No se reusa StatCard directo porque no esta exportado (es
// privado de Estadisticas.tsx) y esta version no necesita icono propio, solo
// el anillo + numero + label.
function StatRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-card-md border border-navy/10 bg-navy/5 p-5">
      <div className="relative shrink-0" style={{ width: 60, height: 60 }}>
        <RadialProgress
          value={value}
          size={60}
          strokeWidth={5}
          trackClassName="stroke-navy/10"
          progressClassName="stroke-accent"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-h3-sm font-bold text-navy [font-variant-numeric:tabular-nums]">
            <AnimatedCounter value={value} suffix="%" className="text-navy" />
          </p>
        </div>
      </div>
      <p className="text-p-small leading-snug text-navy/75">{label}</p>
    </div>
  );
}

export default function ManejoAnsiedadCaida() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Disclaimer clinico: obligatorio en contenido de salud/bienestar --
          deja explicito que el articulo informa pero no reemplaza una
          evaluacion profesional, mismo criterio de honestidad ("sin
          promesas vacias") que ya rige el resto del copy del sitio. */}
      <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small text-navy/70">
        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          Este artículo es educativo y está basado en evidencia científica
          disponible a la fecha de publicación (fuentes citadas al final). No
          reemplaza una evaluación clínica: si la ansiedad está afectando tu
          día a día, conversarlo con un profesional de salud mental es un
          paso válido y valiente.
        </p>
      </div>

      <p className="mt-8 text-p-lead text-navy/80">
        Ver más pelo del habitual en la almohada, en la ducha o en el cepillo
        puede disparar una ola de ansiedad casi inmediata. No es que estés
        exagerando ni que le estés &quot;dando demasiada vuelta&quot;: la
        conexión entre la caída de cabello y la ansiedad tiene una explicación
        emocional y biológica real, y funciona en ambas direcciones.
      </p>
      <p className="mt-4 text-p-lead text-navy/80">
        En este artículo revisamos qué dice la evidencia sobre esa conexión y
        compartimos herramientas concretas, con respaldo científico, para los
        momentos en que la ansiedad se siente más intensa -sin negar lo que
        sientes ni prometerte que &quot;con pensar positivo se soluciona&quot;.
      </p>

      <h2 className="mt-12 text-h2-md text-navy">
        Por qué la caída dispara tanto la ansiedad
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        El pelo no es solo estética: es parte de cómo te reconoces al espejo y
        de cómo te presentas al mundo, así que perderlo activa mucho más que
        una preocupación cosmética. Esto no es solo una impresión subjetiva
        -está documentado en la literatura clínica. Un estudio con pacientes
        de alopecia areata encontró que un 66,7% presentaba síntomas
        significativos de depresión y un 73,3%, de ansiedad, cifras muy por
        encima de la población general. <Cite n={5} />
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <StatRing value={67} label="de pacientes con alopecia areata reportó síntomas de depresión" />
        <StatRing value={73} label="de pacientes con alopecia areata reportó síntomas de ansiedad" />
      </div>

      <p className="mt-4 text-p-body text-navy/75">
        Un estudio poblacional a gran escala confirmó que la ansiedad está
        asociada de forma independiente a la alopecia areata en todos los
        grupos etarios sobre los 30 años, con tasas similares entre hombres y
        mujeres. <Cite n={6} /> Por eso hoy se recomienda que la evaluación
        dermatológica de la caída de cabello incluya, cuando corresponde, una
        mirada a su impacto psicológico -no como un anexo, sino como parte
        del cuadro completo. <Cite n={7} />
      </p>

      <h2 className="mt-12 text-h2-md text-navy">
        El círculo que se retroalimenta: estrés, cortisol y folículo
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Cuando un evento estresante es intenso, puede empujar a un número
        alto de folículos hacia la fase de reposo (telógena) antes de tiempo
        -una condición llamada efluvio telógeno. La caída suele notarse recién
        entre 6 y 12 semanas después del evento que la gatilló, y tiende a
        resolverse en unos 6 meses una vez que el estrés de fondo baja.{" "}
        <Cite n={3} /> <Cite n={4} />
      </p>
      <p className="mt-4 text-p-body text-navy/75">
        En 2021, un equipo de Harvard identificó el mecanismo biológico
        exacto: el cortisol (la hormona del estrés) suprime la actividad de un
        gen llamado GAS6, y eso mantiene a las células madre del folículo
        piloso en un estado de reposo prolongado, sin regenerar el cabello.{" "}
        <Cite n={1} /> <Cite n={2} />
      </p>
      <div className="mt-6 rounded-card-lg bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-6 shadow-sm sm:p-8 lg:p-8">
        {/* lg: en vez de md: (ago 2026, con flechas mas grandes): con 4
            iconos de 139px + flechas de 28px, a md: (768px, ej. iPad
            portrait) el contenedor todavia no llego a su ancho maximo
            (max-w-3xl = 768px) y queda muy justo. A lg: (1024px) el
            contenedor ya esta en su tope de 768px con espacio real de
            sobra -- flex-nowrap fuerza que nunca se bajen de linea (si no
            entran, se ven apretados, pero alineados, en vez de
            descalzarse). Por debajo de lg seguimos en columna (sin riesgo
            de apretarse, cada icono ocupa el ancho completo). */}
        <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:flex-nowrap lg:gap-x-1">
          {LOOP_STEPS.map(({ image, label }, index) => (
            <div key={label} className="flex flex-col items-center gap-2 lg:flex-row">
              <div className="flex w-[139px] shrink-0 flex-col items-center gap-2 text-center">
                <span className="relative h-[139px] w-[139px] overflow-hidden rounded-full bg-white shadow-sm">
                  <Image src={image} alt="" aria-hidden fill sizes="139px" className="object-cover" />
                </span>
                <p className="text-p-small font-semibold leading-snug text-navy">{label}</p>
              </div>
              {index < LOOP_STEPS.length - 1 && (
                <>
                  <ArrowDown size={28} className="text-accent/50 lg:hidden" />
                  <ArrowRight size={28} className="hidden shrink-0 text-accent/50 lg:block" />
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-p-small font-semibold text-accent">
          <RotateCcw size={16} className="shrink-0" />
          El ciclo se repite mientras la ansiedad no baja
        </div>
        <p className="mt-4 text-center text-p-body text-navy/80">
          Bajar la ansiedad, entonces, no es un gesto estético ni &quot;pensar
          positivo&quot;: es intervenir en un mecanismo biológico real.
        </p>
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        Herramientas con respaldo científico para el momento en que la
        ansiedad sube
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Ninguna de estas herramientas &quot;cura&quot; la causa de fondo de tu
        caída de cabello, pero sí bajan la ansiedad en el momento -y ese
        alivio, sostenido en el tiempo, es parte del tratamiento, no un
        extra. Van de lo más inmediato a lo más estructural: no hace falta
        empezar por terapia si hoy lo que necesitas es bajar la ansiedad de
        los próximos cinco minutos.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {TOOLS.map(({ image, title, how, why }, index) => (
          <div
            key={title}
            className="flex flex-col gap-4 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
              <span className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-navy/5 shadow-sm sm:h-32 sm:w-32">
                <Image src={image} alt="" aria-hidden fill sizes="128px" className="object-cover" />
              </span>
              <span className="text-p-caption font-bold uppercase tracking-wide text-navy/40 sm:hidden">
                {index + 1}
              </span>
            </div>
            <div>
              <h3 className="text-h3-md text-navy">{title}</h3>
              <p className="mt-2 text-p-body text-navy/75">{how}</p>
              <p className="mt-2 text-p-small text-navy/55">{why}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        Cuando revisar el espejo se vuelve parte del ciclo
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Es común empezar a revisar el cuero cabelludo, contar pelos en la
        almohada o pasarte los dedos por el pelo muchas veces al día
        &quot;para estar segura&quot;. El problema es que ese chequeo repetido
        suele mantener la ansiedad activa en vez de calmarla. Si notas que te
        cuesta dejar de mirar, tocar o contar, no es falta de voluntad: es un
        patrón conocido, y también se puede trabajar con apoyo profesional.
      </p>

      <h2 className="mt-12 flex items-center gap-2.5 text-h2-md text-navy">
        <LifeBuoy size={30} className="shrink-0 text-accent" />
        Cuándo pedir ayuda profesional
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Estas son algunas señales de que vale la pena sumar apoyo profesional
        a las herramientas anteriores:
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {SIGNALS.map((signal) => (
          <li key={signal} className="flex items-start gap-3 text-p-body text-navy/75">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            {signal}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-p-body text-navy/75">
        Pedir ayuda no es un último recurso: es una herramienta más de esta
        lista, y muchas veces la más efectiva.
      </p>

      {/* Foto real de Jessica + CTAs unificados -- mismo trato que
          MitosComunesAlopecia.tsx (ver nota alli). */}
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
          ¿La ansiedad te está costando más de lo que puedes sola?
        </p>
        <p className="relative mx-auto mt-2 max-w-md text-p-body text-navy/75">
          Conversarlo directamente con Jessica, psicóloga y fundadora de Pelo a
          Pelo, puede ser un buen primer paso.
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
        Lo que sientes frente al espejo hoy es real, tiene una explicación, y
        no tienes que atravesarlo sola. Bajar la ansiedad no te devuelve el
        pelo de un día para otro, pero sí te devuelve algo de calma en el
        camino -y esa calma, además, es parte de lo que tu cuerpo necesita
        para sanar.
      </p>

      {/* Referencias: cada cita [n] en el cuerpo del articulo apunta aca via
          anchor #ref-N. Todas son fuentes reales verificadas por busqueda
          (papers, instituciones academicas/medicas) -- ninguna inventada,
          mismo criterio que el resto del sitio (ver nota en
          Estadisticas.tsx: no se cita lo que no esta verificado). */}
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
