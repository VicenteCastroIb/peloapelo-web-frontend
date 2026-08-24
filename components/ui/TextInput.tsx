"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = { as?: "input" } & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = { as: "textarea" } & TextareaHTMLAttributes<HTMLTextAreaElement>;

// Input/textarea del panel: fondo cream (se hunde dentro de la tarjeta
// blanca en vez de flotar sobre ella) en vez del blanco que usa el resto
// del sitio (ver docs/design del rediseno /progress). El input es pildora;
// el textarea usa rounded-icon porque una pildora multilinea se ve mal.
export default function TextInput({
  invalid = false,
  className = "",
  ...props
}: (InputProps | TextareaProps) & { invalid?: boolean }) {
  const base = `w-full border bg-cream text-p-small text-navy placeholder:text-navy/40 outline-none focus:border-accent ${
    invalid ? "border-coral" : "border-navy/10"
  }`;

  if (props.as === "textarea") {
    const { as, ...rest } = props;
    void as;
    return (
      <textarea
        className={`${base} min-h-11 resize-y rounded-icon px-4 py-3 ${className}`}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  }

  const { as, ...rest } = props;
  void as;
  return (
    <input
      className={`${base} min-h-11 rounded-pill px-4 ${className}`}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
