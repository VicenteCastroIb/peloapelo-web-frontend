// Bloque "video_embed" (fase 3, ago 2026): guarda solo el id de 11
// caracteres de YouTube, no la URL completa que se pega en el inspector --
// asi el render (VideoEmbedBlock.tsx) no tiene que volver a parsear nada.
// Formatos aceptados al pegar: watch?v=, youtu.be/, /embed/, /shorts/, o ya
// el id pelado (11 caracteres, letras/numeros/guion/guion bajo).
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const vParam = url.searchParams.get("v");
      if (vParam && YOUTUBE_ID_PATTERN.test(vParam)) return vParam;

      const match = url.pathname.match(/^\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // No era una URL valida -- ya se probo como id pelado arriba, no hay mas que intentar.
  }

  return null;
}

/** URL del embed en el dominio "privacy-enhanced" (sin cookies de tracking hasta que se reproduce). */
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
