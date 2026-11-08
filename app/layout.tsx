import type { Metadata } from "next";
import localFont from "next/font/local";
import { CLINICA, SEO, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.titulo,
    template: `%s | ${CLINICA.nome}`,
  },
  description: SEO.descricao,
  // Projeto demonstrativo: remova este bloqueio ao adaptar para um cliente real.
  robots: { index: false, follow: false },
  keywords: [
    "clínica em Manaus",
    "clínica geral Manaus",
    "nutricionista Manaus",
    "psicólogo Manaus",
    "fisioterapia Manaus",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SEO.titulo,
    description: SEO.descricao,
    url: "/",
    siteName: CLINICA.nome,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.titulo,
    description: SEO.descricao,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geistSans.variable} data-scroll-behavior="smooth">
      <body className="font-sans">{children}</body>
    </html>
  );
}
