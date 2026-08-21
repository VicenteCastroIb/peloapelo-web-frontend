"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ApiError } from "@/lib/api/client";
import type { BlockData, BlockType } from "@/lib/types/blogBlocks";
import { BLOCK_TYPE_LABEL, defaultBlockData } from "@/lib/admin/blogBlockDefaults";
import BlockDataList from "@/components/articles/BlockDataList";
import PreviewErrorBoundary from "@/components/admin/PreviewErrorBoundary";
import BlockPalette from "./BlockPalette";
import BlockInspector from "./BlockInspector";

/** Forma minima que necesita este editor de un bloque ya guardado -- tanto AdminArticleBlock como AdminLessonBlock (fase 4) la cumplen. */
export interface OwnedBlock {
  id: string;
  blockType: string;
  position: number;
  dataJson: string;
}

interface BlockRequestBody {
  blockType: string;
  position: number;
  dataJson: string;
}

/** CRUD de bloques inyectado por quien usa el editor -- ver lib/api/adminBlog.ts (articulos) y lib/api/adminCourses.ts (lecciones, fase 4). Mismo componente, dos consumidores, sin duplicar esta logica. */
export interface BlockListApi {
  create: (token: string | null | undefined, ownerId: string, body: BlockRequestBody) => Promise<{ id: string }>;
  update: (token: string | null | undefined, blockId: string, body: BlockRequestBody) => Promise<unknown>;
  remove: (token: string | null | undefined, blockId: string) => Promise<void>;
  reorder: (token: string | null | undefined, ownerId: string, blockIds: string[]) => Promise<void>;
}

function parseBlockData(dataJson: string, blockType: string): BlockData | null {
  try {
    const parsed = JSON.parse(dataJson);
    return { ...parsed, type: blockType } as BlockData;
  } catch {
    return null;
  }
}

