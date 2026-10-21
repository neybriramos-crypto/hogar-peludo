import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import Comentarios from "@/components/comentarios";
import BotonReportar from "@/components/botonReportar";
import { supabase } from "@/lib/supabase";
import { hace } from "@/lib/fecha";

export const dynamic = "force-dynamic";

const estados = {
  adopcion: { texto: "En adopción", clases: "bg-turquesa text-tinta" },
  urgente: { texto: "Rescate urgente", clases: "bg-urgente text-white" },
  adoptado: { texto: "Adoptado", clases: "bg-turquesa-oscuro text-white" },
};

export default async function Detalle({ params }) {
  const { id } = await params;

  const { data: animal } = await supabase
    .from("animales")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!animal) notFound();

  const estado = estados[animal.estado];
  const etiquetas = animal.etiquetas ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-16">
        <Link href="/" className="text-sm font-semibold text-turquesa-oscuro">
          ← Volver
        </Link>

        <div
          className="relative mt-3 flex h-72 items-center justify-center overflow-hidden rounded-[20px]"
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
            <svg width="96" height="96" viewBox="0 0 64 64" aria-hidden="true">
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
        </div>

        <h1 className="mt-4 text-3xl font-extrabold">
          {animal.nombre}{" "}
          <span className="text-base font-semibold text-[#6B5F54]">
            {animal.edad} · {animal.sexo}
          </span>
        </h1>
        <p className="mt-1 text-sm text-[#6B5F54]">
          {animal.ubicacion} · publicado {hace(animal.creado_en)}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {etiquetas.map((e) => (
            <li key={e} className="rounded-full bg-white px-3 py-1 text-xs">
              {e}
            </li>
          ))}
        </ul>

        {animal.descripcion && (
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed">
            {animal.descripcion}
          </p>
        )}

        <p className="mt-5 rounded-2xl bg-white p-4 text-sm">
          ¿Te interesa? Escribe un comentario para coordinar con quien lo
          publicó. Por seguridad, no compartas datos personales como tu cédula
          o cuentas bancarias.
        </p>

        <div className="mt-2">
          <BotonReportar
            tipo="animal"
            id={animal.id}
            duenoId={animal.user_id}
            etiqueta="Reportar publicación"
          />
        </div>

        <Comentarios animalId={animal.id} />
      </main>
    </>
  );
}