"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../app/providers";
import { Badge } from "./Badge";
import { GlitchText } from "./GlitchText";

const TECH_ICONS: Record<string, { slug: string; color: string; label: string }> = {
  "JS": { slug: "javascript", color: "#F7DF1E", label: "JavaScript" },
  "TS": { slug: "typescript", color: "#3178C6", label: "TypeScript" },
  "React": { slug: "react", color: "#61DAFB", label: "React" },
  "Next.js": { slug: "nextdotjs", color: "#ffffff", label: "Next.js" },
  "Vue.js": { slug: "vuedotjs", color: "#4FC08D", label: "Vue.js" },
  "Node.js": { slug: "nodedotjs", color: "#339933", label: "Node.js" },
  "RabbitMQ": { slug: "rabbitmq", color: "#FF6600", label: "RabbitMQ" },
  "Python": { slug: "python", color: "#3776AB", label: "Python" },
  "Django": { slug: "django", color: "#44B78B", label: "Django" },
  "Axios": { slug: "axios", color: "#5A29E4", label: "Axios" },
  "Java": { slug: "openjdk", color: "#ED8B00", label: "Java" },
  "Spring": { slug: "spring", color: "#6DB33F", label: "Spring Boot" },
  "GraphQL": { slug: "graphql", color: "#E10098", label: "GraphQL" },
  "REST API": { slug: "openapiinitiative", color: "#6BA539", label: "REST API" },
  "Prisma": { slug: "prisma", color: "#ffffff", label: "Prisma" },
  "Supabase": { slug: "supabase", color: "#3ECF8E", label: "Supabase" },
  "PostgreSQL": { slug: "postgresql", color: "#4169E1", label: "PostgreSQL" },
  "Git": { slug: "git", color: "#F05032", label: "Git" },
  "Docker": { slug: "docker", color: "#2496ED", label: "Docker" },
  "N8N": { slug: "n8n", color: "#EA4B71", label: "N8N" },
  "LLMs": { slug: "openai", color: "#ffffff", label: "LLMs" },
  "Figma": { slug: "figma", color: "#F24E1E", label: "Figma" },
  "Grafana": { slug: "grafana", color: "#F46800", label: "Grafana" },
  "Chatwoot": { slug: "chatwoot", color: "#1F93FF", label: "Chatwoot" },
  "Tailwind": { slug: "tailwindcss", color: "#06B6D4", label: "Tailwind CSS" },
  "Flask": { slug: "flask", color: "#ffffff", label: "Flask" },
  "MCP": { slug: "anthropic", color: "#ffffff", label: "MCP" },
  "Flutter": { slug: "flutter", color: "#02569B", label: "Flutter" },
  "Framer Motion": { slug: "framer", color: "#0055FF", label: "Framer Motion" },
  "pgvector": { slug: "postgresql", color: "#336791", label: "pgvector" },
  "Redis": { slug: "redis", color: "#FF3E30", label: "Redis" },
  "AWS": { slug: "__AWS_CUSTOM__", color: "#FF9900", label: "AWS" },
};

