"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Lock, Link2, Bell, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { FormBuilder } from "@/components/admin/form-builder";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEFAULT_FIELDS = [
  { id: "f1", label: "Nome Completo", type: "text", required: true, placeholder: "Seu nome...", width: "full", visible: true, order: 0 },
  { id: "f2", label: "E-mail de Contato", type: "email", required: true, placeholder: "email@exemplo.com", width: "full", visible: true, order: 1 },
];

export default function FormEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === "new";

  const form = useQuery(api.forms.getFormById, isNew ? "skip" : { id: id as any });
  const createForm = useMutation(api.forms.createForm);
  const updateForm = useMutation(api.forms.updateForm);

  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    displayTitle: "",
    description: "",
    successMessage: "Obrigado! Sua mensagem foi enviada com sucesso. Em breve entraremos em contato.",
    targetEmail: "",
    notifyAllAdmins: true,
    redirectUrl: "",
    sendEmail: false,
    sendWhatsApp: false,
    whatsappNumber: "",
    fields: DEFAULT_FIELDS,
    status: "active",
    allowRecaptcha: true,
  });

  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (form) {
      setFormData(form);
      setSlugEdited(!!form.slug);
    }
  }, [form]);

  const handleTitleChange = (title: string) => {
    const updates: any = { title };
    if (!slugEdited) {
      updates.slug = toSlug(title);
    }
    setFormData({ ...formData, ...updates });
  };

  const handleSlugChange = (slug: string) => {
    setSlugEdited(true);
    setFormData({ ...formData, slug: toSlug(slug) });
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        displayTitle: formData.displayTitle || undefined,
        description: formData.description || undefined,
        successMessage: formData.successMessage || undefined,
        targetEmail: formData.targetEmail || undefined,
        notifyAllAdmins: formData.notifyAllAdmins ?? true,
        redirectUrl: formData.redirectUrl || undefined,
        sendEmail: !!formData.sendEmail,
        sendWhatsApp: !!formData.sendWhatsApp,
        whatsappNumber: formData.whatsappNumber || undefined,
        allowRecaptcha: !!formData.allowRecaptcha,
        fields: (formData.fields || []).map((f: any, i: number) => ({
          id: f.id,
          type: f.type,
          label: f.label,
          placeholder: f.placeholder || undefined,
          helpText: f.helpText || undefined,
          required: !!f.required,
          defaultValue: f.defaultValue || undefined,
          mask: f.mask || undefined,
          width: f.width || "full",
          options: f.options || undefined,
          validation: f.validation || undefined,
          order: i,
          visible: f.visible !== false,
        })),
        status: formData.status || "active",
      };

      if (!isNew) {
        await updateForm({ id: id as any, ...payload });
        toast.success("Formulário atualizado!");
      } else {
        await createForm(payload);
        toast.success("Formulário criado!");
      }
      router.push("/admin/forms");
    } catch (error) {
      toast.error("Erro ao salvar formulário.");
    }
  };

  const set = (key: string, val: any) => setFormData((p: any) => ({ ...p, [key]: val }));

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 py-8 pb-40">
      {/* Header */}
      <header className="flex flex-col gap-8 border-b border-zinc-100 pb-12">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all w-fit"
        >
          <div className="size-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-all">
            <ChevronLeft className="size-4" />
          </div>
          Voltar para Central de Leads
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">
                Mecanismo de Captura
              </span>
            </div>
            <h2 className="text-5xl font-medium tracking-tighter text-zinc-900 font-ui">
              {isNew ? "Criar Formulário" : "Configurar Form"}
            </h2>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-20">
        <Tabs defaultValue="base" className="w-full">
          <TabsList className="bg-zinc-100/40 p-1.5 mb-16 rounded-2xl w-fit flex h-20 border border-zinc-100/50 gap-1">
            {[
              { value: "base", label: "Definições", icon: LayoutTemplate },
              { value: "fields", label: "Campos", icon: LayoutTemplate },
              { value: "notifications", label: "Notificações", icon: Bell },
              { value: "security", label: "Segurança", icon: Lock },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-xl px-8 h-full text-[11px] uppercase font-bold tracking-[0.15em] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20 text-zinc-400 transition-all duration-300"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Definições ─────────────────────────────────────── */}
          <TabsContent value="base" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Identificação Interna
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl h-20 px-8 text-2xl font-ui focus:bg-white transition-all shadow-sm"
                  placeholder="Ex: Formulário de Contato Principal"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  URL Pública (Slug)
                </Label>
                <div className="flex items-center gap-0 bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden shadow-sm focus-within:bg-white transition-all">
                  <span className="px-5 text-zinc-400 text-sm font-ui border-r border-zinc-100 h-14 flex items-center whitespace-nowrap">
                    /form/
                  </span>
                  <input
                    value={formData.slug || ""}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 h-14 px-4 bg-transparent text-sm font-ui focus:outline-none text-zinc-900"
                    placeholder="meu-formulario"
                  />
                  {formData.slug && (
                    <a
                      href={`/form/${formData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 text-zinc-400 hover:text-primary transition-colors"
                    >
                      <Link2 className="size-4" />
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-ui">
                  Gerado automaticamente a partir do título. Somente letras minúsculas, números e hífens.
                </p>
              </div>

              {/* Display title */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Título para o Cliente <span className="text-zinc-300 font-normal normal-case tracking-normal">(opcional — aparece no topo do formulário público)</span>
                </Label>
                <Input
                  value={formData.displayTitle || ""}
                  onChange={(e) => set("displayTitle", e.target.value)}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl h-14 px-6 text-base font-ui focus:bg-white transition-all shadow-sm"
                  placeholder="Ex: Entre em Contato"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Instruções ao Cliente
                </Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl min-h-[120px] p-6 text-sm leading-relaxed focus:bg-white transition-all"
                  placeholder="Texto exibido no topo do formulário público..."
                />
              </div>

              {/* Success message */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Mensagem de Sucesso
                </Label>
                <Textarea
                  value={formData.successMessage || ""}
                  onChange={(e) => set("successMessage", e.target.value)}
                  className="bg-zinc-50 border-zinc-100 rounded-2xl min-h-[100px] p-6 text-sm leading-relaxed focus:bg-white transition-all"
                  placeholder="Mensagem exibida após o envio bem-sucedido..."
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Campos ─────────────────────────────────────────── */}
          <TabsContent value="fields" className="space-y-10">
            <FormBuilder
              fields={formData.fields || []}
              onChange={(fields) => set("fields", fields)}
            />
          </TabsContent>

          {/* ── Notificações ───────────────────────────────────── */}
          <TabsContent value="notifications" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              {/* E-mail notification */}
              <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-ui font-medium text-lg leading-none text-zinc-900">Notificação por E-mail</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Receba um e-mail a cada envio</p>
                  </div>
                  <Switch
                    checked={!!formData.sendEmail}
                    onCheckedChange={(val) => set("sendEmail", val)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                {formData.sendEmail && (
                  <div className="space-y-4">
                    {/* Checkbox para todos os admins */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="notifyAllAdmins"
                        checked={formData.notifyAllAdmins ?? true}
                        onChange={(e) => set("notifyAllAdmins", e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="notifyAllAdmins" className="text-sm text-zinc-700 font-ui cursor-pointer">
                        Enviar para todos os administradores
                      </label>
                    </div>
                    
                    {/* Campo de email específico */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        E-mail de Destino Específico
                      </Label>
                      <Input
                        type="email"
                        value={formData.targetEmail || ""}
                        onChange={(e) => set("targetEmail", e.target.value)}
                        className={`bg-white border-zinc-100 rounded-xl h-12 px-5 text-sm font-ui focus:border-primary/30 transition-all shadow-sm ${formData.notifyAllAdmins ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder="destino@email.com"
                        disabled={formData.notifyAllAdmins}
                      />
                      {formData.notifyAllAdmins && (
                        <p className="text-xs text-zinc-400">E-mails serão enviados para todos os administradores.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Redirect URL */}
              <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                <div className="space-y-1">
                  <p className="font-ui font-medium text-lg leading-none text-zinc-900">Redirecionamento Pós-Envio</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Redirecionar para URL específica após submissão</p>
                </div>
                <Input
                  type="url"
                  value={formData.redirectUrl || ""}
                  onChange={(e) => set("redirectUrl", e.target.value)}
                  className="bg-white border-zinc-100 rounded-xl h-12 px-5 text-sm font-ui focus:border-primary/30 transition-all shadow-sm"
                  placeholder="https://seusite.com/obrigado (deixe em branco para usar a mensagem de sucesso)"
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Segurança ──────────────────────────────────────── */}
          <TabsContent value="security" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-ui font-medium text-lg leading-none text-zinc-900">Google reCAPTCHA v3</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Bloqueio inteligente de robôs</p>
                </div>
                <Switch
                  checked={!!formData.allowRecaptcha}
                  onCheckedChange={(val) => set("allowRecaptcha", val)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-ui font-medium text-lg leading-none text-zinc-900">Status do Fluxo</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Ativar ou pausar recebimento</p>
                </div>
                <Switch
                  checked={formData.status === "active"}
                  onCheckedChange={(val) => set("status", val ? "active" : "inactive")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>

      {/* Footer */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none lg:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:lg:left-[var(--sidebar-width-icon)]">
        <div className="max-w-[1000px] mx-auto w-full pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-3xl border border-zinc-100 p-8 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-6 pl-4">
              <div
                className={`size-3 rounded-full ${formData.status === "active"
                    ? "bg-primary shadow-[0_0_15px_rgba(88,89,71,0.2)]"
                    : "bg-red-400"
                  }`}
              />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-900 font-ui">
                  {formData.title || "Formulário sem título"}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                  {formData.status === "active" ? "Captura Ativa" : "Fluxo Pausado"}
                  {formData.slug ? ` · /form/${formData.slug}` : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => router.push("/admin/forms")}
                className="h-14 px-8 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
              >
                Abortar
              </Button>
              <Button
                variant="premium"
                size="xl"
                type="button"
                onClick={handleSave}
                className="px-12 h-16 rounded-xl gap-4"
              >
                <Save className="size-5" />
                Finalizar Configuração
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
