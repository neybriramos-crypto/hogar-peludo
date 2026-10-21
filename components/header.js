import Link from "next/link";
import AuthButton from "@/components/authButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-hueso/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-2" aria-label="Hogar Peludo, inicio">
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 4 L58 30 V54 Q58 60 52 60 H12 Q6 60 6 54 V30 Z" fill="#E8772E" />
            <ellipse cx="32" cy="42" rx="11" ry="8.5" fill="#F3EFE2" />
            <ellipse cx="20" cy="31" rx="4.5" ry="6" fill="#F3EFE2" />
            <ellipse cx="28" cy="26" rx="4.5" ry="6" fill="#F3EFE2" />
            <ellipse cx="36" cy="26" rx="4.5" ry="6" fill="#F3EFE2" />
            <ellipse cx="44" cy="31" rx="4.5" ry="6" fill="#F3EFE2" />
          </svg>
          <span className="text-2xl font-extrabold text-[#B84E0C]">
            Hogar <span className="text-turquesa-oscuro">Peludo</span>
          </span>
        </Link>
        <AuthButton />
      </div>
    </header>
  );
}