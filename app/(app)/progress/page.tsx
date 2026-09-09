"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Camera,
  Lock,
  ChevronDown,
  Flame,
  Heart,
  ArrowLeftRight,
  Plus,
  FileText,
  Download,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import TextInput from "@/components/ui/TextInput";
import EmptyState from "@/components/ui/EmptyState";
import Collapse from "@/components/shared/Collapse";
import Skeleton from "@/components/shared/Skeleton";
import MetricaChica from "@/components/shared/MetricaChica";
import DailyMessageCard from "@/components/dashboard/DailyMessageCard";
import MoodPicker, { type MoodValue } from "@/components/progress/MoodPicker";
import MoodChart, { buildMoodGrid, MoodScaleLegend } from "@/components/progress/MoodChart";
import ProgressPhotoGrid from "@/components/progress/ProgressPhotoGrid";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import {
  getSummary,
  getTodayEntry,
  listEntries,
  saveEntry,
  listPhotos,
  uploadPhoto,
  downloadReport,
  photoImageUrl,
  type ProgressEntry,
  type ProgressPhoto,
  type ProgressSummary,
} from "@/lib/api/progress";

function todayLocalIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function LineaDeTiempo({
  photos,
  onAddPhoto,
  uploading,
  error,
}: {
  photos: ProgressPhoto[];
  onAddPhoto: (file: File) => void;
  uploading: boolean;
  error: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onAddPhoto(file);
    e.target.value = "";
  }

  const monthLabelRaw = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(new Date());
  const monthLabel = monthLabelRaw.charAt(0).toUpperCase() + monthLabelRaw.slice(1);

  return (
    <section className="rounded-card-lg border border-navy/10 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-h4-label text-navy/50">Tu línea de tiempo</p>
          <h2 className="mt-1.5 text-h3-md text-navy">{monthLabel}</h2>
        </div>
        <Button size="sm" variant="outline">
          <ArrowLeftRight size={15} />
          Comparar dos fechas
        </Button>
      </div>

      <p className="mt-2.5 max-w-[520px] text-p-body text-navy/60">
        Tus fotos se ven difuminadas hasta que tú decidas. Nadie más que tú entra acá.
      </p>
      {error && <p className="mt-2 text-p-small text-coral">{error}</p>}

      <div className="mt-5">
        <ProgressPhotoGrid
          photos={photos}
          srcFor={photoImageUrl}
          trailing={
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-card-md border-2 border-dashed border-navy/20 bg-transparent text-p-body font-semibold text-navy/60 transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:text-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
            >
              <Plus size={20} />
              {uploading ? "Subiendo…" : "Sumar foto"}
            </button>
          }
        />
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFileChange} />
      </div>
    </section>
  );
}

