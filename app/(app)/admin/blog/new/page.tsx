"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createArticle, listAdminArticles, type ArticleRequest } from "@/lib/api/adminBlog";
import ArticleForm from "@/components/admin/blog/ArticleForm";
import LiveArticlePreview from "@/components/admin/blog/LiveArticlePreview";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";

const EMPTY: ArticleRequest = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  coverImageUrl: "",
  readTime: "",
  published: false,
  displayOrder: 0,
};

export default function NewArticlePage() {
  const { token } = useAuth();
  const router = useRouter();
  // Ya no hay input de "orden en el listado" en el formulario (se reordena
  // con flechas desde /admin/blog) -- por eso el articulo nuevo necesita un
  // displayOrder por defecto sensato: el largo actual de la lista, para que
  // caiga al final en vez de pisar la posicion 0 de otro articulo.
  const [initial, setInitial] = useState<ArticleRequest | null>(null);
  const [draftFields, setDraftFields] = useState<ArticleRequest>(EMPTY);

  useEffect(() => {
    listAdminArticles(token)
      .then((list) => {
        const withOrder = { ...EMPTY, displayOrder: list.length };
        setInitial(withOrder);
        setDraftFields(withOrder);
      })
      .catch(() => {
        setInitial(EMPTY);
        setDraftFields(EMPTY);
      });
  }, [token]);

  async function handleSubmit(values: ArticleRequest) {
    const created = await createArticle(token, values);
    router.push(`/admin/blog/${created.id}`);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 max-w-2xl">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-a-inline font-semibold text-navy/60">
          <ArrowLeft size={14} /> Panel de blog
        </Link>
        <h1 className="mt-4 text-h3-lg text-navy">Nuevo artículo</h1>
        <p className="mt-1 text-p-body text-navy/60">Después de crearlo podrás agregar el contenido en bloques.</p>

        <div className="mt-6">
          {initial ? (
            <ArticleForm
              initial={initial}
              submitLabel="Crear artículo"
              onSubmit={handleSubmit}
              onChange={setDraftFields}
            />
          ) : (
            <p className="text-p-small text-navy/50">Cargando…</p>
          )}
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <PreviewErrorBoundary>
          <LiveArticlePreview fields={draftFields} blocks={[]} />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
