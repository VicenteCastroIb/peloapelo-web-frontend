import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/constants";
import type { CtaCardBlockData } from "@/lib/types/blogBlocks";

// Card de cierre con foto real de Jessica (fundadora) + CTAs unificados --
// mismo patron en los 3 articulos originales. La foto, el boton de Calendly
// y el link a la comunidad son fijos a proposito (identidad de marca), solo
// la pregunta/subtexto se editan por articulo.
export default function CtaCardBlock({ data }: { data: CtaCardBlockData }) {
  return (
    <div className="relative overflow-hidden rounded-card-lg border-2 border-accent/25 border-t-4 border-t-accent bg-[linear-gradient(160deg,#ffffff,rgba(96,73,141,0.10))] p-6 text-center shadow-md sm:p-8">
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
      <p className="relative mt-3 text-h3-md text-navy">{data.question}</p>
      <p className="relative mx-auto mt-2 max-w-md text-p-body text-navy/75">{data.subtext}</p>
      <Button href={CALENDLY_URL} target="_blank" variant="gradient" className="relative mt-5">
        Agendar sesión con Jessica →
      </Button>
      <div className="relative mt-3">
        <Link href="/#comunidad" className="text-a-inline font-bold text-accent hover:underline">
          O conoce la comunidad de Pelo a Pelo →
        </Link>
      </div>
    </div>
  );
}
