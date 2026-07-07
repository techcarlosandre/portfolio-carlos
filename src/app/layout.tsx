import type { Metadata } from "next";
import { Outfit, Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.techcarlos.com.br"),
  title: "Carlos André | Desenvolvedor Full-Stack",
  description:
    "Portfólio de Carlos André — Desenvolvedor Full-Stack especializado em Next.js, React, TypeScript, Python e automações inteligentes. Criando plataformas SaaS de alta performance com UI premium.",
  keywords: [
    "desenvolvedor full-stack",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "automação",
    "SaaS",
    "freelancer",
    "Carlos André",
  ],
  authors: [{ name: "Carlos André", url: "https://github.com/techcarlosandre" }],
  creator: "Carlos André",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Carlos André | Desenvolvedor Full-Stack",
    description:
      "Desenvolvedor Full-Stack especializado em Next.js, React, TypeScript e automações com IA. Criando soluções digitais de alto desempenho.",
    siteName: "Carlos André Portfolio",
    images: [
      {
        url: "/eu.webp",
        width: 800,
        height: 800,
        alt: "Carlos André — Desenvolvedor Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carlos André | Desenvolvedor Full-Stack",
    description:
      "Desenvolvedor Full-Stack especializado em Next.js, React, TypeScript e automações com IA.",
    images: ["/eu.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
