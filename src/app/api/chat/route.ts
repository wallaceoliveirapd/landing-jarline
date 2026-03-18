import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

interface BriefingCampo {
  key: string;
  label: string;
  ordem: number;
  obrigatorio: boolean;
  opcoes?: string;
}

interface AiConfig {
  nomeArquiteta?: string;
  posicionamento?: string;
  tomVoz?: string;
  tone?: string;
  objetivoIA?: string;
  instrucoesGerais?: string;
  servicosOferecidos?: string;
  criteriosRecomendacao?: string;
  perguntasEssenciais?: string | string[];
  perguntasOpcionais?: string | string[];
  estruturaMensagem?: string;
  estruturaMensagemFinal?: string;
  textoEncerramento?: string;
  whatsappNumber?: string;
  whatsapp?: string;
  isActive?: boolean;
  regraPreservacao?: string;
  faz?: string;
  naoFaz?: string;
  allowMarkdown?: boolean;
  useEmojis?: boolean;
  initialGreeting?: string;
  exemplos?: { q: string; a: string }[];
  exemplosEntrada?: string[];
  exemplosSaida?: string[];
  camposBriefing?: BriefingCampo[];
}

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

type LLMCaller = (
  messages: { role: string; content: string }[],
  maxTokens: number
) => Promise<string>;

// ─────────────────────────────────────────────
// CONFIG PADRÃO — fallback mínimo de identidade
// Campos de briefing vêm exclusivamente do painel admin
// ─────────────────────────────────────────────

function getDefaultConfig(): AiConfig {
  return {
    nomeArquiteta: "Jarline Vieira",
    posicionamento: "Arquitetura e interiores de alto padrão",
    tomVoz: "amigável, profissional e acolhedor",
    naoFaz:
      "Nunca dar valores, preços ou estimativas — diga que a arquiteta precisa avaliar e enviar um orçamento personalizado",
    whatsappNumber: "5581999999999",
    whatsapp: "5581999999999",
    isActive: true,
    camposBriefing: [],
  };
}

// ─────────────────────────────────────────────
// LLM CALLER
// Tenta Groq primeiro (mais capaz), depois HuggingFace
// ─────────────────────────────────────────────

// Dois callers distintos: rápido (acks do briefing) e completo (off-topic)
interface LLMCallers {
  fast: LLMCaller;   // llama-3.1-8b-instant — barato, rápido, 20k TPM
  full: LLMCaller;   // llama-3.3-70b-versatile — mais capaz, para off-topic
}

function createGroqCaller(groqKey: string, model: string): LLMCaller {
  return async (messages, maxTokens) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.6 }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`Groq [${model}] error ${res.status}:`, err);
      throw new Error(`Groq ${res.status}`);
    }
    return (await res.json()).choices?.[0]?.message?.content?.trim() || "";
  };
}

function createHFCaller(hfKey: string): LLMCaller {
  return async (messages, maxTokens) => {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${hfKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages,
        max_tokens: maxTokens,
        temperature: 0.5,
        top_p: 0.9,
      }),
    });
    if (!res.ok) throw new Error(`HF ${res.status}: ${await res.text()}`);
    return (await res.json()).choices?.[0]?.message?.content?.trim() || "";
  };
}

function createLLMCallers(groqKey?: string, hfKey?: string): LLMCallers | null {
  if (groqKey) {
    return {
      fast: createGroqCaller(groqKey, "llama-3.1-8b-instant"),   // 20k TPM, ótimo para acks
      full: createGroqCaller(groqKey, "llama-3.3-70b-versatile"), // 12k TPM, para off-topic
    };
  }
  if (hfKey) {
    const hf = createHFCaller(hfKey);
    return { fast: hf, full: hf };
  }
  return null;
}

// ─────────────────────────────────────────────
// EXTRAÇÃO DETERMINÍSTICA DA MENSAGEM ATUAL
// ─────────────────────────────────────────────

