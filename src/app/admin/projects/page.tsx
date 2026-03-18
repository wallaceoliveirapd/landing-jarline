"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Star,
  Copy,
  Image as ImageIconLucide,
  Layout
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ProjectsManagementPage() {
  const router = useRouter();
  const projects = useQuery(api.projects.getProjects);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  const createProject = useMutation(api.projects.createProject);

  const toggleProjectStatus = async (id: any, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "published" ? "draft" : "published";
      await updateProject({ id, status: nextStatus });
      toast.success(`Projeto definido como ${nextStatus === 'published' ? 'Público' : 'Rascunho'}`);
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const toggleFeatured = async (id: any, currentFeatured: boolean) => {
    try {
      await updateProject({ id, isFeatured: !currentFeatured });
      toast.success(`Projeto ${!currentFeatured ? 'destacado' : 'removido dos destaques'}`);
    } catch (error) {
      toast.error("Erro ao atualizar destaque.");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await deleteProject({ id });
        toast.success("Projeto excluído.");
      } catch (error) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  const handleDuplicate = async (project: any) => {
    try {
      const { _id, _creationTime, ...copyData } = project;
      await createProject({
        ...copyData,
        title: `${copyData.title} (Cópia)`,
        slug: `${copyData.slug}-copia`,
        isFeatured: false,
        order: (projects?.length || 0) + 1
      });
      toast.success("Projeto duplicado!");
    } catch (error) {
      toast.error("Erro ao duplicar.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-12 py-4 sm:py-8 pb-20 sm:pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 border-b border-zinc-100 pb-6 sm:pb-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Módulo de Portfólio</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-ui">Gestão de Projetos</h2>
          <p className="text-zinc-500 text-sm max-w-md hidden sm:block">Controle editorial completo conforme Seção 7 do PRD Jarline Vieira.</p>
        </div>

        <Button
          onClick={() => router.push("/admin/projects/new")}
          variant="premium"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {projects === undefined ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Carregando...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
              <Search className="size-6 text-zinc-200" />
            </div>
            <p className="text-zinc-400 text-sm">Nenhum projeto cadastrado.</p>
          </div>
        ) : projects.map((project) => (
          <div key={project._id} className="bg-white border border-zinc-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-12 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden">
                {project.coverImage
                  ? <img src={project.coverImage} className="size-full object-cover" alt={project.title} />
                  : <ImageIconLucide className="size-5 text-zinc-300 m-auto mt-3.5" />
                }
              </div>
              <div className="min-w-0">
                <p className="font-ui font-medium text-sm text-zinc-900 truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0 h-4">{project.category || "Geral"}</Badge>
                  <button
                    onClick={() => toggleProjectStatus(project._id, project.status)}
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md transition-all ${project.status === "published" ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"}`}
                  >
                    {project.status === "published" ? "Publicado" : "Rascunho"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="secondary" size="icon-sm" onClick={() => router.push(`/admin/projects/${project._id}`)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(project._id)} className="text-zinc-300 hover:text-red-500 hover:bg-red-50">
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Projeto & Arquitetura</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Status</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Featured</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Galeria</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects === undefined ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Carregando Acervo...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : projects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                      <Search className="size-6 text-zinc-200" />
                    </div>
                    <p className="text-zinc-400 text-sm font-ui tracking-wide">Nenhum projeto registrado no portfólio.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects?.map((project) => (
                <TableRow key={project._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-all duration-500 group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-sm">
                        {project.coverImage ? (
                          <img src={project.coverImage} className="size-full object-cover" alt={project.title} />
                        ) : (
                          <ImageIconLucide className="size-6" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-ui font-medium text-lg text-zinc-900 group-hover:text-primary transition-colors">{project.title}</span>
                        <div className="flex items-center gap-3">
                          <Badge className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5">{project.category || "Geral"}</Badge>
                          <span className="text-[10px] font-mono text-zinc-300">/{project.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleProjectStatus(project._id, project.status)}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${project.status === "published"
                        ? 'bg-primary text-white shadow-lg shadow-primary/10'
                        : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                    >
                      {project.status === "published" ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {project.status === "published" ? 'Publicado' : 'Rascunho'}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleFeatured(project._id, project.isFeatured)}
                      className={`size-12 inline-flex items-center justify-center rounded-2xl transition-all ${project.isFeatured ? 'bg-primary text-white shadow-xl shadow-primary/20 rotate-12 scale-110' : 'text-zinc-200 hover:text-zinc-400 bg-zinc-50'
                        }`}
                    >
                      <Star className={`size-5 ${project.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <div className="size-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                        <Layout className="size-4 text-zinc-300" />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{(project.gallery || []).length} Fotos</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => handleDuplicate(project)}
                        className="text-zinc-400 hover:text-zinc-900"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => router.push(`/admin/projects/${project._id}`)}
                        className="text-zinc-400 hover:text-zinc-900"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(project._id)}
                        className="text-zinc-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
