"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Type,
  Globe,
  Layout,
  Image as ImageIconLucide,
  Save,
  X,
  Plus,
  ArrowLeft,
  Settings2,
  ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function ProjectEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const project = useQuery(api.projects.getProjectById, isNew ? "skip" : { id: id as any });
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const projects = useQuery(api.projects.getProjects);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    category: "",
    subtitle: "",
    summary: "",
    coverImage: "",
    gallery: [],
    content: [],
    seoTitle: "",
    seoDescription: "",
    seoImage: "",
    status: "published",
    isFeatured: false,
    order: 0
  });

  // State to track if slug was manually edited
  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        gallery: project.gallery || [],
        content: project.content || [],
      });
      setIsSlugManual(true); // Don't auto-generate for existing projects unless they want to
    } else if (isNew) {
      setFormData((prev: any) => ({
        ...prev,
        order: (projects?.length || 0) + 1
      }));
    }
  }, [project, isNew, projects?.length]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugManual) {
      const generatedSlug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      setFormData((prev: any) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, isSlugManual]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isNew) {
        const { _id, _creationTime, ...updateData } = formData;
        await updateProject({ id: id as any, ...updateData });
        toast.success("Projeto atualizado!");
      } else {
        await createProject(formData);
        toast.success("Projeto criado com sucesso!");
      }
      router.push("/admin/projects");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar projeto.");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 py-8 pb-40">
      <header className="flex flex-col gap-8 border-b border-zinc-100 pb-12">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all w-fit"
        >
          <div className="size-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-all">
            <ChevronLeft className="size-4" />
          </div>
          Voltar para Listagem
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Editor de Portfólio</span>
            </div>
            <h2 className="text-5xl font-medium tracking-tighter text-zinc-900 font-display  ">
              {isNew ? "Novo Projeto" : "Editando Conteúdo"}
            </h2>
            <p className="text-zinc-500 text-sm max-w-md">Estrutura de dados modular conforme Seção 7 do PRD Jarline Vieira.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-20">
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="mb-16">
            <TabsTrigger value="base">Informações Base</TabsTrigger>
            <TabsTrigger value="content">Editor de Blocos</TabsTrigger>
            <TabsTrigger value="gallery">Galeria Visual</TabsTrigger>
            <TabsTrigger value="seo">Performance & SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="base" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4 col-span-2">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Título do Projeto</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-20 px-8 text-2xl focus:bg-white transition-all"
                  placeholder="Ex: Apartamento Reserva do Mar"
                  required
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Caminho da URL (Slug)</Label>
                <div className="flex items-center gap-3 group">
                  <div className="bg-zinc-100 px-6 h-14 rounded-2xl flex items-center text-zinc-400 text-xs font-medium border border-transparent group-focus-within:border-zinc-200 transition-all">
                    jarlinevieira.com.br/projetos/
                  </div>
                  <Input
                    value={formData.slug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, slug: val });
                      setIsSlugManual(val !== "");
                    }}
                    className="font-mono text-sm shadow-none"
                    placeholder="nome-do-projeto"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Ordem de Exibição</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-32 font-mono shadow-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Resumo Executive (Short Summary)</Label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="min-h-[140px]"
                  placeholder="Descreva a essência do projeto para os cards de listagem e SEO inicial..."
                />
              </div>

              <div className="p-8 rounded-[2rem] border border-zinc-100 bg-zinc-50/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-ui font-medium text-lg text-zinc-900 mb-2">Acervo Fotográfico</h4>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed font-ui">Seção fixa para controle de mídia. Adicione todas as fotos do projeto aqui.</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-3">
                    {formData.gallery.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="size-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shrink-0 shadow-sm relative">
                        {item.url && <img src={typeof item.url === 'string' ? item.url : (item as any)} className="size-full object-cover" alt="" />}
                        {item.isMain && (
                          <div className="absolute inset-0 bg-[#585947]/10 flex items-center justify-center">
                            <div className="size-2 rounded-full bg-[#585947]" />
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.gallery.length > 3 && (
                      <div className="size-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                        +{formData.gallery.length - 3}
                      </div>
                    )}
                    {formData.gallery.length === 0 && (
                      <div className="size-10 rounded-full border-2 border-white bg-zinc-50 flex items-center justify-center text-zinc-300 shrink-0">
                        <ImageIconLucide className="size-4" />
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="ghost" onClick={() => {
                    const tabs = document.querySelectorAll('[role="tab"]');
                    (tabs[2] as HTMLElement)?.click();
                  }} className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:bg-white px-4 h-10 rounded-xl">
                    Gerenciar Galeria
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <ImageUpload
                label="Asset de Destaque (Capa)"
                description="Escolha a imagem principal que representará este projeto nos cards e banners."
                value={formData.coverImage}
                onChange={(storageId) => setFormData({ ...formData, coverImage: storageId })}
              />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-8 rounded-2xl border border-zinc-100 bg-zinc-50/30">
              <header className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h4 className="font-ui font-medium text-xl text-zinc-900 leading-tight">Arquitetura de Conteúdo</h4>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Editor Rico</p>
                </div>
                <Badge variant="outline" className="bg-white border-zinc-100 text-[9px] uppercase font-medium tracking-widest py-1.5 px-4 rounded-lg">Rich Text</Badge>
              </header>

              <div className="space-y-6">
                <RichTextEditor
                  content={Array.isArray(formData.content) ? "" : formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  placeholder="Escreva a história do projeto."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-10 rounded-2xl border border-zinc-100 bg-zinc-50/30">
              <GalleryManager
                label="Curadoria de Ativos"
                description="A galeria permite que você organize as imagens. Arraste para reordenar, clique na estrela para definir a Capa, e preencha a Legenda/Descrições em Editar Infos."
                value={formData.gallery}
                onChange={(items) => setFormData({ ...formData, gallery: items })}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Globe className="size-5" />
                  </div>
                  <h4 className="text-xl font-ui font-medium text-zinc-900">Google Indexation</h4>
                </div>
                <div className="p-10 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-8 shadow-inner">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">SEO Meta Title</Label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="bg-white shadow-none"
                      placeholder="Recomendado: 50-60 caracteres"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Meta Description</Label>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Resumo otimizado para os resultados de busca orgânica.</p>
                    <Textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="bg-white"
                      placeholder="Foque em palavras-chave relevantes..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Settings2 className="size-5" />
                  </div>
                  <h4 className="text-xl font-ui font-medium text-zinc-900">Regras de Exposição</h4>
                </div>

                <div className="space-y-6">
                  <ImageUpload
                    label="Social Share Image (SEO)"
                    description="Imagem que aparece quando o link é compartilhado nas redes sociais."
                    value={formData.seoImage}
                    onChange={(storageId) => setFormData({ ...formData, seoImage: storageId })}
                    aspectRatio="video"
                  />

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between p-10 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white transition-all shadow-sm">
                      <div className="space-y-2">
                        <p className="font-ui font-medium text-lg leading-none text-zinc-900">Estado: {formData.status === "published" ? "Público" : "Draft"}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Visibilidade no site de portfólio</p>
                      </div>
                      <Switch
                        className="data-[state=checked]:bg-primary"
                        checked={formData.status === "published"}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "published" : "draft" })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-10 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white transition-all shadow-sm">
                      <div className="space-y-2">
                        <p className="font-ui font-medium text-lg leading-none text-zinc-900">Projeto em Destaque</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Habilitar no carrossel da Home</p>
                      </div>
                      <Switch
                        className="data-[state=checked]:bg-primary"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>

      {/* Global Actions Footer */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none transition-all duration-300 lg:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:lg:left-[var(--sidebar-width-icon)]">
        <div className="max-w-[1000px] mx-auto w-full pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-3xl border border-zinc-100 p-8 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-6 pl-4 font-ui">
              <div className={`size-3 rounded-full ${formData.status === 'published' ? 'bg-primary shadow-[0_0_15px_rgba(88,89,71,0.2)]' : 'bg-red-400'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-900 font-ui text-left">Status do Projeto</span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest text-left font-ui">{formData.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/projects")} className="h-14 px-8 rounded-lg text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 font-ui">Descartar</Button>
              <Button variant="premium" size="xl" onClick={handleSave} className="px-12 h-16 rounded-xl gap-4 font-ui text-[11px] uppercase tracking-widest font-medium">
                <Save className="size-5" />
                Confirmar & Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
