"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X, ArrowUpRight } from "lucide-react";
import { useApp } from "../app/providers";
import { useIsMobile } from "../lib/useIsMobile";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";
import { SpotlightCard } from "./SpotlightCard";

// ─── NEURAL SYNAPSE INTRO CANVAS ───
const NeuralSynapseIntro = ({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active || completedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      phase: number;
      speed: number;
      pulseDelay: number;
      activated: boolean;
    }

    const nodes: Node[] = [];
    const nodeCount = 80;
    const connectionDist = 160;
    let elapsed = 0;
    const INTRO_DURATION_FRAMES = 90; // ~1.5s at 60fps

    // Spawn nodes from center outward
    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const db = Math.random() * Math.max(width, height) * 0.6;
      nodes.push({
        x: cx + Math.cos(angle) * db,
        y: cy + Math.sin(angle) * db,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.015,
        pulseDelay: Math.random() * 40, // faster cascade
        activated: false,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      elapsed++;
      ctx.clearRect(0, 0, width, height);

      // Global intensity ramps up then fades at the end
      const progress = elapsed / INTRO_DURATION_FRAMES;
      const intensity =
        progress < 0.6
          ? Math.min(progress / 0.3, 1) // ramp up in first 30%
          : 1 - (progress - 0.6) / 0.4; // fade out in last 40%

      if (progress >= 1 && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }

      // Activate nodes in cascade
      nodes.forEach((n) => {
        if (!n.activated && elapsed > n.pulseDelay) {
          n.activated = true;
        }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].activated) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          if (!nodes[j].activated) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha =
              (1 - dist / connectionDist) * 0.25 * intensity;
            const pulse =
              Math.sin(elapsed * 0.04 + nodes[i].phase) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(200, 30, 30, ${alpha * (0.5 + pulse * 0.5)})`;
            ctx.lineWidth = 0.8 * intensity;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Traveling pulse dots
            if (pulse > 0.8 && Math.random() > 0.93) {
              const t = Math.random();
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.fillStyle = `rgba(255, 60, 60, ${alpha * 4})`;
              ctx.beginPath();
              ctx.arc(px, py, 2 * intensity, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        if (!n.activated) return;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = Math.sin(elapsed * n.speed + n.phase);
        const glowRadius = (n.radius + pulse * 2) * intensity;

        // Outer glow
        const grad = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          glowRadius * 5
        );
        grad.addColorStop(0, `rgba(220, 40, 40, ${0.25 * intensity})`);
        grad.addColorStop(1, `rgba(220, 40, 40, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(240, 50, 50, ${(0.6 + pulse * 0.4) * intensity})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Center convergence glow (dramatic focal point)
      const centerGlowSize = Math.min(width, height) * 0.4 * intensity;
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerGlowSize);
      centerGrad.addColorStop(0, `rgba(180, 20, 20, ${0.15 * intensity})`);
      centerGrad.addColorStop(0.5, `rgba(150, 10, 10, ${0.06 * intensity})`);
      centerGrad.addColorStop(1, `rgba(100, 0, 0, 0)`);
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, centerGlowSize, 0, Math.PI * 2);
      ctx.fill();

      if (progress < 1.2) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 30 }}
    />
  );
};