function extractFromMessage(
  message: string,
  nextCampo: BriefingCampo | null
): { key: string; value: string } | null {
  if (!nextCampo || !message.trim()) return null;

  if (nextCampo.opcoes) {
    // Campo com opções: precisa bater com uma das opções
    const opcoes = nextCampo.opcoes.split(",").map((o) => o.trim());
    const msgLower = message.toLowerCase().trim();
    const match = opcoes.find((op) => {
      const opL = op.toLowerCase();
      return msgLower === opL || msgLower.includes(opL);
    });
    return match ? { key: nextCampo.key, value: match } : null;
  }

  // Campo de texto livre: qualquer mensagem com mais de 2 chars é a resposta
  if (message.trim().length > 2) {
    return { key: nextCampo.key, value: message.trim() };
  }

  return null;
}

// ─────────────────────────────────────────────
// PROMPT ENXUTO — para acks do briefing (≈300 tokens)
// Usa llama-3.1-8b-instant (20k TPM)
// ─────────────────────────────────────────────

function buildAckPrompt(
  cfg: AiConfig,
  nextCampo: BriefingCampo | null,
  isComplete: boolean,
  currentBriefing: Record<string, string> = {},
  campos: BriefingCampo[] = []
): string {
  const nome = cfg.nomeArquiteta || "Jarline Vieira";
  const tom = cfg.tone || cfg.tomVoz || "amigável e profissional";
  const useEmoji = cfg.useEmojis !== false;
  const useMarkdown = cfg.allowMarkdown !== false;

  const naoPreco = `Nunca mencione preços — diga que ${nome} vai avaliar e enviar orçamento personalizado.`;

  if (isComplete) {
    const enc = cfg.textoEncerramento || `${nome} tem tudo que precisa para enviar um orçamento personalizado!`;

    // Monta o briefing coletado para o AI organizar
    const sorted = [...campos].sort((a, b) => a.ordem - b.ordem);
    const briefingStr = sorted
      .filter((c) => currentBriefing[c.key])
      .map((c) => `- ${c.label.replace(/[?!]$/, "")}: ${currentBriefing[c.key]}`)
      .join("\n");

    return `Você é Jal, assistente de ${nome}. Tom: ${tom}.
O briefing do cliente foi concluído. Dados coletados:
${briefingStr}

Sua resposta deve:
1. Fazer um breve resumo organizado do que o cliente precisa (2-3 frases, use as informações acima de forma natural e detalhada — não apenas repita, elabore o projeto deles)
2. Encerrar com: "${enc}"

Regras: português, máximo 4 frases no total, ${useEmoji ? "pode usar emojis relevantes" : "sem emoji"}, ${useMarkdown ? "pode usar **negrito** para destacar" : "sem markdown"}, sem perguntas, NÃO mencione botão, link ou WhatsApp na resposta — isso é tratado automaticamente.`;
  }

  const nextQ = nextCampo?.label || "Como posso ajudar?";
  const opcoes = nextCampo?.opcoes ? ` (opções: ${nextCampo.opcoes})` : "";

  return `Você é Jal, assistente de ${nome}. Tom: ${tom}.
${cfg.naoFaz ? cfg.naoFaz.split("\n")[0] : naoPreco}
O cliente acabou de responder. Confirme brevemente (1 frase natural) e pergunte: "${nextQ}"${opcoes}.
Regras: português, máximo 2 frases, ${useEmoji ? "1 emoji relevante" : "sem emoji"}, ${useMarkdown ? "pode usar **negrito**" : "sem markdown"}, sem cabeçalhos.`;
}

// ─────────────────────────────────────────────
// PROMPT COMPLETO — para off-topic e perguntas gerais
// Usa llama-3.3-70b-versatile (12k TPM)
// ─────────────────────────────────────────────

