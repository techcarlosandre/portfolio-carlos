'use client';

import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ExternalLink, Globe, MessageCircle, Menu, X, Zap, Sun, Moon, GraduationCap, Briefcase, Mail } from 'lucide-react';

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
import { translations, type Lang } from './translations';

// ─── Context ───
type TranslationType = typeof translations['pt'] | typeof translations['en'];
const AppContext = createContext<{ lang: Lang; t: TranslationType; theme: string; toggleTheme: () => void; setLang: (l: Lang) => void }>({
  lang: 'pt', t: translations.pt, theme: 'dark', toggleTheme: () => {}, setLang: () => {},
});

const useApp = () => useContext(AppContext);

// ─── Particles ───
const Particles = () => {
  const [particles, setParticles] = useState<{ id: number; size: number; left: number; dur: number; delay: number }[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i, size: Math.random() * 3 + 1, left: Math.random() * 100,
      dur: Math.random() * 15 + 15, delay: Math.random() * 10,
    })));
  }, []);
  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
};

// ─── Utility Components ───
const SpotlightCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div ref={ref} onMouseMove={handleMove} className={`glass-card spotlight-card rounded-3xl p-8 ${className}`}
      style={{ '--mouse-x': `${pos.x}px`, '--mouse-y': `${pos.y}px` } as React.CSSProperties}>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const dirs: Record<string, { x: number; y: number }> = { up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { x: 40, y: 0 }, right: { x: -40, y: 0 } };
  return (
    <motion.div initial={{ opacity: 0, ...dirs[direction], filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}>
      {children}
    </motion.div>
  );
};

