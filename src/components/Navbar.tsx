"use client";

import React, { useEffect, useState } from "react";
import { Globe, Sun, Moon, X, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../app/providers";

export const Navbar = () => {
  const { t, lang, setLang, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      setHidden(current > lastY && current > 100);
      lastY = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: t.nav.aboutMe, href: "#sobre-mim" },
    { name: t.nav.experience, href: "#experiencia" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.services, href: "#servicos" },
    { name: t.nav.projects, href: "#projetos" },
    { name: t.nav.certs, href: "#certificados" },
    { name: t.nav.contact, href: "#contato" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className={`container mx-auto max-w-6xl transition-all duration-300 ${scrolled ? "bg-bg/90 backdrop-blur-2xl border border-border shadow-2xl rounded-full py-2.5 px-6 mx-4 mt-2" : "py-4 px-4"}`}>
        <div className="flex justify-between items-center">
          <a href="#home" className="text-lg font-black tracking-tighter">
            CARLOS<span className="text-primary">.</span>
          </a>
          <div className="hidden lg:flex gap-5 items-center text-[8px] font-black uppercase tracking-wider">
            {links.map((l) => (
              <a key={l.name} href={l.href} className="hover:text-primary transition-colors relative group">
                {l.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newLang = lang === "pt" ? "en" : "pt";
                localStorage.setItem("carlos_portfolio_lang", newLang);
                window.location.reload();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-[8px] font-bold bg-surface/20 hover:bg-surface/40 transition-colors"
            >
              <Globe size={10} className="text-primary" /> {lang === "pt" ? "EN" : "PT"}
            </button>
            <button onClick={toggleTheme} className="p-1.5 rounded-full border border-border bg-surface/20 hover:bg-surface/40 transition-colors">
              {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-1.5">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-16 left-4 right-4 bg-bg/95 backdrop-blur-2xl border border-border rounded-2xl p-6 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-4 items-center font-black uppercase tracking-widest text-xs">
              {links.map((l) => (
                <a key={l.name} href={l.href} onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">
                  {l.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
