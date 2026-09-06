"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  listAdminDailyMessages,
  createDailyMessage,
  updateDailyMessage,
  deleteDailyMessage,
  reorderDailyMessages,
  type AdminDailyMessage,
  type DailyMessageRequest,
} from "@/lib/api/adminDailyMessages";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DailyMessageFormModal from "@/components/admin/DailyMessageFormModal";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/shared/Skeleton";

export default function AdminDailyMessagesPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<AdminDailyMessage[] | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDailyMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    listAdminDailyMessages(token)
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [token]);

  const sorted = messages ? [...messages].sort((a, b) => a.displayOrder - b.displayOrder) : [];

  // Mismo patron que AdminBlogPage.move(): swap local + reescribir el orden
  // completo en el backend, despues refetch para no confiar en el estado
  // optimista si algo salio mal a mitad de camino.
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length || reordering) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    setMessages(next);
    setReordering(true);
    setError(null);
    try {
      await reorderDailyMessages(token, next.map((m) => m.id));
      setMessages(await listAdminDailyMessages(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reordenar los mensajes");
      listAdminDailyMessages(token)
        .then(setMessages)
        .catch(() => {});
    } finally {
      setReordering(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(message: AdminDailyMessage) {
    setEditing(message);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave(request: DailyMessageRequest) {
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const updated = await updateDailyMessage(token, editing.id, request);
        setMessages((prev) => (prev ? prev.map((m) => (m.id === updated.id ? updated : m)) : prev));
      } else {
        const created = await createDailyMessage(token, { ...request, displayOrder: sorted.length });
        setMessages((prev) => (prev ? [...prev, created] : [created]));
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar el mensaje");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(message: AdminDailyMessage) {
    setError(null);
    try {
      const updated = await updateDailyMessage(token, message.id, {
        phrase: message.phrase,
        body: message.body,
        active: !message.active,
        displayOrder: message.displayOrder,
      });
      setMessages((prev) => (prev ? prev.map((m) => (m.id === updated.id ? updated : m)) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el mensaje");
    }
  }

  async function confirmDelete() {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setDeletingId(id);
    setError(null);
    try {
      await deleteDailyMessage(token, id);
      setMessages((prev) => (prev ? prev.filter((m) => m.id !== id) : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el mensaje");
    } finally {
      setDeletingId(null);
    }
  }

  const messageToDelete = sorted.find((m) => m.id === confirmId) ?? null;
  const activeCount = sorted.filter((m) => m.active).length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h3-lg text-navy">Mensajes del día</h1>
          <p className="mt-1 text-p-body text-navy/60">
            Frases que rotan, una por día, en la card destacada de /dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex shrink-0 items-center gap-2 rounded-pill bg-navy px-4 py-2.5 text-a-inline font-semibold text-cream"
        >
          <Plus size={16} /> Nuevo mensaje
        </button>
      </div>

      {messages !== null && (
        <p className="mt-4 text-p-small text-navy/50">
          {sorted.length} {sorted.length === 1 ? "mensaje" : "mensajes"} · {activeCount} en rotación
        </p>
      )}

      {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

      {messages === null && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[84px] w-full rounded-card-md" />
          ))}
        </div>
      )}

      {messages?.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={Sparkles}
            title="Todavía no creaste ningún mensaje"
            description="Mientras no haya ninguno, el dashboard muestra un mensaje genérico por defecto."
          />
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-card-lg border border-navy/10 bg-white shadow-sm">
          {sorted.map((message, i) => (
            <div key={message.id} className="flex items-start gap-4 p-4 sm:items-center">
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  disabled={i === 0 || reordering}
                  onClick={() => move(i, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-navy/40 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover arriba"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  type="button"
                  disabled={i === sorted.length - 1 || reordering}
                  onClick={() => move(i, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-navy/40 hover:bg-navy/5 disabled:opacity-20"
                  aria-label="Mover abajo"
                >
                  <ChevronDown size={15} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy">{message.phrase}</p>
                  <span
                    className={`shrink-0 rounded-pill px-2.5 py-0.5 text-p-caption font-semibold ${
                      message.active ? "bg-accent/10 text-accent" : "bg-navy/5 text-navy/50"
                    }`}
                  >
                    {message.active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-p-small text-navy/60">{message.body}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={message.active}
                  aria-label={message.active ? "Desactivar mensaje" : "Activar mensaje"}
                  onClick={() => toggleActive(message)}
                  className="flex h-9 w-9 items-center justify-center rounded-pill text-navy/50 hover:bg-navy/5"
                  title={message.active ? "Desactivar" : "Activar"}
                >
                  <span
                    aria-hidden
                    className={`relative block h-[22px] w-[38px] rounded-pill border border-navy/10 transition-colors ${
                      message.active ? "bg-accent" : "bg-navy/15"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-pill bg-white shadow-sm transition-transform ${
                        message.active ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(message)}
                  className="flex h-9 w-9 items-center justify-center rounded-pill text-navy/50 hover:bg-navy/5"
                  aria-label={`Editar ${message.phrase}`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  disabled={deletingId === message.id}
                  onClick={() => setConfirmId(message.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-pill text-navy/50 hover:bg-coral-soft hover:text-coral disabled:opacity-20"
                  aria-label={`Eliminar ${message.phrase}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DailyMessageFormModal
        open={modalOpen}
        editing={editing}
        saving={saving}
        error={formError}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={confirmId !== null}
        title={`¿Eliminar "${messageToDelete?.phrase ?? "este mensaje"}"?`}
        description="Esta acción no se puede deshacer. Si es el único mensaje activo, el dashboard vuelve a mostrar el mensaje genérico por defecto."
        confirmLabel="Eliminar mensaje"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
