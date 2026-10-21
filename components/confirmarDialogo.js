"use client";

import { useEffect, useRef } from "react";

export default function ConfirmarDialogo({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  cargando = false,
  error = "",
  onConfirmar,
  onCancelar,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialogo-titulo"
      aria-describedby="dialogo-mensaje"
      onCancel={(e) => {
        e.preventDefault(); // Esc
        if (!cargando) onCancelar();
      }}
      onClick={(e) => {
        // clic fuera de la tarjeta
        if (e.target === ref.current && !cargando) onCancelar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-[20px] bg-white p-0 text-tinta shadow-xl backdrop:bg-tinta/50"
    >
      <div className="flex flex-col items-center p-6 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-urgente/10"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B72F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
          </svg>
        </span>

        <h2 id="dialogo-titulo" className="mt-4 text-xl font-extrabold">
          {titulo}
        </h2>
        <p id="dialogo-mensaje" className="mt-2 text-sm text-[#6B5F54]">
          {mensaje}
        </p>

        {error && <p className="mt-3 text-sm text-urgente">{error}</p>}

        <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            autoFocus
            disabled={cargando}
            onClick={onCancelar}
            className="h-12 flex-1 rounded-full border border-[#D9D2BF] bg-white text-base font-semibold disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={onConfirmar}
            className="h-12 flex-1 rounded-full bg-urgente text-base font-extrabold text-white disabled:opacity-60"
          >
            {cargando ? "Borrando..." : textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  );
}