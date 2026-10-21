"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { hace } from "@/lib/fecha";
import BotonReportar from "@/components/botonReportar";

export default function Comentarios({ animalId }) {
  const [comentarios, setComentarios] = useState([]);
  const [user, setUser] = useState(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Al cambiar este número, se vuelven a pedir los comentarios
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;
    supabase
      .from("comentarios")
      .select("*")
      .eq("animal_id", animalId)
      .order("creado_en", { ascending: true })
      .then(({ data }) => {
        if (!activo) return;
        setComentarios(data ?? []);
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [animalId, recarga]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function enviar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    setError("");

    const { error } = await supabase.from("comentarios").insert({
      animal_id: animalId,
      user_id: user.id,
      autor: user.user_metadata?.nombre || "Usuario",
      texto: texto.trim(),
    });

    if (error) {
      setError("No pudimos publicar tu comentario. Intenta de nuevo.");
    } else {
      setTexto("");
      setRecarga((n) => n + 1);
    }
    setEnviando(false);
  }

  async function borrar(id) {
    await supabase.from("comentarios").delete().eq("id", id);
    setRecarga((n) => n + 1);
  }

  return (
    <section className="mt-8" aria-labelledby="titulo-comentarios">
      <h2 id="titulo-comentarios" className="text-xl font-extrabold">
        Comentarios ({comentarios.length})
      </h2>

      <ul className="mt-3 flex flex-col gap-3">
        {cargando && <li className="text-sm text-[#6B5F54]">Cargando...</li>}
        {!cargando && comentarios.length === 0 && (
          <li className="text-sm text-[#6B5F54]">
            Aún no hay comentarios. ¡Haz la primera pregunta!
          </li>
        )}
        {comentarios.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-turquesa text-sm font-extrabold"
            >
              {c.autor[0]?.toUpperCase()}
            </span>
            <div className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold">{c.autor}</span>
                <span className="text-xs text-[#6B5F54]">{hace(c.creado_en)}</span>
              </div>
              <p className="mt-1 whitespace-pre-line break-words">{c.texto}</p>
              {user?.id === c.user_id ? (
                <button
                  onClick={() => borrar(c.id)}
                  className="mt-2 text-xs font-semibold text-urgente"
                >
                  Borrar
                </button>
              ) : (
                <BotonReportar tipo="comentario" id={c.id} duenoId={c.user_id} />
              )}
            </div>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={enviar} className="mt-4 flex flex-col gap-2">
          <label htmlFor="comentario" className="sr-only">
            Escribe un comentario
          </label>
          <textarea
            id="comentario"
            rows={3}
            maxLength={500}
            required
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un comentario o una pregunta"
            className="rounded-2xl border border-[#D9D2BF] bg-white p-4 text-base"
          />
          {error && <p className="text-sm text-urgente">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="h-12 rounded-full bg-turquesa-oscuro text-base font-extrabold text-white disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm">
          <Link href="/login" className="font-extrabold text-turquesa-oscuro underline">
            Inicia sesión
          </Link>{" "}
          para comentar.
        </p>
      )}
    </section>
  );
}