function buildSystemPrompt(
  cfg: AiConfig,
  currentBriefing: Record<string, string>,
  nextCampo: BriefingCampo | null,
  isComplete: boolean,
  campos: BriefingCampo[]
): string {
  const nome = cfg.nomeArquiteta || "Jarline Vieira";
  const tom = cfg.tone || cfg.tomVoz || "amigável, profissional e acolhedor";
  const useEmoji = cfg.useEmojis !== false;
  const useMarkdown = cfg.allowMarkdown !== false;

  const toList = (val?: string | string[]) => {
    if (!val) return "";
    const arr = Array.isArray(val)
      ? val
      : val.split(/\n|;/).map((s) => s.trim()).filter(Boolean);
    return arr.map((s) => `- ${s}`).join("\n");
  };

  const parts: string[] = [];

  // ── Identidade ───────────────────────────────────────────────
  parts.push(
    [
      `Você é Jal, assistente virtual da arquiteta ${nome}.`,
      `Tom de voz: ${tom}.`,
      cfg.posicionamento ? `Especialidade: ${cfg.posicionamento}.` : "",
      cfg.objetivoIA ? `Objetivo: ${cfg.objetivoIA}.` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  if (cfg.instrucoesGerais) {
    parts.push(`INSTRUÇÕES GERAIS:\n${cfg.instrucoesGerais}`);
  }

  if (cfg.servicosOferecidos) {
    parts.push(`SERVIÇOS OFERECIDOS:\n${cfg.servicosOferecidos}`);
  }

  if (cfg.criteriosRecomendacao) {
    parts.push(`CRITÉRIOS DE RECOMENDAÇÃO:\n${cfg.criteriosRecomendacao}`);
  }

  if (cfg.faz) {
    parts.push(`O QUE VOCÊ DEVE FAZER:\n${cfg.faz}`);
  }

  const naoFazDefault = `- Nunca dar preços, valores ou estimativas de custo
- Dizer sempre que ${nome} precisa avaliar o projeto para enviar um orçamento personalizado
- Não repetir perguntas já respondidas
- Não fazer mais de uma pergunta por vez`;

  parts.push(`O QUE VOCÊ NÃO DEVE FAZER:\n${cfg.naoFaz || naoFazDefault}`);

  if (cfg.regraPreservacao) {
    parts.push(`REGRA DE PRESERVAÇÃO DE DADOS:\n${cfg.regraPreservacao}`);
  }

  const pergEss = toList(cfg.perguntasEssenciais);
  if (pergEss) parts.push(`PERGUNTAS ESSENCIAIS (use após o briefing básico):\n${pergEss}`);

  const pergOpc = toList(cfg.perguntasOpcionais);
  if (pergOpc) parts.push(`PERGUNTAS OPCIONAIS:\n${pergOpc}`);

  if (cfg.exemplos && cfg.exemplos.length > 0) {
    const exs = cfg.exemplos
      .map((e) => `Cliente: "${e.q}"\nJal: "${e.a}"`)
      .join("\n\n");
    parts.push(`EXEMPLOS DE REFERÊNCIA — siga este tom e estilo:\n${exs}`);
  }

  // ── Estado atual do briefing ─────────────────────────────────
  const coletados = campos.filter((c) => currentBriefing[c.key]);
  const coletadosStr = coletados.length > 0
    ? coletados.map((c) => `  ✓ ${c.label.replace(/[?!]$/, "")}: "${currentBriefing[c.key]}"`).join("\n")
    : "  (nenhum ainda)";

  parts.push(`ESTADO DO BRIEFING:\nJá coletados (NÃO PERGUNTE NOVAMENTE):\n${coletadosStr}`);

  // ── Instrução de ação ────────────────────────────────────────
  if (isComplete) {
    const encerramento =
      cfg.textoEncerramento ||
      `Perfeito! Agora ${nome} tem tudo que precisa para enviar um orçamento personalizado.`;
    parts.push(
      `BRIEFING COMPLETO:\nTodos os dados foram coletados. Sua resposta deve:\n1. Agradecer brevemente ao cliente\n2. Dizer: "${encerramento}"\n3. Pedir para clicar no botão do WhatsApp\nNÃO FAÇA MAIS PERGUNTAS.`
    );
  } else if (nextCampo) {
    const opcoesStr = nextCampo.opcoes
      ? `\n   Opções disponíveis: ${nextCampo.opcoes}`
      : "";
    parts.push(
      `PRÓXIMA AÇÃO — OBRIGATÓRIA:\nFaça SOMENTE esta pergunta, de forma natural:\n"${nextCampo.label}"${opcoesStr}\nNão faça outras perguntas. Aguarde a resposta antes de avançar.`
    );
  }

  // ── Regras de comunicação ────────────────────────────────────
  const commRules = [
    "Responda SEMPRE em português do Brasil",
    "Seja concisa — máximo 2-3 frases no total",
    useEmoji
      ? "Use 1 emoji relevante por resposta, com moderação"
      : "Não use emojis",
    useMarkdown
      ? "Você pode usar **negrito** para destacar pontos importantes"
      : "Escreva em texto simples — sem asteriscos, underlines ou qualquer formatação markdown",
    "Nunca use cabeçalhos (##, ###)",
    "Nunca repita literalmente o que o cliente disse",
  ];
  parts.push(`REGRAS DE COMUNICAÇÃO:\n${commRules.map((r) => `- ${r}`).join("\n")}`);

  return parts.join("\n\n");
}

// ─────────────────────────────────────────────
// GERAR CONTEXTO DO PROJETO (para o WhatsApp)
// Produz um parágrafo organizado em 3ª pessoa
// ─────────────────────────────────────────────

async function generateProjectContext(
  briefing: Record<string, string>,
  campos: BriefingCampo[],
  cfg: AiConfig,
  llm: LLMCallers
): Promise<string> {
  const sorted = [...campos].sort((a, b) => a.ordem - b.ordem);
  const briefingStr = sorted
    .filter((c) => briefing[c.key])
    .map((c) => `${c.label.replace(/[?!]$/, "")}: ${briefing[c.key]}`)
    .join("\n");

  const nome = cfg.nomeArquiteta || "a arquiteta";
  const servicos = cfg.servicosOferecidos ? `\nServiços oferecidos: ${cfg.servicosOferecidos}` : "";

  const prompt = `Você é um assistente de briefing de arquitetura trabalhando para ${nome}. Com base nos dados abaixo, escreva UM parágrafo (3-4 frases) em terceira pessoa descrevendo o projeto do cliente de forma organizada e profissional. Elabore o contexto, conecte as informações e deixe claro o que o cliente precisa. Escreva direto o parágrafo, sem título nem introdução.${servicos}

Dados do projeto:
${briefingStr}`;

  try {
    const result = await llm.fast(
      [{ role: "user", content: prompt }],
      200
    );
    return result || briefing.detalhes || "";
  } catch {
    return briefing.detalhes || "";
  }
}

// ─────────────────────────────────────────────
// STRIP MARKDOWN
// ─────────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

// ─────────────────────────────────────────────
// FALLBACK DETERMINÍSTICO (sem LLM)
// ─────────────────────────────────────────────

function deterministicResponse(
  nextCampo: BriefingCampo | null,
  isComplete: boolean,
  cfg: AiConfig,
  captured: boolean
): string {
  const useEmoji = cfg.useEmojis !== false;

  if (isComplete) {
    const enc =
      cfg.textoEncerramento ||
      `Agora ${cfg.nomeArquiteta || "Jarline"} tem tudo que precisa para enviar um orçamento personalizado.`;
    return `${useEmoji ? "🎉 " : ""}${enc}`;
  }

  const ack = captured ? (useEmoji ? "✅ Anotado! " : "Anotado! ") : "";
  return nextCampo ? `${ack}${nextCampo.label}` : `${ack}Como posso ajudar?`;
}

// ─────────────────────────────────────────────
// WHATSAPP LINK
// ─────────────────────────────────────────────

function buildWhatsappLink(
  phone: string,
  briefing: Record<string, string>,
  campos: BriefingCampo[],
  cfg: AiConfig
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const estrutura = cfg.estruturaMensagem || cfg.estruturaMensagemFinal;
  // Só usa o template se contiver marcadores {{key}}
  const hasValidTemplate = !!estrutura && /\{\{[^}]+\}\}/.test(estrutura);

  let msg: string;
  if (hasValidTemplate) {
    msg = estrutura!;
    // 1) Substitui pelos campos configurados
    for (const campo of campos) {
      msg = msg.replace(
        new RegExp(`\\{\\{${campo.key}\\}\\}`, "g"),
        briefing[campo.key] || ""
      );
    }
    // 2) Substitui quaisquer {{key}} restantes direto do briefing
    //    (chaves no template que não estão nos campos configurados)
    msg = msg.replace(/\{\{(\w+)\}\}/g, (_match, key) =>
      briefing[key] !== undefined ? briefing[key] : ""
    );
    // 3) Remove linhas onde o valor ficou vazio após substituição
    msg = msg.replace(/^[^\n]*:\*?\s*\n/gm, "\n");
    // 4) Remove linhas com placeholders não substituídos
    msg = msg.replace(/^.*\{\{[^}]+\}\}.*\n?/gm, "");
    // 5) Limpa linhas em branco extras
    msg = msg.replace(/\n{3,}/g, "\n\n").trim();
  } else {
    const emojis: Record<string, string> = {
      tipoProjeto: "🏠", tipoObra: "🔨", tamanho: "📐", orcamento: "💰",
      ambientes: "🚪", estilo: "🎨", nome: "👤", localizacao: "📍", detalhes: "📝",
    };
    const sorted = [...campos].sort((a, b) => a.ordem - b.ordem);
    msg = `Olá! Vim pelo site e tenho interesse nos serviços de arquitetura.\n\n*BRIEFING DO PROJETO*\n─────────────────────\n`;
    for (const campo of sorted) {
      if (!briefing[campo.key] || campo.key === "detalhes") continue;
      msg += `${emojis[campo.key] || "📝"} *${campo.label.replace(/[?!]$/, "")}*: ${briefing[campo.key]}\n`;
    }
    if (briefing.detalhes) {
      msg += `\n📝 *Sobre o projeto*:\n${briefing.detalhes}\n`;
    }
    msg += `\nGostaria de conversar sobre este projeto!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function isBriefingComplete(
  briefing: Record<string, string>,
  campos: BriefingCampo[]
): boolean {
  const obrigatorios = campos.filter((c) => c.obrigatorio);
  return (
    obrigatorios.length > 0 &&
    obrigatorios.every((c) => !!briefing[c.key]?.trim())
  );
}

function detectWhatsAppIntent(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("whatsapp") ||
    lower.includes("falar com ela") ||
    lower.includes("falar com a jarline") ||
    lower.includes("falar com a arquiteta") ||
    (lower.includes("sim") && lower.includes("enviar"))
  );
}

// ─────────────────────────────────────────────
// HANDLER PRINCIPAL
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      message,
      history = [],
      config,
      briefing: clientBriefing = {},
    } = body as {
      message: string;
      history: HistoryMessage[];
      config?: AiConfig;
      briefing?: Record<string, string>;
    };

    const cfg: AiConfig =
      config && Object.keys(config).length > 0
        ? { ...getDefaultConfig(), ...config }
        : getDefaultConfig();

    const campos = cfg.camposBriefing ?? [];
    const sortedCampos = [...campos].sort((a, b) => a.ordem - b.ordem);

    if (campos.length === 0) {
      return NextResponse.json({
        response:
          "Configure os campos de briefing no painel de administração para ativar o chat.",
        briefing: {},
      });
    }

    const phone = cfg.whatsappNumber || cfg.whatsapp || "5581999999999";
    const llm = createLLMCallers(
      process.env.GROQ_API_KEY,
      process.env.HUGGINGFACE_API_KEY
    );

    // ── Saudação inicial ──────────────────────────────────────────
    if (!message) {
      const primeiroCampo = sortedCampos.find((c) => c.obrigatorio);
      let greeting = cfg.initialGreeting;
      if (!greeting) {
        greeting = `Olá! 👋 Sou a Jal, assistente virtual${cfg.nomeArquiteta ? ` da ${cfg.nomeArquiteta}` : ""}.\n\n`;
        greeting +=
          primeiroCampo?.label || "Que tipo de projeto você está pensando?";
        if (primeiroCampo?.opcoes)
          greeting += `\n\nOpções: ${primeiroCampo.opcoes}`;
      }
      return NextResponse.json({ response: greeting, briefing: {} });
    }

    // ── Detectar intenção de ir ao WhatsApp ──────────────────────
    if (detectWhatsAppIntent(message)) {
      return NextResponse.json({
        response: `Ótimo! Clique no botão abaixo para falar diretamente com a ${cfg.nomeArquiteta || "Jarline"} no WhatsApp. 🚀`,
        whatsappLink: buildWhatsappLink(phone, clientBriefing, campos, cfg),
        briefing: clientBriefing,
        isComplete: true,
      });
    }

    // ── Estado do briefing (acumulado no cliente) ─────────────────
    let currentBriefing: Record<string, string> = { ...clientBriefing };

    // ── Próximo campo ANTES de processar a mensagem atual ─────────
    const pendentesAntes = sortedCampos.filter(
      (c) => c.obrigatorio && !currentBriefing[c.key]
    );
    const nextCampoEsperado =
      pendentesAntes[0] ||
      sortedCampos.find((c) => !c.obrigatorio && !currentBriefing[c.key]) ||
      null;

    // ── Extração determinística ───────────────────────────────────
    const extracted = extractFromMessage(message, nextCampoEsperado);
    if (extracted) {
      currentBriefing = { ...currentBriefing, [extracted.key]: extracted.value };
    }

    const isComplete = isBriefingComplete(currentBriefing, campos);

    // ── Próximo campo APÓS extração ───────────────────────────────
    const pendentesPos = sortedCampos.filter(
      (c) => c.obrigatorio && !currentBriefing[c.key]
    );
    const nextCampo =
      pendentesPos[0] ||
      sortedCampos.find((c) => !c.obrigatorio && !currentBriefing[c.key]) ||
      null;

    // ── Detectar se é pergunta fora do escopo ────────────────────
    const msgLower = message.toLowerCase().trim();
    const isOffTopic =
      msgLower.length > 30 &&
      ["?", "quanto custa", "como funciona", "o que é", "me fala", "me conta sobre", "quero saber"].some(
        (kw) => msgLower.includes(kw)
      ) &&
      !nextCampoEsperado?.opcoes?.split(",").some((op) => msgLower.includes(op.trim().toLowerCase()));

    // ── Gerar resposta via LLM ────────────────────────────────────
    let aiResponse: string;

    if (llm) {
      try {
        let reply: string;

        if (isComplete) {
          // Encerramento: resumo do projeto + botão WhatsApp, modelo rápido
          const ackPrompt = buildAckPrompt(cfg, null, true, currentBriefing, sortedCampos);
          reply = await llm.fast(
            [
              { role: "system", content: ackPrompt },
              { role: "user", content: message },
            ],
            200
          );
        } else if (isOffTopic) {
          // Off-topic: usa modelo 70B com prompt completo
          const systemPrompt = buildSystemPrompt(cfg, currentBriefing, nextCampo, false, sortedCampos);
          reply = await llm.full(
            [
              { role: "system", content: systemPrompt },
              ...history.slice(-4).map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: message },
            ],
            200
          );
        } else {
          // Briefing normal: usa modelo 8B rápido com prompt enxuto
          const ackPrompt = buildAckPrompt(cfg, nextCampo, false, currentBriefing, sortedCampos);
          reply = await llm.fast(
            [
              { role: "system", content: ackPrompt },
              ...history.slice(-2).map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: message },
            ],
            120
          );
        }

        if (cfg.allowMarkdown === false) reply = stripMarkdown(reply);
        aiResponse = reply;
      } catch (e) {
        console.error("LLM call failed:", e);
        aiResponse = deterministicResponse(nextCampo, isComplete, cfg, !!extracted);
      }
    } else {
      aiResponse = deterministicResponse(nextCampo, isComplete, cfg, !!extracted);
    }

    // ── WhatsApp link se briefing completo ────────────────────────
    // Quando completo, gera contexto organizado via IA para substituir o texto bruto do detalhes
    let briefingForWhatsapp = currentBriefing;
    if (isComplete && llm) {
      const contextoGerado = await generateProjectContext(currentBriefing, sortedCampos, cfg, llm);
      if (contextoGerado) {
        briefingForWhatsapp = { ...currentBriefing, detalhes: contextoGerado };
      }
    }

    const whatsappLink = isComplete
      ? buildWhatsappLink(phone, briefingForWhatsapp, campos, cfg)
      : "";

    // ── Opções do próximo campo ───────────────────────────────────
    const responseOptions =
      !isComplete && nextCampo?.opcoes
        ? nextCampo.opcoes.split(",").map((o) => o.trim())
        : null;

    return NextResponse.json({
      response: aiResponse,
      success: true,
      briefing: currentBriefing,
      isComplete,
      whatsappLink: whatsappLink || undefined,
      options: responseOptions,
      nextCampo: nextCampo || null,
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json({
      response: "Tive um problema técnico. Que tipo de projeto você está pensando?",
      success: false,
    });
  }
}
