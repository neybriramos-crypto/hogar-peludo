import Link from "next/link";

const estados = {
  adopcion: { texto: "En adopción", clases: "bg-turquesa text-tinta" },
  urgente: { texto: "Rescate urgente", clases: "bg-urgente text-white" },
  adoptado: { texto: "Adoptado", clases: "bg-turquesa-oscuro text-white" },
};

const botones = {
  adopcion: "Quiero adoptar",
  urgente: "Quiero ayudar",
  adoptado: "Ya fue adoptado",
};

export default function AnimalCard({ animal }) {
  const estado = estados[animal.estado];
  const adoptado = animal.estado === "adoptado";

  return (
    <article className="overflow-hidden rounded-[20px] bg-white shadow-sm">
      {/* Foto: por ahora un bloque de color. Luego usaremos la foto real. */}
      <div
        className={`relative flex h-44 items-center justify-center ${adoptado ? "opacity-60" : ""}`}
        style={{ backgroundColor: animal.color }}
      >
        {animal.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={animal.foto_url}
            alt={`Foto de ${animal.nombre}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden="true">
            <g fill="#fff" opacity="0.8">
              <ellipse cx="32" cy="42" rx="14" ry="11" />
              <ellipse cx="16" cy="28" rx="6" ry="8" />
              <ellipse cx="26" cy="19" rx="6" ry="8" />
              <ellipse cx="38" cy="19" rx="6" ry="8" />
              <ellipse cx="48" cy="28" rx="6" ry="8" />
            </g>
          </svg>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-extrabold ${estado.clases}`}
        >
          {estado.texto}
        </span>

        <button
          aria-label="Guardar en favoritos"
          className="absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B2118" strokeWidth="2" aria-hidden="true">
            <path d="M12 21 C4 14 3 10 3 8 A5 5 0 0 1 12 6 A5 5 0 0 1 21 8 C21 10 20 14 12 21Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-xl font-extrabold">
          <Link href={`/animal/${animal.id}`}>{animal.nombre}</Link>{" "}
          <span className="text-sm font-semibold text-[#6B5F54]">
            {animal.edad} · {animal.sexo}
          </span>
        </h2>
        <p className="text-sm text-[#6B5F54]">{animal.ubicacion}</p>

        <ul className="flex flex-wrap gap-1.5">
          {animal.etiquetas.map((e) => (
            <li key={e} className="rounded-full bg-hueso px-2.5 py-1 text-xs">
              {e}
            </li>
          ))}
        </ul>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-[#6B5F54]">
            {animal.publicado} · {animal.comentarios} comentarios
          </span>
          <Link
            href={`/animal/${animal.id}`}
            className={`flex h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-extrabold ${
              adoptado ? "bg-hueso text-[#6B5F54]" : "bg-naranja text-tinta"
            }`}
          >
            {botones[animal.estado]}
          </Link>
        </div>
      </div>
    </article>
  );
}