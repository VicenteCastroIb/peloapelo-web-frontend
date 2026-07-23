"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { faqItems } from "@/lib/data/faq";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="preguntas" className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-3xl">
        <SectionBadge label="Preguntas · VII" />
        <h2 className="text-h2-lg text-navy">
          Lo que <span className="italic text-accent">te preguntas</span>.
        </h2>

        <div className="mt-10 border-t border-navy/10">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-navy/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-5 text-left text-h3-sm font-medium"
                >
                  {item.question}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-navy/50 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && <p className="pb-5 text-p-body text-navy/70">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
