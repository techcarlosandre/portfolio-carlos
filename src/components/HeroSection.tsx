"use client";

import React from "react";
import Image from "next/image";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { ShinyText } from "./ShinyText";
import { SplitText } from "./SplitText";
import { FadeIn } from "./FadeIn";
import { TypewriterTitle } from "./TypewriterTitle";
import { useIsMobile } from "../lib/useIsMobile";

export const HeroSection = ({ loaded }: { loaded: boolean }) => {
  const { t } = useApp();
  const isMobile = useIsMobile();

  return (
    <section id="home" className="min-h-[60vh] sm:min-h-[80vh] md:min-h-[92vh] py-10 md:py-0 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="hero-glow" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent pointer-events-none" />

      <div className="w-full px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center relative z-10 text-center">
        <FadeIn delay={0.05} triggerOnMount>
          {/* Avatar with glow ring */}
          <div className="relative w-20 h-20 mb-5 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-primary/50 blur-lg opacity-60 animate-pulse" />
            <div className="absolute inset-0.5 rounded-full overflow-hidden border-2 border-primary/40">
              <Image src="/eu.webp" alt="Carlos André" fill className="object-cover object-top" priority unoptimized />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-bg flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-green-500 relative" />
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} triggerOnMount>
          <Badge pulsing>
            <ShinyText text={t.hero.badge} />
          </Badge>
        </FadeIn>

        <FadeIn delay={0.25} triggerOnMount>
          <h1 className="text-4xl sm:text-6xl md:text-[76px] font-black uppercase leading-[0.95] tracking-tighter mt-6 mb-3">
            {isMobile ? t.hero.title1 : <SplitText text={t.hero.title1} />}
            <br />
            <span className="text-gradient">
              {isMobile ? t.hero.title2 : <SplitText text={t.hero.title2} delay={0.25} />}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.35} triggerOnMount>
          <div className="text-txt-muted text-sm md:text-base font-medium mb-8 h-7">
            <TypewriterTitle words={t.hero.typewriter} start={loaded} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
