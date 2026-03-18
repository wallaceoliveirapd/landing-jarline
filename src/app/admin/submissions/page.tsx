"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Inbox,
  Search,
  Filter,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  User,
} from "lucide-react";
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
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SubmissionWithForm = {
  _id: string;
  formId: string;
  formTitle: string;
  formFields: { id: string; label: string }[];
  data: Record<string, unknown>;
  status: string;
  createdAt: number;
};

function getDisplayName(data: Record<string, unknown>, formFields: { id: string; label: string }[]): string {
  // 1. Prioridade: campo cujo label contém "nome" (ex: "Nome completo", "Seu nome")
  const nameField = formFields?.find((f) =>
    f.label.toLowerCase().includes("nome") || f.label.toLowerCase().includes("name")
  );
  if (nameField && typeof data[nameField.id] === "string" && data[nameField.id]) {
    return data[nameField.id] as string;
  }
  // 2. Chave exata
  for (const key of ["name", "nome", "Name", "Nome"]) {
    if (typeof data[key] === "string" && data[key]) return data[key] as string;
  }
  // 3. Primeiro valor string disponível
  const firstStr = Object.values(data).find((v) => typeof v === "string" && v);
  return typeof firstStr === "string" ? firstStr : "Sem dados";
}

function getDisplayEmail(data: Record<string, unknown>, formFields: { id: string; label: string }[]): string {
  // 1. Campo cujo label contém "email" ou "e-mail"
  const emailField = formFields?.find((f) =>
    f.label.toLowerCase().includes("email") || f.label.toLowerCase().includes("e-mail")
  );
  if (emailField && typeof data[emailField.id] === "string" && data[emailField.id]) {
    return data[emailField.id] as string;
  }
  // 2. Chave exata
  for (const key of ["email", "Email", "e-mail", "E-mail"]) {
    if (typeof data[key] === "string" && data[key]) return data[key] as string;
  }
  return "";
}

