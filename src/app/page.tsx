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
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
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

interface ProjectMetaItem {
  link: string;
  img: string;
  github: string;
  wip?: boolean;
}

type TranslationType =
  | (typeof translations)["pt"]
  | (typeof translations)["en"];

const AppContext = createContext<{
  lang: Lang;
  t: TranslationType;
  theme: string;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
}>({
  lang: "pt",
  t: translations.pt,
  theme: "dark",
  toggleTheme: () => { },
  setLang: () => { },
});

const useApp = () => useContext(AppContext);

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
      <div className="max-w-md w-full bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">
          Portfólio atualizado
        </h2>
        <p className="text-txt-muted text-xs leading-relaxed mb-6">
          Você está acessando uma versão antiga do meu portfólio. A nova versão possui projetos atualizados, melhorias visuais e novas funcionalidades.
        </p>
        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-primary">
          Redirecionando em {countdown} segundos...
        </div>
        <a
          href={targetUrl}
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/35"
        >
          Visitar Nova Versão <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

// ─── LOADING SCREEN ───
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [text, setText] = useState("");
  const full = "CARLOS.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

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
        <div className="loading-bar-fill" />
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

  useEffect(() => {
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
  }, []);

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
const TypewriterTitle = ({ words }: { words: readonly string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75);
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, words]);

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
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const dirs = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction], filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
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
  "Python": { slug: "python", color: "#3776AB", label: "Python" },
  "Java": { slug: "openjdk", color: "#ED8B00", label: "Java" },
  "Spring": { slug: "spring", color: "#6DB33F", label: "Spring Boot" },
  "GraphQL": { slug: "graphql", color: "#E10098", label: "GraphQL" },
  "Axios": { slug: "axios", color: "#5A29E4", label: "Axios" },
  "Prisma": { slug: "prisma", color: "#ffffff", label: "Prisma" },
  "Supabase": { slug: "supabase", color: "#3ECF8E", label: "Supabase" },
  "PostgreSQL": { slug: "postgresql", color: "#4169E1", label: "PostgreSQL" },
  "Git": { slug: "git", color: "#F05032", label: "Git" },
  "Docker": { slug: "docker", color: "#2496ED", label: "Docker" },
  "N8N": { slug: "n8n", color: "#EA4B71", label: "N8N" },
  "Figma": { slug: "figma", color: "#F24E1E", label: "Figma" },
  "Grafana": { slug: "grafana", color: "#F46800", label: "Grafana" },
  "Chatwoot": { slug: "chatwoot", color: "#1F93FF", label: "Chatwoot" },
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
  const info = TECH_ICONS[tech];
  if (!info) return null;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`tech-logo-card ${selected ? "selected" : ""}`}
      whileTap={{ scale: 0.95 }}
      title={info.label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${info.slug}/${info.color.replace("#", "")}`}
        alt={info.label}
        width={32}
        height={32}
        loading="lazy"
      />
      <span className="tech-logo-label">{info.label}</span>
    </motion.button>
  );
};

// ─── CHAT IA ───
const ChatHibrido = () => {
  const { t } = useApp();
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string }[]
  >([{ id: "1", sender: "bot", text: t.chat.welcome }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { id: Date.now().toString(), sender: "user" as const, text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsTyping(true);

    const history = messages
      .filter((m) => m.id !== "1")
      .map((m) => ({ sender: m.sender, text: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = data.reply || t.chat.replyDefault;
      setMessages((p) => [...p, { id: Date.now().toString(), sender: "bot", text: reply }]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "Ops! Tive um problema técnico. Fale com o Carlos direto: techcarlosandre@gmail.com",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, messages, t.chat.replyDefault]);

  const quickBtns = [
    { label: "🚀 " + t.chat.btnProjects, msg: "Quais são os principais projetos do Carlos?" },
    { label: "🤖 Automações IA", msg: "Quero saber sobre as automações de IA" },
    { label: "💼 " + t.chat.btnQuote, msg: "Quero fazer um orçamento de projeto" },
    { label: "🛠️ " + t.chat.btnSkills, msg: "Quais são as habilidades técnicas do Carlos?" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel border border-border rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative z-10">
      {/* Header */}
      <div className="bg-surface/40 backdrop-blur-xl px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-primary/30 overflow-hidden bg-primary/10 flex items-center justify-center avatar-glow">
            <Image src="/eu.webp" alt="Carlos André" fill className="object-cover object-top" unoptimized />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider">{t.chat.assistantName}</h4>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-green-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online · Gemini
            </div>
          </div>
        </div>
        <span className="text-[8px] font-black bg-primary/15 text-accent border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
          {t.chat.assistantRole}
        </span>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="h-[320px] overflow-y-auto p-6 space-y-4 chat-scrollbar bg-bg/5">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${m.sender === "user"
                ? "bg-primary text-white rounded-tr-none"
                : "bg-surface/80 border border-border text-txt rounded-tl-none"
                }`}
              style={{ whiteSpace: "pre-line" }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Buttons */}
      <div className="p-3 bg-surface/20 border-t border-border flex flex-wrap gap-2 justify-center">
        {quickBtns.map((btn) => (
          <button
            key={btn.label}
            onClick={() => handleSend(btn.msg)}
            disabled={isTyping}
            className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary cursor-pointer disabled:opacity-50"
          >
            {btn.label}
          </button>
        ))}
        <a
          href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto."
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary flex items-center"
        >
          💬 WhatsApp
        </a>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="p-3 bg-surface/40 border-t border-border flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          disabled={isTyping}
          className="flex-1 bg-bg/40 border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/40 transition-colors text-txt disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-primary hover:bg-accent disabled:opacity-50 text-white px-4 rounded-xl flex items-center justify-center transition-all shadow-md"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
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
    { name: t.nav.solutions, href: "#solucoes" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.services, href: "#servicos" },
    { name: t.nav.projects, href: "#projetos" },
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
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
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
const HeroSection = () => {
  const { t } = useApp();

  return (
    <section id="home" className="min-h-[92vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="hero-glow" style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/4 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center relative z-10 text-center">
        <FadeIn delay={0.05}>
          {/* Avatar with glow ring */}
          <div className="relative w-20 h-20 mb-5 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-accent to-primary/50 blur-lg opacity-60 animate-pulse" />
            <div className="absolute inset-0.5 rounded-full overflow-hidden border-2 border-primary/40">
              <Image src="/eu.webp" alt="Carlos André" fill className="object-cover object-top" unoptimized />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-bg flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-green-500 relative" />
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Badge pulsing>{t.hero.badge}</Badge>
        </FadeIn>

        <FadeIn delay={0.25}>
          <h1 className="text-4xl sm:text-6xl md:text-[76px] font-black uppercase leading-[0.95] tracking-tighter mt-6 mb-3">
            {t.hero.title1}
            <br />
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="text-txt-muted text-sm md:text-base font-medium mb-8 h-7">
            <TypewriterTitle words={t.hero.typewriter} />
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-border max-w-2xl w-full backdrop-blur-xl">
            <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-6">
              {t.hero.desc}
            </p>
            <div className="w-full h-px bg-border mb-6" />
            <div className="flex justify-center gap-8 md:gap-16 mb-6">
              {[
                { val: 2, suffix: "+", label: t.hero.stat1 },
                { val: 8, suffix: "+", label: t.hero.stat2 },
                { val: 100, suffix: "%", label: t.hero.stat3 },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xl md:text-2xl font-black text-primary">
                    <AnimatedCounter to={s.val} suffix={s.suffix} />
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-txt-muted mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#projetos"
                className="btn-magnetic inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                {t.hero.ctaPrimary} <ArrowRight size={14} />
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/40 text-txt-muted hover:text-txt text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Refactored Social Buttons (Módulo 1) */}
        <FadeIn delay={0.55}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 max-w-2xl mx-auto w-full px-4">
            {[
              {
                href: "https://github.com/techcarlosandre",
                icon: <GithubIcon size={18} />,
                label: "GitHub",
              },
              {
                href: "https://www.linkedin.com/in/devcarlosandre/",
                icon: <LinkedinIcon size={18} />,
                label: "LinkedIn",
              },
              {
                href: "#",
                icon: <span className="text-primary text-sm">📍</span>,
                label: "Rio de Janeiro, BR",
                isLocation: true
              }
            ].map((item, i) => {
              const Tag = item.isLocation ? "div" : "a";
              const props = item.isLocation ? {} : { href: item.href, target: "_blank", rel: "noreferrer" };
              
              return (
                <motion.div
                  key={i}
                  className="w-full sm:w-48"
                  whileHover={item.isLocation ? {} : { y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Tag
                    {...props}
                    className={`flex items-center justify-center gap-3 w-full h-14 rounded-2xl border bg-zinc-900/40 backdrop-blur-md transition-all text-xs font-black uppercase tracking-wider ${
                      item.isLocation 
                        ? "border-zinc-800 text-txt-muted cursor-default" 
                        : "border-zinc-800 text-txt-muted hover:text-txt hover:border-primary/50 hover:shadow-[0_0_20px_rgba(128,0,0,0.3)] hover:bg-zinc-900/60"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Tag>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── SOLUTIONS SECTION ───
const SolutionsSection = () => {
  const { t } = useApp();
  return (
    <section id="solucoes" className="py-20 bg-bg/40 border-t border-b border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.solutions.badge}</Badge>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-3">
              {t.solutions.title1}{" "}
              <span className="text-gradient">{t.solutions.titleHighlight}</span>
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {t.solutions.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <div className="glow-card glass-card rounded-2xl p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Zap size={18} className="text-primary" />
                </div>
                <h3 className="text-sm font-black uppercase mb-2">{item.title}</h3>
                <p className="text-txt-muted text-xs leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
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

    const particleCount = 45;
    const connectionDistance = 110;
    const mouse = { x: -1000, y: -1000, active: false };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
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
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(128, 0, 0, 0.25)";
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

      // Draw connections
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

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
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
  const allTechs = Object.keys(TECH_ICONS);

  return (
    <section id="skills" className="py-24 px-4 border-t border-border/40 bg-bg/10 relative overflow-hidden">
      <NeuralCanvas />
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.skills.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              {t.skills.title1}{" "}
              <span className="text-gradient">{t.skills.titleHighlight}</span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
              {t.skills.desc}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
            {allTechs.map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="w-full flex items-center justify-center"
              >
                <TechLogoCard
                  tech={tech}
                  selected={selectedTech === tech}
                  onClick={() => onSelectTech(selectedTech === tech ? null : tech)}
                />
              </motion.div>
            ))}
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
    <section id="servicos" className="py-24 px-4 bg-bg/30 border-t border-border/60">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <FadeIn>
            <Badge>{t.services.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-3">
              {t.services.title1}{" "}
              <span className="text-gradient">{t.services.titleHighlight}</span>
            </h2>
            <p className="text-txt-muted text-xs md:text-sm max-w-xl mx-auto">{t.services.desc}</p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {t.services.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <div className="service-card h-full flex flex-col">
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
                  className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                >
                  {t.services.cta} <ChevronRight size={12} />
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROJECTS SLIDER SECTION (Módulo 2 - Restored & Refined Mockup Slider) ───
const ProjectsSection = ({
  selectedTech,
  onClearSelection,
}: {
  selectedTech: string | null;
  onClearSelection: () => void;
}) => {
  const { t } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mockupType, setMockupType] = useState<"desktop" | "mobile">("desktop");

  const projectsData = [
    {
      title: t.projects.items[0].title,
      desc: t.projects.items[0].desc,
      tag: t.projects.items[0].tag,
      techs: t.projects.items[0].techs,
      link: "https://omni-gestao-pro-six.vercel.app",
      area: "Web & ERP",
      desktop: { img: "/projetos/omni-thumb.png" },
      mobile: { img: "/projetos/omni-thumb.png" }
    },
    {
      title: t.projects.items[1].title,
      desc: t.projects.items[1].desc,
      tag: t.projects.items[1].tag,
      techs: t.projects.items[1].techs,
      link: "https://omni-financas-demo.vercel.app",
      area: "Web & Fintech",
      desktop: { img: "/projetos/omni-financas.png" },
      mobile: { img: "/projetos/omni-financas.png" }
    },
    {
      title: t.projects.items[2].title,
      desc: t.projects.items[2].desc,
      tag: t.projects.items[2].tag,
      techs: t.projects.items[2].techs,
      link: "https://rankehub.vercel.app/",
      area: "Web & Analytics",
      desktop: { img: "/projetos/rankhub.png" },
      mobile: { img: "/projetos/rankhub.png" }
    },
    {
      title: t.projects.items[3].title,
      desc: t.projects.items[3].desc,
      tag: t.projects.items[3].tag,
      techs: t.projects.items[3].techs,
      link: "https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.",
      area: "Automação & IA",
      desktop: { video: "/projetos/automacao-wpp.mp4" },
      mobile: { video: "/projetos/automacao-ig.mp4" }
    },
    {
      title: t.projects.items[4].title,
      desc: t.projects.items[4].desc,
      tag: t.projects.items[4].tag,
      techs: t.projects.items[4].techs,
      link: "#",
      area: "Backend / API",
      wip: true,
      desktop: { placeholder: true },
      mobile: { placeholder: true }
    }
  ];

  const TECH_ALIASES: Record<string, string[]> = {
    "JS": ["JavaScript"], "TS": ["TypeScript"], "React": ["React"],
    "Next.js": ["Next.js"], "Python": ["Python"], "Flask": ["Flask"],
    "Java": ["Java"], "Spring": ["Spring Boot", "Spring"], "Prisma": ["Prisma"],
    "Supabase": ["Supabase"], "PostgreSQL": ["PostgreSQL", "SQL"],
    "HTML5": ["HTML"], "CSS3": ["CSS"], "Tailwind": ["Tailwind", "Tailwind CSS"],
    "Git": ["Git"], "GitHub": ["GitHub"], "Docker": ["Docker"],
    "Vercel": ["Vercel"], "N8N": ["N8N"], "Figma": ["Figma"], "Node.js": ["Node.js"],
    "GraphQL": ["GraphQL"], "Grafana": ["Grafana"], "Axios": ["Axios"],
    "Vue.js": ["Vue.js"], "Chatwoot": ["Chatwoot"]
  };

  const filtered = selectedTech
    ? projectsData.filter((p) => {
      const aliases = TECH_ALIASES[selectedTech] || [selectedTech];
      return p.techs?.some((tech) =>
        aliases.some((alias) => tech.toLowerCase().includes(alias.toLowerCase())) ||
        tech === selectedTech
      );
    })
    : projectsData;

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTech]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  if (filtered.length === 0) {
    return (
      <section id="projetos" className="py-24 px-4 bg-bg/30 border-t border-border/60">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge>{t.projects.badge}</Badge>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-4 mb-8">
            {t.projects.title1} <span className="text-gradient">{t.projects.titleHighlight}</span>
          </h2>
          <div className="w-full max-w-md mx-auto rounded-2xl border border-border p-8 text-center glass-card mt-8">
            <p className="text-txt-muted text-xs">Nenhum projeto encontrado para a tecnologia selecionada.</p>
          </div>
        </div>
      </section>
    );
  }

  const p = filtered[currentIndex];
  const activeMedia = mockupType === "desktop" ? p.desktop : p.mobile;

  return (
    <section id="projetos" className="py-24 px-4 bg-bg/30 border-t border-border/60 relative overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Badge>{t.projects.badge}</Badge>
            <h2 className="text-3xl md:text-5xl font-black uppercase mt-4">
              {t.projects.title1}{" "}
              <span className="text-gradient">{t.projects.titleHighlight}</span>
            </h2>
          </div>
          {selectedTech && (
            <div className="flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-2 rounded-xl text-xs uppercase font-black self-start">
              <div>Filtro: <span className="text-gradient">{selectedTech}</span></div>
              <button onClick={onClearSelection} className="text-[10px] bg-bg border border-border rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors">
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* 1px glowing gradient border effect for the carousel container */}
        <div className="relative p-[1px] bg-zinc-800/40 hover:bg-gradient-to-r hover:from-primary hover:via-accent hover:to-primary/20 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_0_50px_rgba(128,0,0,0.18)]">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center bg-[#09090b]/98 rounded-[39px] p-6 md:p-10 relative z-10 overflow-hidden">
            
            {/* Left Side: Device Mockup Media */}
            <div className="flex flex-col justify-center items-center w-full">
              {/* Mockup Toggle Buttons */}
              <div className="flex justify-center gap-2 mb-6 bg-zinc-900/50 border border-zinc-850 p-1 rounded-xl">
                <button
                  onClick={() => setMockupType("desktop")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${mockupType === "desktop" ? "bg-primary text-white" : "text-txt-muted hover:text-txt"}`}
                >
                  💻 Monitor
                </button>
                <button
                  onClick={() => setMockupType("mobile")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${mockupType === "mobile" ? "bg-primary text-white" : "text-txt-muted hover:text-txt"}`}
                >
                  📱 Celular
                </button>
              </div>

              {/* Device Mockup Display */}
              <div className="w-full flex justify-center items-center h-[290px] md:h-[360px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mockupType + "_" + currentIndex}
                    initial={{ opacity: 0, x: 80, scale: 0.9, rotateY: 20 }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, x: -80, scale: 0.9, rotateY: -20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="w-full max-w-[420px] flex flex-col justify-center"
                    style={{ perspective: 1000 }}
                  >
                    {mockupType === "desktop" ? (
                      // Monitor Mockup
                      <div className="w-full group">
                        <div className="relative w-full aspect-[16/10] border-[8px] border-[#1e1e20] bg-[#0c0c0c] rounded-t-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                          {activeMedia.img ? (
                            <Image 
                              src={activeMedia.img} 
                              alt={p.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                              unoptimized 
                            />
                          ) : activeMedia.video ? (
                            <video src={activeMedia.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Zap size={28} className="text-primary animate-pulse" />
                              <span className="text-[10px] font-black text-txt-muted uppercase tracking-widest">Em Breve</span>
                            </div>
                          )}
                        </div>
                        {/* Monitor Stand */}
                        <div className="w-16 h-8 bg-[#161618] mx-auto border-t border-white/5" />
                        <div className="w-28 h-1.5 bg-[#202022] mx-auto rounded-full shadow-md" />
                      </div>
                    ) : (
                      // Mobile Phone Mockup
                      <div className="w-full flex justify-center group">
                        <div className="relative w-[180px] h-[320px] border-[6px] border-[#1e1e20] bg-[#0c0c0c] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                          {/* Dynamic Island / Notch */}
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-full z-20" />

                          {activeMedia.img ? (
                            <Image 
                              src={activeMedia.img} 
                              alt={p.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                              unoptimized 
                            />
                          ) : activeMedia.video ? (
                            <video src={activeMedia.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Zap size={22} className="text-primary animate-pulse" />
                              <span className="text-[8px] font-black text-txt-muted uppercase tracking-widest">Em Breve</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Project Information */}
            <div className="flex flex-col justify-between h-full min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Project Area Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      {p.area}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-txt-muted">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black uppercase mb-3 text-txt text-gradient">{p.title}</h3>
                  <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-6">{p.desc}</p>
                </motion.div>
              </AnimatePresence>

              <div className="space-y-4 pt-4 border-t border-zinc-900">
                {p.techs && (
                  <div className="flex flex-wrap gap-1">
                    {p.techs.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-full border border-zinc-800 text-[8px] font-bold text-txt-muted bg-zinc-900/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 gap-4">
                  {/* Demo CTA (largura total e destaque visual) */}
                  <div className="flex-1">
                    {p.wip ? (
                      <div className="w-full text-center text-[10px] font-black uppercase tracking-widest text-txt-muted bg-zinc-900/40 border border-zinc-850 py-3.5 rounded-xl">
                        Em breve...
                      </div>
                    ) : (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-accent text-white text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-primary/15 duration-300"
                      >
                        Acessar Aplicação <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>

                  {/* Slider Controls */}
                  <div className="flex gap-1 bg-zinc-900/50 border border-zinc-850 p-1 rounded-xl shrink-0">
                    <button
                      onClick={handlePrev}
                      className="p-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-750 rounded-lg text-txt-muted hover:text-txt cursor-pointer transition-colors"
                      title="Anterior"
                    >
                      <ChevronRight size={14} className="rotate-180" />
                    </button>
                    <span className="text-[9px] font-black uppercase tracking-wider px-3 py-2 bg-[#0c0c0d] border border-zinc-850 rounded-lg flex items-center justify-center min-w-[36px]">
                      {currentIndex + 1} / {filtered.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="p-2 hover:bg-zinc-800 border border-transparent hover:border-zinc-750 rounded-lg text-txt-muted hover:text-txt cursor-pointer transition-colors"
                      title="Próximo"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
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
              {t.contact.title1}{" "}
              <span className="text-gradient">{t.contact.titleHighlight}</span>
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
            <a
              href="mailto:techcarlosandre@gmail.com"
              className="contact-link-card group"
            >
              <span className="text-xl">✉️</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-txt group-hover:text-primary transition-colors">Email</p>
                <p className="text-[8px] text-txt-muted">techcarlosandre@gmail.com</p>
              </div>
            </a>
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

        <ChatHibrido />
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
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState<Lang>("pt");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isOldDomain, setIsOldDomain] = useState(false);

  useEffect(() => {
    // Detect if accessing from old domain (Módulo 0)
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("github.io") || hostname.includes("techcarlosandre.github.io")) {
        setIsOldDomain(true);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "" : "light");
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, t, theme, toggleTheme, setLang }}>
      {isOldDomain && <MigrationOverlay />}

      <AnimatePresence mode="wait">
        {!loaded && <LoadingScreen key="loading" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <main className="relative min-h-screen bg-bg text-txt selection:bg-primary selection:text-white overflow-x-clip dot-grid">
            <div className="grain-overlay" />
            <AuroraBg />
            <Particles />
            <Navbar />
            <HeroSection />
            <SolutionsSection />
            <SkillsSection
              selectedTech={selectedTech}
              onSelectTech={(tech) => setSelectedTech((curr) => (curr === tech ? null : tech))}
            />
            <ServicesSection />
            <ProjectsSection
              selectedTech={selectedTech}
              onClearSelection={() => setSelectedTech(null)}
            />
            <FooterSection />
          </main>
        </>
      )}
    </AppContext.Provider>
  );
}
