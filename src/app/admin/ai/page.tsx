"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Save, Bot, Sparkles, MessageSquare, ShieldCheck, Zap, Send, FileText, Trash2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BriefingCampo = {
  key: string;
  label: string;
  ordem: number;
  obrigatorio: boolean;
  opcoes: string;
};

type AIConfig = {
  nomeArquiteta: string;
  posicionamento: string;
  tomVoz: string;
  tone: string;
  objetivoIA: string;
  instrucoesGerais: string;
  faz: string;
  naoFaz: string;
  servicosOferecidos: string;
  criteriosRecomendacao: string;
  perguntasEssenciais: string;
  perguntasOpcionais: string;
  estruturaMensagem: string;
  textoEncerramento: string;
  whatsapp: string;
  regraPreservacao: string;
  exemplos: { q: string; a: string }[];
  allowMarkdown: boolean;
  useEmojis: boolean;
  initialGreeting: string;
  camposBriefing: BriefingCampo[];
  [key: string]: unknown;
};

const defaultConfig: AIConfig = {
  nomeArquiteta: "Jarline Vieira",
  posicionamento: "Arquitetura de luxo, minimalista e autoral.",
  tomVoz: "Profissional",
  tone: "Profissional, acolhedor e técnico na medida certa.",
  objetivoIA: "Atender leads, qualificar o interesse e encaminhar para o WhatsApp com um resumo estruturado.",
  instrucoesGerais: "Aja como Jal, uma assistente virtual inteligente e proativa.",
  faz: "Responde dúvidas sobre o processo criativo; Sugere serviços com base na necessidade; Coleta dados de contato.",
  naoFaz: "Não dá orçamentos fechados; Não inventa prazos; Não fala sobre outros profissionais.",
  servicosOferecidos: "Projeto Arquitetônico, Design de Interiores, Consultoria Online.",
  criteriosRecomendacao: "Se o cliente quer construir do zero -> Projeto Arquitetônico. Se quer reforma um cômodo -> Interiores.",
  perguntasEssenciais: "Nome, Cidade, Tipo de Imóvel, Metragem estimada.",
  perguntasOpcionais: "Estilo de decoração preferido, Prazo desejado.",
  estruturaMensagem: "Olá! Vim pelo site e tenho interesse nos serviços de arquitetura.\n\n*BRIEFING DO PROJETO*\n─────────────────────\n👤 *Nome*: {{nome}}\n📍 *Cidade/Estado*: {{localizacao}}\n🏠 *Tipo de Projeto*: {{tipoProjeto}}\n🔨 *Tipo de Obra*: {{tipoObra}}\n\n📝 *Sobre o projeto*:\n{{detalhes}}\n\nGostaria de conversar sobre este projeto!",
  textoEncerramento: "Perfeito! Agora a Jarline tem tudo que precisa para te enviar um orçamento personalizado.",
  whatsapp: "+55 (XX) XXXXX-XXXX",
  regraPreservacao: "Nunca omita detalhes técnicos que o cliente mencionou.",
  exemplos: [
    { q: "Gostaria de saber como funciona seu projeto de interiores.", a: "Olá! Que prazer. O projeto de interiores da Jarline funciona em 4 etapas..." }
  ],
  allowMarkdown: true,
  useEmojis: true,
  initialGreeting: "Olá! Sou Jal, inteligência da Jarline Vieira. Como posso transformar seu espaço hoje?",
  camposBriefing: [
    { key: "tipoProjeto", label: "Qual é o tipo de projeto?", ordem: 1, obrigatorio: true, opcoes: "Casa, Apartamento, Escritório, Loft, Studio, Outro" },
    { key: "tipoObra", label: "É construção nova ou reforma?", ordem: 2, obrigatorio: true, opcoes: "Construção nova, Reforma, Retrofit, Ampliação" },
    { key: "detalhes", label: "Me conte com mais detalhes sobre o seu projeto!", ordem: 3, obrigatorio: true, opcoes: "" },
    { key: "nome", label: "Qual é o seu nome?", ordem: 4, obrigatorio: true, opcoes: "" },
    { key: "localizacao", label: "Qual cidade/estado você está?", ordem: 5, obrigatorio: true, opcoes: "" },
    { key: "tamanho", label: "Qual é o tamanho aproximado?", ordem: 6, obrigatorio: false, opcoes: "" },
    { key: "orcamento", label: "Qual é o orçamento previsto?", ordem: 7, obrigatorio: false, opcoes: "" },
    { key: "ambientes", label: "Quais cômodos deseja no projeto?", ordem: 8, obrigatorio: false, opcoes: "Sala, Quarto, Cozinha, Banheiro, Escritório, Varanda, Lavanderia, Todos" },
    { key: "estilo", label: "Qual estilo de decoração prefere?", ordem: 9, obrigatorio: false, opcoes: "Minimalista, Moderno, Clássico, Industrial, Boho, Escandinavo, Outro" }
  ]
};

