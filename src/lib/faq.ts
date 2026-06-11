// Local FAQ library for matching user intent and responding instantly
// to reduce Gemini token usage.

export interface FAQResponse {
  reply: string;
  matched: boolean;
}

const FAQ_DATA_PT: Record<string, string> = {
  habilidades: `As principais habilidades técnicas do Carlos são:
- **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Python, Java, Spring Boot, Prisma, PostgreSQL, Supabase, Docker.
- **IA & Automação:** Google Gemini API, N8N, WhatsApp API, Instagram API.
- **Outros:** Git, GitHub, Vercel, Coolify, Figma.`,
  
  stack: `O Carlos trabalha principalmente com a stack:
- **Next.js & React** para interfaces web de alta performance.
- **TypeScript** para desenvolvimento robusto e type-safe.
- **PostgreSQL / Supabase** como banco de dados principal.
- **Python / Node.js** para automações de IA e serviços backend.`,
  
  tecnologias: `O Carlos utiliza um conjunto moderno de tecnologias: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL, Supabase, Python, Docker e N8N para automações inteligentes.`,
  
  contato: `Você pode entrar em contato com o Carlos de duas formas principais:
- **WhatsApp:** [Enviar Mensagem](https://api.whatsapp.com/send/?phone=21982665121&text=Olá+Carlos%2C+vi+seu+portfólio+e+gostaria+de+conversar+sobre+um+projeto) ou +55 (21) 98266-5121
- **Email:** techcarlosandre@gmail.com`,
  
  email: `O email profissional do Carlos é **techcarlosandre@gmail.com**. Sinta-se à vontade para enviar uma proposta ou mensagem!`,
  
  github: `Você pode conferir o perfil e repositórios do Carlos no GitHub: [github.com/techcarlosandre](https://github.com/techcarlosandre).`,
  
  linkedin: `Conecte-se com o Carlos no LinkedIn: [linkedin.com/in/devcarlosandre](https://www.linkedin.com/in/devcarlosandre/).`,
  
  experiencia: `A experiência profissional do Carlos inclui:
- **Freelancer Full-Stack** (2026 - Presente): Criação de plataformas completas e integrações de IA.
- **Omni Gestão** (2025 - 2026): Desenvolvimento de ERP completo para controle de estoque e fluxo de caixa.
- **Miluli (Especialista em Automação IA)** (2024 - 2026): Implementação de IA conversacional e automações, reduzindo tempo de atendimento em 80%.`,
  
  formacao: `Carlos está cursando **Sistemas de Informação** na Estácio (atualmente no 4º período). Ele também é autodidata em tecnologias modernas como Next.js, IA e integrações de APIs.`,
  
  localizacao: `O Carlos está localizado no **Rio de Janeiro, Brasil**, mas trabalha de forma totalmente remota para projetos em todo o mundo.`,
  
  projetos: `Os principais projetos do Carlos são:
1. **Omni Gestão** — ERP multi-unidade em Next.js e PostgreSQL.
2. **Omni Finanças** — Fintech pessoal com controle de metas integrado ao Supabase.
3. **Rank&Hub** — Analytics e gamificação com IA integrada ao Gemini.
4. **Automação IA WhatsApp/Instagram** — Robô de atendimento usando Python e N8N.
Para ver mais detalhes, role a página até a seção de Projetos!`
};

