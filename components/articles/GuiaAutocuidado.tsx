import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  Feather,
  HeartHandshake,
  LifeBuoy,
  Moon,
  PenLine,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/constants";

// Tercer articulo real del blog (ago 2026), mismo criterio que los otros 2:
// cada afirmacion con cita [n] esta respaldada por una fuente real
// verificada por busqueda (AASM, OMS, JAAD, AAD, PMC, PubMed, DermNet NZ),
// nunca un dato inventado -- ver REFERENCIAS al final. A diferencia de
// "Manejo de ansiedad ante la caida" (herramientas para el momento agudo),
// esta guia son habitos sostenidos en el tiempo -- por eso evita repetir
// respiracion ciclica/anclaje 5-4-3-2-1 (ya cubiertos alli) y se enfoca en
// sueno, movimiento, nutricion, sol, cuidado capilar y comunidad.
const BODY_HABITS = [
  {
    icon: Moon,
    image: "/images/icons/blog/dormir-bien.png",
    tint: "#8F7CB6",
    title: "Dormir 7 horas o más, con horario regular",
    how: "Trata de acostarte y levantarte a la misma hora todos los días -incluidos los fines de semana- y evita siestas después de las 15:00.",
    why: (
      <>
        La Academia Americana de Medicina del Sueño recomienda 7 horas o más
        por noche para una salud óptima. <Cite n={1} /> Además, dormir poco
        activa los mismos sistemas de estrés del cuerpo (el eje
        hipotálamo-hipófisis-adrenal) que dispara la ansiedad -dormir bien no
        es un lujo, es parte del manejo del estrés. <Cite n={2} />
      </>
    ),
  },
  {
    icon: Activity,
    image: "/images/icons/blog/moverte.png",
    tint: "#A3C08B",
    title: "Moverte, aunque sea poco, pero seguido",
    how: "La Organización Mundial de la Salud recomienda entre 150 y 300 minutos semanales de actividad moderada -caminar rápido cuenta. No hace falta partir con eso: unos minutos al día ya suman.",
    why: (
      <>
        La evidencia sobre actividad física y salud mental es especialmente
        fuerte para depresión y ansiedad, con mejoras medibles incluso con
        niveles moderados de ejercicio. <Cite n={3} /> <Cite n={4} />
      </>
    ),
  },
  {
    icon: Feather,
    image: "/images/icons/blog/hierro-ferritina.png",
    tint: "#D9A3B0",
    title: "Si te sientes agotada, pregunta por tu hierro -no te autorecetes",
    how: "Si además de la caída sientes cansancio inusual, conversa con tu médico sobre medir tu ferritina (reserva de hierro) antes de tomar suplementos por tu cuenta.",
    why: (
      <>
        La relación entre déficit de hierro y caída de cabello tiene
        evidencia mixta -algunos estudios la encuentran, otros no- así que
        vale la pena diagnosticarlo con un examen real antes de suplementar a
        ciegas. <Cite n={5} />
      </>
    ),
  },
  {
    icon: Sun,
    image: "/images/icons/blog/proteger-sol.png",
    tint: "#E8B979",
    title: "Proteger tu cuero cabelludo del sol",
    how: "Usa protector solar SPF 30+ en el cuero cabelludo -en cantidad generosa, reaplicando cada 2 horas- o cúbrelo con un sombrero o pañuelo. Es igual de importante con poco pelo que con mucho.",
    why: (
      <>
        El cuero cabelludo es una de las zonas más comunes de cáncer de piel
        de tipo espinocelular, y suele quedar fuera de las rutinas de
        protección solar habituales -especialmente en personas con menos
        pelo que las cubra. <Cite n={6} />
      </>
    ),
  },
];

const MIND_HABITS = [
  {
    icon: PenLine,
    image: "/images/icons/blog/escritura-sostenida.png",
    tint: "#89CFEB",
    title: "Escritura expresiva, como práctica sostenida",
    how: "Más allá del momento de ansiedad aguda, escribir 15 minutos unas veces por semana sobre lo que sientes -sin editar ni buscar que quede \"bien escrito\"- funciona como práctica regular, no solo como herramienta de emergencia.",
    why: (
      <>
        Décadas de investigación muestran que poner en palabras lo que
        sientes, de forma sostenida, reduce la ansiedad y mejora el ánimo con
        el tiempo. <Cite n={7} />
      </>
    ),
  },
  {
    icon: HeartHandshake,
    image: "/images/icons/blog/autocompasion-diaria.png",
    tint: "#9CB8DE",
    title: "Autocompasión como hábito, no solo como rescate",
    how: "Trátate con la misma amabilidad con la que tratarías a una amiga que está pasando por esto -no solo en los días difíciles, sino como una forma habitual de hablarte.",
    why: (
      <>
        Mayor autocompasión se asocia de forma consistente con menores
        síntomas de ansiedad, depresión y estrés a lo largo del tiempo, no
        solo en el momento agudo. <Cite n={8} />
      </>
    ),
  },
  {
    icon: LifeBuoy,
    image: "/images/icons/blog/mindfulness-constancia.png",
    tint: "#8F7CB6",
    title: "Mindfulness o reducción de estrés, con constancia",
    how: "Programas de mindfulness (MBSR) suelen durar 8 semanas con práctica regular -no es necesario hacerlo perfecto, la constancia importa más que la duración de cada sesión.",
    why: (
      <>
        En personas con alopecia areata, los programas de reducción de estrés
        basados en mindfulness mostraron mejoras en calidad de vida, ansiedad
        y síntomas asociados. <Cite n={9} />
      </>
    ),
  },
];

