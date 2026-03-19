"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Search, Layout, Pencil, Trash2, Eye, EyeOff, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PagesManagementPage() {
  const router = useRouter();
  const pages = useQuery(api.pages.getPages);
  const updatePage = useMutation(api.pages.updatePage);
  const deletePage = useMutation(api.pages.deletePage);

  const toggleStatus = async (id: any, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "published" ? "draft" : "published";
      await updatePage({ id, status: nextStatus });
      toast.success(`Página alterada para ${nextStatus === 'published' ? 'Pública' : 'Rascunho'}`);
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Deseja excluir permanentemente esta página?")) {
      try {
        await deletePage({ id });
        toast.success("Página excluída.");
      } catch (error) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-12 py-4 sm:py-8 pb-20 sm:pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 border-b border-zinc-100 pb-6 sm:pb-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Módulo de Conteúdo Digital</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-ui">Páginas Institucionais</h2>
          <p className="text-zinc-500 text-sm max-w-md hidden sm:block">Gerencie as páginas individuais e a estrutura modular conforme Seção 8 do PRD.</p>
        </div>

        <Button
          onClick={() => router.push("/admin/pages/new")}
          variant="premium"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {pages === undefined ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Carregando...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
              <Search className="size-6 text-zinc-200" />
            </div>
            <p className="text-zinc-400 text-sm">Nenhuma página cadastrada.</p>
          </div>
        ) : pages.map((page) => (
          <div key={page._id} className="bg-white border border-zinc-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <Layout className="size-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="font-ui font-medium text-sm text-zinc-900 truncate">{page.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="text-[9px] text-zinc-400 font-mono">/{page.slug}</code>
                  <button
                    onClick={() => toggleStatus(page._id, page.status)}
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md transition-all ${page.status === "published" ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"}`}
                  >
                    {page.status === "published" ? "Publicada" : "Rascunho"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="secondary" size="icon-sm" onClick={() => router.push(`/admin/pages/${page._id}`)}>
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(page._id)} className="text-zinc-300 hover:text-red-500 hover:bg-red-50">
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
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Nome da Página</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Endpoint / Slug</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Status</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages === undefined ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Carregando Estruturas...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : pages?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                      <Search className="size-6 text-zinc-200" />
                    </div>
                    <p className="text-zinc-400 text-sm font-ui tracking-wide">Nenhuma páginainstitucional encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pages?.map((page) => (
                <TableRow key={page._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-all duration-500 group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="size-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 overflow-hidden shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Layout className="size-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-ui font-medium text-lg text-zinc-900">{page.title}</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-ui">ID: {page._id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/page/${page.slug}`} target="_blank">
                      <code className="text-[10px] bg-zinc-50 px-3 py-1 rounded-lg text-zinc-500 font-mono">
                        /page/{page.slug}
                      </code>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleStatus(page._id, page.status)}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${page.status === "published"
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                    >
                      {page.status === "published" ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {page.status === "published" ? 'Publicada' : 'Rascunho'}
                    </button>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => router.push(`/admin/pages/${page._id}`)}
                        className="text-zinc-400 hover:text-zinc-900"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(page._id)}
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

      {/* Info Highlight */}
      <div className="p-6 sm:p-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-12 group">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="size-12 sm:size-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
            <Globe className="size-5 sm:size-6 text-zinc-900" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-medium font-ui text-zinc-900">Arquitetura de Conteúdo</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
              Páginas institucionais são construídas através de um sistema de blocos modulares.
              Isso permite que você crie layouts únicos para Metodologias, FAQ, Sobre e outras seções específicas sem depender de templates fixos.
            </p>
          </div>
        </div>
        <div className="hidden md:flex size-56 bg-white rounded-2xl border border-zinc-100 shadow-xl shadow-zinc-900/5 items-center justify-center relative overflow-hidden">
          <Layout className="size-20 text-zinc-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
