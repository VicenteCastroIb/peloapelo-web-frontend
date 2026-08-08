export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
}

// Mock data para <RelatedArticles /> (home) y /blog (ver tarea de
// reestructuracion, ago 2026). No existen paginas de detalle por articulo
// todavia -- por eso las tarjetas enlazan a /blog en vez de a un slug que
// devolveria 404.
//
// Portadas propias (ago 2026): reemplazan las de lib/data/courses.ts
// (paleta teal/naranja, fuera de la paleta de marca, solo un placeholder
// temporal). Linea navy + acuarela en public/images/blog/, un tono de
// marca distinto por portada (celeste / coral palido / lavanda) para que
// no se vean todas iguales -- ver prompts de generacion en el historial de
// esta tarea.
//
// "manejo-ansiedad-caida": la figura de esta ilustracion no tiene cabello
// visible (silueta calva en meditacion) -- se marco la duda de que pudiera
// leerse como paciente oncologico, pero a pedido explicito del cliente se
// usa igual (revisado y aprobado, ago 2026).
export const articles: Article[] = [
  {
    slug: "manejo-ansiedad-caida",
    title: "Manejo de ansiedad ante la caída",
    excerpt:
      "Herramientas concretas para bajar la ansiedad en los momentos donde la caída se siente más intensa, sin negar lo que sientes.",
    category: "Bienestar emocional",
    image: "/images/blog/manejo-ansiedad-caida.jpg",
    readTime: "6 min de lectura",
  },
  {
    slug: "mitos-comunes-alopecia",
    title: "Mitos comunes sobre la alopecia",
    excerpt:
      "Del estrés al champú milagroso: qué dice realmente la evidencia sobre las causas y los tratamientos de la alopecia.",
    category: "Educación",
    image: "/images/blog/mitos-comunes-alopecia.jpg",
    readTime: "5 min de lectura",
  },
  {
    slug: "guia-autocuidado",
    title: "Guía de autocuidado",
    excerpt:
      "Hábitos simples de cuerpo y mente para sostener tu bienestar día a día, más allá de cualquier tratamiento.",
    category: "Autocuidado",
    image: "/images/blog/guia-autocuidado.jpg",
    readTime: "7 min de lectura",
  },
];