const HAIR_CARE_TIPS = [
  "Usa un shampoo suave y aplica acondicionador después de cada lavado -ayuda a reducir la rotura.",
  "Al lavar, masajea el cuero cabelludo con suavidad; al enjuagar, deja que el acondicionador corra por el largo sin frotarlo con fuerza.",
  "Sécalo presionando con una toalla o polera de algodón, en vez de frotarlo -el pelo mojado es más frágil.",
  "Si usas secador, plancha o bucles, hazlo con calor bajo o medio y un protector térmico, y trata de espaciar su uso.",
  "Evita peinados muy tirantes sostenidos por semanas (colas apretadas, trenzas, extensiones) -pueden sumar tensión a un cuero cabelludo que ya está sensible.",
];

// Misma paleta rotativa que BODY_HABITS/MIND_HABITS, para que cada tip
// tenga su propio tinte y la lista no se lea como bloque de texto plano.
const TIP_TINTS = ["#8F7CB6", "#A3C08B", "#D9A3B0", "#E8B979", "#89CFEB"];

const REFERENCES = [
  {
    text: "American Academy of Sleep Medicine (AASM). Healthy Sleep.",
    url: "https://sleepeducation.org/healthy-sleep/",
  },
  {
    text: "Sleep deprivation and stress: a reciprocal relationship. PMC.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7202382/",
  },
  {
    text: "World Health Organization (WHO). Physical activity (fact sheet).",
    url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  },
  {
    text: "Role of Physical Activity on Mental Health and Well-Being: A Review. PMC.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9902068/",
  },
  {
    text: "Trost, M.T. Iron deficiency and hair loss--nothing new? PubMed.",
    url: "https://pubmed.ncbi.nlm.nih.gov/21679815/",
  },
  {
    text: "The Skin Cancer Foundation. Save Your Scalp from Sun Damage!",
    url: "https://www.skincancer.org/blog/save-your-scalp-from-sun-damage/",
  },
  {
    text: "Research on Expressive Writing in Psychology: A Forty-year Bibliometric Analysis. PMC.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9611203/",
  },
  {
    text: "MacBeth, A., & Gumley, A. (2012). Exploring compassion: a meta-analysis of the association between self-compassion and psychopathology. Clinical Psychology Review, 32(6).",
    url: "https://pubmed.ncbi.nlm.nih.gov/22796446/",
  },
  {
    text: "Systematic Review of Psychological Interventions for Quality of Life, Mental Health, and Hair Growth in Alopecia Areata and Scarring Alopecia. PMC.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9917611/",
  },
  {
    text: "American Academy of Dermatology (AAD). 10 hair care habits that can damage your hair.",
    url: "https://www.aad.org/public/everyday-care/hair-scalp-care/hair/habits-that-damage-hair",
  },
  {
    text: "Social support and mental well-being among people with and without chronic illness during the Covid-19 pandemic. PMC.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10929080/",
  },
  {
    text: "DermNet NZ. Psychological effects of hair loss.",
    url: "https://dermnetnz.org/topics/psychological-effects-of-hair-loss",
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

export default function GuiaAutocuidado() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Disclaimer clinico: mismo criterio que los otros 2 articulos. */}
      <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small text-navy/70">
        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          Este artículo es educativo y está basado en evidencia científica
          disponible a la fecha de publicación (fuentes citadas al final). No
          reemplaza una evaluación médica o psicológica: son hábitos de
          respaldo, no un tratamiento.
        </p>
      </div>

      <p className="mt-8 text-p-lead text-navy/80">
        La caída de pelo puede ocupar tanto espacio mental que el resto del
        autocuidado -dormir bien, moverte, comer con cabeza, mantener a la
        gente cerca- pasa a segundo plano. Pero el impacto psicológico de la
        caída está documentado en la literatura clínica, y sostener estos
        hábitos no es un capricho de bienestar: es parte de cómo tu cuerpo y
        tu mente atraviesan este proceso, tengas o no un tratamiento en
        curso. <Cite n={12} />
      </p>
      <p className="mt-4 text-p-lead text-navy/80">
        Esta guía no promete que estos hábitos hagan crecer tu pelo -eso ya
        lo revisamos en{" "}
        <Link
          href="/blog/mitos-comunes-alopecia"
          className="font-bold text-accent hover:underline"
        >
          el artículo sobre mitos y evidencia
        </Link>
        . Lo que sí hacen, con respaldo real, es sostener tu bienestar día a
        día -que es, de por sí, suficiente motivo para cuidarlos.
      </p>

      <h2 className="mt-12 text-h2-md text-navy">
        Cuerpo: la base que sostiene todo
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Ninguno de estos hábitos es nuevo ni espectacular -y esa es la
        gracia: funcionan justamente porque son simples y sostenibles en el
        tiempo.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {BODY_HABITS.map(({ icon: Icon, image, tint, title, how, why }, index) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm"
          >
            <div
              className="h-14 w-full"
              style={{ backgroundColor: `color-mix(in srgb, ${tint} 16%, white)` }}
            />
            <div className="px-5 pb-5">
              <span className="relative -mt-12 inline-flex shrink-0" style={{ height: 96, width: 96 }}>
                <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="96px"
                      className="scale-[1.45] object-cover"
                    />
                  ) : (
                    <Icon size={36} style={{ color: tint }} />
                  )}
                </span>
                <span
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
                  style={{ backgroundColor: tint }}
                >
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-2 text-h3-md text-navy">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-navy/75">{how}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-navy/55">{why}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        Mente: hábitos que sostienen, sin exigir perfección
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Ya revisamos herramientas para el momento en que la ansiedad se
        siente más intensa. Estas son distintas: pensadas para sostener en el
        tiempo, no para el instante agudo.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {MIND_HABITS.map(({ icon: Icon, image, tint, title, how, why }, index) => (
          <div
            key={title}
            className={`relative overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm ${
              index === MIND_HABITS.length - 1 && MIND_HABITS.length % 2 === 1
                ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)]"
                : ""
            }`}
          >
            <div
              className="h-14 w-full"
              style={{ backgroundColor: `color-mix(in srgb, ${tint} 16%, white)` }}
            />
            <div className="px-5 pb-5">
              <span className="relative -mt-12 inline-flex shrink-0" style={{ height: 96, width: 96 }}>
                <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="96px"
                      className="scale-[1.45] object-cover"
                    />
                  ) : (
                    <Icon size={36} style={{ color: tint }} />
                  )}
                </span>
                <span
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
                  style={{ backgroundColor: tint }}
                >
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-2 text-h3-md text-navy">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-navy/75">{how}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-navy/55">{why}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        Tu pelo y tu cuero cabelludo también se cuidan -sin obsesionarte
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Tengas mucho, poco o nada de pelo hoy, el cuero cabelludo sigue
        siendo piel y merece cuidado. Algunos hábitos simples, respaldados
        por dermatología, ayudan a no sumarle estrés extra al pelo que
        tienes:
      </p>
      <div className="mt-4">
        <ul className="grid gap-4 sm:grid-cols-2">
          {HAIR_CARE_TIPS.map((tip, index) => {
            const tint = TIP_TINTS[index % TIP_TINTS.length];
            const isLastOdd =
              index === HAIR_CARE_TIPS.length - 1 && HAIR_CARE_TIPS.length % 2 === 1;
            return (
              <li
                key={tip}
                className={`flex flex-col items-center gap-2 rounded-card-md p-5 text-center text-p-body text-navy/75 ${
                  isLastOdd ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-8px)]" : ""
                }`}
                style={{ backgroundColor: `color-mix(in srgb, ${tint} 26%, white)` }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <CheckCircle2 size={14} style={{ color: tint }} />
                </span>
                {tip}
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-p-small text-navy/55">
          Fuente: recomendaciones de cuidado capilar de la Academia Americana
          de Dermatología. <Cite n={10} />
        </p>
      </div>

      <h2 className="mt-12 text-h2-md text-navy">
        No estás sola: la comunidad también es autocuidado
      </h2>
      <p className="mt-4 text-p-body text-navy/75">
        Cuidar tu cuerpo y tu mente en soledad tiene un límite. El apoyo
        social -amigos, familia, grupos de personas que entienden lo que
        vives- ayuda a sostener el bienestar psicológico en condiciones
        crónicas, y en alopecia específicamente, espacios de apoyo entre
        pares ofrecen un lugar para procesar lo que sientes y ganar
        herramientas concretas de manejo. <Cite n={11} /> <Cite n={9} />
      </p>
      <p className="mt-4 text-p-body text-navy/75">
        Ese es, justamente, uno de los motivos por los que existe esta
        fundación: para que nadie tenga que sostener todo esto -el cuerpo, la
        mente y el pelo- completamente sola.
      </p>

      {/* Foto real de Jessica + CTAs unificados -- mismo trato que los
          otros 2 articulos. */}
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
          ¿Quieres armar tu propia rutina de autocuidado, a tu ritmo?
        </p>
        <p className="relative mx-auto mt-2 max-w-md text-p-body text-navy/75">
          Conversarlo con Jessica, fundadora de Pelo a Pelo, puede ayudarte a
          ordenar por dónde empezar.
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
        Ninguno de estos hábitos te va a devolver el pelo de un día para
        otro, y está bien que así sea -no es esa la promesa. Lo que sí hacen,
        sostenidos en el tiempo, es cuidar a la persona completa que eres
        mientras atraviesas esto: tu cuerpo, tu mente, y la gente que te
        rodea.
      </p>

      {/* Referencias: mismo patron que los otros 2 articulos -- cada cita
          [n] en el cuerpo apunta aca via anchor #ref-N, todas fuentes
          reales verificadas por busqueda, ninguna inventada. */}
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