export const ProjectsSection = ({
  selectedTech,
  onClearSelection,
}: {
  selectedTech: string | null;
  onClearSelection: () => void;
}) => {
  const { t, lang } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mockupType, setMockupType] = useState<"desktop" | "mobile">("desktop");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fullScreenVideo, setFullScreenVideo] = useState<string | null>(null);

  // Set mockupType to mobile by default on mobile devices
  useEffect(() => {
    if (window.innerWidth < 768) {
      setMockupType("mobile");
    }
  }, []);

  const phase = "ready";
  const showContent = true;
  const isReady = true;
  const staggerDelay = 0;

  const projectsData: {
    title: string;
    desc: string;
    tag: string;
    techs: readonly string[];
    link: string;
    area: string;
    wip?: boolean;
    desktop: { img?: string; video?: string; placeholder?: boolean };
    mobile: { img?: string; video?: string; placeholder?: boolean };
  }[] = [
    {
      title: t.projects.items[0].title,
      desc: t.projects.items[0].desc,
      tag: t.projects.items[0].tag,
      techs: t.projects.items[0].techs,
      link: "https://projetos.techcarlos.com.br/sushi",
      area: "Web & UX/UI",
      desktop: { video: "/sushi/sushi_opt.mp4" },
      mobile: { video: "/sushi/sushi-app_opt.mp4" },
    },
    {
      title: t.projects.items[1].title,
      desc: t.projects.items[1].desc,
      tag: t.projects.items[1].tag,
      techs: t.projects.items[1].techs,
      link: "https://projetos.techcarlos.com.br/fitgym",
      area: "Mobile & Flutter",
      desktop: { video: "/fitgym/fitgym_opt.mp4" },
      mobile: { video: "/fitgym/fitgym-app_opt.mp4" },
    },
    {
      title: t.projects.items[2].title,
      desc: t.projects.items[2].desc,
      tag: t.projects.items[2].tag,
      techs: t.projects.items[2].techs,
      link: "https://projetos.techcarlos.com.br/horizonte",
      area: "Sistemas & Dashboard",
      desktop: { video: "/horizonte/horizonte_opt.mp4" },
      mobile: { video: "/horizonte/horizonte-app_opt.mp4" },
    },
    {
      title: t.projects.items[3].title,
      desc: t.projects.items[3].desc,
      tag: t.projects.items[3].tag,
      techs: t.projects.items[3].techs,
      link: "https://projetos.techcarlos.com.br/barber",
      area: "Gestão & CRM",
      desktop: { video: "/barber/barber_opt.mp4" },
      mobile: { video: "/barber/barber-app_opt.mp4" },
    },
    {
      title: t.projects.items[4].title,
      desc: t.projects.items[4].desc,
      tag: t.projects.items[4].tag,
      techs: t.projects.items[4].techs,
      link: "https://projetos.techcarlos.com.br/vitamed",
      area: "Integrações & IA",
      desktop: { video: "/vitamed/vitamed_opt.mp4" },
      mobile: { video: "/vitamed/vitamed-app_opt.mp4" },
    },
  ];

  const TECH_ALIASES: Record<string, string[]> = {
    JS: ["JavaScript"],
    TS: ["TypeScript"],
    React: ["React"],
    "Next.js": ["Next.js"],
    Python: ["Python"],
    Flask: ["Flask"],
    Java: ["Java"],
    Spring: ["Spring Boot", "Spring"],
    Prisma: ["Prisma"],
    Supabase: ["Supabase"],
    PostgreSQL: ["PostgreSQL", "SQL"],
    HTML5: ["HTML"],
    CSS3: ["CSS"],
    Tailwind: ["Tailwind", "Tailwind CSS"],
    Git: ["Git"],
    GitHub: ["GitHub"],
    Docker: ["Docker"],
    Vercel: ["Vercel"],
    N8N: ["N8N"],
    Figma: ["Figma"],
    "Node.js": ["Node.js"],
    GraphQL: ["GraphQL"],
    Grafana: ["Grafana"],
    Axios: ["Axios"],
    "Vue.js": ["Vue.js"],
    Chatwoot: ["Chatwoot"],
    MCP: ["MCP"],
    Flutter: ["Flutter"],
    RabbitMQ: ["RabbitMQ"],
    "Framer Motion": ["Framer Motion", "Framer"],
    pgvector: ["pgvector", "PostgreSQL"],
    Redis: ["Redis"],
    AWS: ["AWS", "Amazon Web Services"],
  };

  const filtered = selectedTech
    ? projectsData.filter((p) => {
        const aliases = TECH_ALIASES[selectedTech] || [selectedTech];
        return p.techs?.some(
          (tech) =>
            aliases.some((alias) =>
              tech.toLowerCase().includes(alias.toLowerCase())
            ) || tech === selectedTech
        );
      })
    : projectsData;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTech]);

  const handleNext = () => {
    if (phase !== "ready") return;
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = () => {
    if (phase !== "ready") return;
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  if (filtered.length === 0) {
    return (
      <section
        id="projetos"
        className="py-24 px-4 bg-bg/30 border-t border-border/60"
      >
        <div className="container mx-auto max-w-5xl text-center">
          <Badge>{t.projects.badge}</Badge>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-8">
            {t.projects.title1}{" "}
            <span className="text-gradient">{t.projects.titleHighlight}</span>
          </h2>
          <div className="w-full max-w-md mx-auto rounded-2xl border border-border p-8 text-center glass-card mt-8">
            <p className="text-txt-muted text-xs">
              {lang === "en"
                ? "No projects found for the selected technology."
                : "Nenhum projeto encontrado para a tecnologia selecionada."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const p = filtered[currentIndex];
  const activeMedia = mockupType === "desktop" ? p.desktop : p.mobile;

  // Add mobile detection to disable heavy assets/animations
  const isMobileDevice = useIsMobile();

  const getProjectIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("sushi")) return "🍣";
    if (lower.includes("gym") || lower.includes("fit")) return "💪";
    if (lower.includes("horizonte")) return "📊";
    if (lower.includes("barber")) return "💈";
    return "🏥";
  };

  return (
    <section
      ref={sectionRef}
      id="projetos"
      className="relative min-h-screen bg-bg/20 border-t border-border/60 overflow-hidden"
    >
      <div
        className="relative z-10 w-full px-4 py-16 lg:py-24"
        style={{
          opacity: showContent ? 1 : 0,
          pointerEvents: isReady ? "auto" : "none",
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Top Center Title */}
        <motion.div
          className="text-center flex flex-col items-center w-full max-w-xl mx-auto mb-12 lg:mb-16"
          initial={isMobileDevice ? { opacity: 0 } : { opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            delay: staggerDelay * 0,
          }}
        >
          <Badge>{t.projects.badge}</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase mt-2">
            <GlitchText text={t.projects.title1 + " "} />
            <span className="text-gradient"><GlitchText text={t.projects.titleHighlight} delay={0.2} /></span>
          </h2>
        </motion.div>

        {/* Main Grid */}
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Device Mockup */}
            <motion.div
              className="lg:col-span-6 flex flex-col justify-center items-center relative"
              initial={isMobileDevice ? { opacity: 0 } : { opacity: 0, x: -60, scale: 0.92 }}
              animate={showContent ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 18,
                delay: staggerDelay * 1,
              }}
            >
              {!isMobileDevice && (
                <>
                  <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/15 blur-[120px] pointer-events-none"
                    animate={
                      showContent
                        ? { scale: [0.8, 1.1, 1], opacity: [0, 0.8, 0.6] }
                        : {}
                    }
                    transition={{ duration: 3, delay: staggerDelay * 2 }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-rose-500/12 blur-[100px] pointer-events-none"
                    animate={
                      showContent
                        ? { scale: [0.8, 1.2, 1], opacity: [0, 0.6, 0.4] }
                        : {}
                    }
                    transition={{ duration: 3.5, delay: staggerDelay * 3 }}
                  />
                </>
              )}

              {/* Mockup Toggle Buttons */}
              <motion.div
                className="w-full max-w-[550px] flex justify-center mb-4"
                initial={isMobileDevice ? { opacity: 0 } : { opacity: 0, y: -20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: staggerDelay * 2,
                }}
              >
                <div className="flex gap-2 bg-surface/65 border border-border p-1 rounded-xl z-20">
                  <button
                    onClick={() => setMockupType("desktop")}
                    disabled={!isReady}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                      mockupType === "desktop"
                        ? "bg-gradient-to-r from-[#a00000] to-[#e03030] text-txt font-bold"
                        : "text-txt-muted hover:text-txt"
                    }`}
                  >
                    💻 {t.projects.computer}
                  </button>
                  <button
                    onClick={() => setMockupType("mobile")}
                    disabled={!isReady}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
                      mockupType === "mobile"
                        ? "bg-gradient-to-r from-[#a00000] to-[#e03030] text-txt font-bold"
                        : "text-txt-muted hover:text-txt"
                    }`}
                  >
                    📱 {t.projects.mobile}
                  </button>
                </div>
              </motion.div>

              {/* Device Mockup */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mockupType + "_" + currentIndex}
                  initial={isMobileDevice ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotateY: 15, z: -100 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
                  exit={isMobileDevice ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotateY: -15, z: -100 }}
                  transition={isMobileDevice ? { duration: 0.25 } : { type: "spring", stiffness: 300, damping: 24 }}
                  className="w-full max-w-[550px] flex flex-col justify-center"
                  style={{ perspective: 1200 }}
                >
                  {mockupType === "desktop" ? (
                    <div className="w-full group">
                      <button
                        onClick={() => setFullScreenVideo(activeMedia.video || null)}
                        disabled={!isReady}
                        className="relative w-full aspect-[16/10] border-[10px] border-[#1d1d1f] bg-gradient-to-br from-surface to-bg rounded-t-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(128,0,0,0.35)] border-b-0 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                      >
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors z-0" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-3 text-center p-4">
                          <span className="text-4xl">{getProjectIcon(p.title)}</span>
                          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-txt transition-transform duration-300 group-hover:scale-110">
                            <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="ml-0.5">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-txt uppercase tracking-wider block">
                              {lang === "en" ? "Watch Desktop Preview" : "Ver Vídeo Desktop"}
                            </span>
                            <span className="text-[8px] font-medium text-txt-muted uppercase tracking-widest block">
                              {lang === "en" ? "Full Screen" : "Tela Cheia"}
                            </span>
                          </div>
                        </div>
                      </button>
                      <div className="w-20 h-10 bg-zinc-200 dark:bg-[#161618] mx-auto border-t border-border" />
                      <div className="w-36 h-2 bg-zinc-300 dark:bg-[#202022] mx-auto rounded-full shadow-md" />
                    </div>
                  ) : (
                    <div className="w-full flex justify-center group">
                      {isMobileDevice ? (
                        <button
                          onClick={() => setFullScreenVideo(activeMedia.video || null)}
                          className="relative w-full max-w-[280px] aspect-[9/16] bg-gradient-to-br from-surface to-bg rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(128,0,0,0.35)] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary/50 group border border-border"
                        >
                          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors z-0" />
                          
                          <div className="relative z-10 flex flex-col items-center gap-4 text-center p-4">
                            <span className="text-4xl">{getProjectIcon(p.title)}</span>
                            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-txt transition-transform duration-300 group-hover:scale-110">
                              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="ml-0.5">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-txt uppercase tracking-wider block">
                                {lang === "en" ? "Watch Preview" : "Ver Vídeo"}
                              </span>
                              <span className="text-[8px] font-medium text-txt-muted uppercase tracking-widest block">
                                {lang === "en" ? "Full Screen" : "Tela Cheia"}
                              </span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => setFullScreenVideo(activeMedia.video || null)}
                          className="relative w-[210px] h-[370px] border-[8px] border-[#1d1d1f] bg-gradient-to-br from-surface to-bg rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(128,0,0,0.35)] flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                        >
                          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors z-0" />
                          
                          <div className="relative z-10 flex flex-col items-center gap-4 text-center p-4">
                            <span className="text-4xl">{getProjectIcon(p.title)}</span>
                            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-txt transition-transform duration-300 group-hover:scale-110">
                              <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="ml-0.5">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-txt uppercase tracking-wider block">
                                {lang === "en" ? "Watch Preview" : "Ver Vídeo"}
                              </span>
                              <span className="text-[8px] font-medium text-txt-muted uppercase tracking-widest block">
                                {lang === "en" ? "Full Screen" : "Tela Cheia"}
                              </span>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {selectedTech && (
                <div className="mt-4 flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl text-xs uppercase font-black z-20">
                  <div>
                    {t.projects.filter}{" "}
                    <span className="text-gradient">{selectedTech}</span>
                  </div>
                  <button
                    onClick={onClearSelection}
                    disabled={!isReady}
                    className="text-[10px] bg-bg border border-border rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    {t.projects.clear}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Right Side: Project Info & Controls */}
            <motion.div
              className="lg:col-span-6 flex flex-col justify-center relative"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={showContent ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 18,
                delay: staggerDelay * 3,
              }}
            >
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 rounded-full bg-[#ff4d4d]/12 blur-[80px] pointer-events-none" />

              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#ff4d4d] bg-[#ff4d4d]/10 border border-[#ff4d4d]/25 px-3 py-1 rounded-full">
                        {p.area}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-txt-muted">
                        {p.tag}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-black uppercase mb-4 bg-gradient-to-r from-[#ff8080] via-[#ff4040] to-[#ff7070] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(255,64,64,0.35)]">
                      {p.title}
                    </h3>
                    <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-8">
                      {p.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Project Thumbnails Selector */}
                <div className="flex gap-2 overflow-x-auto py-2 chat-scrollbar mb-4">
                  {filtered.map((proj, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={proj.title}
                        onClick={() => setCurrentIndex(idx)}
                        disabled={!isReady}
                        className={`flex flex-col items-start gap-1 p-2.5 rounded-xl border text-left shrink-0 transition-all duration-300 w-28 cursor-pointer hover:border-primary/50 ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(128,0,0,0.25)]"
                            : "border-border bg-surface/40"
                        }`}
                      >
                        <span className="text-[7px] font-black uppercase text-txt-muted block leading-none">
                          {proj.area}
                        </span>
                        <span className="text-[9px] font-bold text-txt truncate w-full">
                          {proj.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-6 pt-6 border-t border-border">
                  {p.techs && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.techs.map((tech, techIdx) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1 rounded-full border border-border hover:border-[#ff4d4d]/40 text-[9px] font-bold text-txt-muted hover:text-txt bg-surface/30 hover:bg-[#ff4d4d]/10 transition-all duration-300 shadow-sm cursor-default"
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          whileHover={{ scale: 1.08, y: -2 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay: techIdx * 0.06,
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <motion.div
                    className="flex items-center justify-between pt-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: 0,
                    }}
                  >
                    <div className="flex-1">
                      {p.wip ? (
                        <div className="w-full text-center text-[10px] font-black uppercase tracking-widest text-txt-muted bg-surface/40 border border-border py-4 rounded-xl">
                          {t.projects.comingSoon}
                        </div>
                      ) : (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#a00000] to-[#e03030] hover:from-[#e03030] hover:to-[#a00000] text-txt text-[10px] font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(224,48,48,0.25)] hover:shadow-[0_4px_25px_rgba(224,48,48,0.45)] duration-300 ${
                            !isReady
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                          tabIndex={isReady ? 0 : -1}
                        >
                          {t.projects.demo} <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>

                    {/* Slider Controls */}
                    <div
                      className={`flex gap-1 bg-surface/60 border border-border p-1 rounded-xl shrink-0 shadow-lg ${
                        !isReady ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <button
                        onClick={handlePrev}
                        disabled={!isReady}
                        className="p-2 hover:bg-primary/20 border border-transparent hover:border-primary/40 rounded-lg text-txt-muted hover:text-txt cursor-pointer transition-all duration-350"
                        title={t.projects.prev}
                      >
                        <ChevronRight size={14} className="rotate-180" />
                      </button>
                      <span className="text-[10px] font-black uppercase tracking-wider px-3.5 py-2 bg-bg border border-border rounded-lg flex items-center justify-center min-w-[42px] text-[#ff4d4d]">
                        {currentIndex + 1} / {filtered.length}
                      </span>
                      <button
                        onClick={handleNext}
                        disabled={!isReady}
                        className="p-2 hover:bg-primary/20 border border-transparent hover:border-primary/40 rounded-lg text-txt-muted hover:text-txt cursor-pointer transition-all duration-350"
                        title={t.projects.next}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full-Screen Video Modal Player */}
      <AnimatePresence>
        {fullScreenVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
          >
            <button
              onClick={() => setFullScreenVideo(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-surface/80 border border-border text-txt cursor-pointer hover:bg-primary transition-colors z-20"
            >
              <X size={20} />
            </button>
            <div className={`relative w-full ${mockupType === "desktop" ? "max-w-4xl aspect-[16/10] max-h-[80vh]" : "max-w-[340px] md:max-w-md aspect-[9/16] max-h-[90vh]"} rounded-2xl md:rounded-3xl overflow-hidden border border-border/20 bg-black shadow-2xl`}>
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
                key={fullScreenVideo}
              >
                <source src={fullScreenVideo.replace(".mp4", ".webm")} type="video/webm" />
                <source src={fullScreenVideo} type="video/mp4" />
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
