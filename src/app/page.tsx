"use client";

import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  Globe,
  Menu,
  Zap,
  Sun,
  Moon,
  Send,
  X,
  Check,
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { translations, type Lang } from "./translations";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { SpotlightCard } from "../components/SpotlightCard";
import { SplitText } from "../components/SplitText";
import { ShinyText } from "../components/ShinyText";
import { CardTilt3D } from "../components/CardTilt3D";
import { BackgroundBeams } from "../components/BackgroundBeams";
import dynamic from "next/dynamic";
const FloatingChatWidget = dynamic(
  () => import("../components/FloatingChatWidget").then((mod) => mod.FloatingChatWidget),
  { ssr: false }
);
import { GlitchText } from "../components/GlitchText";


interface ProjectMetaItem {
  link: string;
  img: string;
  github: string;
  wip?: boolean;
}

import { useApp } from "./providers";

// ─── ICONS ───
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── REDIRECTION SCREEN (Módulo 0) ───
const MigrationOverlay = () => {
  const { t } = useApp();
  const [countdown, setCountdown] = useState(3);
  const targetUrl = "https://portfolio.techcarlos.com.br";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-6 text-center dot-grid">
      <div className="max-w-md w-full bg-surface/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-txt">
          {t.migration.title}
        </h2>
        <p className="text-txt-muted text-xs leading-relaxed mb-6">
          {t.migration.desc}
        </p>
        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-primary">
          {t.migration.redirecting.replace("{seconds}", countdown.toString())}
        </div>
        <a
          href={targetUrl}
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-accent text-txt text-xs font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/35"
        >
          {t.migration.cta} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

// ─── LOADING SCREEN ───
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [text, setText] = useState("");
  const full = "CARLOS.";
  const duration = 1200; // Fast 1.2s loading animation for all devices

  useEffect(() => {
    let i = 0;
    const intervalTime = Math.floor((duration * 0.3) / full.length); // Dynamic speed based on duration
    const interval = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(interval);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [onDone, duration]);

  // Animation duration inline style (excluding the last 400ms fade-out buffer)
  const animSecs = `${(duration - 400) / 1000}s`;

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <div className="loading-logo">
        {text.slice(0, -1)}
        <span>{text.slice(-1)}</span>
      </div>
      <div className="loading-bar-track">
        <div 
          className="loading-bar-fill" 
          style={{ 
            animation: `loading-fill ${animSecs} cubic-bezier(0.4, 0, 0.2, 1) forwards, shimmer-bar 1.5s linear infinite`
          }} 
        />
      </div>
      <p className="loading-tagline">Full-Stack Developer</p>
    </motion.div>
  );
};

