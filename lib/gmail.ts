/**
 * Arma un link de "Redactar" de Gmail en vez de usar mailto:. mailto:
 * depende del cliente de correo que tenga configurado por defecto el
 * sistema operativo (podia abrir Outlook u otro), y a peticion explicita
 * de la fundacion cualquier envio de correo desde el sitio debe pasar por
 * Gmail siempre, sin importar el default del usuario. Se abre en una
 * pestaña nueva (ver target="_blank" en cada uso).
 */
export function gmailComposeUrl(to: string, subject?: string, body?: string): string {
  const params = new URLSearchParams({ view: "cm", fs: "1", to });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