const TechLogoCard = ({
  tech,
  selected,
  onClick,
}: {
  tech: string;
  selected: boolean;
  onClick: () => void;
}) => {
  const { theme } = useApp();
  const info = TECH_ICONS[tech];
  const [llmIndex, setLlmIndex] = useState(0);

  const llmLogos = useMemo(() => [
    { slug: "openai", color: "ffffff", label: "OpenAI" },
    { slug: "googlegemini", color: "ffffff", label: "Gemini" },
    { slug: "anthropic", color: "ffffff", label: "Claude" },
    { slug: "huggingface", color: "ffffff", label: "HuggingFace" }
  ], []);

  useEffect(() => {
    if (tech !== "LLMs") return;
    const timer = setInterval(() => {
      setLlmIndex((prev) => (prev + 1) % llmLogos.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [tech, llmLogos.length]);

  if (!info) return null;

  // ── AWS custom inline SVG (no simpleicons entry) ──
  if (tech === "AWS") {
    const awsColor = theme === "light" ? "#FF6600" : "#FF9900";
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`tech-logo-card ${selected ? "selected" : ""}`}
        whileTap={{ scale: 0.95 }}
        title="Amazon Web Services"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width={32} height={32} fill={awsColor}>
            <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.064.056.128.056.184 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.240-.024-.304-.08-.063-.048-.12-.16-.168-.311L7.586 6.72a1.4 1.4 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.127a1.137 1.137 0 0 1-.056.2l-1.923 6.001c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687a.47.47 0 0 1-.32-.08c-.063-.056-.12-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32a.484.484 0 0 1-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.743.167-1.155.167z" />
          </svg>
        </div>
        <span className="tech-logo-label">AWS</span>
      </motion.button>
    );
  }

  const currentSlug = tech === "LLMs" ? llmLogos[llmIndex].slug : info.slug;
  const rawColor = tech === "LLMs" ? llmLogos[llmIndex].color : info.color.replace("#", "");
  const currentColor = theme === "light" && (rawColor.toLowerCase() === "ffffff" || rawColor.toLowerCase() === "fff") ? "111111" : rawColor;
  const currentLabel = tech === "LLMs" ? llmLogos[llmIndex].label : info.label;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`tech-logo-card ${selected ? "selected" : ""}`}
      whileTap={{ scale: 0.95 }}
      title={tech === "LLMs" ? "Modelos de Linguagem (OpenAI, Gemini, Claude, HuggingFace)" : info.label}
    >
      <div className="w-8 h-8 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {currentSlug === "openai" ? (
            <motion.svg
              key="openai"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              viewBox="0 0 24 24"
              width={32}
              height={32}
              fill="currentColor"
              style={{ color: `#${currentColor}` }}
              className="absolute object-contain"
            >
              <path d="M21.3,10.1a3.9,3.9,0,0,0-.4-3.3,4.1,4.1,0,0,0-4.4-1.9,4.1,4.1,0,0,0-5.7-1.8A4.1,4.1,0,0,0,6.2,6.1,4.1,4.1,0,0,0,4.7,5.5,3.9,3.9,0,0,0,1,10.1,4.1,4.1,0,0,0,1.4,13.4a3.9,3.9,0,0,0,.4,3.3,4.1,4.1,0,0,0,4.4,1.9,4.1,4.1,0,0,0,5.7,1.8,4.1,4.1,0,0,0,4.6-2.9,4.1,4.1,0,0,0,1.5-.7,4,4,0,0,0,1.2-1.2A4.1,4.1,0,0,0,21.3,10.1ZM12,19a3.1,3.1,0,0,1-1.9-.7l.1-.1,3.2-1.8a.5.5,0,0,0,.3-.5V11.4l1.4.8a.1.1,0,0,1,0,.1V16A3,3,0,0,1,12,19ZM5.5,16.2a3,3,0,0,1-.4-2l.1.1,3.2,1.8a.5.5,0,0,0,.5,0l3.9-2.2v1.5a.1.1,0,0,1,0,.1L9.3,15.1A3,3,0,0,1,5.5,16.2ZM4.6,9.3a3,3,0,0,1,1.1-1.9v3.8a.5.5,0,0,0,.3.4l3.9,2.2-1.4.8a.1.1,0,0,1,0,0L5.7,13.3A3,3,0,0,1,4.6,9.3ZM18.3,11.5l-3.9-2.2,1.4-.8a.1.1,0,0,1,0,0l2.8,1.6a3,3,0,0,1,1.1,1.9,3,3,0,0,1-.3,3.2A3,3,0,0,1,18,16.2V12A.5.5,0,0,0,18.3,11.5ZM19.4,7.8l-.1-.1-3.2-1.8a.5.5,0,0,0-.5,0L11.7,8.2V6.6a.1.1,0,0,1,0-.1l3.5-2A3,3,0,0,1,19.4,7.8ZM8,5.7V9.5a.5.5,0,0,0,.3.4l3.9,2.2-1.4.8a.1.1,0,0,1,0,0L8,11.4A3,3,0,0,1,8,5.7Z" />
            </motion.svg>
          ) : (
            <motion.img
              key={currentSlug}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              src={`https://cdn.simpleicons.org/${currentSlug}/${currentColor}`}
              alt={currentLabel}
              width={32}
              height={32}
              decoding="async"
              loading="lazy"
              className="absolute object-contain"
            />
          )}
        </AnimatePresence>
      </div>
      <span className="tech-logo-label">{tech === "LLMs" ? "LLMs" : info.label}</span>
    </motion.button>
  );
};

