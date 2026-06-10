"use client";

import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  Globe,
  MessageCircle,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

import { translations, type Lang } from "./translations";

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
  toggleTheme: () => {},
  setLang: () => {},
});

const useApp = () => useContext(AppContext);

const Particles = () => {
  const [particles, setParticles] = useState<
    { id: number; size: number; left: number; dur: number; delay: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: Math.random() * 2.5 + 1,
        left: Math.random() * 100,
        dur: Math.random() * 20 + 15,
        delay: Math.random() * -10,
      })),
    );
  }, []);
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

const SpotlightCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`glass-card spotlight-card rounded-3xl p-6 md:p-8 ${className}`}
      style={
        {
          "--mouse-x": `${pos.x}px`,
          "--mouse-y": `${pos.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

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
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction], filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

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

const WebGLTagGlobe = ({
  tags,
  selectedTech,
  onSelectTech,
}: {
  tags: readonly string[];
  selectedTech: string | null;
  onSelectTech: (tag: string | null) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pointsRef = useRef<{ text: string; x: number; y: number; z: number }[]>(
    [],
  );
  const rotationRef = useRef({
    ax: 0.3,
    ay: 0.3,
    targetAx: 0.3,
    targetAy: 0.3,
  });

  const createPointCloud = (tagsList: readonly string[]) =>
    tagsList.map((text, i) => {
      const phi = Math.acos(-1 + (2 * i) / tagsList.length);
      const theta = Math.sqrt(tagsList.length * Math.PI) * phi;
      return {
        text,
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    });

  const rotatePoint = (
    point: { x: number; y: number; z: number },
    ax: number,
    ay: number,
  ) => {
    const cosX = Math.cos(ax),
      sinX = Math.sin(ax);
    const cosY = Math.cos(ay),
      sinY = Math.sin(ay);
    const y = point.y * cosX - point.z * sinX;
    let z = point.z * cosX + point.y * sinX;
    const x = point.x * cosY - z * sinY;
    z = z * cosY + point.x * sinY;
    return { x, y, z };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModel;
      uniform mat4 uProjection;
      void main() {
        gl_Position = uProjection * uModel * vec4(aPosition, 1.0);
        gl_PointSize = 4.0;
      }
    `;
    const fsSource = `
      precision mediump float;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(0.5, 0.0, 0.0, 0.35);
      }
    `;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uModel = gl.getUniformLocation(program, "uModel");
    const uProjection = gl.getUniformLocation(program, "uProjection");
    const buffer = gl.createBuffer();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width * window.devicePixelRatio);
      const h = Math.floor(rect.height * window.devicePixelRatio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    pointsRef.current = createPointCloud(tags);

    let animId = 0;
    const render = () => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      rotationRef.current.ax +=
        (rotationRef.current.targetAx - rotationRef.current.ax) * 0.05;
      rotationRef.current.ay +=
        (rotationRef.current.targetAy - rotationRef.current.ay) * 0.05;

      const rotated = pointsRef.current.map((p) =>
        rotatePoint(p, rotationRef.current.ax, rotationRef.current.ay),
      );

      const posData = new Float32Array(rotated.flatMap((p) => [p.x, p.y, p.z]));
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, posData, gl.DYNAMIC_DRAW);
      gl.useProgram(program);

      const f = 1.0 / Math.tan((60 * (Math.PI / 180)) / 2);
      const proj = new Float32Array([
        f / (canvas.width / canvas.height),
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        -1.02,
        -1,
        0,
        0,
        -0.2,
        0,
      ]);
      const cosX = Math.cos(rotationRef.current.ax),
        sinX = Math.sin(rotationRef.current.ax);
      const cosY = Math.cos(rotationRef.current.ay),
        sinY = Math.sin(rotationRef.current.ay);
      const model = new Float32Array([
        cosY,
        sinX * sinY,
        -cosX * sinY,
        0,
        0,
        cosX,
        sinX,
        0,
        sinY,
        -sinX * cosY,
        cosX * cosY,
        0,
        0,
        0,
        -2.5,
        1,
      ]);

      gl.uniformMatrix4fv(uProjection, false, proj);
      gl.uniformMatrix4fv(uModel, false, model);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, rotated.length);

      const wWidth = canvas.width / window.devicePixelRatio;
      const wHeight = canvas.height / window.devicePixelRatio;
      rotated.forEach((p, idx) => {
        const label = labelRefs.current[tags[idx]];
        if (!label) return;
        const scale = 2.5 / (2.5 - p.z);
        const x = wWidth / 2 + p.x * wWidth * 0.28 * scale;
        const y = wHeight / 2 + p.y * wHeight * 0.28 * scale;
        const visible = p.z > -0.9;
        label.style.opacity = visible ? "1" : "0.15";
        label.style.transform = `translate(${x}px, ${y}px) scale(${0.8 + scale * 0.2})`;
        label.style.zIndex = visible ? "20" : "10";
      });

      animId = requestAnimationFrame(render);
    };
    render();

    const handleMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = 0.5 - (e.clientY - r.top) / r.height;
      rotationRef.current.targetAy = x * 1.5;
      rotationRef.current.targetAx = y * 1.5;
    };
    const handleLeave = () => {
      rotationRef.current.targetAx = 0.3;
      rotationRef.current.targetAy = 0.3;
    };

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
    };
  }, [tags]);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto native-globe">
      <canvas ref={canvasRef} className="w-full h-full bg-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        {tags.map((tag) => (
          <button
            key={tag}
            ref={(el) => {
              labelRefs.current[tag] = el;
            }}
            type="button"
            onClick={() => onSelectTech(selectedTech === tag ? null : tag)}
            className={`globe-tag pointer-events-auto ${selectedTech === tag ? "globe-tag-selected" : ""}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatHibrido = () => {
  const { t } = useApp();
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string }[]
  >([{ id: "1", sender: "bot", text: t.chat.welcome }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, displayedText]);

  useEffect(() => {
    if (!activeTypingId || !isTyping) return;
    const msg = messages.find((m) => m.id === activeTypingId);
    if (!msg) return;

    if (displayedText.length >= msg.text.length) {
      setIsTyping(false);
      setActiveTypingId(null);
      return;
    }

    const delay = 30 + (Math.random() - 0.5) * 15;
    const timeout = setTimeout(() => {
      setDisplayedText((p) => msg.text.substring(0, p.length + 1));
    }, delay);
    return () => clearTimeout(timeout);
  }, [activeTypingId, displayedText, messages, isTyping]);

  const handleSend = (text: string, isBtn = false) => {
    if (!text.trim() || isTyping) return;
    setMessages((p) => [
      ...p,
      { id: Date.now().toString(), sender: "user", text },
    ]);
    if (!isBtn) setInput("");

    setIsTyping(true);
    setDisplayedText("");
    setActiveTypingId("pending");

    setTimeout(() => {
      let reply = "";
      const query = text.toLowerCase();
      if (
        query.includes("projeto") ||
        query.includes("saas") ||
        query.includes("🚀")
      ) {
        reply = t.chat.replyProjects;
      } else if (
        query.includes("orçam") ||
        query.includes("contrat") ||
        query.includes("💼")
      ) {
        reply = t.chat.replyQuote;
      } else if (
        query.includes("habilidad") ||
        query.includes("stack") ||
        query.includes("🛠️")
      ) {
        reply = t.chat.replySkills;
      } else {
        reply = t.chat.replyDefault;
      }

      const botId = Date.now().toString();
      setMessages((p) => [...p, { id: botId, sender: "bot", text: reply }]);
      setActiveTypingId(botId);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel border border-border rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative z-10">
      <div className="bg-surface/40 backdrop-blur-xl px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border border-primary/30 overflow-hidden bg-primary/10 flex items-center justify-center avatar-glow">
            <Image
              src="/portfolio-carlos/eu.png"
              alt="Carlos André"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider">
              {t.chat.assistantName}
            </h4>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-green-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
              Online
            </div>
          </div>
        </div>
        <span className="text-[8px] font-black bg-primary/15 text-accent border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
          {t.chat.assistantRole}
        </span>
      </div>

      <div className="h-[340px] overflow-y-auto p-6 space-y-4 chat-scrollbar bg-bg/5">
        {messages.map((m) => {
          const typing = activeTypingId === m.id && isTyping;
          if (m.id === "pending") return null;
          return (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-surface/80 border border-border text-txt rounded-tl-none"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {typing ? displayedText : m.text}
                {typing && <span className="typing-cursor">|</span>}
              </div>
            </div>
          );
        })}
        {isTyping && activeTypingId === "pending" && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1 items-center shadow-sm">
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-surface/20 border-t border-border flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleSend("🚀 " + t.chat.btnProjects, true)}
          className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary cursor-pointer"
        >
          {t.chat.btnProjects}
        </button>
        <button
          onClick={() =>
            handleSend("🤖 " + (t.nav.ai || "Automações IA"), true)
          }
          className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary cursor-pointer"
        >
          🤖 Automações IA
        </button>
        <button
          onClick={() => handleSend("📄 Ver Currículo", true)}
          className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary cursor-pointer"
        >
          📄 Currículo
        </button>
        <a
          href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto."
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] font-bold uppercase tracking-widest bg-bg/60 hover:bg-primary/10 border border-border hover:border-primary/30 px-3 py-2 rounded-full transition-all text-txt-muted hover:text-primary flex items-center"
        >
          💬 WhatsApp
        </a>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-surface/40 border-t border-border flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          className="flex-1 bg-bg/40 border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/40 transition-colors text-txt"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-accent text-white px-4 rounded-xl flex items-center justify-center transition-all shadow-md"
        >
          <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
};

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
    { name: t.nav.about, href: "#sobre" },
    { name: t.nav.solutions, href: "#solucoes" },
    { name: t.nav.ai, href: "#ia" },
    { name: t.nav.apps, href: "#aplicativos" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.projects, href: "#projetos" },
    { name: t.nav.experience, href: "#experiencia" },
    { name: t.nav.contact, href: "#contato" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`container mx-auto max-w-5xl transition-all duration-300 ${scrolled ? "bg-bg/85 backdrop-blur-xl border border-border shadow-xl rounded-full py-2.5 px-6" : "py-4 px-4"}`}
      >
        <div className="flex justify-between items-center">
          <a href="#home" className="text-lg font-black tracking-tighter">
            CARLOS<span className="text-primary">.</span>
          </a>
          <div className="hidden lg:flex gap-4 items-center text-[8px] font-black uppercase tracking-wider">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="hover:text-primary transition-colors"
              >
                {l.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border text-[8px] font-bold bg-surface/20"
            >
              <Globe size={10} className="text-primary" />{" "}
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-border bg-surface/20"
            >
              {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-4 right-4 bg-bg/95 backdrop-blur-2xl border border-border rounded-2xl p-6 shadow-xl lg:hidden"
          >
            <div className="flex flex-col gap-4 items-center font-black uppercase tracking-widest text-xs">
              {links.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-primary"
                >
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

const HeroSection = () => {
  const { t } = useApp();
  return (
    <section
      id="home"
      className="min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-4xl w-full flex flex-col items-center relative z-10 text-center">
        <FadeIn delay={0.1}>
          <Badge pulsing>{t.hero.badge}</Badge>
        </FadeIn>
        <FadeIn delay={0.25}>
          <h1 className="text-4xl sm:text-6xl md:text-[76px] font-black uppercase leading-[0.95] tracking-tighter mt-4 mb-6">
            {t.hero.title1} <br />
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-border max-w-2xl w-full backdrop-blur-xl">
            <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-6">
              {t.hero.desc}
            </p>
            <div className="w-full h-[1px] bg-border mb-4" />
            <div className="flex justify-center gap-8 md:gap-16">
              {[
                { val: t.hero.stat1v, label: t.hero.stat1 },
                { val: t.hero.stat2v, label: t.hero.stat2 },
                { val: t.hero.stat3v, label: t.hero.stat3 },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xl md:text-2xl font-black text-primary">
                    {s.val}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-txt-muted mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useApp();
  return (
    <section id="sobre" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-center mb-12">
          <FadeIn direction="right">
            <div className="relative group w-full max-w-[240px] aspect-square mx-auto md:mx-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-2xl blur-xl opacity-20" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border avatar-glow">
                <Image
                  src="/portfolio-carlos/eu.png"
                  alt="Carlos André"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <div className="text-center md:text-left">
              <Badge>{t.about.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 mb-4">
                {t.about.title1}{" "}
                <span className="text-gradient">{t.about.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-6">
                {t.about.bio}
              </p>
              <div className="flex justify-center md:justify-start gap-2.5">
                <a
                  href="https://github.com/techcarlosandre"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-surface/40 border border-border hover:bg-primary transition-colors"
                >
                  <GithubIcon size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/devcarlosandre/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-surface/40 border border-border hover:bg-primary transition-colors"
                >
                  <LinkedinIcon size={16} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FadeIn delay={0.1}>
            <SpotlightCard>
              <h4 className="font-black uppercase tracking-wider text-xs mb-3">
                {t.about.softSkillsTitle}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {t.about.softSkills.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full border border-border text-txt-muted text-[8px] font-bold uppercase"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </FadeIn>
          <FadeIn delay={0.2}>
            <SpotlightCard>
              <h4 className="font-black uppercase tracking-wider text-xs mb-3">
                {t.about.langTitle}
              </h4>
              <div className="space-y-2">
                {(
                  t.about.langs as readonly { name: string; level: string }[]
                ).map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-bold">{l.name}</span>
                    <span className="text-[8px] font-black border border-border px-2 py-0.5 rounded-full">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const SolutionsSection = () => {
  const { t } = useApp();
  return (
    <section
      id="solucoes"
      className="py-20 bg-bg/40 border-t border-b border-border"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.solutions.badge}</Badge>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-3">
              {t.solutions.title1}{" "}
              <span className="text-gradient">
                {t.solutions.titleHighlight}
              </span>
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {t.solutions.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="glow-card glass-card rounded-2xl p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Zap size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-black uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-txt-muted text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIAutomationsSection = () => {
  const { t } = useApp();
  return (
    <section id="ia" className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-[1fr_1fr] gap-10 items-center">
          <FadeIn direction="right">
            <div>
              <Badge>{t.aiAutomations.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 mb-4">
                {t.aiAutomations.title1} <br />
                <span className="text-gradient">
                  {t.aiAutomations.titleHighlight}
                </span>
              </h2>
              <p className="text-txt-muted text-xs md:text-sm leading-relaxed">
                {t.aiAutomations.desc}
              </p>
            </div>
          </FadeIn>
          <div className="space-y-4">
            {t.aiAutomations.items.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glow-card glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-black uppercase mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                    {item.title}
                  </h3>
                  <p className="text-txt-muted text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AppsSection = () => {
  const { t } = useApp();
  return (
    <section
      id="aplicativos"
      className="py-20 bg-bg/40 border-t border-b border-border"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.apps.badge}</Badge>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-3">
              {t.apps.title1}{" "}
              <span className="text-gradient">{t.apps.titleHighlight}</span>
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {t.apps.items.map((app, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="glow-card glass-card rounded-2xl p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-base font-black uppercase mb-2">
                    {app.title}
                  </h3>
                  <p className="text-txt-muted text-xs leading-relaxed">
                    {app.desc}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-[8px] font-black bg-primary/10 text-accent border border-primary/20 px-2.5 py-0.5 rounded-full">
                    PRODUÇÃO
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = ({
  selectedTech,
  onSelectTech,
}: {
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
}) => {
  const { t } = useApp();
  const allTechs = t.skills.categories.flatMap((cat) => cat.techs);

  return (
    <section id="skills" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="space-y-4">
            <FadeIn direction="right">
              <Badge>{t.skills.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 mb-4">
                {t.skills.title1}{" "}
                <span className="text-gradient">{t.skills.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-xs md:text-sm leading-relaxed mb-6">
                {t.skills.desc}
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="globe-container">
                <WebGLTagGlobe
                  tags={allTechs}
                  selectedTech={selectedTech}
                  onSelectTech={onSelectTech}
                />
              </div>
            </FadeIn>
          </div>
          <div className="space-y-4">
            {(t.skills.categories as any).map((cat: any, i: number) => (
              <FadeIn key={i} delay={i * 0.05}>
                <SpotlightCard>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                      <Briefcase size={14} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs">
                        {cat.title}
                      </h4>
                      <p className="text-[8px] text-txt-muted font-bold uppercase">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                  <p className="text-txt-muted text-[11px] leading-relaxed mb-3">
                    {cat.desc}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cat.techs.map((tech: string) => (
                      <button
                        key={tech}
                        onClick={() =>
                          onSelectTech(selectedTech === tech ? null : tech)
                        }
                        className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase transition-all ${
                          selectedTech === tech
                            ? "bg-primary border-accent text-white"
                            : "border-border text-txt-muted hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = ({
  selectedTech,
  onClearSelection,
}: {
  selectedTech: string | null;
  onClearSelection: () => void;
}) => {
  const { t } = useApp();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const projectMeta = [
    {
      link: "https://omni-gestao-pro-six.vercel.app",
      img: "/portfolio-carlos/projetos/omni-thumb.png",
      github: "https://github.com/techcarlosandre/omni-gestao-vitrine",
    },
    {
      link: "https://omni-financas-demo.vercel.app",
      img: "/portfolio-carlos/projetos/omni-financas.png",
      github: "https://github.com/techcarlosandre/omni-financas-vitrine",
    },
    {
      link: "https://rankehub.vercel.app/",
      img: "/portfolio-carlos/projetos/rankhub.png",
      github: "https://github.com/techcarlosandre/Rank-Hub",
    },
    {
      link: "#",
      img: "",
      github: "#",
      videos: [
        "/portfolio-carlos/projetos/automacao-wpp.mp4",
        "/portfolio-carlos/projetos/automacao-ig.mp4",
      ],
    },
    { link: "#", img: "", github: "#", wip: true },
  ];

  const projects = t.projects.items.map((item, i) => ({
    ...item,
    ...projectMeta[i],
  }));
  const filtered = selectedTech
    ? projects.filter((p) => p.techs?.some((tech) => tech === selectedTech))
    : projects;

  return (
    <section id="projetos" className="py-20 border-t border-border bg-bg/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge>{t.projects.badge}</Badge>
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-3">
              {t.projects.title1}{" "}
              <span className="text-gradient">{t.projects.titleHighlight}</span>
            </h2>
          </FadeIn>
        </div>
        {selectedTech && (
          <div className="mb-6 flex items-center justify-between border border-primary/20 bg-primary/5 p-3 rounded-xl text-xs uppercase font-black">
            <div>
              Filtrando: <span className="text-gradient">{selectedTech}</span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-[9px] bg-bg border border-border rounded-lg px-2.5 py-1"
            >
              Limpar
            </button>
          </div>
        )}
        <div className="space-y-4">
          {filtered.map((p, i) => {
            const isExpanded = expandedIdx === i;
            return (
              <div
                key={p.title}
                className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">
                      {p.tag}
                    </span>
                    <h3 className="text-lg font-black uppercase mt-1 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-txt-muted text-xs leading-relaxed max-w-2xl">
                      {p.desc}
                    </p>
                  </div>
                  <div className="text-[9px] font-black text-primary uppercase shrink-0">
                    {isExpanded ? "▲ Fechar" : "▼ Detalhes"}
                  </div>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 0 }}
                  className="overflow-hidden bg-bg/40 border-t border-border/40"
                >
                  <div className="p-6 space-y-4">
                    {p.techs && (
                      <div className="flex flex-wrap gap-1">
                        {p.techs.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full border border-primary/20 text-[8px] font-bold text-primary bg-primary/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {p.link !== "#" && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-primary text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          Demo <ExternalLink size={10} />
                        </a>
                      )}
                      {p.github !== "#" && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-border text-[9px] font-black uppercase px-3 py-1.5 rounded-lg"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  const { t } = useApp();
  const [active, setActive] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 70%", "end 30%"],
  });

  return (
    <section id="experiencia" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl" ref={container}>
        <div className="grid md:grid-cols-[1fr_2px_1.5fr] gap-8">
          <div>
            <div className="md:sticky md:top-28">
              <Badge>{t.experience.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-black uppercase mt-3 mb-4">
                {t.experience.title1}{" "}
                <span className="text-gradient">
                  {t.experience.titleHighlight}
                </span>
              </h2>
              <p className="text-txt-muted text-xs leading-relaxed">
                {t.experience.subtitle}
              </p>
            </div>
          </div>
          <div className="hidden md:block relative bg-border w-full">
            <motion.div
              className="absolute top-0 left-0 w-full bg-primary origin-top"
              style={{ scaleY: scrollYProgress, height: "100%" }}
            />
          </div>
          <div className="space-y-4">
            {t.experience.items.map((item, i) => (
              <motion.div
                key={i}
                onViewportEnter={() => setActive(i)}
                className={`p-5 rounded-2xl glass-card border ${active === i ? "border-primary/40" : "border-border"}`}
              >
                <div className="flex justify-between items-start text-xs mb-3">
                  <div>
                    <h4 className="font-black uppercase text-sm">
                      {item.title}
                    </h4>
                    <p className="text-primary font-bold uppercase tracking-wider text-[10px]">
                      {item.company}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-txt-muted">
                    {item.date}
                  </span>
                </div>
                <ul className="space-y-2">
                  {item.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="text-txt-muted text-xs flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />{" "}
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  const { t } = useApp();
  return (
    <footer
      id="contato"
      className="pt-20 pb-10 px-4 border-t border-border bg-bg/50"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Badge>{t.contact.badge}</Badge>
          <h2 className="text-3xl md:text-5xl font-black uppercase mt-3">
            {t.contact.title1}{" "}
            <span className="text-gradient">{t.contact.titleHighlight}</span>
          </h2>
        </div>
        <ChatHibrido />
        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-txt-muted text-[9px] font-bold uppercase tracking-widest">
          <p>{t.footer.copy}</p> <p>{t.footer.made}</p>
        </div>
      </div>
    </footer>
  );
};

export default function PortfolioPage() {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState<Lang>("pt");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute(
      "data-theme",
      next === "dark" ? "" : "light",
    );
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, t, theme, toggleTheme, setLang }}>
      <main className="relative min-h-screen bg-bg text-txt selection:bg-primary selection:text-white overflow-x-clip dot-grid">
        <div className="grain-overlay" />
        <Particles />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <SolutionsSection />
        <AIAutomationsSection />
        <AppsSection />
        <SkillsSection
          selectedTech={selectedTech}
          onSelectTech={(tech) =>
            setSelectedTech((curr) => (curr === tech ? null : tech))
          }
        />
        <ProjectsSection
          selectedTech={selectedTech}
          onClearSelection={() => setSelectedTech(null)}
        />
        <ExperienceSection />
        <FooterSection />
      </main>
    </AppContext.Provider>
  );
}
