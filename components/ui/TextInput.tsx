"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = { as?: "input" } & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = { as: "textarea" } & TextareaHTMLAttributes<HTMLTextAreaElement>;

// Input/textarea del panel: fondo cream (se hunde dentro de la tarjeta
// blanca en vez de flotar sobre ella) en vez del blanco que usa el resto
// del sitio (ver docs/design del rediseno /progress). El input es pildora;
// el textarea usa rounded-icon porque una pildora multilinea se ve mal.
// Tono de solo-lectura (ver docs/design del rediseno /profile): fondo
// navy/5 + texto navy/70 en vez del cream editable, para que un formulario
// en modo lectura se distinga de uno editable sin depender solo del cursor.
export default function TextInput({
  invalid = false,
  className = "",
  ...props
}: (InputProps | TextareaProps) & { invalid?: boolean }) {
  const tone = props.readOnly ? "bg-navy/5 text-navy/70" : "bg-cream text-navy";
  const base = `w-full border ${tone} text-p-small placeholder:text-navy/40 outline-none focus:border-accent ${
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
