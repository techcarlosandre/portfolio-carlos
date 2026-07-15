"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { SpotlightCard } from "./SpotlightCard";
import { CardTilt3D } from "./CardTilt3D";
import { FadeIn } from "./FadeIn";

export const AboutMeSection = () => {
  const { t } = useApp();
  const am = t.aboutMe;

  const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Copilot': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'GitHub': { bg: 'bg-zinc-500/10', text: 'text-txt-muted', border: 'border-zinc-500/20' },
    'Azure': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    'freeCodeCamp': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    'Cisco': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  };
  void CATEGORY_COLORS;

  return (
    <section id="sobre-mim" className="py-16 md:py-24 px-4 bg-bg/20 border-t border-border/40">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn>
            <Badge>{am.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={am.title1 + " "} />
              <span className="text-gradient"><GlitchText text={am.titleHighlight} delay={0.2} /></span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Bio + Stats + Areas */}
          <FadeIn direction="left">
            <div className="space-y-6">
              {/* Avatar + Bio Card */}
              <SpotlightCard className="border border-border bg-surface/60 p-6 rounded-2xl backdrop-blur-xl">
                <div className="flex items-start gap-5 mb-5">
                  <div className="relative w-16 h-16 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-primary/50 blur-md opacity-50" />
                    <div className="absolute inset-0.5 rounded-full overflow-hidden border-2 border-primary/30">
                      <Image src="/eu.webp" alt="Carlos André" fill className="object-cover object-top" unoptimized />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight">Carlos André</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Full-Stack Developer</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Disponível para projetos</span>
                    </div>
                  </div>
                </div>
                <p className="text-txt-muted text-xs leading-relaxed">{am.bio}</p>
              </SpotlightCard>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {am.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    className="border border-border bg-surface/60 backdrop-blur-xl rounded-xl p-4 text-center hover:border-primary/40 transition-colors"
                    whileHover={{ y: -4, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="text-2xl font-black text-primary">{s.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-txt-muted mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Areas */}
              <SpotlightCard className="border border-border bg-surface/60 p-5 rounded-2xl backdrop-blur-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted mb-3">{am.areasTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {am.areas.map((area, i) => (
                    <span key={i} className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
                      {area}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </FadeIn>

          {/* Right: Education + Languages */}
          <FadeIn direction="right" delay={0.1}>
            <div className="space-y-5">
              {/* Education */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />{am.educationTitle}
                </p>
                <div className="space-y-3">
                  {am.education.map((edu, i) => (
                    <CardTilt3D key={i}>
                      <SpotlightCard className="border border-border bg-surface/60 p-5 rounded-2xl backdrop-blur-xl hover:border-primary/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{edu.icon}</span>
                              <div>
                                <p className="text-xs font-black leading-tight">{edu.degree}</p>
                                <p className="text-[10px] text-primary font-bold mt-0.5">{edu.institution}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-txt-muted mt-2 pl-7">{edu.detail}</p>
                          </div>
                          <span className={`shrink-0 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                            edu.status === 'Em Andamento' || edu.status === 'In Progress'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-green-500/10 text-green-400 border border-green-500/20'
                          }`}>{edu.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                          <span className="text-[8px] font-black uppercase tracking-widest text-txt-muted">{edu.period}</span>
                        </div>
                      </SpotlightCard>
                    </CardTilt3D>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <SpotlightCard className="border border-border bg-surface/60 p-5 rounded-2xl backdrop-blur-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted mb-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />{am.languagesTitle}
                </p>
                <div className="space-y-4">
                  {am.languages.map((lang, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <p className="text-xs font-black">{lang.name}</p>
                            <p className="text-[9px] text-txt-muted">{lang.level}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-primary">{lang.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
