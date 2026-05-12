'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, Code, Layout, Server, Database, Phone, Mail, ExternalLink, Globe, Share2, MessageCircle, Menu, X, Zap, Cpu } from 'lucide-react';

const Particles = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={`custom-cursor hidden md:block ${isPointer ? 'active' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${isPointer ? 'scale(3)' : 'scale(1)'}`,
      }}
    />
  );
};

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * 0.4;
    const y = (clientY - centerY) * 0.4;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Sobre', 'Habilidades', 'Projetos', 'Contato'];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-black/95 backdrop-blur-md py-4 border-b border-primary/20' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter"
        >
          PORT<span className="text-primary">FOLIO.</span>
        </motion.div>

        <div className="hidden md:flex gap-8 items-center text-sm font-bold uppercase tracking-widest leading-none">
          {navLinks.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors relative group">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Magnetic>
            <a
              href="https://wa.me/21982665121?text=Olá Carlos, vi seu portfólio e gostaria de conversar sobre um projeto."
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full text-xs font-black uppercase transition-all glow-primary"
              >
                Vamos Conversar
              </motion.button>
            </a>
          </Magnetic>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-black/95 border-b border-white/5 py-8"
        >
          <div className="flex flex-col items-center gap-6 font-black uppercase tracking-[0.2em] text-sm">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors py-2"
              >
                {item}
              </a>
            ))}
            <a
              href="https://wa.me/21982665121?text=Olá Carlos, vi seu portfólio e gostaria de conversar sobre um projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <button className="bg-primary text-white px-8 py-3 rounded-full text-xs font-black uppercase glow-primary">
                Vamos Conversar
              </button>
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const SkillBar = ({ name, percent }: { name: string; percent: number }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between mb-3">
        <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em]">{name}</span>
        <span className="text-xs md:text-sm font-black text-primary">{percent}%</span>
      </div>
      <div className="h-[6px] w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary/50 to-primary relative"
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.div>
      </div>
    </div>
  );
};