export default function ProgressPage() {
  const { token, status } = useAuth();

  const [porQue, setPorQue] = useState(false);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [todayEntry, setTodayEntry] = useState<ProgressEntry | null | undefined>(undefined);
  const [recentEntries, setRecentEntries] = useState<ProgressEntry[] | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[] | null>(null);

  const [editing, setEditing] = useState(false);
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    getSummary(token).then(setSummary).catch(() => setSummary({ streakDays: 0, photosThisMonth: 0, monthsWithUs: 0 }));
    getTodayEntry(token).then((e) => setTodayEntry(e ?? null)).catch(() => setTodayEntry(null));
    listEntries(token, 14).then(setRecentEntries).catch(() => setRecentEntries([]));
    listPhotos(token).then(setPhotos).catch(() => setPhotos([]));
  }, [status, token]);

  function startEditing() {
    setEditing(true);
    setMood((todayEntry?.mood as MoodValue) ?? null);
    setNota(todayEntry?.note ?? "");
  }

  async function refreshAfterChange() {
    const [freshSummary, freshEntries] = await Promise.all([getSummary(token), listEntries(token, 14)]);
    setSummary(freshSummary);
    setRecentEntries(freshEntries);
  }

  async function handleSave() {
    if (status !== "authenticated" || mood === null) return;
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await saveEntry(token, todayLocalIso(), mood, nota);
      setTodayEntry(saved);
      setEditing(false);
      await refreshAfterChange();
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "No pudimos guardar tu registro.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadPhoto(file: File) {
    if (status !== "authenticated") return;
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const photo = await uploadPhoto(token, file, todayLocalIso());
      setPhotos((prev) => [photo, ...(prev ?? [])]);
      const freshSummary = await getSummary(token);
      setSummary(freshSummary);
    } catch (err) {
      setPhotoError(err instanceof ApiError ? err.message : "No pudimos subir la foto.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleGenerateReport() {
    if (status !== "authenticated") return;
    setGeneratingReport(true);
    setReportError(null);
    try {
      const blob = await downloadReport(token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte-pelo-a-pelo.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setReportError(err instanceof ApiError ? err.message : "No pudimos generar el reporte.");
    } finally {
      setGeneratingReport(false);
    }
  }

  const loading = summary === null || todayEntry === undefined || recentEntries === null || photos === null;
  const showConfirmation = !editing && !!todayEntry;
  const isNew = !loading && (recentEntries?.length ?? 0) === 0 && (photos?.length ?? 0) === 0;

  if (loading) {
    return (
      <div className="mx-auto grid max-w-[1040px] gap-7">
        <Skeleton className="h-[34px] w-[260px] rounded-pill" />
        <Skeleton className="h-[190px] w-full rounded-card-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[78px] w-full rounded-card-md" />
          <Skeleton className="h-[78px] w-full rounded-card-md" />
          <Skeleton className="h-[78px] w-full rounded-card-md" />
        </div>
        <Skeleton className="h-[280px] w-full rounded-card-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1040px] gap-7">
      <header>
        <p className="text-h4-label text-navy/50">Seguimiento</p>
        <h1 className="mt-1.5 text-h3-lg text-navy">Tu espejo honesto 👁</h1>
        <p className="mt-2 max-w-[620px] text-p-body text-navy/60 text-pretty">
          Ver la realidad a veces incomoda, pero es el primer paso para sanar.
        </p>
        <button
          type="button"
          onClick={() => setPorQue((v) => !v)}
          aria-expanded={porQue}
          className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-pill border-none bg-transparent px-1 text-a-inline font-semibold text-accent transition-colors duration-200 hover:text-navy"
        >
          Por qué te pedimos esto
          <span
            className={`inline-flex transition-transform duration-300 motion-reduce:transition-none ${porQue ? "rotate-180" : ""}`}
          >
            <ChevronDown size={15} />
          </span>
        </button>
        <Collapse open={porQue}>
          <div className="mt-3 max-w-[620px] border-l-2 border-accent/25 pl-4">
            <p className="text-p-body leading-relaxed text-navy/70">
              Muchas veces, por miedo, nos desconectamos de nuestro cuerpo. Dejamos de mirarnos, de registrar lo
              que pasa. Este módulo existe para que estés presente en tu sanación: al mirar seguido y sin drama,
              los cambios dejan de ser una sorpresa y pasan a ser información.
            </p>
          </div>
        </Collapse>
      </header>

      {/* Seccion siempre visible (ago 2026, a pedido: "el mensaje del dia
          mas la opcion de la foto deben poder verse tambien en una seccion
          de /progress") -- antes el mensaje del dia solo vivia en /dashboard,
          y la opcion de subir foto quedaba escondida dentro de la tarjeta de
          animo, que desaparece detras de "Listo por hoy" apenas registras tu
          animo. Ahora ambas quedan disponibles ademas aca, sin depender de
          si ya registraste el animo de hoy. */}
      <section className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <DailyMessageCard />
        <PhotoPicker onSelect={handleUploadPhoto} uploading={uploadingPhoto} error={photoError} />
      </section>

      {showConfirmation ? (
        <EmptyState
          tone="accent"
          icon={Check}
          title="Listo por hoy."
          description="Ya quedó guardado. Nos vemos mañana, sin apuro."
          action={
            <Button variant="outline" onClick={startEditing}>
              Editar mi registro
            </Button>
          }
        />
      ) : (
        <section className="rounded-card-lg border border-accent/25 bg-[linear-gradient(160deg,#ffffff,rgba(143,124,182,0.16))] p-7 shadow-sm">
          <div className="max-w-[560px]">
            <h2 className="text-h3-md text-navy">¿Cómo estás hoy?</h2>
            <p className="mb-[18px] mt-1 text-p-body text-navy/60">
              No hay respuestas correctas. Toca la que se parezca a tu día.
            </p>
            <MoodPicker value={mood} onChange={setMood} />
            <div className="mt-5">
              <Field label="¿Quieres contarnos algo? (opcional)" htmlFor="animo-nota">
                <TextInput
                  as="textarea"
                  id="animo-nota"
                  rows={2}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Hoy me costó salir, pero salí."
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-p-small text-navy/60">
              <Lock size={13} /> Solo tú ves esto. Nada se comparte sin que lo pidas.
            </p>
            <div className="flex flex-col items-end gap-2">
              {saveError && <p className="text-p-small text-coral">{saveError}</p>}
              <Button variant="gradient" disabled={mood === null || saving} onClick={handleSave}>
                {saving ? "Guardando…" : "Guardar mi registro"}
              </Button>
            </div>
          </div>
        </section>
      )}

      {isNew ? (
        <EmptyState
          icon={Camera}
          title="Todavía no hay nada que mirar — y está bien."
          description="Tu línea de tiempo se arma sola a medida que registras. En una semana ya vas a poder comparar."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricaChica
              icon={Flame}
              valor={`${summary.streakDays} ${summary.streakDays === 1 ? "día" : "días"}`}
              label="seguidos registrando"
            />
            <MetricaChica icon={Camera} valor={`${summary.photosThisMonth} fotos`} label="este mes" />
            <MetricaChica
              icon={Heart}
              valor={`${summary.monthsWithUs} ${summary.monthsWithUs === 1 ? "mes" : "meses"}`}
              label="acompañándote"
            />
          </div>

          <section className="rounded-card-lg border border-navy/10 bg-white p-7 shadow-sm">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-h4-label text-navy/50">Tu ánimo</p>
                <h2 className="mt-1.5 text-h3-md text-navy">Últimas dos semanas</h2>
              </div>
              <MoodScaleLegend />
            </div>
            <MoodChart data={buildMoodGrid(recentEntries)} />
          </section>

          <LineaDeTiempo photos={photos} onAddPhoto={handleUploadPhoto} uploading={uploadingPhoto} error={photoError} />

          <section className="flex flex-wrap items-center gap-5 rounded-card-lg border border-navy/10 bg-white p-7 shadow-sm">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-icon bg-accent/10 text-accent">
              <FileText size={22} strokeWidth={1.9} />
            </span>
            <div className="min-w-[220px] flex-1">
              <p className="text-h3-md text-navy">Reporte para tu médico</p>
              <p className="mt-1 max-w-[460px] text-p-body leading-relaxed text-navy/60 text-pretty">
                Tus fotos y tu ánimo del período, en un PDF ordenado. Llegas a la consulta con todo dicho, sin
                tener que acordarte de nada.
              </p>
              {reportError && <p className="mt-1.5 text-p-small text-coral">{reportError}</p>}
            </div>
            <Button variant="outline" disabled={generatingReport} onClick={handleGenerateReport}>
              <Download size={15} />
              {generatingReport ? "Generando…" : "Generar reporte"}
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

function PhotoPicker({
  onSelect,
  uploading,
  error,
}: {
  onSelect: (file: File) => void;
  uploading: boolean;
  error: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    e.target.value = "";
  }

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-card-md border-2 border-dashed border-accent/25 bg-cream/60 px-5 py-[22px] text-center transition-colors duration-200 hover:border-accent/45 hover:bg-cream">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-accent/10 text-accent">
        <Camera size={20} strokeWidth={1.9} />
      </span>
      <p className="mt-3 text-p-body font-semibold text-navy">Suma la foto de hoy</p>
      <p className="mb-3.5 mt-1 text-p-small leading-relaxed text-navy/60">
        Opcional. Con luz pareja y el mismo encuadre se comparan mejor.
      </p>
      <Button size="sm" variant="outline" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
        {uploading ? "Subiendo…" : "Elegir foto"}
      </Button>
      {error && <p className="mt-2 text-p-small text-coral">{error}</p>}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleFileChange} />
    </div>
  );
}
