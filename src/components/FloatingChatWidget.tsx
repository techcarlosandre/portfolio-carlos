"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
import Image from "next/image";

interface FloatingChatWidgetProps {
  t: any;
  lang: string;
  theme: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ t, lang, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when chat is opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: "1", sender: "bot", text: t.chat.welcome }]);
    }
  }, [messages.length, t.chat.welcome]);

  // Show greeting bubble after 4 seconds if not open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowGreeting(true);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isOpen]);

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

    const cleanText = text.trim().toLowerCase();
    let localReply = "";

    const isProjectsMsg = cleanText === t.chat.msgProjects.toLowerCase() || cleanText.includes("principais projetos") || cleanText.includes("projetos");
    const isAiMsg = cleanText === t.chat.msgAi.toLowerCase() || cleanText.includes("automações de ia") || cleanText.includes("automacoes de ia");
    const isQuoteMsg = cleanText === t.chat.msgQuote.toLowerCase() || cleanText.includes("orçamento") || cleanText.includes("orcamento");
    const isSkillsMsg = cleanText === t.chat.msgSkills.toLowerCase() || cleanText.includes("habilidades") || cleanText.includes("tecnologias");

    if (isProjectsMsg) {
      localReply = lang === "pt"
        ? "O Carlos desenvolve projetos Web (ex: Sushi House, Horizonte SaaS, Barber+) e Mobile nativo (ex: FitGym com Flutter). Qual você quer explorar?"
        : "Carlos builds premium Web projects (e.g. Sushi House, Horizonte SaaS, Barber+) and native Mobile apps (e.g. FitGym with Flutter). Which one would you like to explore?";
    } else if (isAiMsg) {
      localReply = lang === "pt"
        ? "Ele cria fluxos inteligentes no N8N com WhatsApp Cloud API e modelos GPT/Gemini para automatizar vendas e atendimentos."
        : "He creates smart workflows in N8N with WhatsApp Cloud API and GPT/Gemini models to automate sales and support.";
    } else if (isQuoteMsg) {
      localReply = lang === "pt"
        ? "Fale diretamente pelo WhatsApp: [Falar no WhatsApp](https://api.whatsapp.com/send/?phone=21982665121%26text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+um+orçamento.) ou e-mail **techcarlosandre@gmail.com**!"
        : "Speak directly on WhatsApp: [Chat on WhatsApp](https://api.whatsapp.com/send/?phone=21982665121%26text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+um+orçamento.) or email **techcarlosandre@gmail.com**!";
    } else if (isSkillsMsg) {
      localReply = lang === "pt"
        ? "As principais tecnologias usadas são: React, Next.js, Node.js, Flutter, Java Spring Boot, N8N, Docker e PostgreSQL."
        : "Main technologies used: React, Next.js, Node.js, Flutter, Java Spring Boot, N8N, Docker, and PostgreSQL.";
    }

    if (localReply) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMessages((p) => [...p, { id: Date.now().toString(), sender: "bot", text: localReply }]);
      setIsTyping(false);
      return;
    }

    // Call API route
    try {
      const history = messages
        .filter((m) => m.id !== "1")
        .map((m) => ({ sender: m.sender, text: m.text }));
 
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      
      if (res.status === 429) {
        const data = await res.json();
        setMessages((p) => [
          ...p,
          { 
            id: Date.now().toString(), 
            sender: "bot", 
            text: data.reply || (lang === "pt" ? "Muitas mensagens enviadas. Por favor, aguarde um instante." : "Too many messages. Please wait a moment.") 
          },
        ]);
        setIsTyping(false);
        return;
      }

      const data = await res.json();
      const reply = data.reply || t.chat.replyDefault;
 
      setMessages((p) => [...p, { id: Date.now().toString(), sender: "bot", text: reply }]);
    } catch {
      setMessages((p) => [
        ...p,
        { id: Date.now().toString(), sender: "bot", text: t.chat.error },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, messages, t.chat.replyDefault, t.chat.error, lang]);

  const quickBtns = [
    { label: "🚀 " + t.chat.btnProjects, msg: t.chat.msgProjects },
    { label: "🤖 " + t.chat.btnAi, msg: t.chat.msgAi },
    { label: "💼 " + t.chat.btnQuote, msg: t.chat.msgQuote },
    { label: "🛠️ " + t.chat.btnSkills, msg: t.chat.msgSkills },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9990] flex flex-col items-end max-w-[calc(100vw-32px)]">
      {/* Mini Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-[calc(100vw-32px)] sm:w-[310px] h-[calc(100vh-120px)] sm:h-[460px] max-h-[500px] bg-[#0c0c0d]/90 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between mb-4 relative"
          >
            {/* Header */}
            <div className="bg-zinc-950/60 px-4 py-3 border-b border-zinc-800/80 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative w-7 h-7 rounded-full border border-primary/40 overflow-hidden bg-primary/10 flex items-center justify-center">
                  <Image src="/eu.webp" alt="Carlos André" fill className="object-cover object-top" unoptimized />
                </div>
                <div>
                  <h4 className="font-black text-[9px] uppercase tracking-wider text-white">{t.chat.assistantName}</h4>
                  <div className="flex items-center gap-1 text-[7px] font-bold text-green-500 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Online · Gemini
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 chat-scrollbar bg-bg/5"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-[10px] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800 text-white rounded-tl-none"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none px-3 py-2 flex gap-1 items-center">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Input Form */}
            <div className="bg-zinc-950/40 border-t border-zinc-800/80">
              <div className="p-2 flex flex-wrap gap-1 justify-center max-h-[80px] overflow-y-auto chat-scrollbar">
                {quickBtns.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleSend(btn.msg)}
                    disabled={isTyping}
                    className="text-[6.5px] font-bold uppercase tracking-wider bg-zinc-900/60 hover:bg-primary/10 border border-zinc-850 hover:border-primary/30 px-2 py-1.5 rounded-full transition-all text-zinc-450 hover:text-primary cursor-pointer disabled:opacity-50"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="p-2 border-t border-zinc-800/80 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chat.placeholder}
                  disabled={isTyping}
                  className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[9px] focus:outline-none focus:border-primary/40 transition-colors text-white disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="bg-primary hover:bg-accent disabled:opacity-50 text-white px-2.5 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send size={10} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting Speech Bubble */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-3 mr-1 bg-zinc-950/90 border border-zinc-800 p-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-[240px]"
          >
            <div className="flex-1 text-[10px] text-white leading-tight font-medium">
              {lang === "pt" ? "Olá! Dúvidas sobre meus projetos? Fale comigo!" : "Hi! Questions about my work? Let's chat!"}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
              }}
              className="text-zinc-500 hover:text-white p-0.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowGreeting(false);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-lg cursor-pointer hover:shadow-primary/30 z-[9991] relative"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {/* Pulsing indicator when closed */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 border border-zinc-950">
            <span className="w-full h-full rounded-full bg-green-500 animate-ping absolute top-0 left-0" />
          </span>
        )}
      </motion.button>
    </div>
  );
};
