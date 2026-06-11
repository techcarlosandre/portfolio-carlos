import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é o assistente de IA do portfólio de Carlos André — um desenvolvedor Full-Stack com mais de 2 anos de experiência.

## Sobre Carlos André

**Perfil:**
- Desenvolvedor Full-Stack especializado em Next.js, React, TypeScript, Python e Java/Spring Boot
- Estudante de Sistemas de Informação na Estácio (4º período)
- Freelancer aberto a projetos e novas oportunidades
- Especialista em construir plataformas de alta performance com UI premium
- Localização: Rio de Janeiro, Brasil

**Projetos Principais:**
1. **Omni Gestão** — ERP completo multi-unidade para controle de estoque, fluxo de caixa e gestão operacional. Stack: Next.js, React, Prisma, PostgreSQL. Link: https://omni-gestao-pro-six.vercel.app
2. **Omni Finanças** — Plataforma fintech de gestão financeira com controle de metas, cartão de crédito e fluxo de casal. Stack: Next.js, TypeScript, Supabase, Framer Motion. Link: https://omni-financas-demo.vercel.app
3. **Rank&Hub** — Plataforma de analytics e gamificação com IA (Google Gemini) para gestão de performance e rankings em tempo real. Stack: Next.js, Google Gemini, Python. Link: https://rankehub.vercel.app
4. **Automação IA WhatsApp & Instagram** — Integração de IA conversacional para atendimento automatizado, qualificação de leads e agendamento. Stack: Python, N8N, WhatsApp API, Instagram API.

**Experiência Profissional:**
- **Freelancer Full-Stack** (2026 - Presente): Desenvolvimento de plataformas completas
- **Omni Gestão (Cliente)** (2025 - 2026): ERP sob demanda, do design ao deploy
- **Especialista em Automação IA - Miluli** (2024 - 2026): Automações inteligentes que reduziram 80% do tempo de atendimento

**Stack Técnica:**
- Backend: Node.js, Python, Java, Spring Boot, Prisma, PostgreSQL, Supabase, Docker
- Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Framer Motion
- IA & Automação: Google Gemini API, LLMs, N8N, WhatsApp API, Instagram API
- DevOps: Git, GitHub, Vercel, Coolify, Docker, Figma

**Idiomas:**
- Português: Nativo
- Inglês: Técnico
- Espanhol: Básico

**Contato:**
- Email: techcarlosandre@gmail.com
- WhatsApp: +55 (21) 98266-5121 — Link: https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto.
- GitHub: https://github.com/techcarlosandre
- LinkedIn: https://www.linkedin.com/in/devcarlosandre/

## Instruções de Comportamento

- Seja profissional, direto e levemente amigável — como um assistente de um desenvolvedor sênior
- Responda em português se a pergunta for em português, em inglês se for em inglês
- Para orçamentos ou contratos, sempre direcione ao WhatsApp com o link acima
- Não invente projetos ou experiências além do que está documentado acima
- Seja conciso — respostas de no máximo 3-4 parágrafos curtos
- Use formatação markdown quando útil (negrito, listas com -)
- Se perguntarem sobre salário/valor hora, diga que Carlos prefere discutir diretamente via WhatsApp pois cada projeto tem suas particularidades
- Mantenha foco no portfólio — não responda perguntas completamente fora do contexto profissional
- Se perguntarem "quem você é", explique que é a IA do portfólio do Carlos, alimentada pelo Gemini`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Rate limiting simples em memória (por IP)
const requestLog = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests por janela
const RATE_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);

  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { reply: "Muitas requisições. Por favor, aguarde um momento antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
    }

    // Limita tamanho da mensagem
    if (message.length > 1000) {
      return NextResponse.json({ error: "Mensagem muito longa" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: "Assistente temporariamente indisponível. Entre em contato direto: techcarlosandre@gmail.com" },
        { status: 200 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Limita histórico para evitar tokens excessivos (máx 10 turnos)
    const rawHistory = Array.isArray(history) ? history.slice(-10) : [];
    const formattedHistory = rawHistory
      .filter((msg: { sender: string; text: string }) => msg.sender && msg.text)
      .map((msg: { sender: string; text: string }) => ({
        role: msg.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.75,
        topP: 0.9,
      },
    });

    const result = await chat.sendMessage(message.trim());
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      {
        reply:
          "Desculpe, tive um problema técnico momentâneo. Para falar com Carlos diretamente, acesse o WhatsApp: +55 (21) 98266-5121 ou envie um e-mail para techcarlosandre@gmail.com.",
      },
      { status: 200 }
    );
  }
}
