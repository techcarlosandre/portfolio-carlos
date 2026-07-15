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
    <section id="experiencia" className="py-16 md:py-24 px-4 bg-bg/20 border-t border-border/40">
      <div className="container mx-auto max-w-5xl">
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

        {/* Experience Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {exp.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <CardTilt3D className="h-full">
                <SpotlightCard className="h-full flex flex-col border border-border bg-surface/60 p-6 rounded-2xl backdrop-blur-xl hover:border-red-950/60 relative overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                  {/* Header info */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-[8px] font-black bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block">
                        {item.date}
                      </span>
                      {'link' in item && item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[8px] font-black bg-white/5 hover:bg-primary/20 border border-border hover:border-primary/40 text-txt hover:text-txt px-2 py-1 rounded-lg transition-all"
                        >
                          {lang === 'pt' ? 'Visitar' : 'Visit'} <ExternalLink size={8} />
                        </a>
                      )}
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-txt mb-1">
                      {item.company}
                    </h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {item.title}
                    </p>
                  </div>

                  <div className="w-full h-px bg-border/40 my-3" />

                  {/* Deliverables / Bullets */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {(item.bullets as readonly string[]).map((bullet, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-[10px] text-txt-muted leading-relaxed">
                        <Check size={10} className="text-primary shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stack utilized */}
                  <div className="pt-3 border-t border-border/40">
                    <p className="text-[8px] font-black uppercase tracking-widest text-txt-muted mb-2">Stack</p>
                    <div className="flex flex-wrap gap-1">
                      {(item.stack as readonly string[]).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-full border border-border text-[8px] font-bold text-txt-muted bg-surface/30 shadow-sm cursor-default"
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