// Editor visual de bloques (fase 0, ago 2026; generico desde fase 4) -- un
// lienzo de 3 columnas: paleta (agregar) | lienzo (headerPreview opcional +
// BlockDataList en modo editable: el contenido real, seleccionable/
// arrastrable) | inspector (editar el bloque seleccionado). El "borrador en
// vivo" de los bloques se mantiene aca (parsea cada `dataJson` apenas llega,
// actualiza en cada tecla que se escribe en el inspector) para que el
// lienzo se vea siempre actualizado -- el guardado real a la API sigue
// siendo por bloque (boton "Guardar bloque" del inspector).
export default function BlockList({
  ownerId,
  blocks,
  headerPreview,
  emptyMessage = "Todavía no hay contenido. Agregá el primer bloque desde el panel de la izquierda.",
  token,
  api,
  onChange,
}: {
  /** id del articulo o leccion dueño de estos bloques. */
  ownerId: string;
  blocks: OwnedBlock[];
  /** Se muestra arriba de los bloques dentro del mismo lienzo (ej. ArticleHeaderPreview con titulo/portada) -- opcional porque no todos los consumidores tienen un "encabezado" propio (ver LessonEditor.tsx, fase 4). */
  headerPreview?: ReactNode;
  emptyMessage?: string;
  token: string | null | undefined;
  api: BlockListApi;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [draft, setDraft] = useState<Record<string, BlockData | null>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  // Resembrar el borrador cuando cambia la lista de bloques en si (carga
  // inicial, o despues de agregar/eliminar/reordenar, que van directo a la
  // API y recargan) -- NO en cada tecla, eso lo maneja onDataChange abajo
  // actualizando `draft` directamente sin volver a parsear todo. No se puede
  // calcular `draft` directo en el render (regla react-hooks/set-state-in-effect)
  // porque diverge a proposito de `blocks` mientras se tipea; y un `key` que
  // remonte el arbol en cada reload tiraria la seleccion/scroll actual.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(Object.fromEntries(sorted.map((b) => [b.id, parseBlockData(b.dataJson, b.blockType)])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  // Bloques con dataJson invalido (ej. editado fuera del panel) -- no se
  // pueden renderizar en el lienzo, asi que quedan afuera de `visibleSorted`
  // (que es lo que alimenta BlockDataList/seleccion/reorder) y en cambio se
  // listan aparte con la unica accion posible: eliminarlos.
  const brokenBlocks = sorted.filter((b) => draft[b.id] === null);
  const visibleSorted = sorted.filter((b) => draft[b.id] != null);

  const selectedIndex = selectedBlockId ? visibleSorted.findIndex((b) => b.id === selectedBlockId) : -1;
  const selectedBlock = selectedIndex >= 0 ? visibleSorted[selectedIndex] : null;
  const selectedData = selectedBlock ? (draft[selectedBlock.id] ?? null) : null;

  // Sin try/catch (bug real, ago 2026): un reorder mientras el dueño (articulo
  // o leccion) ya no existe mas (ej. se borro desde otra pestaña) hacia que
  // reorder tirara 404 SIN atajar -- esa excepcion quedaba como promise
  // rejection sin manejar y tumbaba toda la pagina con la pantalla roja de
  // Next.js. `reordering` de paso evita mandar dos reorders en simultaneo con
  // drags/clicks rapidos.
  async function handleReorder(from: number, to: number) {
    if (reordering) return;
    const clampedTo = Math.max(0, Math.min(to, visibleSorted.length - 1));
    if (from === clampedTo || from < 0 || from >= visibleSorted.length) return;

    // `visibleSorted` puede ser un subconjunto de `sorted` si hay bloques
    // rotos (ver brokenBlocks) -- se reordena solo dentro de los indices
    // visibles y despues se reinserta ese nuevo orden en los huecos que
    // ocupaban los bloques visibles dentro del orden completo, dejando los
    // rotos fijos en su posicion.
    const reorderedVisibleIds = visibleSorted.map((b) => b.id);
    const [movedId] = reorderedVisibleIds.splice(from, 1);
    reorderedVisibleIds.splice(clampedTo, 0, movedId);
    let vi = 0;
    const fullOrder = sorted.map((b) => (draft[b.id] != null ? reorderedVisibleIds[vi++] : b.id));

    setReordering(true);
    setError(null);
    try {
      await api.reorder(token, ownerId, fullOrder);
      onChange();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo reordenar el bloque");
    } finally {
      setReordering(false);
    }
  }

  function moveSelected(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    handleReorder(selectedIndex, selectedIndex + direction);
  }

  async function addBlock(type: BlockType) {
    setAdding(true);
    setError(null);
    try {
      const created = await api.create(token, ownerId, {
        blockType: type,
        position: sorted.length,
        dataJson: JSON.stringify(defaultBlockData(type)),
      });
      setSelectedBlockId(created.id);
      onChange();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo agregar el bloque");
    } finally {
      setAdding(false);
    }
  }

  async function saveSelected() {
    if (!selectedBlock || !selectedData) return;
    setSaving(true);
    setError(null);
    try {
      await api.update(token, selectedBlock.id, {
        blockType: selectedData.type,
        position: selectedBlock.position,
        dataJson: JSON.stringify(selectedData),
      });
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el bloque");
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: string) {
    setRemoving(true);
    setError(null);
    try {
      await api.remove(token, id);
      setSelectedBlockId((current) => (current === id ? null : current));
      onChange();
    } catch (err) {
      // 404 = ya no existe -- el resultado buscado ya esta logrado.
      if (err instanceof ApiError && err.status === 404) {
        setSelectedBlockId((current) => (current === id ? null : current));
        onChange();
        return;
      }
      setError(err instanceof Error ? err.message : "No se pudo eliminar el bloque");
    } finally {
      setRemoving(false);
    }
  }

  return (
    // @container (fase 4, ago 2026): el mismo editor ahora se embebe tanto a
    // pagina completa (blog, /admin/blog/[id]) como adentro de una fila de
    // acordeon mas angosta (leccion, ver LessonEditor.tsx dentro de
    // /admin/courses/[id]) -- un breakpoint de VIEWPORT (lg:) no distingue
    // esos dos casos: en la fila angosta el viewport puede ser ancho igual,
    // asi que forzaba 3 columnas apretadas contra el ancho real disponible.
    // Con @container, el layout reacciona al ancho del propio contenedor
    // (@5xl ~ los mismos 1024px que antes usaba `lg`), asi que se ve bien en
    // los dos lugares sin duplicar el componente.
    <div className="@container">
      {error && <p className="mb-3 text-p-small text-coral">{error}</p>}

      {brokenBlocks.length > 0 && (
        <div className="mb-4 rounded-card-md border border-coral/30 bg-coral-soft p-3 text-p-caption text-coral">
          <p className="font-semibold">
            {brokenBlocks.length === 1
              ? "Hay 1 bloque con contenido inválido que no se puede mostrar en el lienzo."
              : `Hay ${brokenBlocks.length} bloques con contenido inválido que no se pueden mostrar en el lienzo.`}
          </p>
          <ul className="mt-1.5 space-y-1">
            {brokenBlocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2">
                <span>
                  {BLOCK_TYPE_LABEL[b.blockType as BlockType] ?? b.blockType} (posición {b.position + 1})
                </span>
                <button type="button" className="font-semibold underline" onClick={() => removeBlock(b.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 @5xl:grid-cols-[200px_minmax(0,1fr)_320px]">
        <BlockPalette onAdd={addBlock} disabled={adding} />

        <div className="min-w-0 rounded-card-lg border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
          {headerPreview && <PreviewErrorBoundary>{headerPreview}</PreviewErrorBoundary>}

          <div className={headerPreview ? "mt-10" : undefined}>
            {visibleSorted.length === 0 ? (
              <p className="mx-auto max-w-3xl rounded-card-md bg-cream p-6 text-center text-p-small text-navy/50">
                {emptyMessage}
              </p>
            ) : (
              <PreviewErrorBoundary>
                <BlockDataList
                  blocks={visibleSorted.map((b) => draft[b.id]!)}
                  editable
                  selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
                  onSelect={(i) => setSelectedBlockId(visibleSorted[i]?.id ?? null)}
                  onReorder={handleReorder}
                />
              </PreviewErrorBoundary>
            )}
          </div>
        </div>

        <BlockInspector
          block={selectedBlock}
          data={selectedData}
          index={selectedIndex}
          total={visibleSorted.length}
          saving={saving}
          removing={removing}
          moveDisabled={reordering}
          token={token}
          onDataChange={(data) => {
            if (selectedBlock) setDraft((prev) => ({ ...prev, [selectedBlock.id]: data }));
          }}
          onSave={saveSelected}
          onDelete={() => selectedBlock && removeBlock(selectedBlock.id)}
          onMoveUp={() => moveSelected(-1)}
          onMoveDown={() => moveSelected(1)}
        />
      </div>
    </div>
  );
}
