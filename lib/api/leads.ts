import { apiFetch } from "./client";

/**
 * Origenes validos de un lead -- deben coincidir exactamente con el
 * @Pattern del backend (ver LeadRequest.java). Si se agrega un nuevo
 * formulario de captura a futuro, el valor nuevo debe agregarse en ambos
 * lados.
 */
export type LeadSource = "ebook";

export function captureLead(name: string, email: string, source: LeadSource) {
  return apiFetch<void>("/api/leads", {
    method: "POST",
    body: { name, email, source },
  });
}
