"use client";

import { useState } from "react";
import AnimalCard from "@/components/animalCard";

const filtros = [
  { nombre: "Todos", prueba: () => true },
  { nombre: "Perros", prueba: (a) => a.tipo === "perro" },
  { nombre: "Gatos", prueba: (a) => a.tipo === "gato" },
  { nombre: "Urgente", prueba: (a) => a.estado === "urgente" },
];

// Quita tildes y pasa a minúsculas para buscar sin importar cómo se escriba
function normalizar(texto) {
  return (texto ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ListaAnimales({ animales }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const prueba = filtros.find((f) => f.nombre === filtro).prueba;
  const termino = normalizar(busqueda.trim());

  const visibles = animales.filter((a) => {
    if (!prueba(a)) return false;
    if (!termino) return true;
    const texto = normalizar(
      [a.nombre, a.ubicacion, a.tipo, a.edad, ...(a.etiquetas ?? [])].join(" ")
    );
    return texto.includes(termino);
  });

  return (
    <>
      <label htmlFor="buscar" className="sr-only">
        Buscar animales
      </label>
      <input
        id="buscar"
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por ciudad, raza o nombre"
        className="h-12 w-full rounded-full border border-[#D9D2BF] bg-white px-5 text-base"
      />

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {filtros.map((f) => (
          <button
            key={f.nombre}
            onClick={() => setFiltro(f.nombre)}
            aria-pressed={filtro === f.nombre}
            className={`h-11 shrink-0 rounded-full px-5 text-sm ${
              filtro === f.nombre
                ? "bg-naranja font-extrabold text-tinta"
                : "border border-[#D9D2BF] bg-white font-semibold"
            }`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white p-4 text-sm">
          {animales.length === 0
            ? "Aún no hay publicaciones. ¡Sé la primera persona en publicar!"
            : "No encontramos animales con esa búsqueda. Prueba con otra palabra o quita el filtro."}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((a) => (
            <AnimalCard key={a.id} animal={a} />
          ))}
        </div>
      )}
    </>
  );
}