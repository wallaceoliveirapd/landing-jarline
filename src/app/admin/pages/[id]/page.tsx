"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Trash2,
  Type,
  Layout,
  Image as ImageIconLucide,
  Globe,
  Settings2,
  X,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function InstitutionalPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const page = useQuery(api.pages.getPageById, isNew ? "skip" : { id: id as any });
  const createPage = useMutation(api.pages.createPage);
  const updatePage = useMutation(api.pages.updatePage);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    description: "",
    status: "published",
    content: [],
    seoTitle: "",
    seoDescription: "",
    coverImage: ""
  });

  const [isSlugManual, setIsSlugManual] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        ...page,
        content: page.content || [],
      });
      setIsSlugManual(true);
    }
  }, [page]);

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
        const { _id, _creationTime, createdAt, updatedAt, publishedAt, ...updateData } = formData;
        await updatePage({ id: id as any, ...updateData });
        toast.success("Página atualizada!");
      } else {
        const { _id, _creationTime, createdAt, updatedAt, publishedAt, ...createData } = formData;
        await createPage(createData);
        toast.success("Página criada com sucesso!");
      }
      router.push("/admin/pages");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar página.");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 py-8 pb-40">
      <header className="flex flex-col gap-8 border-b border-zinc-100 pb-12">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all w-fit"
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
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Módulo Institucional</span>
            </div>
            <h2 className="text-5xl font-medium tracking-tighter text-zinc-900 font-display  ">
              {isNew ? "Nova Página" : "Editar Página"}
            </h2>
            <p className="text-zinc-500 text-sm max-w-md">Controle de páginas estáticas e conteúdo modular (PRD Seção 8).</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/admin/pages")} className="h-14 px-8 rounded-lg text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Cancelar</Button>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-20">
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="mb-16 h-20">
            <TabsTrigger value="base">Informações Base</TabsTrigger>
            <TabsTrigger value="content">Editor Modular</TabsTrigger>
            <TabsTrigger value="seo">SEO & Visibilidade</TabsTrigger>
          </TabsList>

          <TabsContent value="base" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4 col-span-2">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Título da Página</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-20 px-8 text-2xl focus:bg-white transition-all font-ui"
                  placeholder="Ex: Metodologia de Trabalho"
                  required
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">Caminho da URL (Slug)</Label>
                <div className="flex items-center gap-3 group">
                  <div className="bg-zinc-100 px-6 h-14 rounded-2xl flex items-center text-zinc-400 text-xs font-medium border border-transparent group-focus-within:border-zinc-200 transition-all">
                    jarlinevieira.com.br/
                  </div>
                  <Input
                    value={formData.slug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, slug: val });
                      setIsSlugManual(val !== "");
                    }}
                    className="font-mono text-sm shadow-none"
                    placeholder="nome-da-pagina"
                  />
                  {isSlugManual && (
                    <Button
                      type="button"
                      onClick={() => setIsSlugManual(false)}
                      variant="ghost"
                      className="h-14 px-4 rounded-2xl text-[9px] uppercase font-medium tracking-wider text-zinc-400 font-ui"
                    >
                      Resetar
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <ImageUpload
                  label="Imagem de Capa"
                  description="Imagem principal que aparece no topo da página institucional."
                  value={formData.coverImage}
                  onChange={(storageId) => setFormData({ ...formData, coverImage: storageId })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Descrição/Resumo (Description)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[140px]"
                placeholder="Breve resumo da página para listagens ou cards internos..."
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
                  placeholder="Escreva o conteúdo da página."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Globe className="size-5" />
                  </div>
                  <h4 className="text-xl font-ui font-medium text-zinc-900 leading-tight">Google Indexation</h4>
                </div>

                <div className="p-10 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-8 shadow-inner">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">SEO Meta Title</Label>
                    <Input
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="bg-white border-zinc-100 shadow-sm"
                      placeholder="Título para o Google..."
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">Meta Description</Label>
                    <Textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="bg-white border-zinc-100"
                      placeholder="Descrição para resultados de busca..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <Settings2 className="size-5" />
                  </div>
                  <h4 className="text-xl font-ui font-medium text-zinc-900 leading-tight">Configurações Finais</h4>
                </div>

                <div className="space-y-6">
                  <ImageUpload
                    label="Social Share Image (SEO)"
                    description="Imagem que aparece quando o link é compartilhado nas redes sociais."
                    value={formData.seoImage}
                    onChange={(storageId) => setFormData({ ...formData, seoImage: storageId })}
                    aspectRatio="video"
                  />

                  <div className="flex items-center justify-between p-10 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white transition-all shadow-sm">
                    <div className="space-y-2">
                      <p className="font-ui font-medium text-lg leading-none text-zinc-900">Estado: {formData.status === "published" ? "Público" : "Draft"}</p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium font-ui">Visibilidade no site principal</p>
                    </div>
                    <Switch
                      className="data-[state=checked]:bg-primary"
                      checked={formData.status === "published"}
                      onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "published" : "draft" })}
                    />
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
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-900 font-ui text-left">Status da Página</span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest text-left font-ui">{formData.status === 'published' ? 'Ao vivo' : 'Rascunho de trabalho'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/admin/pages")} className="h-14 px-8 rounded-lg text-[10px] font-medium uppercase tracking-widest text-zinc-400 hover:text-zinc-900 font-ui">Descartar</Button>
              <Button variant="premium" size="xl" onClick={handleSave} className="px-12 h-16 rounded-xl gap-4 font-ui text-[11px] uppercase tracking-widest font-medium">
                <Save className="size-5" />
                Confirmar & Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
