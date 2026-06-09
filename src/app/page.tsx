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
  Mail,
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

// ─── Context ───
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

// ─── Particles ───
const Particles = () => {
  const [particles, setParticles] = useState<
    { id: number; size: number; left: number; dur: number; delay: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        dur: Math.random() * 15 + 15,
        delay: Math.random() * 10,
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

// ─── Utility Components ───
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
      className={`glass-card spotlight-card rounded-3xl p-8 ${className}`}
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
  const dirs: Record<string, { x: number; y: number }> = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction], filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
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
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border text-[10px] md:text-xs font-bold uppercase tracking-widest text-txt-muted">
    {pulsing && (
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    )}
    {children}
  </div>
);

// ─── WebGL 3D Particle Globe with Tech Filter ───
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
    ax: 0.28,
    ay: 0.32,
    targetAx: 0.28,
    targetAy: 0.32,
  });

  const createPointCloud = (tagsList: readonly string[]) =>
    tagsList.map((text, i) => {
      const t = Math.PI * 2 * (i / tagsList.length);
      const c = 1 - 2 * (i / tagsList.length);
      const s = Math.sqrt(1 - c * c);
      return {
        text,
        x: s * Math.cos(t),
        y: s * Math.sin(t),
        z: c,
      };
    });

  const rotatePoint = (
    point: { x: number; y: number; z: number },
    ax: number,
    ay: number,
  ) => {
    const cosX = Math.cos(ax);
    const sinX = Math.sin(ax);
    const cosY = Math.cos(ay);
    const sinY = Math.sin(ay);

    let y = point.y * cosX - point.z * sinX;
    let z = point.z * cosX + point.y * sinX;
    let x = point.x * cosY - z * sinY;
    z = z * cosY + point.x * sinY;

    return { x, y, z };
  };

  const projectPoint = (
    point: { x: number; y: number; z: number },
    width: number,
    height: number,
  ) => {
    const cameraZ = 3.4;
    const scale = cameraZ / (cameraZ - point.z);
    return {
      x: width / 2 + point.x * width * 0.18 * scale,
      y: height / 2 + point.y * height * 0.18 * scale,
      scale,
      visible: point.z > -1.3,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec3 aPosition;
      uniform mat4 uModel;
      uniform mat4 uProjection;
      void main() {
        gl_Position = uProjection * uModel * vec4(aPosition, 1.0);
        gl_PointSize = 3.5;
      }
    `;
    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.25, 0.5, dist);
        gl_FragColor = vec4(1.0, 0.4, 0.4, alpha);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const createProgram = (vs: WebGLShader, fs: WebGLShader) => {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      return program;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(vertexShader, fragmentShader);
    if (!program) return;

    const aPosition = gl.getAttribLocation(program, "aPosition");
    const uModel = gl.getUniformLocation(program, "uModel");
    const uProjection = gl.getUniformLocation(program, "uProjection");
    if (aPosition === -1 || !uModel || !uProjection) return;

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(
        1,
        Math.floor(rect.width * window.devicePixelRatio),
      );
      const height = Math.max(
        1,
        Math.floor(rect.height * window.devicePixelRatio),
      );
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const buildProjection = () => {
      const fov = 60 * (Math.PI / 180);
      const aspect = canvas.width / canvas.height;
      const near = 0.1;
      const far = 100.0;
      const f = 1.0 / Math.tan(fov / 2);
      return new Float32Array([
        f / aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (far + near) / (near - far),
        -1,
        0,
        0,
        (2 * far * near) / (near - far),
        0,
      ]);
    };

    const buildModel = (ax: number, ay: number) => {
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);

      return new Float32Array([
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
        0,
        1,
      ]);
    };

    const points = createPointCloud(tags);
    pointsRef.current = points;

    const updateLabelPositions = (
      rotated: { x: number; y: number; z: number }[],
    ) => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      rotated.forEach((point, index) => {
        const label = labelRefs.current[tags[index]];
        if (!label) return;
        const projected = projectPoint(point, width, height);
        label.style.opacity = projected.visible ? "1" : "0";
        label.style.transform = `translate(${projected.x}px, ${projected.y}px) scale(${0.9 + projected.scale * 0.25})`;
        label.style.zIndex = projected.visible ? "20" : "10";
      });
    };

    let animationFrameId = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const render = () => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const time = performance.now() * 0.00035;
      rotationRef.current.ax +=
        (rotationRef.current.targetAx - rotationRef.current.ax) * 0.06;
      rotationRef.current.ay +=
        (rotationRef.current.targetAy - rotationRef.current.ay) * 0.06;
      const currentAx = rotationRef.current.ax + Math.sin(time) * 0.12;
      const currentAy = rotationRef.current.ay + Math.cos(time) * 0.12;

      const rotated = pointsRef.current.map((point) =>
        rotatePoint(point, currentAx, currentAy),
      );

      const positionData = new Float32Array(
        rotated.flatMap((p) => [p.x, p.y, p.z]),
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.DYNAMIC_DRAW);

      gl.useProgram(program);
      gl.uniformMatrix4fv(uProjection, false, buildProjection());
      gl.uniformMatrix4fv(uModel, false, buildModel(currentAx, currentAy));
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, rotated.length);

      updateLabelPositions(rotated);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      lastPointerX = (event.clientX - rect.left) / rect.width;
      lastPointerY = (event.clientY - rect.top) / rect.height;
      rotationRef.current.targetAy = (lastPointerX - 0.5) * 0.8;
      rotationRef.current.targetAx = (0.5 - lastPointerY) * 0.7;
    };

    const handlePointerLeave = () => {
      rotationRef.current.targetAx = 0.28;
      rotationRef.current.targetAy = 0.32;
    };

    const handleCanvasClick = (event: MouseEvent) => {
      if (event.target === canvas) {
        onSelectTech(null);
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleCanvasClick);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleCanvasClick);
      resizeObserver.disconnect();
    };
  }, [tags, onSelectTech]);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full bg-transparent"
        role="img"
        aria-label="Globo 3D de tecnologias"
      />
      <div className="absolute inset-0 pointer-events-none">
        {tags.map((tag) => (
          <button
            key={tag}
            ref={(el) => {
              labelRefs.current[tag] = el;
            }}
            type="button"
            onClick={() => onSelectTech(selectedTech === tag ? null : tag)}
            className={`globe-tag pointer-events-auto ${
              selectedTech === tag ? "globe-tag-selected" : ""
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Hybrid AI Chat Component ───
const ChatHibrido = () => {
  const { t } = useApp();
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string; isTyping?: boolean }[]
  >([{ id: "1", sender: "bot", text: t.chat.welcome }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, displayedText]);

  // Efeito de digitação realista (35ms ± 10ms por letra)
  useEffect(() => {
    if (!typingMessageId || !isTyping) return;

    const msgIndex = messages.findIndex((m) => m.id === typingMessageId);
    if (msgIndex === -1) return;

    const fullText = messages[msgIndex].text;
    if (displayedText.length >= fullText.length) {
      setIsTyping(false);
      setTypingMessageId(null);
      return;
    }

    const randomDelay = 35 + (Math.random() - 0.5) * 20; // 35ms ± 10ms
    typingTimeoutRef.current = setTimeout(() => {
      setDisplayedText((prev) => fullText.substring(0, prev.length + 1));
    }, randomDelay);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [typingMessageId, displayedText, messages, isTyping]);

  const handleSend = (text: string, isButton = false) => {
    if (!text.trim()) return;

    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text }]);
    if (!isButton) setInput("");

    // Typing indicator por 1.2 segundos exatos
    setTimeout(() => {
      let reply = "";
      const tQuery = text.toLowerCase();

      // 4 Caminhos específicos com detecção aprimorada
      if (
        tQuery.includes("projeto") ||
        tQuery.includes("project") ||
        tQuery.includes("saas") ||
        tQuery.includes("🚀")
      ) {
        reply = t.chat.replyProjects;
      } else if (
        tQuery.includes("orçam") ||
        tQuery.includes("budget") ||
        tQuery.includes("contrat") ||
        tQuery.includes("hire") ||
        tQuery.includes("💼")
      ) {
        reply = t.chat.replyQuote;
      } else if (
        tQuery.includes("habilidad") ||
        tQuery.includes("skill") ||
        tQuery.includes("tecnolog") ||
        tQuery.includes("stack") ||
        tQuery.includes("🛠️") ||
        tQuery.includes("tools")
      ) {
        reply = t.chat.replySkills;
      } else if (
        tQuery.includes("whatsapp") ||
        tQuery.includes("whats") ||
        tQuery.includes("contat") ||
        tQuery.includes("email") ||
        tQuery.includes("💬")
      ) {
        reply = t.chat.replyQuote;
      } else {
        // Fallback inteligente para outros tópicos
        reply = t.chat.replyDefault;
      }

      const botMsgId = (Date.now() + Math.random()).toString();
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: "bot", text: reply, isTyping: true },
      ]);
      setTypingMessageId(botMsgId);
      setDisplayedText("");
      setIsTyping(true);
    }, 1200); // 1.2 segundos de typing indicator
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative z-10">
      {/* Header */}
      <div className="bg-surface/60 backdrop-blur-xl px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full border-2 border-primary/40 overflow-hidden bg-primary/10 flex items-center justify-center avatar-glow">
            <Image
              src="/eu.webp"
              alt="Carlos André"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">
              {t.chat.assistantName}
            </h4>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-green-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <span className="text-[9px] font-black bg-primary/25 text-primary border border-primary/30 px-4 py-1.5 rounded-full uppercase tracking-widest">
          {t.chat.assistantRole}
        </span>
      </div>

      {/* Message Area */}
      <div className="h-[360px] overflow-y-auto p-6 space-y-4 chat-scrollbar flex flex-col bg-bg/5">
        {messages.map((m) => {
          const isCurrentlyTyping = typingMessageId === m.id && isTyping;
          const textToDisplay = isCurrentlyTyping ? displayedText : m.text;

          return (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-xs md:text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                    : "bg-surface/90 border border-border text-txt rounded-tl-none shadow-sm"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {textToDisplay}
                {isCurrentlyTyping && <span className="animate-pulse">|</span>}
              </div>
            </div>
          );
        })}
        {!isTyping && typingMessageId === null && messages.length > 1 && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border text-txt rounded-2xl rounded-tl-none px-5 py-3 flex gap-1.5 items-center shadow-sm">
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

      {/* Suggested Actions - 4 Caminhos Específicos */}
      <div className="p-4 bg-surface/30 border-t border-border flex flex-wrap gap-2.5 justify-center">
        <button
          onClick={() => handleSend("🚀 " + t.chat.btnProjects, true)}
          className="text-[9px] font-bold uppercase tracking-widest bg-bg/70 hover:bg-primary/20 border border-border hover:border-primary/45 px-4 py-2.5 rounded-full transition-all text-txt-muted hover:text-primary cursor-pointer shadow-sm"
        >
          {t.chat.btnProjects}
        </button>
        <button
          onClick={() =>
            handleSend("🤖 Como funcionam suas automações com IA?", true)
          }
          className="text-[9px] font-bold uppercase tracking-widest bg-bg/70 hover:bg-blue-500/20 border border-border hover:border-blue-500/45 px-4 py-2.5 rounded-full transition-all text-txt-muted hover:text-blue-400 cursor-pointer shadow-sm"
        >
          🤖 Automações IA
        </button>
        <button
          onClick={() => handleSend("📄 Quero ver seu currículo", true)}
          className="text-[9px] font-bold uppercase tracking-widest bg-bg/70 hover:bg-green-500/20 border border-border hover:border-green-500/45 px-4 py-2.5 rounded-full transition-all text-txt-muted hover:text-green-400 cursor-pointer shadow-sm"
        >
          📄 Currículo
        </button>
        <a
          href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] font-bold uppercase tracking-widest bg-bg/70 hover:bg-green-500/20 border border-border hover:border-green-500/45 px-4 py-2.5 rounded-full transition-all text-txt-muted hover:text-green-500 cursor-pointer shadow-sm"
        >
          {t.chat.btnWhatsApp}
        </a>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 bg-surface/60 border-t border-border flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          className="flex-1 bg-bg/50 border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-accent text-white px-5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-primary/25"
        >
          <ChevronRight size={18} />
        </button>
      </form>
    </div>
  );
};