// ─── CUSTOM CURSOR ───
const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const outer = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth < 768;
      setIsMobile(hasTouch || isSmall);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.left = `${e.clientX}px`;
        innerRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isHoverable = el.closest("a, button, [data-hover]");
      outerRef.current?.classList.toggle("hovering", !!isHoverable);
      innerRef.current?.classList.toggle("hovering", !!isHoverable);
    };

    let rafId: number;
    const animate = () => {
      outer.current.x += (pos.current.x - outer.current.x) * 0.12;
      outer.current.y += (pos.current.y - outer.current.y) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.left = `${outer.current.x}px`;
        outerRef.current.style.top = `${outer.current.y}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onHover);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onHover);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={outerRef} className="custom-cursor-outer" />
      <div ref={innerRef} className="custom-cursor-inner" />
    </>
  );
};

// ─── SCROLL PROGRESS ───
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX, width: "100%" }}
    />
  );
};

// ─── ANIMATED COUNTER ───
const AnimatedCounter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * to));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(to);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── TYPEWRITER TITLE ───
const TypewriterTitle = ({ words, start = true }: { words: readonly string[]; start?: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync index and text when words prop changes (like translation toggle)
  useEffect(() => {
    setDisplayed("");
    setIsDeleting(false);
    setIndex(0);
  }, [words]);

  useEffect(() => {
    if (!start) return;
    const word = words[index];
    if (!word) return;

    const delay = isDeleting 
      ? 40 
      : displayed === word 
        ? 2200 
        : 75;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayed !== word) {
          setDisplayed(word.slice(0, displayed.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayed !== "") {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index, words, start]);

  return (
    <span className="typewriter-text">{displayed}</span>
  );
};

// ─── PARTICLES ───
const Particles = () => {
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 0.8,
      left: Math.random() * 100,
      dur: Math.random() * 28 + 16,
      delay: Math.random() * -20,
    }))
  );

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── AURORA BACKGROUND ───
const AuroraBg = () => (
  <div className="aurora-bg" aria-hidden="true">
    <div className="aurora-blob aurora-blob-1" />
    <div className="aurora-blob aurora-blob-2" />
    <div className="aurora-blob aurora-blob-3" />
  </div>
);

// ─── FADE IN ───
const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  triggerOnMount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  triggerOnMount?: boolean;
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const dirs = {
    up: { y: isMobile ? 25 : 40, x: 0 },
    down: { y: isMobile ? -25 : -40, x: 0 },
    left: { x: isMobile ? 25 : 40, y: 0 },
    right: { x: isMobile ? -25 : -40, y: 0 },
  };

  // If triggerOnMount is enabled, animate directly on mount instead of scroll triggers
  if (triggerOnMount) {
    return (
      <motion.div
        initial={{ opacity: 0, ...dirs[direction], filter: isMobile ? "none" : "blur(8px)" }}
        animate={{ opacity: 1, x: 0, y: 0, filter: isMobile ? "none" : "blur(0px)" }}
        transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? delay * 0.5 : delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction], filter: isMobile ? "none" : "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: isMobile ? "none" : "blur(0px)" }}
      viewport={{ once: true, margin: isMobile ? "-20px" : "-60px" }}
      transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? delay * 0.5 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const StackingSectionDesktop = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.9]);

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.div
        id={id}
        style={{ scale, opacity }}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ─── STACKING SECTION ───
const StackingSection = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile) {
    return (
      <div id={id} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <StackingSectionDesktop className={className} id={id}>
      {children}
    </StackingSectionDesktop>
  );
};


// ─── LAZY SECTION WRAPPER ───
const LazySection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  estimatedHeight?: number;
}) => {
  // Render immediately to support seamless background pre-rendering
  return (
    <div className={className}>
      {children}
    </div>
  );
};


// ─── BADGE ───
const Badge = ({
  children,
  pulsing = false,
}: {
  children: React.ReactNode;
  pulsing?: boolean;
}) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/40 border border-border text-[10px] font-black uppercase tracking-[0.15em] text-txt-muted">
    {pulsing && (
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
    )}
    {children}
  </div>
);

// ─── TECH LOGO GRID (Módulo 4) ───
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

  const llmLogos = React.useMemo(() => [
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


// ─── NAVBAR ───
const Navbar = () => {
  const { t, lang, setLang, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      setHidden(current > lastY && current > 100);
      lastY = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: t.nav.aboutMe, href: "#sobre-mim" },
    { name: t.nav.experience, href: "#experiencia" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.services, href: "#servicos" },
    { name: t.nav.projects, href: "#projetos" },
    { name: t.nav.certs, href: "#certificados" },
    { name: t.nav.contact, href: "#contato" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className={`container mx-auto max-w-6xl transition-all duration-300 ${scrolled ? "bg-bg/90 backdrop-blur-2xl border border-border shadow-2xl rounded-full py-2.5 px-6 mx-4 mt-2" : "py-4 px-4"}`}>
        <div className="flex justify-between items-center">
          <a href="#home" className="text-lg font-black tracking-tighter">
            CARLOS<span className="text-primary">.</span>
          </a>
          <div className="hidden lg:flex gap-5 items-center text-[8px] font-black uppercase tracking-wider">
            {links.map((l) => (
              <a key={l.name} href={l.href} className="hover:text-primary transition-colors relative group">
                {l.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newLang = lang === "pt" ? "en" : "pt";
                localStorage.setItem("carlos_portfolio_lang", newLang);
                window.location.reload();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-[8px] font-bold bg-surface/20 hover:bg-surface/40 transition-colors"
            >
              <Globe size={10} className="text-primary" /> {lang === "pt" ? "EN" : "PT"}
            </button>
            <button onClick={toggleTheme} className="p-1.5 rounded-full border border-border bg-surface/20 hover:bg-surface/40 transition-colors">
              {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-1.5">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-16 left-4 right-4 bg-bg/95 backdrop-blur-2xl border border-border rounded-2xl p-6 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-4 items-center font-black uppercase tracking-widest text-xs">
              {links.map((l) => (
                <a key={l.name} href={l.href} onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">
                  {l.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── HERO SECTION (Módulo 1) ───
const HeroSection = ({ loaded }: { loaded: boolean }) => {
  const { t } = useApp();
  const [isMobile, setIsMobile] = useState<boolean>(true);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

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

// ─── ABOUT ME SECTION ───
const AboutMeSection = () => {
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


// ─── EXPERIENCE SECTION ───
const ExperienceSection = () => {
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


const SolutionsSection = () => {
  const { t } = useApp();
  const sol = t.solutions;
  const p = sol.partner;

  // Map category icons to lucide components or placeholders
  const getIcon = (iconStr: string) => {
    switch (iconStr) {
      case 'server': return '💻';
      case 'code':   return '📊';
      case 'zap':    return '🔌';
      case 'cpu':    return '⚡';
      default:       return '✨';
    }
  };

  return (
    <section id="solucoes" className="py-16 md:py-24 bg-bg/40 border-t border-b border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6">
          <FadeIn>
            <Badge>{sol.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              <GlitchText text={sol.title1 + " "} />
              <span className="text-gradient"><GlitchText text={sol.titleHighlight} delay={0.2} /></span>
            </h2>
          </FadeIn>
        </div>

        {/* Short description */}
        <FadeIn delay={0.1}>
          <p className="text-txt-muted text-xs md:text-sm leading-relaxed max-w-2xl mx-auto text-center mb-12">
            {sol.desc}
          </p>
        </FadeIn>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {sol.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <CardTilt3D className="h-full">
                <SpotlightCard className="h-full flex flex-col border border-border bg-surface/60 p-5 rounded-2xl backdrop-blur-xl hover:border-primary/45 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-lg">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-xs font-black uppercase mb-3 text-txt tracking-tight">{item.title}</h3>
                  <ul className="space-y-1.5 flex-1">
                    {(item.bullets as readonly string[]).map((bullet, bi) => (
                      <li key={bi} className="text-[10px] text-txt-muted flex items-start gap-1.5 leading-snug">
                        <span className="text-primary mt-0.5 text-[8px]">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </CardTilt3D>
            </FadeIn>
          ))}
        </div>

        {/* Visual Divider & Partner Heading */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center gap-4 my-14">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-surface/80 border border-border text-primary-light shadow-[0_0_10px_rgba(200,30,30,0.05)]">
              {sol.partnerTitle}
            </span>
          </div>
        </FadeIn>

        {/* Horizontal Partnership Card (Yasmin's Profile) */}
        <FadeIn delay={0.45}>
          <SpotlightCard className="border border-border bg-gradient-to-r from-surface/70 via-surface/60 to-surface/70 p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-accent/5 blur-[40px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Photo */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border-2 border-primary/40 shadow-xl shadow-black/40">
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </div>

              {/* Text details */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-txt">{p.name}</h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{p.role}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                  {p.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface border border-border text-txt-muted hover:border-primary/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="w-full h-px bg-border/60" />

                <p className="text-[11px] md:text-xs text-txt-muted leading-relaxed italic">
                  "{p.desc}"
                </p>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── NEURAL CANVAS EFFECT ───
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

// ─── SKILLS SECTION (Módulo 4) ───
const SkillsSection = ({
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

// ─── SERVICES SECTION ───
const ServicesSection = () => {
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

// ─── NEURAL SYNAPSE INTRO CANVAS (Projects Full-Screen Intro) ───
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
      const dist = Math.random() * Math.max(width, height) * 0.6;
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
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

// ─── DECODING TEXT (Intro Overlay) ───
const DecodingTitle = ({
  text,
  highlightIndex,
  active,
  onComplete,
}: {
  text: string;
  highlightIndex: number;
  active: boolean;
  onComplete: () => void;
}) => {
  const [chars, setChars] = useState<string[]>(
    active ? Array(text.length).fill("") : text.split("")
  );
  const [decoded, setDecoded] = useState(!active);
  const glitchChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]~^";

  useEffect(() => {
    if (!active) {
      setChars(text.split(""));
      setDecoded(true);
      return;
    }

    const charTimers: ReturnType<typeof setTimeout>[] = [];
    const charIntervals: ReturnType<typeof setInterval>[] = [];

    text.split("").forEach((targetChar, i) => {
      const delay = 100 + i * 100;
      const timer = setTimeout(() => {
        let frame = 0;
        const totalFrames = 10;
        const interval = setInterval(() => {
          frame++;
          setChars((prev) => {
            const next = [...prev];
            if (frame >= totalFrames) {
              next[i] = targetChar;
            } else {
              next[i] =
                glitchChars[
                  Math.floor(Math.random() * glitchChars.length)
                ];
            }
            return next;
          });
          if (frame >= totalFrames) {
            clearInterval(interval);
            // If last character, signal completion
            if (i === text.length - 1) {
              setTimeout(() => {
                setDecoded(true);
                onComplete();
              }, 200);
            }
          }
        }, 40);
        charIntervals.push(interval);
      }, delay);
      charTimers.push(timer);
    });

    return () => {
      charTimers.forEach(clearTimeout);
      charIntervals.forEach(clearInterval);
    };
  }, [active, text, onComplete]);

  return (
    <div className="flex items-center justify-center">
      {chars.map((char, i) => (
        <motion.span
          key={`decode-${i}`}
          className={`inline-block text-[15vw] lg:text-[12vw] font-black uppercase tracking-[0.03em] ${
            i === highlightIndex ? "text-primary" : "text-txt/80"
          }`}
          initial={active ? { opacity: 0, y: 40, scale: 0.3, rotateX: 90 } : {}}
          animate={
            char
              ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
              : { opacity: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 12,
            delay: active ? (100 + i * 100) / 1000 : 0,
          }}
          style={{
            textShadow:
              decoded && i === highlightIndex
                ? "0 0 40px rgba(200,30,30,0.7), 0 0 80px rgba(200,30,30,0.3)"
                : char
                ? "0 0 20px rgba(200,30,30,0.2)"
                : "none",
          }}
        >
          {char || "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
};

// ─── PROJECTS SECTION (3-Phase Intro Sequence) ───
const ProjectsSection = ({
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

  // ── Projects Intro Sequence (Removed for Performance Optimization) ──
  const phase = "ready" as "idle" | "intro" | "revealing" | "ready";

  // Background giant text
  const bgText = lang === "en" ? "PROJECTS" : "PROJETOS";
  const highlightIndex = lang === "en" ? 7 : 6;

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

  const isIntroActive = phase === "intro";
  const showContent = phase === "revealing" || phase === "ready";
  const isReady = phase === "ready";
  const staggerDelay = phase === "revealing" ? 0.15 : 0;

  // Add mobile detection to disable heavy assets/animations
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(true);
  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
  }, []);

  // Placeholder images/icons for projects on mobile to save bandwidth
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
      {/* ═══ PHASE 1: Full-Screen Intro Overlay (Removed) ═══ */}

      {/* ═══ PHASE 2 & 3: Project Content (staggered reveal → interactive) ═══ */}
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
              {/* Ambient backlights - Disable on mobile to prevent GPU overload */}
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
                      {/* Monitor Stand */}
                      <div className="w-20 h-10 bg-zinc-200 dark:bg-[#161618] mx-auto border-t border-border" />
                      <div className="w-36 h-2 bg-zinc-300 dark:bg-[#202022] mx-auto rounded-full shadow-md" />
                    </div>
                  ) : (
                    <div className="w-full flex justify-center group">
                      {isMobileDevice ? (
                        /* Optimized Mobile Placeholder for Video (No autoplay loop to save CPU & Bandwidth) */
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

              {/* Tech Filter indicator */}
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
              {/* Subtle accent glow */}
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
                    {/* Project Area Badge */}
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
                          initial={
                            phase === "revealing"
                              ? { opacity: 0, scale: 0.8, y: 10 }
                              : {}
                          }
                          animate={
                            showContent
                              ? { opacity: 1, scale: 1, y: 0 }
                              : {}
                          }
                          whileHover={{ scale: 1.08, y: -2 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay:
                              phase === "revealing"
                                ? staggerDelay * 4 + techIdx * 0.06
                                : 0,
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <motion.div
                    className="flex items-center justify-between pt-4 gap-4"
                    initial={
                      phase === "revealing" ? { opacity: 0, y: 20 } : {}
                    }
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: phase === "revealing" ? staggerDelay * 5 : 0,
                    }}
                  >
                    {/* Demo CTA */}
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

      {/* ═══ Full-Screen Video Modal Player ═══ */}
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



// ─── CERTIFICATES SECTION ───
const CertificatesSection = () => {
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


// ─── COPY EMAIL BUTTON ───
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

// ─── FOOTER / CONTACT SECTION ───
const FooterSection = () => {
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

// ─── MAIN PAGE ───
export default function PortfolioPage() {
  const { lang, t, theme } = useApp();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isOldDomain, setIsOldDomain] = useState(false);

  useEffect(() => {
    // Detect if accessing from old domain (Módulo 0)
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
