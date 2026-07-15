"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { FadeIn } from "./FadeIn";
import { GithubIcon, LinkedinIcon } from "./Icons";

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  const email = "techcarlosandre@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const el = document.createElement("textarea");
      el.value = email;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="contact-link-card group cursor-pointer w-full text-left"
      >
        <span className="text-xl">✉️</span>
        <div>
          <p className="text-[9px] font-black uppercase tracking-wider text-txt group-hover:text-primary transition-colors">Email</p>
          <p className="text-[8px] text-txt-muted">techcarlosandre@gmail.com</p>
        </div>
      </button>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap"
          >
            <div className="flex items-center gap-1.5 bg-green-500 text-txt text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-green-500/30">
              <Check size={10} />
              Email copiado!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FooterSection = () => {
  const { t } = useApp();
  return (
    <footer id="contato" className="pt-20 pb-10 px-4 border-t border-border bg-bg/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <FadeIn>
            <Badge>{t.contact.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
              <GlitchText text={t.contact.title1 + " "} />
              <span className="text-gradient"><GlitchText text={t.contact.titleHighlight} delay={0.2} /></span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm mt-3 max-w-lg mx-auto">{t.contact.desc}</p>
          </FadeIn>
        </div>

        {/* Quick contact links */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <a
              href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto."
              target="_blank" rel="noopener noreferrer"
              className="contact-link-card group"
            >
              <span className="text-xl">💬</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-txt group-hover:text-primary transition-colors">WhatsApp</p>
                <p className="text-[8px] text-txt-muted">(21) 98266-5121</p>
              </div>
            </a>
            <CopyEmailButton />
            <a
              href="https://github.com/techcarlosandre"
              target="_blank" rel="noopener noreferrer"
              className="contact-link-card group"
            >
              <GithubIcon size={18} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-txt group-hover:text-primary transition-colors">GitHub</p>
                <p className="text-[8px] text-txt-muted">techcarlosandre</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/devcarlosandre/"
              target="_blank" rel="noopener noreferrer"
              className="contact-link-card group"
            >
              <LinkedinIcon size={18} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-txt group-hover:text-primary transition-colors">LinkedIn</p>
                <p className="text-[8px] text-txt-muted">devcarlosandre</p>
              </div>
            </a>
          </div>
        </FadeIn>

        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-txt-muted text-[9px] font-bold uppercase tracking-widest">
          <p>{t.footer.copy}</p>
          <p>{t.footer.made}</p>
        </div>
      </div>
    </footer>
  );
};