// ─── Navbar ───
const Navbar = () => {
  const { t, lang, setLang, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      setHidden(current > lastScrollY && current > 120);
      lastScrollY = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: t.nav.about, href: "#sobre" },
    { name: t.nav.projects, href: "#projetos" },
    { name: t.nav.solutions, href: "#solucoes" },
    { name: t.nav.ai, href: "#ia" },
    { name: t.nav.apps, href: "#aplicativos" },
    { name: t.nav.skills, href: "#skills" },
    { name: t.nav.experience, href: "#experiencia" },
    { name: t.nav.contact, href: "#contato" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`container mx-auto max-w-5xl transition-all duration-500 ${scrolled ? "bg-bg/90 backdrop-blur-2xl border border-border shadow-2xl rounded-full py-3 px-6 md:px-8" : "py-4 px-2"}`}
      >
        <div className="flex justify-between items-center">
          <motion.a
            href="#home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
          >
            CARLOS<span className="text-primary">.</span>
          </motion.a>

          <div className="hidden lg:flex gap-5 items-center text-[9px] font-bold uppercase tracking-[0.12em]">
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
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 transition-all bg-surface/30"
            >
              <Globe size={12} className="text-primary" />
              {lang === "pt" ? "EN" : "PT"}
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border hover:border-primary/50 transition-all bg-surface/30"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* CTA Desktop */}
            <a
              href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                {t.nav.cta}
              </motion.button>
            </a>

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 lg:hidden bg-bg/95 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex flex-col gap-5 items-center font-black uppercase tracking-widest text-sm">
              {links.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-primary transition-colors"
                >
                  {l.name}
                </a>
              ))}
              <a
                href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full"
              >
                <button className="w-full bg-primary text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
                  {t.nav.cta}
                </button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