const ScrollingSkills = () => {
  const skills = [
    { name: "Next.js / React", percent: 93, icon: Layout },
    { name: "Typescript", percent: 85, icon: Code },
    { name: "Tailwind CSS", percent: 90, icon: Globe },
    { name: "Node.js / Bun", percent: 87, icon: Server },
    { name: "PostgreSQL", percent: 89, icon: Database },
    { name: "Prisma ORM", percent: 88, icon: Database },
    { name: "Python / Flask", percent: 93, icon: Code },
    { name: "Google Gemini / IA", percent: 85, icon: Share2 },
    { name: "Vercel / Deploy", percent: 89, icon: ExternalLink },
    { name: "Git / GitHub", percent: 88, icon: Code },
    { name: "APIs & GraphQL", percent: 85, icon: Server },
    { name: "Docker", percent: 80, icon: Server },
    { name: "UI/UX Design", percent: 90, icon: Layout },
    { name: "Framer", percent: 90, icon: Zap },
    { name: "MPC", percent: 85, icon: Cpu },
  ];

  const duplicatedSkills = [...skills, ...skills];

  return (
    <div className="h-[500px] overflow-hidden relative group rounded-3xl border border-white/5 bg-surface/20 backdrop-blur-md">
      <motion.div
        animate={{
          y: [0, "-50%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col p-6"
      >
        {duplicatedSkills.map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div key={`${skill.name}-${index}`} className="mb-8 last:mb-0 group/skill">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-surface/50 border border-white/5 flex items-center justify-center group-hover/skill:border-primary/50 transition-all duration-500 group-hover/skill:scale-110 shadow-xl">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover/skill:text-white transition-colors">{skill.name}</span>
                    <span className="text-xs font-black text-primary/60 group-hover/skill:text-primary transition-colors">{skill.percent}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percent}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary relative"
                    >
                      <div className="absolute top-0 right-0 h-full w-[2px] bg-white glow-primary" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default function PortfolioPage() {
  const { scrollYProgress } = useScroll();
  const [copied, setCopied] = useState(false);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('techcarlosandre@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.location.href = "mailto:techcarlosandre@gmail.com";
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <CustomCursor />
      <div className="grain-overlay" />
      <Particles />
      <Navbar />

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />

      <section id="home" className="min-h-screen flex items-center pt-24 md:pt-20 relative overflow-hidden">
        <motion.div 
          style={{ 
            y: useSpring(useTransform(scrollYProgress, [0, 0.2], [0, -200]), { stiffness: 100, damping: 30 }),
            opacity: useTransform(scrollYProgress, [0, 0.15], [0.05, 0])
          }}
          className="absolute -bottom-20 -left-20 text-[15vw] md:text-[25vw] font-black leading-none stroke-text pointer-events-none whitespace-nowrap z-0 select-none"
        >
          CARLOS ANDRE
        </motion.div>

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <p className="text-primary font-black tracking-[0.4em] text-[10px] md:text-xs uppercase mb-8 flex items-center gap-4">
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[1px] bg-primary"
              ></motion.span>
              DESENVOLVEDOR FULL-STACK & ARQUITETO UI
            </p>
            <h1 className="text-5xl sm:text-8xl md:text-[130px] font-black uppercase leading-[0.85] tracking-tighter text-white mb-10">
              CONSTRUINDO <br />
              <span className="stroke-text">POTÊNCIAS</span> <br />
              DIGITAIS <br />
              <span className="text-primary glow-text-primary">MODERNAS</span>
            </h1>

            <p className="text-gray-400 text-sm md:text-xl max-w-xl mb-12 leading-relaxed">
              Desenvolvedor Full Stack com foco em tecnologias de alto desempenho. Dedico meus projetos ao ecossistema <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-8">Next.js, Python e IA</span>.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <Magnetic>
                <a href="#projetos">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white font-black px-10 py-5 uppercase text-xs tracking-[0.2em] glow-primary hover:bg-secondary transition-all flex items-center justify-center gap-3"
                  >
                    Ver Projetos <ChevronRight size={16} />
                  </motion.button>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contato">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-surface/30 backdrop-blur-md border border-white/10 text-white font-black px-10 py-5 uppercase text-xs tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    Contato
                  </motion.button>
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <div className="relative flex justify-center items-center py-10 md:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[2px] border-secondary/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-[1px] border-dashed border-primary/40 rounded-full"
              />

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  <Image
                    src="/portfolio-carlos/sua-logo-ca.png"
                    alt="Logo Oficial"
                    width={600}
                    height={600}
                    priority
                    unoptimized
                    className="logo-3d relative z-10 w-full h-full object-contain scale-150 mix-blend-screen"
                  />
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-0 right-10 bg-surface p-4 rounded-xl border border-primary/20 shadow-2xl">
                <Code className="text-primary" size={24} />
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} className="absolute bottom-10 left-0 bg-surface p-4 rounded-xl border border-primary/20 shadow-2xl">
                <Database className="text-primary" size={24} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-20 md:py-32 bg-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 md:order-1"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <p className="text-primary font-black text-sm uppercase tracking-widest mb-4">Conheça minha Jornada</p>
              <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 leading-none">Quem é o <br /> <span className="text-primary glow-text-primary">Carlos?</span></h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg md:text-xl">
                <p>
                  Sou um desenvolvedor apaixonado por tecnologia, focado em criar aplicações modernas e funcionais. Minha missão é entregar código de qualidade e uma experiência de usuário fluida em cada projeto.
                </p>
                <p>
                  Atualmente, focado em arquiteturas robustas unindo o ecossistema Javascript (Next.js/Node) com a versatilidade do Python e Inteligência Artificial, priorizando performance e escalabilidade.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center items-center order-1 md:order-2 mb-12 md:mb-0"
            >
              <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px]" />

              <div className="relative w-full max-w-[320px] md:max-w-[450px] aspect-[4/5] flex items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-transparent to-primary/5 border border-white/5 shadow-2xl">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src="/portfolio-carlos/eu.png"
                    alt="Carlos"
                    width={800}
                    height={1000}
                    priority
                    className="w-full h-full object-cover object-top drop-shadow-[0_20px_50px_rgba(128,0,0,0.5)]"
                  />
                </motion.div>
              </div>

              <motion.div
                animate={{ x: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-surface px-4 py-3 md:px-6 md:py-4 rounded-2xl border border-primary/20 shadow-2xl backdrop-blur-md z-20"
              >
                <p className="text-white font-black text-lg md:text-xl leading-none">CARLOS</p>
                <p className="text-primary text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Full-Stack Dev</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="habilidades" className="py-32 md:py-48 bg-black relative overflow-hidden">
        <motion.div 
          style={{ 
            x: useSpring(useTransform(scrollYProgress, [0.3, 0.5], [100, -100]), { stiffness: 100, damping: 30 }),
          }}
          className="absolute top-1/2 -translate-y-1/2 right-0 text-[30vw] font-black stroke-text opacity-[0.03] pointer-events-none select-none whitespace-nowrap"
        >
          MINHAS SKILLS
        </motion.div>

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-start relative z-10">
          <div className="sticky top-32">
            <p className="text-primary font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
              <span className="w-10 h-[1px] bg-primary"></span>
              Especialidades Técnicas
            </p>
            <h2 className="text-5xl md:text-[100px] font-black uppercase mb-10 leading-[0.9] tracking-tighter">
              Tecnologias <br /> 
              <span className="stroke-text">de</span> <span className="text-primary">Foco</span>
            </h2>
            <p className="text-gray-400 mb-12 leading-relaxed text-lg md:text-xl max-w-md">
              Utilizo as ferramentas mais atuais do mercado para desenvolver aplicações que equilibram performance no backend e uma experiência fluida no frontend.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Layout, label: "Frontend", techs: ["Next.js", "React", "Tailwind", "Typescript"] },
                { icon: Server, label: "Backend", techs: ["Node.js", "Python", "Flask", "Prisma"] },
                { icon: Database, label: "Database", techs: ["PostgreSQL", "Supabase", "Prisma"] },
                { icon: Code, label: "IA & Automação", techs: ["Gemini", "Automação", "IA Consulting"] }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial="initial"
                  whileHover="hover"
                  className="bg-surface/30 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer h-40 flex flex-col justify-center"
                >
                  <div className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <item.icon className="text-primary mb-4" size={28} />
                    <h4 className="font-black uppercase tracking-[0.2em] text-xs md:text-sm">{item.label}</h4>
                  </div>

                  <motion.div
                    variants={{
                      initial: { x: "100%" },
                      hover: { x: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute inset-0 bg-primary/90 backdrop-blur-xl p-6 flex flex-col justify-center z-20"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-3">Tecnologias:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.techs.map((tech, idx) => (
                        <span key={idx} className="text-[10px] md:text-xs font-black uppercase bg-black/30 px-3 py-1 rounded-full border border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative mt-20 md:mt-0">
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full" />
            <ScrollingSkills />
          </div>
        </div>
      </section>

      <section id="projetos" className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <p className="text-primary font-black text-sm uppercase tracking-widest mb-2">Portfolio</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase">Trabalhos <span className="text-primary">Recentes</span></h2>
            <div className="w-20 h-1 bg-primary mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Omni Gestão",
                tag: "ERP / Gestão",
                desc: "Plataforma completa para controle de estoque e fluxo de caixa, com relatórios inteligentes e gestão de unidades operacionais.",
                link: "https://omni-gestao-pro-six.vercel.app",
                github: "https://github.com/techcarlosandre/omni-gestao-vitrine",
                img: "/portfolio-carlos/omni-thumb.png"
              },
              {
                title: "Omni Finanças",
                tag: "Fintech / ERP / Management",
                desc: "Plataforma robusta de gestão financeira e controle de estoque, focada em automação de fluxo de caixa e integridade de dados operacionais.",
                link: "https://omni-financas.vercel.app",
                github: "https://github.com/techcarlosandre/omni-gestao",
                img: "/portfolio-carlos/omni-financas.png"
              },
              {
                title: "Rank&Hub",
                tag: "Gamificação & IA",
                desc: "Plataforma de analytics e gamificação com IA para gestão de performance e criação de rankings dinâmicos em tempo real.",
                link: "https://rankehub.vercel.app/",
                github: "https://github.com/techcarlosandre/Rank-Hub",
                img: "/portfolio-carlos/rankhub.png"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card rounded-3xl overflow-hidden group"
              >
                <div className="h-64 bg-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                  {project.img ? (
                    <Image
                      src={project.img}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : null}
                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="text-[10px] font-black uppercase bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full tracking-[0.1em]">{project.tag}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">
                    {project.desc}
                  </p>
                  <div className="flex gap-6">
                    <Magnetic>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 hover:text-white transition-colors"
                      >
                        {index === 0 ? 'Demo' : 'Abrir'} <ExternalLink size={14} />
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a
                        href={project.github}
                        className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
                      >
                        GitHub
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contato" className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div>
              <h2 className="text-5xl font-black uppercase mb-4 text-white">VAMOS <br /><span className="text-primary">CONSTRUIR</span>?</h2>
              <div className="flex gap-6 mt-8">
                <a
                  href="https://github.com/techcarlosandre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center hover:bg-primary hover:-translate-y-2 transition-all duration-300 border border-white/5 group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 transition-colors"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/devcarlosandre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center hover:bg-[#0077B5] hover:-translate-y-2 transition-all duration-300 border border-white/5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/21982665121?text=Olá Carlos, vi seu portfólio e gostaria de conversar sobre um projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center hover:bg-[#25D366] hover:-translate-y-2 transition-all duration-300 border border-white/5"
                >
                  <MessageCircle size={24} />
                </a>
              </div>
            </div>

            <div className="text-center md:text-right relative">
              <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mb-4">© 2026 Carlos Portfolio</p>
              <a
                href="mailto:techcarlosandre@gmail.com"
                onClick={handleCopyEmail}
                className="text-2xl md:text-4xl font-black text-primary hover:text-white transition-colors block"
              >
                techcarlosandre@gmail.com
              </a>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 right-0 md:right-0 left-0 md:left-auto text-green-500 font-bold text-xs uppercase tracking-widest"
                >
                  E-mail copiado!
                </motion.span>
              )}
              <div className="mt-8 flex items-center justify-center md:justify-end gap-2 text-primary font-bold uppercase text-xs tracking-widest leading-none">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Disponível para novos projetos
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
