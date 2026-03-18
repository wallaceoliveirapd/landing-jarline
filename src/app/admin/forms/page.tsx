"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, LayoutPanelTop, Pencil, Trash2, Eye, EyeOff, Settings2, Sparkles, Mail, ShieldCheck } from "lucide-react";
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

export default function FormsManagementPage() {
  const router = useRouter();
  const forms = useQuery(api.forms.getForms);
  const updateForm = useMutation(api.forms.updateForm);
  const deleteForm = useMutation(api.forms.deleteForm);

  const toggleStatus = async (id: any, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "active" ? "inactive" : "active";
      await updateForm({ id, status: nextStatus });
      toast.success(`Formulário ${nextStatus === 'active' ? 'Ativado' : 'Pausado'}`);
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Deseja excluir permanentemente este formulário? Isso não apagará as mensagens já recebidas.")) {
      try {
        await deleteForm({ id });
        toast.success("Formulário removido.");
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
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Engajamento & Leads</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-ui">Formulários de Captura</h2>
          <p className="text-zinc-500 text-sm max-w-md hidden sm:block">Configure os pontos de entrada de novos clientes e orçamentos (PRD Seção 9).</p>
        </div>

        <Button
          variant="premium"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin/forms/new")}
        >
          <Plus className="size-4 mr-2" />
          Novo Formulário
        </Button>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {forms === undefined ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Carregando...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
              <LayoutPanelTop className="size-6 text-zinc-200" />
            </div>
            <p className="text-zinc-400 text-sm">Nenhum formulário cadastrado.</p>
          </div>
        ) : forms.map((form) => (
          <div key={form._id} className="bg-white border border-zinc-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 size-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <LayoutPanelTop className="size-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="font-ui font-medium text-sm text-zinc-900 truncate">{form.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-zinc-400">{form.fields.length} campos</span>
                  <button
                    onClick={() => toggleStatus(form._id, form.status)}
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md transition-all ${form.status === "active" ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"}`}
                  >
                    {form.status === "active" ? "Ativo" : "Pausado"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="secondary" size="icon-sm" onClick={() => router.push(`/admin/forms/${form._id}`)}>
                <Settings2 className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(form._id)} className="text-zinc-300 hover:text-red-500 hover:bg-red-50">
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
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Identificação</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Status</TableHead>
              <TableHead className="py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Destinatário</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui text-right">Controle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms === undefined ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="size-8 rounded-full border-2 border-zinc-100 border-t-primary animate-spin" />
                    <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-2">Mapeando Fluxos...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : forms?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-100  ">
                      ?
                    </div>
                    <p className="text-zinc-400 text-sm font-ui tracking-wide">Nenhum fluxo de recepção configurado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              forms?.map((form) => (
                <TableRow key={form._id} className="border-zinc-50 hover:bg-zinc-50/30 transition-all duration-500 group">
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="size-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <LayoutPanelTop className="size-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-ui font-medium text-lg text-zinc-900">{form.title}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-ui">{form.fields.length} campos definidos</span>
                          {form.allowRecaptcha && <Badge className="bg-zinc-50 text-zinc-400 border-zinc-100 font-ui text-[8px] h-5 px-2 rounded-lg"><ShieldCheck className="size-2 mr-1" /> Protected</Badge>}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleStatus(form._id, form.status)}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${form.status === "active"
                        ? 'bg-primary text-white shadow-lg shadow-primary/10'
                        : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                    >
                      {form.status === "active" ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                      {form.status === "active" ? 'Ativo' : 'Pausado'}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-600 font-ui font-medium flex items-center gap-2">
                        <Mail className="size-3 text-zinc-300" />
                        {form.targetEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => router.push(`/admin/forms/${form._id}`)}
                        className="text-zinc-400 hover:text-zinc-900"
                      >
                        <Settings2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(form._id)}
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

      {/* Admin Feature Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-6 sm:p-12 rounded-2xl bg-primary text-white space-y-6 sm:space-y-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-4 sm:space-y-6 relative z-10">
            <div className="size-12 sm:size-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl group-hover:bg-white group-hover:text-primary transition-all duration-700">
              <Sparkles className="size-5 sm:size-6 shadow-sm" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-3xl font-medium font-ui leading-tight">Análise Preditiva (Jal)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Toda submissão é processada pela Jal Intelligence. O sistema extrai intenções, qualifica o lead e sugere respostas rápidas no seu dashboard de Inbox.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Módulo de IA Integrado</span>
          </div>
          <div className="absolute -bottom-10 -right-10 size-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="p-6 sm:p-12 rounded-2xl border border-zinc-100 bg-white space-y-6 sm:space-y-8 flex flex-col">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-primary" />
              <h4 className="font-ui font-medium text-zinc-900 text-xl sm:text-3xl">Pronto para Ecossistemas</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['WhatsApp', 'E-mail SMTP', 'RD Station', 'Google Sheets'].map((int) => (
                <div key={int} className="px-4 py-4 sm:px-6 sm:py-5 rounded-2xl bg-zinc-50 flex items-center justify-center border border-zinc-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 cursor-pointer group/int">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/int:text-white">{int}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest leading-relaxed mt-auto">
            Integrações via Webhooks e API nativa Convex disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
}
