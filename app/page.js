import Link from "next/link";
import Header from "@/components/header";
import ListaAnimales from "@/components/listaAnimales";
import { supabase } from "@/lib/supabase";
import { hace } from "@/lib/fecha";

// Siempre pide los datos más recientes a la base de datos
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await supabase
    .from("animales")
    .select("*")
    .order("creado_en", { ascending: false });

  const animales = (data ?? []).map((a) => ({
    ...a,
    etiquetas: a.etiquetas ?? [],
    publicado: hace(a.creado_en),
    comentarios: 0, // lo conectaremos más adelante
  }));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-28">
        {error && (
          <p className="mb-4 rounded-2xl bg-white p-4 text-sm text-urgente">
            No pudimos cargar los animales. Revisa la conexión con Supabase.
          </p>
        )}

        <ListaAnimales animales={animales} />
      </main>

      <Link
        href="/publicar"
        className="fixed bottom-5 right-4 flex h-13 items-center rounded-full bg-turquesa-oscuro px-6 text-[15px] font-extrabold text-white shadow-lg"
      >
        + Publicar
      </Link>
    </>
  );
}