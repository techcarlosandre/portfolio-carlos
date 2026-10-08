"use client";

import React from "react";
import { ExternalLink, Check } from "lucide-react";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { SpotlightCard } from "./SpotlightCard";
import { CardTilt3D } from "./CardTilt3D";
import { FadeIn } from "./FadeIn";

export const ExperienceSection = () => {
  const { t, lang } = useApp();
  const exp = t.experience;

  return (
    <section id="experiencia" className="py-16 md:py-24 px-4 bg-bg/20 border-t border-border/40 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <Badge>{exp.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={exp.title1 + " "} />
              <span className="text-gradient">
                <GlitchText text={exp.titleHighlight} delay={0.2} />
              </span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm max-w-xl mx-auto">{exp.subtitle}</p>
          </FadeIn>
        </div>

        {/* Horizontal Order of Vertical Cards (Card 1 -> Card 2 -> Card 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {exp.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.12} className="h-full">
              <CardTilt3D className="h-full">
                <SpotlightCard className="h-full flex flex-col justify-between border border-border bg-surface/60 p-6 rounded-3xl backdrop-blur-xl hover:border-primary/50 relative overflow-hidden transition-all shadow-xl group">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent group-hover:via-primary transition-all duration-500" />

                  {/* Header info */}
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-3">
                      <span className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block shadow-sm">
                        {item.date}
                      </span>
                      {'link' in item && item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[9px] font-black bg-surface/80 hover:bg-primary/20 border border-border hover:border-primary/50 text-txt px-2.5 py-1 rounded-lg transition-all"
                        >
                          {lang === 'pt' ? 'Visitar' : 'Visit'} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    
                    <h3 className="text-base font-black uppercase tracking-tight text-txt mb-1 group-hover:text-primary transition-colors">
                      {item.company}
                    </h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                      {item.title}
                    </p>

                    <div className="w-full h-px bg-border/40 my-3" />

                    {/* Deliverables / Bullets */}
                    <ul className="space-y-2.5 mb-6">
                      {(item.bullets as readonly string[]).map((bullet, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-[11px] text-txt-muted leading-relaxed">
                          <span className="w-3.5 h-3.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={9} className="text-primary" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack utilized (Bottom of Vertical Card) */}
                  <div className="pt-4 border-t border-border/40 mt-auto">
                    <p className="text-[8px] font-black uppercase tracking-widest text-txt-muted mb-2">Stack & Tecnologias</p>
                    <div className="flex flex-wrap gap-1">
                      {(item.stack as readonly string[]).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-full border border-border/60 text-[8px] font-bold text-txt-muted bg-surface/40 hover:border-primary/40 hover:text-txt transition-all cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </CardTilt3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