const FAQ_DATA_EN: Record<string, string> = {
  habilidades: `Carlos's main technical skills are:
- **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Python, Java, Spring Boot, Prisma, PostgreSQL, Supabase, Docker.
- **AI & Automation:** Google Gemini API, N8N, WhatsApp API, Instagram API.
- **Others:** Git, GitHub, Vercel, Coolify, Figma.`,
  
  stack: `Carlos mainly works with this stack:
- **Next.js & React** for high-performance web interfaces.
- **TypeScript** for robust and type-safe development.
- **PostgreSQL / Supabase** as the main database solution.
- **Python / Node.js** for AI automations and backend services.`,
  
  tecnologias: `Carlos uses a modern set of technologies: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, PostgreSQL, Supabase, Python, Docker, and N8N for smart integrations.`,
  
  contato: `You can contact Carlos via:
- **WhatsApp:** [Send Message](https://api.whatsapp.com/send/?phone=21982665121&text=Hi+Carlos%2C+I+saw+your+portfolio+and+would+like+to+talk+about+a+project) or +55 (21) 98266-5121
- **Email:** techcarlosandre@gmail.com`,
  
  email: `Carlos's professional email is **techcarlosandre@gmail.com**. Feel free to send a message or request a quote!`,
  
  github: `Check out Carlos's repositories on GitHub: [github.com/techcarlosandre](https://github.com/techcarlosandre).`,
  
  linkedin: `Connect with Carlos on LinkedIn: [linkedin.com/in/devcarlosandre](https://www.linkedin.com/in/devcarlosandre/).`,
  
  experiencia: `Carlos's professional experience includes:
- **Full-Stack Freelancer** (2026 - Present): Developing complete platforms and AI integrations.
- **Omni Gestão** (2025 - 2026): Building an ERP system for inventory and cash flow management.
- **Miluli (AI Automation Specialist)** (2024 - 2026): Implementing conversational AI and integrations, reducing customer service time by 80%.`,
  
  formacao: `Carlos is studying **Information Systems** at Estácio (currently in the 4th semester). He is also self-taught in modern technologies like Next.js, AI, and APIs.`,
  
  localizacao: `Carlos is based in **Rio de Janeiro, Brazil**, and works remotely for clients worldwide.`,
  
  projetos: `Carlos's main projects are:
1. **Omni Gestão** — Multi-unit ERP built with Next.js and PostgreSQL.
2. **Omni Finanças** — Personal financial manager integrated with Supabase.
3. **Rank&Hub** — Analytics and gamification platform using Gemini AI.
4. **WhatsApp/Instagram AI Automation** — Customer service agent using Python and N8N.
Scroll down to the Projects section to see them!`
};

// Simple keywords maps for intent detection
const INTENTS_MAP: Record<string, string[]> = {
  habilidades: ['habilidade', 'skills', 'skill', 'sabe fazer', 'conhece', 'domina', 'capacidade', 'knows'],
  stack: ['stack', 'arquitetura', 'linguagem', 'linguagens', 'programar'],
  tecnologias: ['tecnologia', 'tecnologias', 'ferramenta', 'ferramentas', 'framework', 'frameworks', 'library', 'biblioteca', 'technologies', 'tools'],
  contato: ['contato', 'telefone', 'celular', 'whatsapp', 'wpp', 'falar com', 'conversar', 'contact', 'phone'],
  email: ['email', 'e-mail', 'correio', 'mensagem'],
  github: ['github', 'git', 'repositorio', 'repositorios', 'code', 'codigo'],
  linkedin: ['linkedin', 'perfil profissional'],
  experiencia: ['experiencia', 'trabalho', 'emprego', 'tramp', 'historico', 'cargo', 'empresa', 'empresas', 'experience', 'jobs', 'work'],
  formacao: ['formacao', 'estudo', 'estudos', 'faculdade', 'curso', 'cursos', 'universidade', 'estacio', 'graduacao', 'education', 'college'],
  localizacao: ['localizacao', 'onde mora', 'onde vive', 'cidade', 'estado', 'rio', 'rj', 'brasil', 'location', 'live', 'lives'],
  projetos: ['projeto', 'projetos', 'portfolio', 'portfolios', 'trabalhos feitos', 'sistema', 'sistemas', 'projects', 'apps']
};

export function getFAQResponse(message: string, lang: 'pt' | 'en' = 'pt'): FAQResponse {
  const normalized = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [intent, keywords] of Object.entries(INTENTS_MAP)) {
    for (const keyword of keywords) {
      // Normalize keyword too
      const normKeyword = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const regex = new RegExp(`\\b${normKeyword}\\b`, 'i');
      if (regex.test(normalized) || normalized.includes(normKeyword)) {
        const reply = lang === 'en' ? FAQ_DATA_EN[intent] : FAQ_DATA_PT[intent];
        return { reply, matched: true };
      }
    }
  }
  
  return { reply: '', matched: false };
}
