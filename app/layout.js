import {Nunito} from "next/font/google";
import "./globals.css";

const nunito = Nunito({subsets: ["latin"]});

export const metadata = {
  title: "Hogar Peludo",
  description: "Rescate y adopcion de animales en Venezuela",
};

export default function RootLayout({children}) {
  return (
    <html lang="es" className={nunito.className}>
      <body>{children}</body>
    </html>
  );
}