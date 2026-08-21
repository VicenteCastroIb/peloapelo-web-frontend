import { apiFetch } from "./client";

// Subida de imagenes del bloque "image" del editor visual (fase 3, ago
// 2026) -- ver backend AdminMediaController. Video no pasa por aca: el
// bloque "video_embed" solo guarda un id de YouTube (ver lib/blog/youtube.ts).
export interface MediaUploadResponse {
  url: string;
}

export function uploadMedia(token: string | null | undefined, file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<MediaUploadResponse>("/api/admin/media", { method: "POST", body, token });
}
