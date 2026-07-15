"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { SpotlightCard } from "./SpotlightCard";
import { FadeIn } from "./FadeIn";

export const CertificatesSection = () => {
  const { t } = useApp();
  const c = t.certs;
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const CATEGORY_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    'Copilot':      { color: 'text-purple-400',  bg: 'bg-purple-500/10',    border: 'border-purple-500/25',  icon: '🤖' },
    'GitHub':       { color: 'text-txt-muted',    bg: 'bg-zinc-500/10',      border: 'border-zinc-500/25',    icon: '🐙' },
    'Azure':        { color: 'text-blue-400',    bg: 'bg-blue-500/10',      border: 'border-blue-500/25',    icon: '☁️' },
    'freeCodeCamp': { color: 'text-green-400',   bg: 'bg-green-500/10',     border: 'border-green-500/25',   icon: '🔥' },
    'Cisco':        { color: 'text-teal-400',    bg: 'bg-teal-500/10',      border: 'border-teal-500/25',    icon: '🛡️' },
    'DevOps':       { color: 'text-rose-400',    bg: 'bg-rose-500/10',      border: 'border-rose-500/25',    icon: '🚀' },
  };

  const PLATFORM_COLOR: Record<string, string> = {
    'Microsoft Learn': 'text-blue-400',
    'freeCodeCamp': 'text-green-400',
    'Cisco Networking Academy': 'text-teal-400',
  };

  const allCategories = ['all', ...Array.from(new Set(c.items.map((i) => i.category)))];
  const filtered = activeFilter === 'all' ? c.items : c.items.filter((i) => i.category === activeFilter);
  
  // Slice list to show maximum 6 items initially (2 rows on desktop)
  const visibleItems = showAll ? filtered : filtered.slice(0, 6);

  // Reset showAll when changing filter to keep UX intuitive
  useEffect(() => {
    setShowAll(false);
  }, [activeFilter]);

  return (
    <section id="certificados" className="py-16 md:py-24 px-4 bg-bg/30 border-t border-border/60">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{c.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={c.title1 + " "} />
              <span className="text-gradient"><GlitchText text={c.titleHighlight} delay={0.2} /></span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm max-w-xl mx-auto">{c.desc}</p>
          </FadeIn>
        </div>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {allCategories.map((cat) => {
                const conf = cat !== 'all' ? CATEGORY_CONFIG[cat] : null;
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-txt border-primary shadow-[0_0_12px_rgba(128,0,0,0.3)]'
                        : `border-border bg-surface/40 text-txt-muted hover:border-primary/40 hover:text-txt`
                    }`}
                  >
                    {conf && <span>{conf.icon}</span>}
                    {cat === 'all' ? c.filterAll : cat}
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[8px] ${
                      isActive ? 'bg-white/20' : 'bg-surface'
                    }`}>
                      {cat === 'all' ? c.items.length : c.items.filter(i => i.category === cat).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + "_" + showAll}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {visibleItems.map((item, idx) => {
              const conf = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG['GitHub'];
              const platColor = PLATFORM_COLOR[item.platform] ?? 'text-txt-muted';
              const isInProgress = String(item.status) === 'inprogress';
              const isFeatured = 'featured' in item && !!item.featured;
              return (
                <motion.div
                  key={item.title + idx}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <SpotlightCard className={`h-full flex flex-col border p-4 rounded-2xl backdrop-blur-xl transition-all relative overflow-hidden cursor-pointer ${
                    isFeatured 
                      ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-zinc-950/60 to-zinc-950/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'border-border bg-surface/60 hover:border-primary/30'
                  }`}>
                    {/* Top highlights indicator — subtle glow only, no label */}
                    {isFeatured && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
                    )}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                    {/* Top row: category badge + status */}
                    <div className="flex items-center justify-between mb-3 pr-12">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${conf.bg} ${conf.color} ${conf.border} flex items-center gap-1`}>
                        <span>{conf.icon}</span> {item.category}
                      </span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border flex items-center gap-1 ${
                        isInProgress
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isInProgress ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                        {isInProgress ? c.statusInProgress : c.statusCompleted}
                      </span>
                    </div>

                    {/* Title */}
                    <p className={`text-xs font-black leading-tight flex-1 mb-3 ${isFeatured ? 'text-amber-200/90' : ''}`}>{item.title}</p>

                    {/* Footer: platform only */}
                    <div className="pt-3 border-t border-border/40">
                      <span className={`text-[8px] font-bold ${platColor} uppercase tracking-wider`}>{item.platform}</span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Show More Button */}
        {filtered.length > 6 && (
          <FadeIn delay={0.2}>
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-primary border border-border hover:border-primary text-txt hover:text-txt text-[10px] font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md duration-300"
              >
                <span>{showAll ? c.btnShowLess : c.btnShowMore}</span>
                <ChevronRight size={12} className={`transition-transform duration-300 ${showAll ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
};
