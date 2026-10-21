"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthButton() {
  const [user, setUser] = useState(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setListo(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!listo) return <div className="h-11 w-11" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-11 items-center rounded-full bg-naranja px-5 text-sm font-extrabold text-tinta"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => supabase.auth.signOut()}
        className="h-11 rounded-full border border-[#D9D2BF] bg-white px-4 text-sm font-semibold"
      >
        Salir
      </button>
      <Link
        href="/perfil"
        aria-label="Mi perfil"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white font-extrabold"
      >
        {(user.user_metadata?.nombre || user.email)[0].toUpperCase()}
      </Link>
    </div>
  );
}