const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Optimize settings for mobile devices
    const isMobileDevice = window.innerWidth < 768;
    const particleCount = isMobileDevice ? 15 : 45;
    const connectionDistance = 110;
    const mouse = { x: -1000, y: -1000, active: false };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.45),
        vy: (Math.random() - 0.5) * (isMobileDevice ? 0.3 : 0.45),
        radius: Math.random() * 1.5 + 1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileDevice) return; // Disable mouse interactions on mobile
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    const parent = canvas.parentElement;
    if (parent && !isMobileDevice) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    let isIntersecting = false;

    const animate = () => {
      if (!isIntersecting) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(128, 0, 0, 0.20)";
      ctx.strokeStyle = "rgba(128, 0, 0, 0.08)";

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections - Skip this expensive calculation entirely on mobile
      if (!isMobileDevice) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.15;
              ctx.strokeStyle = `rgba(128, 0, 0, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Connect to mouse
          if (mouse.active) {
            const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
            if (distToMouse < connectionDistance * 1.5) {
              const alpha = (1 - distToMouse / (connectionDistance * 1.5)) * 0.35;
              ctx.strokeStyle = `rgba(128, 0, 0, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    }, { threshold: 0.02 });

    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

import { FadeIn } from "./FadeIn";

export const SkillsSection = ({
  selectedTech,
  onSelectTech,
}: {
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
}) => {
  const { t } = useApp();
  const [pausedRow, setPausedRow] = useState<Record<number, boolean>>({});

  const row1 = ["JS", "TS", "React", "Next.js", "Vue.js", "Node.js", "RabbitMQ", "Framer Motion"];
  const row2 = ["Java", "Spring", "GraphQL", "Prisma", "Supabase", "REST API", "Django", "pgvector"];
  const row3 = ["Git", "Docker", "N8N", "Figma", "Grafana", "Chatwoot", "LLMs", "Redis"];
  const row4 = ["Python", "PostgreSQL", "Tailwind", "Flask", "MCP", "Flutter", "Axios", "AWS"];

  return (
    <section id="skills" className="py-16 md:py-24 px-4 border-t border-border/40 bg-bg/10 relative overflow-hidden">
      <NeuralCanvas />
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.skills.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={t.skills.title1 + " "} />
              <span className="text-gradient"><GlitchText text={t.skills.titleHighlight} delay={0.2} /></span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
              {t.skills.desc}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="skills-marquee-container">
            {/* Row 1 (Left <-) */}
            <div
              onClick={() => setPausedRow(prev => ({ ...prev, 1: !prev[1] }))}
              style={{ animationPlayState: pausedRow[1] ? "paused" : undefined }}
              className="skills-marquee-row marquee-left"
            >
              {[...row1, ...row1, ...row1].map((tech, i) => (
                <div key={tech + "_1_" + i} className="w-[90px] sm:w-[110px] shrink-0">
                  <TechLogoCard
                    tech={tech}
                    selected={selectedTech === tech}
                    onClick={() => onSelectTech(selectedTech === tech ? null : tech)}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 (Right ->) */}
            <div
              onClick={() => setPausedRow(prev => ({ ...prev, 2: !prev[2] }))}
              style={{ animationPlayState: pausedRow[2] ? "paused" : undefined }}
              className="skills-marquee-row marquee-right"
            >
              {[...row2, ...row2, ...row2].map((tech, i) => (
                <div key={tech + "_2_" + i} className="w-[90px] sm:w-[110px] shrink-0">
                  <TechLogoCard
                    tech={tech}
                    selected={selectedTech === tech}
                    onClick={() => onSelectTech(selectedTech === tech ? null : tech)}
                  />
                </div>
              ))}
            </div>

            {/* Row 3 (Left <-) */}
            <div
              onClick={() => setPausedRow(prev => ({ ...prev, 3: !prev[3] }))}
              style={{ animationPlayState: pausedRow[3] ? "paused" : undefined }}
              className="skills-marquee-row marquee-left"
            >
              {[...row3, ...row3, ...row3].map((tech, i) => (
                <div key={tech + "_3_" + i} className="w-[90px] sm:w-[110px] shrink-0">
                  <TechLogoCard
                    tech={tech}
                    selected={selectedTech === tech}
                    onClick={() => onSelectTech(selectedTech === tech ? null : tech)}
                  />
                </div>
              ))}
            </div>

            {/* Row 4 (Right ->) */}
            <div
              onClick={() => setPausedRow(prev => ({ ...prev, 4: !prev[4] }))}
              style={{ animationPlayState: pausedRow[4] ? "paused" : undefined }}
              className="skills-marquee-row marquee-right"
            >
              {[...row4, ...row4, ...row4].map((tech, i) => (
                <div key={tech + "_4_" + i} className="w-[90px] sm:w-[110px] shrink-0">
                  <TechLogoCard
                    tech={tech}
                    selected={selectedTech === tech}
                    onClick={() => onSelectTech(selectedTech === tech ? null : tech)}
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
