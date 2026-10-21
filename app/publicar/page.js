"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CARACTERISTICAS = [
  "Vacunado/a",
  "Esterilizado/a",
  "Desparasitado/a",
  "Necesita atención",
];
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

const campo =
  "h-12 w-full rounded-full border border-[#D9D2BF] bg-white px-5 text-base";
const etiqueta = "text-sm font-semibold";

export default function Publicar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [listo, setListo] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "perro",
    edad: "",
    sexo: "Hembra",
    tamano: "Mediano",
    ubicacion: "",
    estado: "adopcion",
    descripcion: "",
  });
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      } else {
        setUser(data.session.user);
        setListo(true);
      }
    });
  }, [router]);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function marcar(valor) {
    setCaracteristicas((actual) =>
      actual.includes(valor) ? actual.filter((c) => c !== valor) : [...actual, valor]
    );
  }

  function elegirFoto(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!TIPOS_FOTO.includes(archivo.type)) {
      setError("La foto debe ser JPG, PNG o WebP.");
      return;
    }
    if (archivo.size > MAX_MB * 1024 * 1024) {
      setError(`La foto no puede pesar más de ${MAX_MB} MB.`);
      return;
    }
    setError("");
    setFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    if (!foto) {
      setError("Agrega una foto del animal.");
      return;
    }
    setEnviando(true);

    const ext = foto.name.split(".").pop().toLowerCase();
    const ruta = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: errFoto } = await supabase.storage
      .from("fotos-animales")
      .upload(ruta, foto, { contentType: foto.type });

    if (errFoto) {
      setError("No pudimos subir la foto. Intenta de nuevo.");
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("fotos-animales").getPublicUrl(ruta);

    const { error: errInsert } = await supabase.from("animales").insert({
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      edad: form.edad.trim(),
      sexo: form.sexo,
      ubicacion: form.ubicacion.trim(),
      estado: form.estado,
      descripcion: form.descripcion.trim(),
      etiquetas: [form.tamano, ...caracteristicas],
      foto_url: data.publicUrl,
      user_id: user.id,
    });

    if (errInsert) {
      setError("No pudimos guardar la publicación. Intenta de nuevo.");
      setEnviando(false);
      return;
    }

    router.push("/");
  }

  if (!listo) return null;

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <Link href="/" className="text-sm font-semibold text-turquesa-oscuro">
        ← Volver
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold text-[#B84E0C]">
        Publicar un animal
      </h1>

      <form onSubmit={enviar} className="mt-5 flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-sm">
        <label htmlFor="foto" className={etiqueta}>Foto</label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Vista previa de la foto" className="h-56 w-full rounded-2xl object-cover" />
        )}
        <input id="foto" type="file" accept="image/jpeg,image/png,image/webp" onChange={elegirFoto} className="text-sm" />

        <label htmlFor="nombre" className={etiqueta}>Nombre</label>
        <input id="nombre" name="nombre" required maxLength={40} value={form.nombre} onChange={cambiar} className={campo} />

        <label htmlFor="tipo" className={etiqueta}>Tipo de animal</label>
        <select id="tipo" name="tipo" value={form.tipo} onChange={cambiar} className={campo}>
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        <label htmlFor="estado" className={etiqueta}>¿Qué necesita?</label>
        <select id="estado" name="estado" value={form.estado} onChange={cambiar} className={campo}>
          <option value="adopcion">En adopción</option>
          <option value="urgente">Rescate urgente</option>
        </select>

        <label htmlFor="edad" className={etiqueta}>Edad (aproximada)</label>
        <input id="edad" name="edad" required maxLength={30} placeholder="Ej: 2 años, cachorro" value={form.edad} onChange={cambiar} className={campo} />

        <label htmlFor="sexo" className={etiqueta}>Sexo</label>
        <select id="sexo" name="sexo" value={form.sexo} onChange={cambiar} className={campo}>
          <option value="Hembra">Hembra</option>
          <option value="Macho">Macho</option>
        </select>

        <label htmlFor="tamano" className={etiqueta}>Tamaño</label>
        <select id="tamano" name="tamano" value={form.tamano} onChange={cambiar} className={campo}>
          <option>Pequeño</option>
          <option>Mediano</option>
          <option>Grande</option>
        </select>

        <label htmlFor="ubicacion" className={etiqueta}>Ubicación</label>
        <input id="ubicacion" name="ubicacion" required maxLength={80} placeholder="Ej: Los Teques, Miranda" value={form.ubicacion} onChange={cambiar} className={campo} />

        <fieldset className="flex flex-wrap gap-2">
          <legend className={`${etiqueta} mb-1`}>Características</legend>
          {CARACTERISTICAS.map((c) => (
            <label key={c} className={`flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm ${caracteristicas.includes(c) ? "border-naranja bg-naranja font-extrabold" : "border-[#D9D2BF] bg-white"}`}>
              <input type="checkbox" className="sr-only" checked={caracteristicas.includes(c)} onChange={() => marcar(c)} />
              {c}
            </label>
          ))}
        </fieldset>

        <label htmlFor="descripcion" className={etiqueta}>Su historia</label>
        <textarea id="descripcion" name="descripcion" required rows={4} maxLength={600} placeholder="Cuenta cómo fue rescatado, su carácter y qué tipo de hogar necesita." value={form.descripcion} onChange={cambiar} className="rounded-2xl border border-[#D9D2BF] bg-white p-4 text-base" />

        {error && <p className="text-sm text-urgente">{error}</p>}

        <button type="submit" disabled={enviando} className="mt-2 h-12 rounded-full bg-naranja text-base font-extrabold text-tinta disabled:opacity-60">
          {enviando ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </main>
  );
}