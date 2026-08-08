"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { gmailComposeUrl } from "@/lib/gmail";

const CONTACTO_EMAIL = "jessica.lagno@peloapelo.cl";

// Pagina nueva /contacto (ver tarea de reestructuracion, ago 2026): no
// existe backend de contacto general todavia (lib/api/leads.ts solo acepta
// source "ebook", ver LeadRequest.java) -- en vez de simular un envio que
// no persiste nada, este formulario arma un correo real via Gmail Compose
// (mismo patron que el resto del sitio, ver lib/gmail.ts) con lo que la
// persona escribio. 100% funcional, sin backend nuevo que mantener.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = name.trim() && email.trim() && message.trim();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    const subject = `Contacto desde la web · ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    window.open(gmailComposeUrl(CONTACTO_EMAIL, subject, body), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-card-lg border border-navy/10 bg-white p-6 sm:p-8">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-p-small font-medium text-navy/70">
          Tu nombre
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-card-md border border-navy/15 bg-cream/40 px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-p-small font-medium text-navy/70">
          Tu correo
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-card-md border border-navy/15 bg-cream/40 px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-p-small font-medium text-navy/70">
          Cuéntanos en qué te podemos acompañar
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full resize-none rounded-card-md border border-navy/15 bg-cream/40 px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent"
        />
      </div>

      <Button type="submit" variant="gradient" disabled={!canSubmit} className="w-full">
        Enviar mensaje <Send size={15} />
      </Button>

      <p className="text-p-caption text-navy/50">
        Al enviar, se abrirá Gmail con tu mensaje ya redactado hacia nuestro correo.
      </p>
    </form>
  );
}
