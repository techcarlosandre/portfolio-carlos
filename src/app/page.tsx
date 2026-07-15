"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useApp } from "./providers";

// Background Grid & Beams
import { BackgroundGrid } from "../components/BackgroundGrid";
import { BackgroundBeams } from "../components/BackgroundBeams";

// Modular Clean Components
import { MigrationOverlay } from "../components/MigrationOverlay";
import { LoadingScreen } from "../components/LoadingScreen";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollProgress } from "../components/ScrollProgress";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutMeSection } from "../components/AboutMeSection";
import { ExperienceSection } from "../components/ExperienceSection";
import { SkillsSection } from "../components/SkillsSection";
import { ServicesSection } from "../components/ServicesSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { CertificatesSection } from "../components/CertificatesSection";
import { FooterSection } from "../components/FooterSection";

import { StackingSection } from "../components/StackingSection";
import { LazySection } from "../components/LazySection";

const FloatingChatWidget = dynamic(
  () => import("../components/FloatingChatWidget").then((mod) => mod.FloatingChatWidget),
  { ssr: false }
);

export default function PortfolioPage() {
  const { lang, t, theme } = useApp();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isOldDomain, setIsOldDomain] = useState(false);

  useEffect(() => {
    // Detect if accessing from old domain
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      // Strict check to avoid running on localhost or IP addresses during development
      if (
        hostname === "techcarlosandre.github.io" || 
        (hostname.includes("github.io") && !hostname.includes("localhost") && !hostname.startsWith("192.168.") && !hostname.startsWith("10."))
      ) {
        setIsOldDomain(true);
      }
    }
  }, []);

  return (
    <>
      {isOldDomain && <MigrationOverlay />}

      <AnimatePresence>
        {!loaded && <LoadingScreen key="loading" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div 
        className={`w-full min-h-screen transition-opacity duration-700 ease-out portfolio-app-wrapper ${
          !loaded 
            ? "pointer-events-none h-screen overflow-hidden opacity-0" 
            : "opacity-100"
        }`}
      >
        <CustomCursor />
        <ScrollProgress />
        <FloatingChatWidget t={t} lang={lang} theme={theme} />
        <main className="relative min-h-screen bg-bg text-txt selection:bg-primary selection:text-txt overflow-x-clip dot-grid">
          <div className="grain-overlay" />
          <BackgroundGrid />
          <BackgroundBeams />
          <Navbar />
          
          <StackingSection>
            <HeroSection loaded={loaded} />
          </StackingSection>
          
          <StackingSection>
            <AboutMeSection />
          </StackingSection>
          
          <StackingSection>
            <ExperienceSection />
          </StackingSection>

          <LazySection>
            <StackingSection>
              <SkillsSection
                selectedTech={selectedTech}
                onSelectTech={(tech) => setSelectedTech((curr) => (curr === tech ? null : tech))}
              />
            </StackingSection>
          </LazySection>

          <LazySection>
            <StackingSection>
              <ServicesSection />
            </StackingSection>
          </LazySection>

          <LazySection>
            <StackingSection>
              <ProjectsSection
                selectedTech={selectedTech}
                onClearSelection={() => setSelectedTech(null)}
              />
            </StackingSection>
          </LazySection>

          <LazySection>
            <StackingSection>
              <CertificatesSection />
            </StackingSection>
          </LazySection>
          
          <FooterSection />
        </main>
      </div>
    </>
  );
}
