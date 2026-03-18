"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { SectionCard } from "@/components/admin/section-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Save, Plus, Trash2, Layout, MessageSquare, MapPin, Phone, Mail, Instagram, ExternalLink, Eye, EyeOff, Type, Image as ImageIcon, Link as LinkIcon, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LinkAutocomplete } from "@/components/admin/link-autocomplete";

export default function HomeManagementPage() {
  const heroSettings = useQuery(api.settings.getSetting, { key: "hero" });
  const setSetting = useMutation(api.settings.setSetting);

  const bigNumbersSettings = useQuery(api.settings.getSetting, { key: "bignumbers" });
  const aboutSettings = useQuery(api.settings.getSetting, { key: "about" });
  const projectsSettings = useQuery(api.settings.getSetting, { key: "home-projects" });
  const servicesSettings = useQuery(api.settings.getSetting, { key: "services" });

  const projects = useQuery(api.projects.getProjects) || [];

  const [heroData, setHeroData] = useState<any>({
    isEnabled: true,
    caption: "Arquitetura & Design",
    title: "Transformando espaços em experiências únicas",
    subtitle: "Projetos autorais que unem estética, funcionalidade e a essência de quem habita.",
    ctaPrimary: { isEnabled: true, text: "Ver Projetos", link: "/projetos" },
    ctaSecondary: { isEnabled: true, text: "Falar com Jarline", link: "/contato" }
  });

  const [bigNumbersData, setBigNumbersData] = useState<any>({
    isEnabled: true,
    title: "Nossos Números",
    subtitle: "",
    description: "",
    stats: [
      { id: 1, isEnabled: true, number: "12", label: "Projetos Concluídos", prefix: "+", suffix: "", description: "" },
      { id: 2, isEnabled: true, number: "5", label: "Anos de Experiência", prefix: "", suffix: " anos", description: "" }
    ]
  });

  const [aboutData, setAboutData] = useState<any>({
    isEnabled: true,
    title: "Prazer, sou Jarline Vieira",
    subtitle: "Arquiteta e Urbanista",
    description: "Minha trajetória na arquitetura é marcada...",
    imageUrl: "",
    highlights: [
      { id: 1, isEnabled: true, text: "Design Autoral", icon: "" },
      { id: 2, isEnabled: true, text: "Funcionalidade", icon: "" }
    ],
    cta: { isEnabled: false, text: "Saber mais", link: "/sobre" }
  });

  const [homeProjectsData, setHomeProjectsData] = useState<any>({
    isEnabled: true,
    title: "Meus Projetos",
    subtitle: "Seleção de trabalhos",
    description: "Uma mostra dos projetos mais recentes...",
    cta: { isEnabled: true, text: "Ver Portfólio Completo", link: "/projetos" },
    selectedIds: [],
    maxVisible: 5
  });

  const [servicesData, setServicesData] = useState<any>({
    isEnabled: true,
    title: "Nossos Serviços",
    subtitle: "Como podemos ajudar",
    description: "Soluções completas para seu espaço...",
    cta: { isEnabled: false, text: "Consultar Orçamento", link: "/contato" },
    list: [
      {
        id: 1,
        isEnabled: true,
        title: "Projeto de Interiores",
        description: "Transformação completa de ambientes...",
        imageUrl: "",
        button: { isEnabled: true, text: "Ver detalhes", link: "/servicos/interiores" }
      }
    ]
  });

  const [aiSectionData, setAiSectionData] = useState<any>({
    isEnabled: true,
    title: "Converse com a Jal",
    subtitle: "Minha Assistente de IA",
    description: "Tire suas dúvidas agora mesmo...",
    benefits: [
      { id: 1, isEnabled: true, text: "Resposta imediata", icon: "" },
      { id: 2, isEnabled: true, text: "Consultoria prévia", icon: "" }
    ],
    supportText: "Disponível 24/7 para você",
    imageUrl: "",
    cta: { isEnabled: true, text: "Iniciar Chat", link: "#ai" }
  });

  const [footerData, setFooterData] = useState<any>({
    isEnabled: true,
    institutionalName: "Jarline Vieira",
    institutionalText: "Arquitetura com propósito e estética refinada.",
    contact: {
      address: "",
      phone: "",
      whatsapp: "",
      email: ""
    },
    social: {
      instagram: ""
    },
    links: [
      { id: 1, isEnabled: true, label: "Sobre", link: "/sobre", isExternal: false }
    ],
    copyright: "© 2026 Jarline Vieira Arquiteta. Todos os direitos reservados."
  });

  const aiSectionSettings = useQuery(api.settings.getSetting, { key: "ai_section" });
  const footerSettings = useQuery(api.settings.getSetting, { key: "footer" });

  useEffect(() => {
    if (heroSettings?.value) setHeroData(heroSettings.value);
  }, [heroSettings]);

  useEffect(() => {
    if (bigNumbersSettings?.value) setBigNumbersData(bigNumbersSettings.value);
  }, [bigNumbersSettings]);

  useEffect(() => {
    if (aboutSettings?.value) setAboutData(aboutSettings.value);
  }, [aboutSettings]);

  useEffect(() => {
    if (projectsSettings?.value) setHomeProjectsData(projectsSettings.value);
  }, [projectsSettings]);

  useEffect(() => {
    if (servicesSettings?.value) setServicesData(servicesSettings.value);
  }, [servicesSettings]);

  useEffect(() => {
    if (aiSectionSettings?.value) setAiSectionData(aiSectionSettings.value);
  }, [aiSectionSettings]);

  useEffect(() => {
    if (footerSettings?.value) setFooterData(footerSettings.value);
  }, [footerSettings]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "preview_update",
        payload: {
          hero: heroData,
          bigNumbers: bigNumbersData,
          about: aboutData,
          services: servicesData,
          aiSection: aiSectionData,
          footer: footerData,
        }
      }, "*");
    }
  }, [heroData, bigNumbersData, aboutData, servicesData, aiSectionData, footerData]);

  const handleSave = async (key: string, value: any) => {
    try {
      await setSetting({ key, value });
      toast.success(`Seção ${key} atualizada!`);
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 py-8 pb-32">
      <div className="flex flex-col gap-4 border-b border-zinc-100 pb-12">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Editor de Conteúdo Principal</span>
        </div>
        <h2 className="text-4xl font-medium tracking-tight text-zinc-900 font-display">Página Inicial</h2>
        <p className="text-zinc-500 text-sm max-w-md">Controle absoluto de cada módulo, seguindo rigorosamente as definições do PRD Jarline Vieira.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          {/* Section: Hero */}
          <SectionCard
            id="hero"
            title="6.2.1 - Banner Principal (Hero)"
            isEnabled={heroData.isEnabled}
            onToggle={(val) => setHeroData({ ...heroData, isEnabled: val })}
          >
            <div className="grid grid-cols-1 gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Caption (Legenda)</Label>
                  <Input
                    value={heroData.caption}
                    onChange={(e) => setHeroData({ ...heroData, caption: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Headline (Título)</Label>
                <Textarea
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl min-h-[100px] p-6 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Supporting Text</Label>
                <Textarea
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl min-h-[100px] p-6 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-50 pt-8">
                <div className="space-y-6 p-8 bg-zinc-50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Botão Primário</span>
                    <Switch checked={heroData.ctaPrimary.isEnabled} onCheckedChange={(val) => setHeroData({ ...heroData, ctaPrimary: { ...heroData.ctaPrimary, isEnabled: val } })} />
                  </div>
                  <div className="space-y-4">
                    <Input value={heroData.ctaPrimary.text} onChange={(e) => setHeroData({ ...heroData, ctaPrimary: { ...heroData.ctaPrimary, text: e.target.value } })} placeholder="Texto" className="bg-white" />
                    <LinkAutocomplete value={heroData.ctaPrimary.link} onChange={(val) => setHeroData({ ...heroData, ctaPrimary: { ...heroData.ctaPrimary, link: val } })} placeholder="Link" className="bg-white" />
                  </div>
                </div>
                <div className="space-y-6 p-8 bg-zinc-50 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Botão Secundário</span>
                    <Switch checked={heroData.ctaSecondary.isEnabled} onCheckedChange={(val) => setHeroData({ ...heroData, ctaSecondary: { ...heroData.ctaSecondary, isEnabled: val } })} />
                  </div>
                  <div className="space-y-4">
                    <Input value={heroData.ctaSecondary.text} onChange={(e) => setHeroData({ ...heroData, ctaSecondary: { ...heroData.ctaSecondary, text: e.target.value } })} placeholder="Texto" className="bg-white" />
                    <LinkAutocomplete value={heroData.ctaSecondary.link} onChange={(val) => setHeroData({ ...heroData, ctaSecondary: { ...heroData.ctaSecondary, link: val } })} placeholder="Link" className="bg-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("hero", heroData)} className="gap-2">
                  <Save className="size-4" /> Salvar Hero
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: Big Numbers */}
          <SectionCard
            id="bignumbers"
            title="6.2.2 - Indicadores (Big Numbers)"
            isEnabled={bigNumbersData.isEnabled}
            onToggle={(val) => setBigNumbersData({ ...bigNumbersData, isEnabled: val })}
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título da Seção</Label>
                  <Input value={bigNumbersData.title} onChange={(e) => setBigNumbersData({ ...bigNumbersData, title: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subtítulo</Label>
                  <Input value={bigNumbersData.subtitle} onChange={(e) => setBigNumbersData({ ...bigNumbersData, subtitle: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Descrição</Label>
                <Textarea value={bigNumbersData.description} onChange={(e) => setBigNumbersData({ ...bigNumbersData, description: e.target.value })} className="bg-zinc-50 rounded-2xl min-h-[100px] p-6" />
              </div>

              <div className="space-y-6 pt-10 border-t border-zinc-100">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cards de Indicadores</Label>
                <div className="grid grid-cols-1 gap-6">
                  {bigNumbersData.stats.map((stat: any, index: number) => (
                    <div key={index} className="p-10 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-8 relative group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">#{index + 1}</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Configuração do Card</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold text-zinc-400">{stat.isEnabled ? 'Ativo' : 'Inativo'}</span>
                            <Switch checked={stat.isEnabled} onCheckedChange={(val) => {
                              const next = [...bigNumbersData.stats];
                              next[index].isEnabled = val;
                              setBigNumbersData({ ...bigNumbersData, stats: next });
                            }} />
                          </div>
                          <Button variant="ghost" size="icon-sm" onClick={() => {
                            const next = bigNumbersData.stats.filter((_: any, i: number) => i !== index);
                            setBigNumbersData({ ...bigNumbersData, stats: next });
                          }} className="text-zinc-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Número</Label>
                          <Input value={stat.number} onChange={(e) => {
                            const next = [...bigNumbersData.stats];
                            next[index].number = e.target.value;
                            setBigNumbersData({ ...bigNumbersData, stats: next });
                          }} className="bg-white" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Prefixo</Label>
                          <Input value={stat.prefix} onChange={(e) => {
                            const next = [...bigNumbersData.stats];
                            next[index].prefix = e.target.value;
                            setBigNumbersData({ ...bigNumbersData, stats: next });
                          }} className="bg-white" placeholder="Ex: +" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Sufixo</Label>
                          <Input value={stat.suffix} onChange={(e) => {
                            const next = [...bigNumbersData.stats];
                            next[index].suffix = e.target.value;
                            setBigNumbersData({ ...bigNumbersData, stats: next });
                          }} className="bg-white" placeholder="Ex: %" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Título do Card</Label>
                          <Input value={stat.label} onChange={(e) => {
                            const next = [...bigNumbersData.stats];
                            next[index].label = e.target.value;
                            setBigNumbersData({ ...bigNumbersData, stats: next });
                          }} className="bg-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Descrição Auxiliar</Label>
                        <Input value={stat.description} onChange={(e) => {
                          const next = [...bigNumbersData.stats];
                          next[index].description = e.target.value;
                          setBigNumbersData({ ...bigNumbersData, stats: next });
                        }} className="bg-white" />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="h-20 rounded-2xl border-dashed border-zinc-200" onClick={() => {
                    setBigNumbersData({ ...bigNumbersData, stats: [...bigNumbersData.stats, { isEnabled: true, number: "", label: "", prefix: "", suffix: "", description: "" }] });
                  }}><Plus className="size-5 mr-3" /> Adicionar Indicador</Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("bignumbers", bigNumbersData)}>
                  Salvar Big Numbers
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: Featured Projects */}
          <SectionCard
            id="home-projects"
            title="6.2.3 - Portfólio em Destaque (Projetos)"
            isEnabled={homeProjectsData.isEnabled}
            onToggle={(val) => setHomeProjectsData({ ...homeProjectsData, isEnabled: val })}
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título da Galeria</Label>
                  <Input value={homeProjectsData.title} onChange={(e) => setHomeProjectsData({ ...homeProjectsData, title: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subtítulo</Label>
                  <Input value={homeProjectsData.subtitle} onChange={(e) => setHomeProjectsData({ ...homeProjectsData, subtitle: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Descrição Curta</Label>
                <Textarea value={homeProjectsData.description} onChange={(e) => setHomeProjectsData({ ...homeProjectsData, description: e.target.value })} className="bg-zinc-50 rounded-2xl min-h-[100px] p-6" />
              </div>

              <div className="space-y-6 pt-10 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Curadoria Manual ({homeProjectsData.selectedIds?.length || 0}/5 selecionados)</Label>
                  <span className="text-[10px] font-mono text-zinc-400">Escolha os projetos que aparecerão na home</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project: any) => {
                    const isSelected = homeProjectsData.selectedIds?.includes(project._id);
                    return (
                      <div
                        key={project._id}
                        onClick={() => {
                          const current = homeProjectsData.selectedIds || [];
                          const next = current.includes(project._id)
                            ? current.filter((id: string) => id !== project._id)
                            : [...current, project._id];
                          setHomeProjectsData({ ...homeProjectsData, selectedIds: next });
                        }}
                        className={`group p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col gap-3 ${isSelected
                          ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20"
                          : "bg-zinc-50 border-zinc-100 text-zinc-900 hover:border-zinc-300"
                          }`}
                      >
                        <Layout className={`size-4 mb-2 ${isSelected ? "text-white" : "text-zinc-400"}`} />
                        <div className="font-medium text-sm leading-tight line-clamp-2">{project.title}</div>
                        <div className={`text-[10px] uppercase tracking-wide font-bold ${isSelected ? "text-zinc-400" : "text-zinc-400"}`}>
                          {project.category || "Sem categoria"}
                        </div>
                        {isSelected && (
                          <div className="absolute top-6 right-6 size-2 bg-white rounded-full animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("home-projects", homeProjectsData)}>
                  Salvar Curadoria
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: About */}
          <SectionCard
            id="about"
            title="6.2.4 - Sobre Mim (Perfil)"
            isEnabled={aboutData.isEnabled}
            onToggle={(val) => setAboutData({ ...aboutData, isEnabled: val })}
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título Principal</Label>
                  <Input value={aboutData.title} onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subtítulo (Profissão/Cargo)</Label>
                  <Input value={aboutData.subtitle} onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Texto Biográfico</Label>
                <Textarea value={aboutData.description} onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })} className="bg-zinc-50 rounded-2xl min-h-[250px] p-10 leading-relaxed text-zinc-600 focus:bg-white transition-all" />
              </div>

              <div className="space-y-6 pt-10 border-t border-zinc-50">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Destaques Criativos (Highlights)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutData.highlights.map((highlight: any, index: number) => (
                    <div key={index} className="flex gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 items-center hover:bg-white transition-all group">
                      <div className="flex-1 space-y-2">
                        <Input value={highlight.text} onChange={(e) => {
                          const next = [...aboutData.highlights];
                          next[index].text = e.target.value;
                          setAboutData({ ...aboutData, highlights: next });
                        }} className="bg-white h-12 rounded-xl text-sm border-zinc-100" placeholder="Ex: Design Autoral de Alto Padrão" />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => {
                        const next = aboutData.highlights.filter((_: any, i: number) => i !== index);
                        setAboutData({ ...aboutData, highlights: next });
                      }} className="text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="size-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" className="h-16 rounded-2xl border-dashed border-zinc-200" onClick={() => {
                    setAboutData({ ...aboutData, highlights: [...aboutData.highlights, { isEnabled: true, text: "", icon: "" }] });
                  }}><Plus className="size-4 mr-2" /> Adicionar Highlight</Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("about", aboutData)}>
                  Atualizar Perfil Autoral
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: Services */}
          <SectionCard
            id="services"
            title="6.2.5 - Meus Serviços (Especialidades)"
            isEnabled={servicesData.isEnabled}
            onToggle={(val) => setServicesData({ ...servicesData, isEnabled: val })}
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título da Seção</Label>
                  <Input value={servicesData.title} onChange={(e) => setServicesData({ ...servicesData, title: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subtítulo</Label>
                  <Input value={servicesData.subtitle} onChange={(e) => setServicesData({ ...servicesData, subtitle: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Descrição Introdutória</Label>
                <Textarea value={servicesData.description} onChange={(e) => setServicesData({ ...servicesData, description: e.target.value })} className="bg-zinc-50 rounded-2xl min-h-[100px] p-6" />
              </div>

              <div className="space-y-6 pt-10 border-t border-zinc-100">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Lista de Serviços</Label>
                <div className="grid grid-cols-1 gap-6">
                  {(servicesData.list || []).map((service: any, index: number) => (
                    <div key={index} className="p-10 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-8 relative group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">#{index + 1}</div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{service.title || "Novo Serviço"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch checked={service.isEnabled} onCheckedChange={(val) => {
                            const next = [...servicesData.list];
                            next[index].isEnabled = val;
                            setServicesData({ ...servicesData, list: next });
                          }} />
                          <Button variant="ghost" size="icon-sm" onClick={() => {
                            const next = servicesData.list.filter((_: any, i: number) => i !== index);
                            setServicesData({ ...servicesData, list: next });
                          }} className="text-zinc-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Nome do Serviço</Label>
                          <Input value={service.title} onChange={(e) => {
                            const next = [...servicesData.list];
                            next[index].title = e.target.value;
                            setServicesData({ ...servicesData, list: next });
                          }} className="bg-white" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Botão do Card (Opcional)</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Texto" value={service.button?.text} onChange={(e) => {
                              const next = [...servicesData.list];
                              next[index].button = { ...next[index].button, text: e.target.value };
                              setServicesData({ ...servicesData, list: next });
                            }} className="bg-white flex-1" />
                            <div className="flex-1">
                              <LinkAutocomplete placeholder="Link" value={service.button?.link} onChange={(val) => {
                                const next = [...servicesData.list];
                                next[index].button = { ...next[index].button, link: val };
                                setServicesData({ ...servicesData, list: next });
                              }} className="bg-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Descrição detalhada</Label>
                        <Textarea value={service.description} onChange={(e) => {
                          const next = [...servicesData.list];
                          next[index].description = e.target.value;
                          setServicesData({ ...servicesData, list: next });
                        }} className="bg-white rounded-2xl min-h-[80px]" />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="h-20 rounded-2xl border-dashed border-zinc-200" onClick={() => {
                    setServicesData({ ...servicesData, list: [...(servicesData.list || []), { isEnabled: true, title: "", description: "", button: { isEnabled: true, text: "Ver detalhes", link: "" } }] });
                  }}><Plus className="size-5 mr-3" /> Adicionar Serviço</Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("services", servicesData)}>
                  Salvar Serviços
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: AI Chat */}
          <SectionCard
            id="ai_section"
            title="6.2.6 - Assistente Virtual (Chat IA)"
            isEnabled={aiSectionData.isEnabled}
            onToggle={(val) => setAiSectionData({ ...aiSectionData, isEnabled: val })}
          >
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Título Chamada</Label>
                  <Input value={aiSectionData.title} onChange={(e) => setAiSectionData({ ...aiSectionData, title: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subtítulo</Label>
                  <Input value={aiSectionData.subtitle} onChange={(e) => setAiSectionData({ ...aiSectionData, subtitle: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Support Tagline</Label>
                  <Input value={aiSectionData.supportText} onChange={(e) => setAiSectionData({ ...aiSectionData, supportText: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Descrição do Serviço IA</Label>
                <Textarea value={aiSectionData.description} onChange={(e) => setAiSectionData({ ...aiSectionData, description: e.target.value })} className="bg-zinc-50 rounded-2xl min-h-[120px] p-8 focus:bg-white transition-all" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-zinc-50">
                <div className="space-y-6">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Benefícios & Funcionalidades</Label>
                  <div className="space-y-3">
                    {aiSectionData.benefits.map((benefit: any, index: number) => (
                      <div key={index} className="flex gap-4 p-2 bg-zinc-50/50 rounded-2xl border border-zinc-100 items-center">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white"><Globe className="size-3" /></div>
                        <Input value={benefit.text} onChange={(e) => {
                          const next = [...aiSectionData.benefits];
                          next[index].text = e.target.value;
                          setAiSectionData({ ...aiSectionData, benefits: next });
                        }} className="h-11 bg-white text-sm border-none shadow-none focus:ring-0" placeholder="Ex: Disponível 24h" />
                        <Button variant="ghost" size="icon-sm" onClick={() => {
                          const next = aiSectionData.benefits.filter((_: any, i: number) => i !== index);
                          setAiSectionData({ ...aiSectionData, benefits: next });
                        }} className="text-zinc-200 hover:text-red-400 hover:bg-transparent"><Trash2 className="size-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full rounded-2xl border-dashed border-zinc-200 h-14" onClick={() => {
                      setAiSectionData({ ...aiSectionData, benefits: [...aiSectionData.benefits, { isEnabled: true, text: "", icon: "" }] });
                    }}>+ Novo Benefício</Button>
                  </div>
                </div>
                <div className="space-y-6 p-10 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 size-32 bg-zinc-100 -mr-16 -mt-16 rounded-full opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2 relative z-10"><MessageSquare className="size-4" /> Configuração do Chat</span>
                  <div className="space-y-4 relative z-10 pt-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] uppercase font-bold text-zinc-400">Texto do Botão</Label>
                      <Input value={aiSectionData.cta.text} onChange={(e) => setAiSectionData({ ...aiSectionData, cta: { ...aiSectionData.cta, text: e.target.value } })} placeholder="Texto do Botão" className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] uppercase font-bold text-zinc-400">Ação / Âncora</Label>
                      <LinkAutocomplete value={aiSectionData.cta.link} onChange={(val) => setAiSectionData({ ...aiSectionData, cta: { ...aiSectionData.cta, link: val } })} placeholder="Ex: #chat" className="bg-white font-mono text-[11px]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="premium" size="xl" onClick={() => handleSave("ai_section", aiSectionData)}>
                  Salvar Módulo Assistente
                </Button>
              </div>
            </div>
          </SectionCard>

          {/* Section: Footer */}
          <SectionCard
            id="footer"
            title="6.2.7 - Footer & Identidade (Institucional)"
            isEnabled={footerData.isEnabled}
            onToggle={(val) => setFooterData({ ...footerData, isEnabled: val })}
          >
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nome da Marca</Label>
                  <Input value={footerData.institutionalName} onChange={(e) => setFooterData({ ...footerData, institutionalName: e.target.value })} className="bg-zinc-50" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Slogan Institucional</Label>
                  <Input value={footerData.institutionalText} onChange={(e) => setFooterData({ ...footerData, institutionalText: e.target.value })} className="bg-zinc-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-zinc-50">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><MapPin className="size-4 text-zinc-900" /> Endereço Físico</Label>
                  <Input value={footerData.contact.address} onChange={(e) => setFooterData({ ...footerData, contact: { ...footerData.contact, address: e.target.value } })} className="bg-zinc-50 text-xs" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Phone className="size-4 text-zinc-900" /> WhatsApp Business</Label>
                  <Input value={footerData.contact.whatsapp} onChange={(e) => setFooterData({ ...footerData, contact: { ...footerData.contact, whatsapp: e.target.value } })} className="bg-zinc-50 text-xs font-mono" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Mail className="size-4 text-zinc-900" /> Canal de Email</Label>
                  <Input value={footerData.contact.email} onChange={(e) => setFooterData({ ...footerData, contact: { ...footerData.contact, email: e.target.value } })} className="bg-zinc-50 text-xs" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Instagram className="size-4 text-zinc-900" /> Instagram Oficial</Label>
                  <Input value={footerData.social.instagram} onChange={(e) => setFooterData({ ...footerData, social: { ...footerData.social, instagram: e.target.value } })} className="bg-zinc-50 text-xs" placeholder="@usuário" />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Copyright Line (Direitos Autorais)</Label>
                <Input value={footerData.copyright} onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })} className="bg-zinc-50" />
              </div>

              <div className="flex justify-end pt-6">
                <Button variant="premium" size="xl" onClick={() => handleSave("footer", footerData)}>
                  Finalizar Edição Institucional
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Real-time Preview */}
        <div className="sticky top-8 h-[calc(100vh-64px)] rounded-[50px] overflow-hidden border-[6px] border-zinc-900 shadow-2xl bg-white hidden xl:block">
          <iframe
            ref={iframeRef}
            src="/?preview=true"
            className="w-full h-full border-none"
            title="Preview em Tempo Real"
          />
        </div>
      </div>
    </div>
  );
}