const Badge = ({ children, pulsing = false }: { children: React.ReactNode; pulsing?: boolean }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border text-[10px] md:text-xs font-bold uppercase tracking-widest text-txt-muted">
    {pulsing && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
    {children}
  </div>
);

// ─── Navbar ───
const Navbar = () => {
  const { t, lang, setLang, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { name: t.nav.about, href: '#sobre' },
    { name: t.nav.experience, href: '#experiencia' },
    { name: t.nav.projects, href: '#projetos' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.contact, href: '#contato' },
  ];

  return (
    <nav className="fixed top-6 w-full z-50 px-4 md:px-6">
      <div className={`container mx-auto max-w-5xl transition-all duration-500 ${scrolled ? 'bg-bg/80 backdrop-blur-xl border border-border shadow-2xl rounded-full py-3 px-6 md:px-8' : 'py-4 px-2'}`}>
        <div className="flex justify-between items-center">
          <motion.a href="#home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            CARLOS<span className="text-primary">.</span>
          </motion.a>

          <div className="hidden md:flex gap-6 items-center text-[10px] font-bold uppercase tracking-[0.15em]">
            {links.map(l => (
              <a key={l.name} href={l.href} className="hover:text-primary transition-colors">{l.name}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 transition-all bg-surface/30">
              <Globe size={12} className="text-primary" />
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>

            {/* Theme Switcher */}
            <button onClick={toggleTheme}
              className="p-2 rounded-full border border-border hover:border-primary/50 transition-all bg-surface/30">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* CTA Desktop */}
            <a href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="hidden md:block">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                {t.nav.cta}
              </motion.button>
            </a>

            {/* Mobile Menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 md:hidden bg-bg/95 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col gap-5 items-center font-black uppercase tracking-widest text-sm">
              {links.map(l => (
                <a key={l.name} href={l.href} onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">{l.name}</a>
              ))}
              <a href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="w-full">
                <button className="w-full bg-primary text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest">{t.nav.cta}</button>
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
    <section id="home" className="min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <FadeIn delay={0.1}><Badge pulsing>{t.hero.badge}</Badge></FadeIn>
      <FadeIn delay={0.3}>
        <h1 className="text-5xl md:text-[100px] font-black text-center uppercase leading-[0.9] tracking-tighter mt-10 mb-8">
          {t.hero.title1} <br />
          <span className="text-gradient">{t.hero.title2}</span>
        </h1>
      </FadeIn>
      <FadeIn delay={0.5}>
        <p className="text-txt-muted text-center max-w-2xl text-lg md:text-xl leading-relaxed mb-12">
          {t.hero.desc}
        </p>
      </FadeIn>
      <FadeIn delay={0.7}>
        <div className="flex flex-wrap justify-center gap-8">
          {[{ val: t.hero.stat1v, label: t.hero.stat1 }, { val: t.hero.stat2v, label: t.hero.stat2 }, { val: t.hero.stat3v, label: t.hero.stat3 }].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-[1px] h-10 bg-border" />}
              <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center">
                <span className="text-3xl font-black text-primary">{s.val}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-txt-muted">{s.label}</span>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </FadeIn>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-txt/20 rounded-full flex justify-center p-2">
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
    <section id="sobre" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <FadeIn direction="right">
              <Badge>{t.about.badge}</Badge>
              <h2 className="text-4xl md:text-6xl font-black uppercase mt-6 mb-8 leading-tight">
                {t.about.title1} <span className="text-gradient">{t.about.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-lg leading-relaxed mb-8">{t.about.bio}</p>
              <div className="flex gap-3">
                <a href="https://github.com/techcarlosandre" target="_blank" rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-surface/50 border border-border hover:bg-primary hover:text-white transition-all"><GithubIcon size={20} /></a>
                <a href="https://www.linkedin.com/in/devcarlosandre/" target="_blank" rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-surface/50 border border-border hover:bg-primary hover:text-white transition-all"><LinkedinIcon size={20} /></a>
              </div>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* Soft Skills */}
            <FadeIn delay={0.1}><SpotlightCard>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-primary/20 rounded-xl text-primary"><MessageCircle size={22} /></div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm">{t.about.softSkillsTitle}</h4>
                  <p className="text-[10px] text-txt-muted font-bold uppercase tracking-widest">{t.about.softSkillsCount}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.about.softSkills.map((s: string, i: number) => (
                  <span key={i} className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-colors ${i === 0 ? 'border-primary/50 text-primary bg-primary/10' : 'border-border text-txt-muted hover:border-primary/30'}`}>{s}</span>
                ))}
              </div>
            </SpotlightCard></FadeIn>

            {/* Languages */}
            <FadeIn delay={0.2}><SpotlightCard>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-primary/20 rounded-xl text-primary"><Globe size={22} /></div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm">{t.about.langTitle}</h4>
                  <p className="text-[10px] text-txt-muted font-bold uppercase tracking-widest">{t.about.langCount}</p>
                </div>
              </div>
              <div className="space-y-3">
                {(t.about.langs as readonly { name: string; level: string }[]).map((l, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-bold text-sm">{l.name}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      l.level === 'NATIVO' || l.level === 'NATIVE' ? 'text-primary border-primary/40 bg-primary/10' :
                      l.level === 'TÉCNICO' || l.level === 'TECHNICAL' ? 'text-blue-400 border-blue-400/40 bg-blue-400/10' :
                      'text-txt-muted border-border'
                    }`}>{l.level}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard></FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Projects Section (Stacked Sticky Cards with Tech Tags + Video) ───
const ProjectsSection = () => {
  const { t } = useApp();
  const projectMeta = [
    { link: 'https://omni-gestao-pro-six.vercel.app', img: '/portfolio-carlos/projetos/omni-thumb.png', github: 'https://github.com/techcarlosandre/omni-gestao-vitrine' },
    { link: 'https://omni-financas.vercel.app', img: '/portfolio-carlos/projetos/omni-financas.png', github: 'https://github.com/techcarlosandre/omni-gestao' },
    { link: 'https://rankehub.vercel.app/', img: '/portfolio-carlos/projetos/rankhub.png', github: 'https://github.com/techcarlosandre/Rank-Hub' },
    { link: '#', img: '', github: '#', videos: ['/portfolio-carlos/projetos/automacao-wpp.mp4', '/portfolio-carlos/projetos/automacao-ig.mp4'] },
    { link: '#', img: '', github: '#', wip: true },
  ];
  const projects = t.projects.items.map((item, i) => ({ ...item, ...projectMeta[i] }));

  return (
    <section id="projetos" className="py-32">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <FadeIn>
            <Badge>{t.projects.badge}</Badge>
            <h2 className="text-4xl md:text-6xl font-black uppercase mt-6">{t.projects.title1} <span className="text-primary">{t.projects.titleHighlight}</span></h2>
          </FadeIn>
        </div>
        <div className="space-y-8">
          {projects.map((p, i) => {
            const isEven = i % 2 === 0;
            const hasVideos = 'videos' in p && p.videos && p.videos.length > 0;
            const isWip = 'wip' in p && p.wip;

            return (
              <div key={p.title} className="sticky" style={{ top: `${100 + i * 40}px` }}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="bg-surface rounded-[2rem] overflow-hidden border border-border/40 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]"
                  style={{ transform: `translateY(${i * 4}px)` }}
                >
                  <div className={`grid md:grid-cols-2 gap-0 ${!isEven ? 'md:[direction:rtl]' : ''}`}>
                    {/* Media Side */}
                    <div className={`h-72 md:h-96 relative group ${!isEven ? 'md:[direction:ltr]' : ''}`}>
                      {p.img ? (
                        <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : hasVideos ? (
                        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                          {(p as any).videos.map((vid: string, vi: number) => (
                            <video key={vi} src={vid} autoPlay muted loop playsInline
                              className="w-full h-full object-cover rounded-xl" />
                          ))}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse">
                            <Zap size={28} className="text-primary" />
                          </div>
                          <p className="text-txt-muted text-xs font-bold uppercase tracking-widest">Em Construção</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                      {isWip && (
                        <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                          🚧 Em Construção
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div className={`p-8 md:p-12 flex flex-col justify-center ${!isEven ? 'md:[direction:ltr]' : ''}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">{p.tag}</span>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">{p.title}</h3>
                      <p className="text-txt-muted text-sm md:text-base leading-relaxed mb-6">{p.desc}</p>

                      {/* Tech Tags */}
                      {'techs' in p && p.techs && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {(p.techs as readonly string[]).map((tech: string) => (
                            <span key={tech} className="px-3 py-1 rounded-full border border-primary/30 text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4">
                        {!isWip ? (
                          <>
                            {p.link !== '#' && (
                              <a href={p.link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
                                {t.projects.details} <ExternalLink size={14} />
                              </a>
                            )}
                            {p.github !== '#' && (
                              <a href={p.github} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-all">
                                GitHub
                              </a>
                            )}
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Em Desenvolvimento
                          </div>
                        )}
                      </div>
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

// ─── Experience Section (Reference Style: Sticky Left + Timeline + Detail Cards) ───
const ExperienceSection = () => {
  const { t } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);
  const words = t.experience.rotatingWords as readonly string[];
  const [wordIdx, setWordIdx] = useState(0);
  const rotatingWord = words[wordIdx];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 80%", "end 20%"] });

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx(prev => (prev + 1) % words.length);
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
                {t.experience.title1} <span className="text-gradient">{t.experience.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-base leading-relaxed mb-10">
                {t.experience.subtitle}
              </p>
              <h3 className="text-2xl md:text-3xl font-black">
                {t.experience.newChapter}{' '}
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
                </AnimatePresence>
                {' '}{t.experience.newChapterEnd}
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
              style={{ top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
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
                  className={`rounded-3xl glass-card overflow-hidden transition-all duration-500 ${activeIdx === i ? 'border-primary/40 shadow-[0_0_40px_rgba(128,0,0,0.08)]' : ''}`}
                >
                  {/* Card Header */}
                  <div className="p-8 pb-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h4 className="font-black uppercase text-lg md:text-xl tracking-tight">{item.title}</h4>
                        <p className="text-primary font-bold uppercase text-xs tracking-widest mt-1">{item.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[9px] font-black uppercase bg-surface/80 border border-border px-3 py-1 rounded-full tracking-widest">{item.type}</span>
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

// ─── Skills Section ───
const SkillsSection = () => {
  const { t } = useApp();
  const iconMap: Record<string, React.ReactNode> = {
    server: <Zap size={24} />,
    code: <ChevronRight size={24} />,
    brain: <GraduationCap size={24} />,
    tool: <Briefcase size={24} />,
  };
  return (
    <section id="skills" className="py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <div className="md:sticky md:top-32">
            <FadeIn direction="right">
              <Badge>{t.skills.badge}</Badge>
              <h2 className="text-4xl md:text-5xl font-black uppercase mt-6 mb-6 leading-tight">
                {t.skills.title1} <span className="text-gradient">{t.skills.titleHighlight}</span>
              </h2>
              <p className="text-txt-muted text-base leading-relaxed">{t.skills.desc}</p>
            </FadeIn>
          </div>
          <div className="space-y-6">
            {(t.skills.categories as readonly { icon: string; title: string; count: string; desc: string; techs: readonly string[] }[]).map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <SpotlightCard>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl text-primary">{iconMap[cat.icon]}</div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-base">{cat.title}</h4>
                      <p className="text-[10px] text-txt-muted font-bold uppercase tracking-widest">{cat.count}</p>
                    </div>
                  </div>
                  <p className="text-txt-muted text-sm leading-relaxed mb-5">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.techs.map((tech: string) => (
                      <span key={tech} className="px-3 py-1.5 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-txt-muted hover:border-primary/40 hover:text-primary transition-colors">{tech}</span>
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

// ─── Contact / Footer ───
const FooterSection = () => {
  const { t } = useApp();
  return (
    <footer id="contato" className="pt-32 pb-16 px-6 border-t border-border bg-bg">
      <div className="container mx-auto max-w-4xl">
        {/* Title */}
        <FadeIn>
          <div className="text-center mb-16">
            <Badge>{t.contact.badge}</Badge>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none mt-6 mb-6">
              {t.contact.title1} <span className="text-gradient">{t.contact.titleHighlight}</span>
            </h2>
          </div>
        </FadeIn>

        {/* Contact Card */}
        <FadeIn delay={0.2}>
          <SpotlightCard className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black uppercase mb-4">{t.contact.subtitle}</h3>
            <p className="text-txt-muted text-sm leading-relaxed mb-8">{t.contact.desc}</p>

            <div className="space-y-4 mb-8">
              <a href="https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-bg/60 border border-border hover:border-green-500/40 transition-all border-green-500/20">
                <div className="p-3 rounded-xl bg-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all"><MessageCircle size={20} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted">WHATSAPP</p>
                  <p className="font-bold text-sm">+55 (21) 98266-5121</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-txt-muted" />
              </a>
              <a href="mailto:techcarlosandre@gmail.com" className="group flex items-center gap-4 p-4 rounded-2xl bg-bg/60 border border-border hover:border-primary/40 transition-all">
                <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all"><Mail size={20} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted">EMAIL</p>
                  <p className="font-bold text-sm">techcarlosandre@gmail.com</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-txt-muted" />
              </a>
              <a href="https://www.linkedin.com/in/devcarlosandre/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-bg/60 border border-border hover:border-primary/40 transition-all">
                <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all"><LinkedinIcon size={20} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted">LINKEDIN</p>
                  <p className="font-bold text-sm">linkedin.com/in/devcarlosandre</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-txt-muted" />
              </a>
              <a href="https://github.com/techcarlosandre" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-bg/60 border border-border hover:border-primary/40 transition-all">
                <div className="p-3 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all"><GithubIcon size={20} /></div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-txt-muted">GITHUB</p>
                  <p className="font-bold text-sm">github.com/techcarlosandre</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-txt-muted" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t.contact.available}
            </div>
          </SpotlightCard>
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
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('pt');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : 'light');
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
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <FooterSection />
      </main>
    </AppContext.Provider>
  );
}
