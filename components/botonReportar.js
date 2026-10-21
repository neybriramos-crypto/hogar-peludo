"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const MOTIVOS = [
  { valor: "estafa", texto: "Posible estafa o piden dinero" },
  { valor: "falso", texto: "Información falsa o animal inexistente" },
  { valor: "maltrato", texto: "Maltrato o venta de animales" },
  { valor: "inapropiado", texto: "Contenido ofensivo o inapropiado" },
  { valor: "spam", texto: "Publicidad o spam" },
  { valor: "otro", texto: "Otro motivo" },
];

export default function BotonReportar({
  tipo, // "animal" o "comentario"
  id,
  duenoId,
  etiqueta = "Reportar",
}) {
  const ref = useRef(null);
  const [user, setUser] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState("estafa");
  const [detalle, setDetalle] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  // No tiene sentido reportar tu propio contenido
  if (user && user.id === duenoId) return null;

  function abrir() {
    setError("");
    setEnviado(false);
    setDetalle("");
    setMotivo("estafa");
    setAbierto(true);
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");

    const fila = {
      user_id: user.id,
      motivo,
      detalle: detalle.trim() || null,
    };
    if (tipo === "animal") fila.animal_id = id;
    else fila.comentario_id = id;

    const { error } = await supabase.from("reportes").insert(fila);

    if (error) {
      setError(
        error.code === "23505"
          ? "Ya reportaste esto antes. Lo estamos revisando."
          : "No pudimos enviar el reporte. Intenta de nuevo."
      );
    } else {
      setEnviado(true);
    }
    setEnviando(false);
  }

  const titulo =
    tipo === "animal" ? "Reportar esta publicación" : "Reportar este comentario";

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="inline-flex min-h-11 items-center gap-1 px-1 text-xs font-semibold text-[#6B5F54] underline"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
        </svg>
        {etiqueta}
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`reporte-titulo-${tipo}-${id}`}
        onCancel={(e) => {
          e.preventDefault();
          if (!enviando) setAbierto(false);
        }}
        onClick={(e) => {
          if (e.target === ref.current && !enviando) setAbierto(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-[20px] bg-white p-0 text-tinta shadow-xl backdrop:bg-tinta/50"
      >
        <div className="flex flex-col gap-3 p-6">
          <h2 id={`reporte-titulo-${tipo}-${id}`} className="text-xl font-extrabold">
            {titulo}
          </h2>

          {!user ? (
            <>
              <p className="text-sm text-[#6B5F54]">
                Para reportar necesitas iniciar sesión. Así evitamos reportes falsos.
              </p>
              <Link href="/login" className="flex h-12 items-center justify-center rounded-full bg-naranja text-base font-extrabold text-tinta">
                Iniciar sesión
              </Link>
              <button type="button" onClick={() => setAbierto(false)} className="h-12 rounded-full border border-[#D9D2BF] text-base font-semibold">
                Cancelar
              </button>
            </>
          ) : enviado ? (
            <>
              <p className="text-sm">
                ¡Gracias! Revisaremos tu reporte lo antes posible. Ayudas a que la comunidad sea más segura.
              </p>
              <button type="button" autoFocus onClick={() => setAbierto(false)} className="h-12 rounded-full bg-turquesa-oscuro text-base font-extrabold text-white">
                Cerrar
              </button>
            </>
          ) : (
            <form onSubmit={enviar} className="flex flex-col gap-3">
              <label htmlFor={`motivo-${tipo}-${id}`} className="text-sm font-semibold">
                ¿Cuál es el problema?
              </label>
              <select
                id={`motivo-${tipo}-${id}`}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="h-12 rounded-full border border-[#D9D2BF] bg-white px-5 text-base"
              >
                {MOTIVOS.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.texto}
                  </option>
                ))}
              </select>

              <label htmlFor={`detalle-${tipo}-${id}`} className="text-sm font-semibold">
                Detalles (opcional)
              </label>
              <textarea
                id={`detalle-${tipo}-${id}`}
                rows={3}
                maxLength={300}
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                placeholder="Cuéntanos qué pasó"
                className="rounded-2xl border border-[#D9D2BF] p-4 text-base"
              />

              {error && <p className="text-sm text-urgente">{error}</p>}

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button type="button" disabled={enviando} onClick={() => setAbierto(false)} className="h-12 flex-1 rounded-full border border-[#D9D2BF] text-base font-semibold disabled:opacity-60">
                  Cancelar
                </button>
                <button type="submit" disabled={enviando} className="h-12 flex-1 rounded-full bg-urgente text-base font-extrabold text-white disabled:opacity-60">
                  {enviando ? "Enviando..." : "Enviar reporte"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}