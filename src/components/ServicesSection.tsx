"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { SpotlightCard } from "./SpotlightCard";
import { CardTilt3D } from "./CardTilt3D";
import { FadeIn } from "./FadeIn";

export const ServicesSection = () => {
  const { t } = useApp();

  return (
    <section id="servicos" className="py-16 md:py-24 px-4 bg-bg/30 border-t border-border/60">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <FadeIn>
            <Badge>{t.services.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={t.services.title1 + " "} />
              <span className="text-gradient"><GlitchText text={t.services.titleHighlight} delay={0.2} /></span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm max-w-xl mx-auto">{t.services.desc}</p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {t.services.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <CardTilt3D className="h-full">
                <SpotlightCard className="h-full flex flex-col border border-border bg-surface/60 p-6 rounded-2xl backdrop-blur-xl hover:border-red-950/60 relative overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                  <div className="flex items-start justify-between mb-5">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-[8px] font-black bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-black uppercase mb-3">{item.title}</h3>
                  <p className="text-txt-muted text-xs leading-relaxed mb-5 flex-1">{item.desc}</p>

                  <ul className="space-y-2 mb-6">
                    {(item.highlights as readonly string[]).map((h, hi) => (
                      <li key={hi} className="flex items-center gap-2 text-[10px] text-txt-muted">
                        <Check size={10} className="text-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+um+orçamento."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-txt border border-primary/30 hover:border-primary text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                  >
                    {t.services.cta} <ChevronRight size={12} />
                  </a>
                </SpotlightCard>
              </CardTilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
