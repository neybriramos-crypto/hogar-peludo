"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import ConfirmarDialogo from "@/components/confirmarDialogo";
import { supabase } from "@/lib/supabase";

const campo =
  "h-12 w-full rounded-full border border-[#D9D2BF] bg-white px-5 text-base";
const boton =
  "h-12 rounded-full bg-naranja px-6 text-base font-extrabold text-tinta disabled:opacity-60";
const tarjeta = "rounded-[20px] bg-white p-5 shadow-sm";

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [msgNombre, setMsgNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [msgPass, setMsgPass] = useState("");
  const [errPass, setErrPass] = useState("");
  const [cambiando, setCambiando] = useState(false);

  const [publicaciones, setPublicaciones] = useState([]);
  const [recarga, setRecarga] = useState(0);

  const [aBorrar, setABorrar] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [errBorrar, setErrBorrar] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setUser(data.session.user);
      setNombre(data.session.user.user_metadata?.nombre ?? "");
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    let activo = true;
    supabase
      .from("animales")
      .select("*")
      .eq("user_id", user.id)
      .order("creado_en", { ascending: false })
      .then(({ data }) => {
        if (activo) setPublicaciones(data ?? []);
      });
    return () => {
      activo = false;
    };
  }, [user, recarga]);

  async function guardarNombre(e) {
    e.preventDefault();
    setGuardando(true);
    setMsgNombre("");
    const { data, error } = await supabase.auth.updateUser({
      data: { nombre: nombre.trim() },
    });
    if (error) setMsgNombre("No pudimos guardar tu nombre. Intenta de nuevo.");
    else {
      setUser(data.user);
      setMsgNombre("Nombre actualizado.");
    }
    setGuardando(false);
  }

  async function cambiarPassword(e) {
    e.preventDefault();
    setErrPass("");
    setMsgPass("");
    if (pass.length < 6) {
      setErrPass("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (pass !== pass2) {
      setErrPass("Las contraseñas no coinciden.");
      return;
    }
    setCambiando(true);
    const { error } = await supabase.auth.updateUser({ password: pass });
    if (error) setErrPass("No pudimos cambiar la contraseña. Intenta de nuevo.");
    else {
      setMsgPass("Contraseña actualizada.");
      setPass("");
      setPass2("");
    }
    setCambiando(false);
  }

  async function cambiarEstado(id, estado) {
    await supabase.from("animales").update({ estado }).eq("id", id);
    setRecarga((n) => n + 1);
  }

  async function confirmarBorrado() {
    setBorrando(true);
    setErrBorrar("");

    const { error } = await supabase.from("animales").delete().eq("id", aBorrar.id);
    if (error) {
      setErrBorrar("No pudimos borrar la publicación. Intenta de nuevo.");
      setBorrando(false);
      return;
    }

    // Borra también la foto guardada
    const ruta = aBorrar.foto_url?.split("/fotos-animales/")[1];
    if (ruta) await supabase.storage.from("fotos-animales").remove([ruta]);

    setBorrando(false);
    setABorrar(null);
    setRecarga((n) => n + 1);
  }

  async function salir() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return null;

  const desde = new Date(user.created_at).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-16">
        <h1 className="text-3xl font-extrabold text-[#B84E0C]">Mi perfil</h1>

        <section className={tarjeta} aria-labelledby="datos">
          <h2 id="datos" className="text-xl font-extrabold">Mis datos</h2>
          <p className="mt-2 text-sm text-[#6B5F54]">Correo: <b className="text-tinta">{user.email}</b></p>
          <p className="text-sm text-[#6B5F54]">Miembro desde: <b className="text-tinta">{desde}</b></p>

          <form onSubmit={guardarNombre} className="mt-4 flex flex-col gap-3">
            <label htmlFor="nombre" className="text-sm font-semibold">Nombre que verán los demás</label>
            <input id="nombre" required maxLength={30} value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
            {msgNombre && <p className="text-sm text-turquesa-oscuro">{msgNombre}</p>}
            <button type="submit" disabled={guardando} className={boton}>
              {guardando ? "Guardando..." : "Guardar nombre"}
            </button>
          </form>
        </section>

        <section className={tarjeta} aria-labelledby="seguridad">
          <h2 id="seguridad" className="text-xl font-extrabold">Contraseña</h2>
          <p className="mt-2 text-sm text-[#6B5F54]">
            Por seguridad, las contraseñas se guardan cifradas y nadie puede verlas, ni siquiera nosotros. Aquí puedes crear una nueva.
          </p>
          <form onSubmit={cambiarPassword} className="mt-4 flex flex-col gap-3">
            <label htmlFor="pass" className="text-sm font-semibold">Nueva contraseña</label>
            <input id="pass" type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} className={campo} />
            <label htmlFor="pass2" className="text-sm font-semibold">Repite la contraseña</label>
            <input id="pass2" type="password" autoComplete="new-password" value={pass2} onChange={(e) => setPass2(e.target.value)} className={campo} />
            {errPass && <p className="text-sm text-urgente">{errPass}</p>}
            {msgPass && <p className="text-sm text-turquesa-oscuro">{msgPass}</p>}
            <button type="submit" disabled={cambiando} className={boton}>
              {cambiando ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        </section>

        <section aria-labelledby="mis-pub">
          <h2 id="mis-pub" className="text-xl font-extrabold">
            Mis publicaciones ({publicaciones.length})
          </h2>
          {publicaciones.length === 0 ? (
            <p className="mt-2 rounded-2xl bg-white p-4 text-sm">
              Aún no has publicado.{" "}
              <Link href="/publicar" className="font-extrabold text-turquesa-oscuro underline">
                Publica tu primer animal
              </Link>
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {publicaciones.map((a) => (
                <li key={a.id} className="flex flex-col gap-2 rounded-2xl bg-white p-4">
                  <Link href={`/animal/${a.id}`} className="text-lg font-extrabold">
                    {a.nombre}
                  </Link>
                  <label htmlFor={`estado-${a.id}`} className="text-xs font-semibold text-[#6B5F54]">Estado</label>
                  <select id={`estado-${a.id}`} value={a.estado} onChange={(e) => cambiarEstado(a.id, e.target.value)} className={campo}>
                    <option value="adopcion">En adopción</option>
                    <option value="urgente">Rescate urgente</option>
                    <option value="adoptado">Adoptado</option>
                  </select>
                  <button
                    onClick={() => {
                      setErrBorrar("");
                      setABorrar(a);
                    }}
                    className="h-11 self-start rounded-full border border-urgente px-5 text-sm font-semibold text-urgente"
                  >
                    Borrar publicación
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button onClick={salir} className="h-12 rounded-full border border-[#D9D2BF] bg-white text-base font-semibold">
          Cerrar sesión
        </button>
      </main>

      <ConfirmarDialogo
        abierto={!!aBorrar}
        titulo={`¿Borrar la publicación de ${aBorrar?.nombre ?? ""}?`}
        mensaje="Se eliminarán también su foto y todos sus comentarios. Esta acción no se puede deshacer."
        textoConfirmar="Sí, borrar"
        cargando={borrando}
        error={errBorrar}
        onConfirmar={confirmarBorrado}
        onCancelar={() => setABorrar(null)}
      />
    </>
  );
}