function getAllDataValues(data: Record<string, unknown>): string {
  return Object.values(data ?? {})
    .map((v) => {
      if (Array.isArray(v)) return v.join(" ");
      if (typeof v === "string") return v;
      if (typeof v === "number" || typeof v === "boolean") return String(v);
      return "";
    })
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getFieldLabel(key: string, formFields: { id: string; label: string }[]): string {
  const field = formFields?.find((f) => f.id === key);
  if (field) return field.label;
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

export default function SubmissionsPage() {
  const submissions = useQuery(api.submissions.getSubmissionsWithForms) as SubmissionWithForm[] | undefined;
  const updateStatus = useMutation(api.submissions.updateStatus);
  const deleteSubmission = useMutation(api.submissions.deleteSubmission);
  const markAsAnswered = useMutation(api.submissions.markAsAnswered);

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithForm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formFilter, setFormFilter] = useState<string>("all");

  const handleOpenDetail = async (sub: SubmissionWithForm) => {
    setSelectedSubmission(sub);
    if (sub.status === "new") {
      await updateStatus({ id: sub._id as any, status: "read" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir esta mensagem permanentemente?")) {
      try {
        await deleteSubmission({ id: id as any });
        toast.success("Mensagem excluída.");
        if (selectedSubmission?._id === id) setSelectedSubmission(null);
      } catch {
        toast.error("Erro ao excluir.");
      }
    }
  };

  const handleMarkAnswered = async (id: string) => {
    try {
      await markAsAnswered({ id: id as any });
      toast.success("Marcado como respondido.");
      if (selectedSubmission?._id === id) {
        setSelectedSubmission((prev) => prev ? { ...prev, status: "answered" } : null);
      }
    } catch {
      toast.error("Erro ao atualizar.");
    }
  };

  const handleReplyEmail = (sub: SubmissionWithForm) => {
    const email = getDisplayEmail(sub.data, sub.formFields);
    if (!email) {
      toast.error("Nenhum e-mail encontrado nesta submissão.");
      return;
    }
    const name = getDisplayName(sub.data, sub.formFields);
    window.open(`mailto:${email}?subject=Re: ${encodeURIComponent(sub.formTitle)}&body=Olá ${encodeURIComponent(name)},`, "_blank");
  };

  const exportCSV = () => {
    if (!submissions || submissions.length === 0) return;
    const headers = ["ID", "Formulário", "Status", "Data", "Dados"];
    const rows = submissions.map((sub) => [
      sub._id,
      sub.formTitle,
      sub.status,
      new Date(sub.createdAt).toLocaleString("pt-BR"),
      JSON.stringify(sub.data),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório CSV exportado!");
  };

  // Unique forms for filter dropdown
  const uniqueForms = submissions
    ? [...new Map(submissions.map((s) => [s.formId, { id: s.formId, title: s.formTitle }])).values()]
    : [];

  const filteredSubmissions = submissions?.filter((sub) => {
    const matchesSearch =
      searchTerm === "" ||
      getAllDataValues(sub.data).includes(searchTerm.toLowerCase()) ||
      sub.formTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesForm = formFilter === "all" || sub.formId === formFilter;
    return matchesSearch && matchesStatus && matchesForm;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Novo</Badge>;
      case "read":
        return <Badge variant="secondary">Lido</Badge>;
      case "answered":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Respondido
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-12 py-4 sm:py-8 pb-20 sm:pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 border-b border-zinc-100 pb-6 sm:pb-12">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Gestão de Leads</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-ui">Caixa de Entrada</h2>
          <p className="text-zinc-500 text-sm max-w-md hidden sm:block">Centralize todos os orçamentos e contatos recebidos pelos formulários do site.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="premium" size="lg" className="w-full sm:w-auto" onClick={exportCSV}>
            <Filter className="size-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome, e-mail ou formulário..."
            className="pl-10 bg-zinc-50 border-none h-12"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        {uniqueForms.length > 1 && (
          <select
            className="h-12 bg-zinc-50 border-none rounded-xl px-4 text-sm font-medium text-zinc-600 focus:ring-0 outline-none"
            value={formFilter}
            onChange={(e) => setFormFilter(e.target.value)}
          >
            <option value="all">Todos os formulários</option>
            {uniqueForms.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        )}
        <select
          className="h-12 bg-zinc-50 border-none rounded-xl px-4 text-sm font-medium text-zinc-600 focus:ring-0 outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="new">Novos</option>
          <option value="read">Lidos</option>
          <option value="answered">Respondidos</option>
        </select>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {filteredSubmissions?.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="size-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <Inbox className="size-6 text-zinc-200" />
            </div>
            <p className="text-zinc-400 text-sm text-center">Caixa vazia ou sem resultados.</p>
          </div>
        )}
        {filteredSubmissions?.map((sub) => {
          const displayName = getDisplayName(sub.data, sub.formFields);
          const displayEmail = getDisplayEmail(sub.data, sub.formFields);
          return (
            <div key={sub._id} className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-ui font-medium text-sm text-zinc-900 truncate">{displayName}</p>
                    {sub.status === "new" && (
                      <div className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{displayEmail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(sub.status)}
                    <span className="text-[10px] text-zinc-400">
                      {format(new Date(sub.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 font-medium uppercase tracking-wide truncate">
                    {sub.formTitle}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon-sm" onClick={() => handleOpenDetail(sub)}>
                    <Eye className="size-3.5" />
                  </Button>
                  <Button variant="destructive" size="icon-sm" onClick={() => handleDelete(sub._id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableHead className="px-10 py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Remetente</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Formulário</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Data</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Status</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="size-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                      <Inbox className="size-6 text-zinc-200" />
                    </div>
                    <p className="text-zinc-400 text-sm font-ui tracking-wide">
                      Sua caixa de entrada está limpa ou a busca não retornou resultados.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredSubmissions?.map((sub) => {
              const displayName = getDisplayName(sub.data, sub.formFields);
              const displayEmail = getDisplayEmail(sub.data, sub.formFields);
              return (
                <TableRow key={sub._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-all duration-500 group">
                  <TableCell className="px-10 py-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-ui font-medium text-lg text-zinc-900">{displayName}</span>
                        {sub.status === "new" && (
                          <div className="size-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      {displayEmail && (
                        <span className="text-xs text-zinc-400 font-normal">{displayEmail}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-zinc-100 text-[9px] uppercase font-bold tracking-widest text-zinc-400 px-3 py-1 max-w-[180px] truncate"
                    >
                      {sub.formTitle}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-medium text-zinc-900">
                        {format(new Date(sub.createdAt), "dd MMM", { locale: ptBR })}
                      </span>
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest leading-none mt-1 font-ui">
                        {format(new Date(sub.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(sub.status)}</TableCell>
                  <TableCell className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleOpenDetail(sub)}>
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="destructive" size="icon-sm" onClick={() => handleDelete(sub._id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <SheetContent className="sm:max-w-[500px] bg-white border-l border-zinc-100 p-0 overflow-y-auto">
          <header className="p-10 bg-zinc-50 border-b border-zinc-100">
            <SheetTitle className="text-3xl font-medium font-ui tracking-tight text-zinc-900">
              Detalhes da Submissão
            </SheetTitle>
            {selectedSubmission && (
              <p className="text-xs text-zinc-400 mt-2 uppercase tracking-widest font-ui font-bold">
                {selectedSubmission.formTitle}
              </p>
            )}
          </header>

          {selectedSubmission && (
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-400">
                  <User className="size-4" />
                  <p className="text-[10px] font-medium uppercase tracking-widest font-ui">Dados Enviados</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(selectedSubmission.data || {}).map(([key, value]) => {
                    const label = getFieldLabel(key, selectedSubmission.formFields);

                    let displayValue = value;
                    if (Array.isArray(value)) displayValue = value.join(", ");
                    if (typeof value === "boolean") displayValue = value ? "Sim" : "Não";

                    return (
                      <div key={key} className="p-5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium mb-1 font-ui">
                          {label}
                        </p>
                        <p className="text-base font-medium text-zinc-900 whitespace-pre-wrap">
                          {String(displayValue)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-400 space-y-1">
                <p>
                  <span className="uppercase tracking-widest font-bold">Data: </span>
                  {format(new Date(selectedSubmission.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
                <p>
                  <span className="uppercase tracking-widest font-bold">Status: </span>
                  {selectedSubmission.status === "new" ? "Novo" : selectedSubmission.status === "read" ? "Lido" : "Respondido"}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="premium"
                  size="xl"
                  className="w-full"
                  onClick={() => handleReplyEmail(selectedSubmission)}
                >
                  <Mail className="size-4 mr-2" />
                  Responder via E-mail
                </Button>
                {selectedSubmission.status !== "answered" && (
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => handleMarkAnswered(selectedSubmission._id)}
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Marcar como Respondido
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
        <div className="bg-white p-5 sm:p-10 rounded-2xl border border-zinc-100 group hover:border-zinc-200 transition-all shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui mb-2 block">Total de Respostas</span>
          <div className="flex items-end justify-between">
            <p className="text-2xl sm:text-4xl font-medium font-ui text-zinc-900">{submissions?.length || 0}</p>
            <Inbox className="size-6 sm:size-8 text-zinc-100 group-hover:text-zinc-200 transition-colors" />
          </div>
        </div>
        <div className="bg-white p-5 sm:p-10 rounded-2xl border border-zinc-100 group hover:border-zinc-200 transition-all shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui mb-2 block">Novos Hoje</span>
          <div className="flex items-end justify-between">
            <p className="text-2xl sm:text-4xl font-medium font-ui text-zinc-900">
              {submissions?.filter((s) => new Date(s.createdAt).toDateString() === new Date().toDateString()).length || 0}
            </p>
            <Clock className="size-6 sm:size-8 text-zinc-100 group-hover:text-zinc-200 transition-colors" />
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-primary p-5 sm:p-10 rounded-2xl text-white shadow-xl shadow-primary/20 group overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/50 font-ui mb-2 block">Não Lidos</span>
            <div className="flex items-end justify-between">
              <p className="text-2xl sm:text-4xl font-medium font-ui">
                {submissions?.filter((s) => s.status === "new").length || 0}
              </p>
              <Mail className="size-6 sm:size-8 text-white/20" />
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
            <Mail className="size-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
