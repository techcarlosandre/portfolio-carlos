import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Dev Portfolio | Carlos André",
  description: "Portfólio de Desenvolvedor Full-Stack High-End de Carlos André, focado em estética premium e interatividade extrema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