export default function AIConfigurationPage() {
  const aiSettings = useQuery(api.settings.getSetting, { key: "ai_config" });
  const setSetting = useMutation(api.settings.setSetting);

  const [config, setConfig] = useState<AIConfig>(() => {
    return (aiSettings?.value as AIConfig) ?? defaultConfig;
  });

  const handleSave = async () => {
    try {
      await setSetting({ key: "ai_config", value: config });
      toast.success("Configuração da Jal atualizada!");
    } catch {
      toast.error("Erro ao salvar configuração.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 py-8 pb-32">
      <header className="flex flex-col gap-6 border-b border-zinc-100 pb-12">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-left">Brain & Intelligence</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-5xl font-medium tracking-tighter text-zinc-900 font-ui   flex items-center gap-4">
              Configuração da Jal
              <Sparkles className="size-8 text-primary shadow-xl shadow-primary/20 animate-pulse" />
            </h2>
            <p className="text-zinc-500 text-sm max-w-md">Treinamento avançado baseado na Seção 10 do PRD para a inteligência operacional do site.</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="mb-12 h-20">
          <TabsTrigger value="personality">Personalidade</TabsTrigger>
          <TabsTrigger value="briefing">Briefing</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="output">Output & CRM</TabsTrigger>
          <TabsTrigger value="examples">Learning</TabsTrigger>
        </TabsList>

        <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-12 shadow-sm">
          <TabsContent value="personality" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <Bot className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Personalidade & Voz</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Define quem ela é e como se comunica</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Nome da Arquiteta</Label>
                <Input
                  value={config.nomeArquiteta}
                  onChange={(e) => setConfig({ ...config, nomeArquiteta: e.target.value })}
                  placeholder="Jarline Vieira"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Tom de Voz</Label>
                <Select
                  value={config.tomVoz || "Profissional"}
                  onValueChange={(val) => setConfig({ ...config, tomVoz: val || "Profissional" })}
                >
                  <SelectTrigger className="h-16 rounded-2xl bg-zinc-50 border-zinc-100 font-ui text-sm">
                    <SelectValue placeholder="Selecione o tom..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Sofisticado">Sofisticado</SelectItem>
                    <SelectItem value="Amigável">Amigável</SelectItem>
                    <SelectItem value="Mínimo">Mínimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 col-span-2">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Posicionamento da Marca</Label>
                <Textarea
                  value={config.posicionamento}
                  onChange={(e) => setConfig({ ...config, posicionamento: e.target.value })}
                  placeholder="Ex: Arquitetura minimalista focado em bem-estar..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-4 col-span-2">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Objetivo Principal (Contexto de Negócio)</Label>
                <Textarea
                  value={config.objetivoIA}
                  onChange={(e) => setConfig({ ...config, objetivoIA: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="briefing" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <FileText className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Coleta de Briefing</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Campos que a IA deve coletar para montar o briefing</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-zinc-500 font-ui">
                Configure quais informações a IA deve coletar durante a conversa. A IA fará perguntas na ordem definida e só oferecerá o WhatsApp quando todos os campos obrigatórios forem preenchidos.
              </p>

              {config.camposBriefing?.sort((a, b) => (a as BriefingCampo).ordem - (b as BriefingCampo).ordem).map((campo, idx) => (
                <div key={idx} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4 relative group">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    <span className="size-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center">{campo.ordem}</span>
                    Campo {idx + 1}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Pergunta</Label>
                      <Input
                        value={campo.label}
                        onChange={(e) => {
                          const next = [...(config.camposBriefing || [])];
                          next[idx].label = e.target.value;
                          setConfig({ ...config, camposBriefing: next });
                        }}
                        placeholder="Ex: Qual é o tipo de projeto?"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Chave</Label>
                      <Input
                        value={campo.key}
                        onChange={(e) => {
                          const next = [...(config.camposBriefing || [])];
                          next[idx].key = e.target.value;
                          setConfig({ ...config, camposBriefing: next });
                        }}
                        placeholder="tipoProjeto"
                        className="bg-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Opções (separadas por vírgula)</Label>
                      <Input
                        value={campo.opcoes || ""}
                        onChange={(e) => {
                          const next = [...(config.camposBriefing || [])];
                          next[idx].opcoes = e.target.value;
                          setConfig({ ...config, camposBriefing: next });
                        }}
                        placeholder="Ex: Casa, Apartamento, Loft"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Ordem</Label>
                      <Input
                        type="number"
                        value={campo.ordem}
                        onChange={(e) => {
                          const next = [...(config.camposBriefing || [])];
                          next[idx].ordem = parseInt(e.target.value) || 1;
                          setConfig({ ...config, camposBriefing: next });
                        }}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-100">
                      <div className="space-y-1">
                        <p className="font-ui font-medium text-zinc-900 text-sm">Obrigatório</p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-ui">Precisa preencher</p>
                      </div>
                      <Switch
                        checked={campo.obrigatorio}
                        onCheckedChange={(checked) => {
                          const next = [...(config.camposBriefing || [])];
                          next[idx].obrigatorio = checked;
                          setConfig({ ...config, camposBriefing: next });
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 size-8 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => {
                      const next = (config.camposBriefing || []).filter((_, i) => i !== idx);
                      setConfig({ ...config, camposBriefing: next });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed border-zinc-200 rounded-2xl text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:border-primary hover:text-zinc-900 transition-all font-ui"
                onClick={() => {
                  const newCampo = {
                    key: `campo_${Date.now()}`,
                    label: "Nova pergunta",
                    ordem: (config.camposBriefing?.length || 0) + 1,
                    obrigatorio: false,
                    opcoes: ""
                  };
                  setConfig({ ...config, camposBriefing: [...(config.camposBriefing || []), newCampo] });
                }}
              >
                <Plus className="size-4 mr-2" /> Adicionar Campo de Briefing
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <ShieldCheck className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Regras & Compliance</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Limites operacionais e instruções de sistema</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Instruções Gerais (Prompt Root)</Label>
                <Textarea
                  value={config.instrucoesGerais}
                  onChange={(e) => setConfig({ ...config, instrucoesGerais: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui text-emerald-600">O que ela DEVE fazer</Label>
                  <Textarea
                    value={config.faz}
                    onChange={(e) => setConfig({ ...config, faz: e.target.value })}
                    className="bg-emerald-50/10 border-emerald-100 min-h-[160px]"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui text-red-600">O que ela NÃO DEVE fazer</Label>
                  <Textarea
                    value={config.naoFaz}
                    onChange={(e) => setConfig({ ...config, naoFaz: e.target.value })}
                    className="bg-red-50/10 border-red-100 min-h-[160px]"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Regra de Preservação de Dados</Label>
                <Input
                  value={config.regraPreservacao}
                  onChange={(e) => setConfig({ ...config, regraPreservacao: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <Zap className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Serviços & Inteligência</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Treinamento sobre o portfólio de serviços</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Listagem de Serviços Oferecidos</Label>
                <Textarea
                  value={config.servicosOferecidos}
                  onChange={(e) => setConfig({ ...config, servicosOferecidos: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Critérios de Recomendação (Lógica)</Label>
                <Textarea
                  value={config.criteriosRecomendacao}
                  onChange={(e) => setConfig({ ...config, criteriosRecomendacao: e.target.value })}
                  className="min-h-[120px]"
                  placeholder="Se o cliente disser X, recomende Y..."
                />
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Perguntas Essenciais</Label>
                  <Textarea
                    value={config.perguntasEssenciais}
                    onChange={(e) => setConfig({ ...config, perguntasEssenciais: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Perguntas Opcionais</Label>
                  <Textarea
                    value={config.perguntasOpcionais}
                    onChange={(e) => setConfig({ ...config, perguntasOpcionais: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <Send className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Transbordo & Mensagens</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Como ela encerra o atendimento</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">WhatsApp de Destino</Label>
                  <Input
                    value={config.whatsapp}
                    onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                    className="bg-zinc-50 font-mono"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Saudação Inicial Padrão</Label>
                  <Input
                    value={config.initialGreeting}
                    onChange={(e) => setConfig({ ...config, initialGreeting: e.target.value })}
                    placeholder="Ex: Olá! Sou a Jal..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="space-y-1">
                    <p className="font-ui font-medium text-zinc-900">Permitir Markdown</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui">Formatação rica em negrito e listas</p>
                  </div>
                  <Switch
                    checked={config.allowMarkdown}
                    onCheckedChange={(checked) => setConfig({ ...config, allowMarkdown: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="space-y-1">
                    <p className="font-ui font-medium text-zinc-900">Responder com Emojis</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui">Tom mais amigável e visual</p>
                  </div>
                  <Switch
                    checked={config.useEmojis}
                    onCheckedChange={(checked) => setConfig({ ...config, useEmojis: checked })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Estrutura da Mensagem Final (Resumo)</Label>
                <Textarea
                  value={config.estruturaMensagem}
                  onChange={(e) => setConfig({ ...config, estruturaMensagem: e.target.value })}
                  className="min-h-[180px] font-mono text-xs"
                />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Use <code className="bg-zinc-100 px-1 rounded font-mono">{"{{key}}"}</code> para inserir valores coletados. As chaves devem ser os nomes dos campos do briefing — ex: <code className="bg-zinc-100 px-1 rounded font-mono">{"{{nome}}"}</code>, <code className="bg-zinc-100 px-1 rounded font-mono">{"{{tipoProjeto}}"}</code>, <code className="bg-zinc-100 px-1 rounded font-mono">{"{{detalhes}}"}</code>. Formato <code className="bg-zinc-100 px-1 rounded font-mono">[Nome]</code> não é suportado.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-6 mb-8">
              <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center text-primary">
                <FileText className="size-8" />
              </div>
              <div>
                <h3 className="text-2xl font-ui font-medium text-zinc-900">Exemplos de Treinamento</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-ui font-medium">Few-shot learning para melhores resultados</p>
              </div>
            </div>

            <div className="space-y-8">
              {config.exemplos.map((ex, idx) => (
                <div key={idx} className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-6 relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 size-8 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => {
                      const next = config.exemplos.filter((_, i) => i !== idx);
                      setConfig({ ...config, exemplos: next });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Pergunta do Usuário</Label>
                    <Input
                      value={ex.q}
                      onChange={(e) => {
                        const next = [...config.exemplos];
                        next[idx].q = e.target.value;
                        setConfig({ ...config, exemplos: next });
                      }}
                      placeholder="Ex: Como funciona o orçamento?"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Resposta Ideal</Label>
                    <Textarea
                      value={ex.a}
                      onChange={(e) => {
                        const next = [...config.exemplos];
                        next[idx].a = e.target.value;
                        setConfig({ ...config, exemplos: next });
                      }}
                      placeholder="Escreva a resposta perfeita..."
                      className="bg-white min-h-[100px]"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed border-zinc-200 rounded-2xl text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:border-primary hover:text-zinc-900 transition-all font-ui"
                onClick={() => setConfig({ ...config, exemplos: [...config.exemplos, { q: "", a: "" }] })}
              >
                <Plus className="size-4 mr-2" /> Adicionar Exemplo de Treinamento
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-10 rounded-[2.5rem] bg-[#FBFBFA] border border-zinc-100/50">
        <div className="flex items-start gap-8">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <MessageSquare className="size-6" />
          </div>
          <div className="space-y-3">
            <h4 className="font-ui font-medium text-zinc-900 text-xl  ">Simulador de Treinamento</h4>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
              Os campos acima são combinados automaticamente para formar o prompt final da Jal. Ao clicar em "Publicar", a inteligência é atualizada instantaneamente no site. Recomenda-se manter o tom de voz consistente com a marca Jarline Vieira.
            </p>
          </div>
        </div>
      </div>

      {/* Global Actions Footer */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none transition-all duration-300 lg:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:lg:left-[var(--sidebar-width-icon)]">
        <div className="max-w-[1000px] mx-auto w-full pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-3xl border border-zinc-100 p-8 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-6 pl-4 font-ui">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-900 font-ui text-left">Brain Engine</span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest text-left font-ui">Versão v1.0.4 (PRD 10)</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.location.reload()} className="h-14 px-8 rounded-lg text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 font-ui">Resetar</Button>
              <Button variant="premium" size="xl" onClick={handleSave} className="px-12 h-16 rounded-xl gap-4 font-ui text-[11px] uppercase tracking-widest font-medium">
                <Save className="size-5" />
                Publicar Inteligência
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
