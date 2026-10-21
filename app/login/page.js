"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function traducir(mensaje) {
  if (mensaje.includes("Invalid login credentials"))
    return "Correo o contraseña incorrectos.";
  if (mensaje.includes("already registered"))
    return "Ese correo ya tiene una cuenta. Prueba iniciar sesión.";
  if (mensaje.includes("at least 6"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (mensaje.includes("Email not confirmed"))
    return "Aún no has confirmado tu correo. Revisa tu bandeja de entrada.";
  return "Ocurrió un error. Intenta de nuevo.";
}

export default function Login() {
  const router = useRouter();
  const [modo, setModo] = useState("entrar"); // "entrar" o "registro"
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensaje("");

    if (modo === "registro") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre: nombre.trim() } },
      });
      if (error) setError(traducir(error.message));
      else if (data.session) router.push("/");
      else
        setMensaje(
          "Te enviamos un correo para confirmar tu cuenta. Confírmala y luego inicia sesión."
        );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(traducir(error.message));
      else router.push("/");
    }
    setCargando(false);
  }

  const tab = (activo) =>
    `h-11 flex-1 rounded-full text-sm ${
      activo ? "bg-naranja font-extrabold text-tinta" : "font-semibold"
    }`;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Link href="/" className="mb-6 text-center text-3xl font-extrabold text-[#B84E0C]">
        Hogar <span className="text-turquesa-oscuro">Peludo</span>
      </Link>

      <div className="rounded-[20px] bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-1 rounded-full bg-hueso p-1">
          <button type="button" className={tab(modo === "entrar")} onClick={() => setModo("entrar")}>
            Iniciar sesión
          </button>
          <button type="button" className={tab(modo === "registro")} onClick={() => setModo("registro")}>
            Crear cuenta
          </button>
        </div>

        <form onSubmit={enviar} className="flex flex-col gap-3">
          {modo === "registro" && (
            <>
              <label htmlFor="nombre" className="text-sm font-semibold">
                Tu nombre
              </label>
              <input
                id="nombre"
                required
                maxLength={30}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-12 rounded-full border border-[#D9D2BF] px-5 text-base"
              />
            </>
          )}

          <label htmlFor="email" className="text-sm font-semibold">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-full border border-[#D9D2BF] px-5 text-base"
          />

          <label htmlFor="password" className="text-sm font-semibold">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-full border border-[#D9D2BF] px-5 text-base"
          />

          {error && <p className="text-sm text-urgente">{error}</p>}
          {mensaje && <p className="text-sm text-turquesa-oscuro">{mensaje}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 h-12 rounded-full bg-naranja text-base font-extrabold text-tinta disabled:opacity-60"
          >
            {cargando ? "Cargando..." : modo === "entrar" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </main>
  );
}