// ─── Hero Section ───
const HeroSection = () => {
  const { t } = useApp();
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center relative z-10">
        {/* Avatar premium na porta da frente */}
        <FadeIn delay={0.1}>
          <div className="relative group w-28 h-28 mb-6 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary avatar-glow">
              <Image
                src="/eu.webp"
                alt="Carlos André"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="glass-panel px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md mb-6 animate-pulse">
            <Badge pulsing>{t.hero.badge}</Badge>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h1 className="text-4xl sm:text-6xl md:text-[85px] font-black text-center uppercase leading-[0.95] tracking-tighter mt-4 mb-6">
            {t.hero.title1} <br />
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.55}>
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl max-w-2xl w-full flex flex-col items-center gap-6 backdrop-blur-xl">
            <p className="text-txt-muted text-center text-sm md:text-base leading-relaxed">
              {t.hero.desc}
            </p>
            <div className="w-full h-[1px] bg-border" />
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {[
                { val: t.hero.stat1v, label: t.hero.stat1 },
                { val: t.hero.stat2v, label: t.hero.stat2 },
                { val: t.hero.stat3v, label: t.hero.stat3 },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-black text-primary">
                    {s.val}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-txt-muted mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-9 border-2 border-txt/20 rounded-full flex justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

// ─── About Section (Profile + Soft Skills + Languages) ───
const AboutSection = () => {
  const { t } = useApp();
  return (
    <section id="sobre" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Upper Side-by-Side: Photo & Bio */}
        <div className="grid md:grid-cols-[1fr_1.8fr] gap-12 items-center mb-16">
          <FadeIn direction="right">
            <div className="relative group w-full max-w-[280px] aspect-square mx-auto md:mx-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border avatar-glow">
                <Image
                  src="/eu.webp"
                  alt="Carlos André"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div className="text-center md:text-left">
              <Badge>{t.about.badge}</Badge>
              <h2 className="text-4xl md:text-5xl font-black uppercase mt-4 mb-6 leading-tight">
                {t.about.title1}{" "}
                <span className="text-gradient">{t.about.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-base md:text-lg leading-relaxed mb-6">
                {t.about.bio}
              </p>
              <div className="flex justify-center md:justify-start gap-3">
                <a
                  href="https://github.com/techcarlosandre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface/50 border border-border hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/devcarlosandre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-surface/50 border border-border hover:bg-primary hover:text-white transition-all cursor-pointer"
                >
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Lower Grid: Soft Skills & Languages */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Soft Skills */}
          <FadeIn delay={0.1}>
            <SpotlightCard>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs">
                    {t.about.softSkillsTitle}
                  </h4>
                  <p className="text-[9px] text-txt-muted font-bold uppercase tracking-widest">
                    {t.about.softSkillsCount}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.about.softSkills.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full border border-border text-txt-muted text-[9px] font-bold uppercase tracking-widest transition-colors hover:border-primary/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </FadeIn>

          {/* Languages */}
          <FadeIn delay={0.2}>
            <SpotlightCard>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-xs">
                    {t.about.langTitle}
                  </h4>
                  <p className="text-[9px] text-txt-muted font-bold uppercase tracking-widest">
                    {t.about.langCount}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {(
                  t.about.langs as readonly { name: string; level: string }[]
                ).map((l, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-bold text-xs md:text-sm">
                      {l.name}
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        l.level === "NATIVO" || l.level === "NATIVE"
                          ? "text-primary border-primary/40 bg-primary/10"
                          : l.level === "TÉCNICO" || l.level === "TECHNICAL"
                            ? "text-blue-400 border-blue-400/40 bg-blue-400/10"
                            : "text-txt-muted border-border"
                      }`}
                    >
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

// ─── Projects Section (Stacked Sticky Cards) ───
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

  const filteredProjects = selectedTech
    ? projects.filter((project) =>
        project.techs?.some((tech) => tech === selectedTech),
      )
    : projects;

  const projectCards = filteredProjects.map((p, i) => {
    const isEven = i % 2 === 0;
    const hasVideos = "videos" in p && p.videos && p.videos.length > 0;
    const isWip = "wip" in p && p.wip;
    const isExpanded = expandedIdx === i;

    return (
      <div
        key={p.title}
        className="sticky"
        style={{ top: `${100 + i * 40}px` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          layout
          className="bg-surface rounded-[2rem] overflow-hidden border border-border/40 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] cursor-pointer"
          style={{ transform: `translateY(${i * 4}px)` }}
          onClick={() => setExpandedIdx(isExpanded ? null : i)}
        >
          <div
            className={`grid md:grid-cols-2 gap-0 ${!isEven ? "md:[direction:rtl]" : ""}`}
          >
            <div
              className={`h-72 md:h-96 relative group ${!isEven ? "md:[direction:ltr]" : ""}`}
            >
              {p.img ? (
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : hasVideos ? (
                <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                  {(p as any).videos.map((vid: string, vi: number) => (
                    <video
                      key={vi}
                      src={vid}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse">
                    <Zap size={28} className="text-primary" />
                  </div>
                  <p className="text-txt-muted text-xs font-bold uppercase tracking-widest">
                    Em Construção
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
              {isWip && (
                <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                  🚧 Em Construção
                </div>
              )}
            </div>

            <div
              className={`p-8 md:p-12 flex flex-col justify-center ${!isEven ? "md:[direction:ltr]" : ""}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                {p.tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
                {p.title}
              </h3>
              <p className="text-txt-muted text-sm md:text-base leading-relaxed mb-6">
                {p.desc}
              </p>

              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                className="overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                {"techs" in p && p.techs && (
                  <div className="flex flex-wrap gap-2 mb-6 mt-2">
                    {(p.techs as readonly string[]).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full border border-primary/30 text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mb-6">
                  {!isWip ? (
                    <>
                      {p.link !== "#" && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-accent transition-all"
                        >
                          {t.projects.details} <ExternalLink size={12} />
                        </a>
                      )}
                      {p.github !== "#" && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:border-primary/50 transition-all"
                        >
                          GitHub
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                      Em Desenvolvimento
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 flex items-center gap-1">
                {isExpanded
                  ? "▲ Recolher detalhes"
                  : "▼ Clique para expandir detalhes"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  });

  return (
    <section id="projetos" className="py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <FadeIn>
            <Badge>{t.projects.badge}</Badge>
            <h2 className="text-4xl md:text-6xl font-black uppercase mt-6">
              {t.projects.title1}{" "}
              <span className="text-primary">{t.projects.titleHighlight}</span>
            </h2>
          </FadeIn>
        </div>
        {selectedTech && (
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-black uppercase tracking-[0.35em] text-primary">
              Filtrando por: <span className="text-white">{selectedTech}</span>
            </div>
            <button
              onClick={onClearSelection}
              className="self-start sm:self-auto bg-bg/80 border border-border rounded-full px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              Ver todos os projetos
            </button>
          </div>
        )}
        <div className="space-y-8">
          {projectCards.length > 0 ? (
            projectCards
          ) : (
            <div className="rounded-[2rem] glass-panel border border-border p-12 text-center">
              <p className="text-txt-muted text-base">
                Nenhum projeto encontrado para a tecnologia selecionada.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Solutions Section ───
const SolutionsSection = () => {
  const { t } = useApp();
  const iconMap: Record<string, React.ReactNode> = {
    server: <Zap size={22} className="text-primary" />,
    code: <ChevronRight size={22} className="text-primary" />,
    zap: <Zap size={22} className="text-primary" />,
  };

  return (
    <section id="solucoes" className="py-24 bg-bg/50 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge>{t.solutions.badge}</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-4 mb-6">
              {t.solutions.title1}{" "}
              <span className="text-gradient">
                {t.solutions.titleHighlight}
              </span>
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.solutions.items.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <div className="glow-card glass-card rounded-3xl p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                    {iconMap[item.icon] || (
                      <Zap size={22} className="text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-txt-muted text-sm leading-relaxed">
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

// ─── AI & Automations Section ───
const AIAutomationsSection = () => {
  const { t } = useApp();
  return (
    <section id="ia" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <FadeIn direction="right">
            <div>
              <Badge>{t.aiAutomations.badge}</Badge>
              <h2 className="text-4xl md:text-5xl font-black uppercase mt-4 mb-6">
                {t.aiAutomations.title1} <br />
                <span className="text-gradient">
                  {t.aiAutomations.titleHighlight}
                </span>
              </h2>
              <p className="text-txt-muted text-base leading-relaxed mb-8">
                {t.aiAutomations.desc}
              </p>
            </div>
          </FadeIn>
          <div className="space-y-6">
            {t.aiAutomations.items.map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="glow-card glass-card rounded-3xl p-6 border border-border">
                  <h3 className="text-lg font-bold uppercase tracking-tight mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {item.title}
                  </h3>
                  <p className="text-txt-muted text-xs md:text-sm leading-relaxed">
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

// ─── Apps Section ───
const AppsSection = () => {
  const { t } = useApp();
  return (
    <section id="aplicativos" className="py-24 bg-bg/50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge>{t.apps.badge}</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase mt-4 mb-6">
              {t.apps.title1}{" "}
              <span className="text-gradient">{t.apps.titleHighlight}</span>
            </h2>
            <p className="text-txt-muted text-sm max-w-xl mx-auto">
              {t.apps.desc}
            </p>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {t.apps.items.map((app, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <div className="glow-card glass-card rounded-[2rem] p-8 border border-border flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">
                    MOBILE & WEB
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                    {app.title}
                  </h3>
                  <p className="text-txt-muted text-sm leading-relaxed">
                    {app.desc}
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <span className="text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full tracking-widest">
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

// ─── Skills Section ───
const SkillsSection = ({
  selectedTech,
  onSelectTech,
}: {
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
}) => {
  const { t } = useApp();
  const iconMap: Record<string, React.ReactNode> = {
    server: <Zap size={24} />,
    code: <ChevronRight size={24} />,
    brain: <GraduationCap size={24} />,
    tool: <Briefcase size={24} />,
  };

  const allTechs = t.skills.categories.flatMap((cat) => cat.techs);

  return (
    <section id="skills" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-[1fr_1.3fr] gap-16 items-center">
          <div className="md:sticky md:top-24 space-y-8">
            <FadeIn direction="right">
              <Badge>{t.skills.badge}</Badge>
              <h2 className="text-4xl md:text-5xl font-black uppercase mt-6 mb-6 leading-tight">
                {t.skills.title1}{" "}
                <span className="text-gradient">{t.skills.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-base leading-relaxed">
                {t.skills.desc}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="globe-container">
                <WebGLTagGlobe
                  tags={allTechs}
                  selectedTech={selectedTech}
                  onSelectTech={onSelectTech}
                />
              </div>
            </FadeIn>
          </div>
          <div className="space-y-6">
            {(
              t.skills.categories as readonly {
                icon: string;
                title: string;
                count: string;
                desc: string;
                techs: readonly string[];
              }[]
            ).map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <SpotlightCard>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl text-primary">
                      {iconMap[cat.icon]}
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-base">
                        {cat.title}
                      </h4>
                      <p className="text-[10px] text-txt-muted font-bold uppercase tracking-widest">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                  <p className="text-txt-muted text-sm leading-relaxed mb-5">
                    {cat.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.techs.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-txt-muted hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {tech}
                      </span>
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

// ─── Experience Section (Reference Style: Sticky Left + Timeline + Detail Cards) ───
const ExperienceSection = () => {
  const { t } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);
  const words = t.experience.rotatingWords as readonly string[];
  const [wordIdx, setWordIdx] = useState(0);
  const rotatingWord = words[wordIdx];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section id="experiencia" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-[1fr_3px_1.4fr] gap-8 md:gap-12">
          {/* Left – Sticky Column */}
          <div className="relative">
            <div className="md:sticky md:top-32 h-fit">
              <FadeIn direction="right">
                <Badge>{t.experience.badge}</Badge>
                <h2 className="text-4xl md:text-5xl font-black uppercase mt-6 mb-6 leading-tight">
                  {t.experience.title1}{" "}
                  <span className="text-gradient">
                    {t.experience.titleHighlight}
                  </span>
                </h2>
                <p className="text-txt-muted text-base leading-relaxed mb-10">
                  {t.experience.subtitle}
                </p>
                <h3 className="text-2xl md:text-3xl font-black">
                  {t.experience.newChapter}{" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotatingWord}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="text-gradient inline-block px-1"
                    >
                      {rotatingWord}
                    </motion.span>
                  </AnimatePresence>{" "}
                  {t.experience.newChapterEnd}
                </h3>
              </FadeIn>
            </div>
          </div>

          {/* Center – Glowing Timeline */}
          <div className="hidden md:block relative w-[2px] self-stretch mx-auto">
            {/* Background Faint Line */}
            <div className="absolute top-0 bottom-0 left-0 w-full bg-border" />

            {/* Filled Red Line */}
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-accent origin-top shadow-[0_0_15px_rgba(128,0,0,0.5)]"
              style={{ scaleY: scrollYProgress }}
            />

            {/* Tracking Glowing Dot */}
            <motion.div
              className="absolute left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-bg flex items-center justify-center z-10 shadow-[0_0_20px_4px_rgba(128,0,0,0.6)]"
              style={{
                top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              }}
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
            </motion.div>
          </div>

          {/* Right – Detailed Cards */}
          <div className="space-y-8 relative" ref={containerRef}>
            {t.experience.items.map((item, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <motion.div
                  onViewportEnter={() => setActiveIdx(i)}
                  className={`rounded-3xl glass-card overflow-hidden transition-all duration-500 ${activeIdx === i ? "border-primary/40 shadow-[0_0_40px_rgba(128,0,0,0.08)]" : ""}`}
                >
                  {/* Card Header */}
                  <div className="p-8 pb-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h4 className="font-black uppercase text-lg md:text-xl tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-primary font-bold uppercase text-xs tracking-widest mt-1">
                          {item.company}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[9px] font-black uppercase bg-surface/80 border border-border px-3 py-1 rounded-full tracking-widest">
                          {item.type}
                        </span>
                        <span className="text-[10px] font-mono text-txt-muted flex items-center gap-1.5">
                          📅 {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="p-8 pt-6">
                    <ul className="space-y-4">
                      {item.bullets.map((bullet, bi) => (
                        <motion.li
                          key={bi}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: bi * 0.1 + 0.2 }}
                          className="flex items-start gap-3 text-txt-muted text-sm leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Contact / Footer ───
const FooterSection = () => {
  const { t } = useApp();
  return (
    <footer
      id="contato"
      className="pt-32 pb-16 px-6 border-t border-border bg-bg"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Title */}
        <FadeIn>
          <div className="text-center mb-16">
            <Badge>{t.contact.badge}</Badge>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mt-6 mb-6">
              {t.contact.title1}{" "}
              <span className="text-gradient">{t.contact.titleHighlight}</span>
            </h2>
          </div>
        </FadeIn>

        {/* Hybrid Chat Interface */}
        <FadeIn delay={0.2}>
          <ChatHibrido />
        </FadeIn>

        {/* Copyright */}
        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-txt-muted text-[10px] font-bold uppercase tracking-widest">
          <p>{t.footer.copy}</p>
          <p>{t.footer.made}</p>
        </div>
      </div>
    </footer>
  );
};

// ─── Main Page ───
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
            setSelectedTech((current) => (current === tech ? null : tech))
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
