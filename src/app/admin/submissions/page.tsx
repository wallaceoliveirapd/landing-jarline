"use client";

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
  Calendar,
  User,
  X
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

export default function SubmissionsPage() {
  const submissions = useQuery(api.submissions.getSubmissions);
  const updateStatus = useMutation(api.submissions.updateStatus);
  const deleteSubmission = useMutation(api.submissions.deleteSubmission);

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleOpenDetail = async (sub: any) => {
    setSelectedSubmission(sub);
    if (sub.status === "new") {
      await updateStatus({ id: sub._id, status: "read" });
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Deseja excluir esta mensagem permanentemente?")) {
      try {
        await deleteSubmission({ id });
        toast.success("Mensagem arquivada/excluída.");
        if (selectedSubmission?._id === id) setSelectedSubmission(null);
      } catch (error) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  const exportCSV = () => {
    if (!submissions || submissions.length === 0) return;
    const headers = ["ID", "Origem", "Status", "Data", "Dados"];
    const rows = submissions.map(sub => [
      sub._id,
      sub.formId,
      sub.status,
      new Date(sub.createdAt).toLocaleString("pt-BR"),
      JSON.stringify(sub.data)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(cell => `"${cell}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório CSV exportado!");
  };

  const filteredSubmissions = submissions?.filter(sub => {
    const matchesSearch = sub.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.data.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Novo</Badge>;
      case "read":
        return <Badge variant="secondary">Lido</Badge>;
      case "answered":
        return <Badge variant="default">Respondido</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 py-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Gestão de Leads</span>
          </div>
          <h2 className="text-4xl font-medium tracking-tight text-zinc-900 font-ui">Caixa de Entrada</h2>
          <p className="text-zinc-500 text-sm max-w-md">Centralize todos os orçamentos e contatos recebidos pelos formulários do site.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="premium" size="lg" onClick={exportCSV}>
            <Filter className="size-4 mr-2" /> Exportar Relatório CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-10 bg-zinc-50 border-none h-12"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
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

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="border-zinc-100 hover:bg-transparent">
              <TableHead className="px-10 py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Remetente & Assunto</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Origem</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Data</TableHead>
              <TableHead className="py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-center">Status</TableHead>
              <TableHead className="px-10 py-6 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui text-right">Detalhamento</TableHead>
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
                    <p className="text-zinc-400 text-sm font-ui tracking-wide">Sua caixa de entrada está limpa ou a busca não retornou resultados.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredSubmissions?.map((sub) => {
              const dataEntries = Object.entries(sub.data || {}).slice(0, 2);
              const firstValue = dataEntries[0]?.[1];
              const secondValue = dataEntries[1]?.[1];
              return (
              <TableRow key={sub._id} className="border-zinc-50 hover:bg-zinc-50/50 transition-all duration-500 group">
                <TableCell className="px-10 py-8">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-ui font-medium text-lg text-zinc-900">
                        {typeof firstValue === 'string' ? firstValue : "Sem dados"}
                      </span>
                      {sub.status === 'new' && <div className="size-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <span className="text-xs text-zinc-400 font-normal">
                      {typeof secondValue === 'string' ? secondValue : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="border-zinc-100 text-[9px] uppercase font-bold tracking-widest text-zinc-400 px-3 py-1">{sub.formId}</Badge>
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
                <TableCell className="text-center">
                  {getStatusBadge(sub.status)}
                </TableCell>
                <TableCell className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleOpenDetail(sub)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleDelete(sub._id)}
                    >
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
        <SheetContent className="sm:max-w-[500px] bg-white border-l border-zinc-100 p-0">
          <header className="p-10 bg-zinc-50 border-b border-zinc-100">
            <SheetTitle className="text-3xl font-medium font-ui tracking-tight text-zinc-900">Detalhes do Lead</SheetTitle>
            <p className="text-xs text-zinc-400 mt-2 uppercase tracking-widest font-ui font-bold">Registro de Submissão em Águas Claras</p>
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
                    const displayKey = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/_/g, " ")
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .trim();
                    
                    let displayValue = value;
                    if (Array.isArray(value)) displayValue = value.join(", ");
                    if (typeof value === "boolean") displayValue = value ? "Sim" : "Não";
                    
                    return (
                      <div key={key} className="p-5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium mb-1 font-ui">{displayKey}</p>
                        <p className="text-base font-medium text-zinc-900">{String(displayValue)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <Button variant="premium" size="xl" className="w-full">
                  <Mail className="size-4 mr-2" />
                  Responder via E-mail
                </Button>
                <Button variant="outline" size="xl" className="w-full" onClick={() => setSelectedSubmission(null)}>
                  Fechar Detalhes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 group hover:border-zinc-200 transition-all shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui mb-2 block">Conversão Total</span>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-medium font-ui text-zinc-900">{submissions?.length || 0}</p>
            <Inbox className="size-8 text-zinc-100 group-hover:text-zinc-200 transition-colors" />
          </div>
        </div>
        <div className="bg-white p-10 rounded-2xl border border-zinc-100 group hover:border-zinc-200 transition-all shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui mb-2 block">Novos Hoje</span>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-medium font-ui text-zinc-900">
              {submissions?.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).length || 0}
            </p>
            <Clock className="size-8 text-zinc-100 group-hover:text-zinc-200 transition-colors" />
          </div>
        </div>
        <div className="bg-primary p-10 rounded-2xl text-white shadow-xl shadow-primary/20 group overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/50 font-ui mb-2 block">Controle de Respostas</span>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-medium font-ui">100%</p>
              <CheckCircle2 className="size-8 text-white/20" />
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
