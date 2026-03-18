"use client";

import { Button } from "@/components/ui/button";
import { GripVertical, X, Plus, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: string;
  width?: string; // "full" | "half" | "third"
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order?: number;
  visible: boolean;
}

const FIELD_TYPES = [
  { group: "Entrada de Texto", items: [
    { value: "text", label: "Texto Curto" },
    { value: "textarea", label: "Texto Longo" },
    { value: "email", label: "E-mail" },
    { value: "tel", label: "Telefone / WhatsApp" },
    { value: "number", label: "Número" },
    { value: "url", label: "Link / URL" },
    { value: "date", label: "Data" },
  ]},
  { group: "Seleção", items: [
    { value: "select", label: "Lista Suspensa" },
    { value: "radio", label: "Múltipla Escolha (radio)" },
    { value: "checkbox", label: "Caixas de Seleção" },
  ]},
  { group: "Outros", items: [
    { value: "file", label: "Upload de Arquivo" },
    { value: "acceptance", label: "Aceite de Termos" },
    { value: "title", label: "Título / Seção" },
    { value: "description", label: "Texto Descritivo" },
    { value: "separator", label: "Divisor" },
  ]},
];

const ALL_TYPES = FIELD_TYPES.flatMap(g => g.items);
const HAS_OPTIONS = ["select", "radio", "checkbox"];
const HAS_PLACEHOLDER = ["text", "email", "tel", "number", "url", "date", "textarea"];
const IS_LAYOUT = ["title", "separator", "description"];

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    setIsDragging(true);
  };

  const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const copy = [...fields];
      const item = copy[dragItem.current];
      copy.splice(dragItem.current, 1);
      copy.splice(dragOverItem.current, 0, item);
      onChange(copy.map((f, i) => ({ ...f, order: i })));
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      label: "Novo Campo",
      type: "text",
      required: false,
      placeholder: "",
      width: "full",
      visible: true,
      order: fields.length,
    };
    onChange([...fields, newField]);
  };

  const removeField = (fieldId: string) => {
    onChange(
      fields
        .filter((f) => f.id !== fieldId)
        .map((f, i) => ({ ...f, order: i }))
    );
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const next = [...fields];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const addOption = (fieldIndex: number) => {
    const opts = [...(fields[fieldIndex].options || [])];
    const label = `Opção ${opts.length + 1}`;
    opts.push({ label, value: toSlug(label) || `opcao_${opts.length + 1}` });
    updateField(fieldIndex, { options: opts });
  };

  const updateOption = (fieldIndex: number, optIdx: number, label: string) => {
    const opts = [...(fields[fieldIndex].options || [])];
    opts[optIdx] = { label, value: toSlug(label) || opts[optIdx].value };
    updateField(fieldIndex, { options: opts });
  };

  const removeOption = (fieldIndex: number, optIdx: number) => {
    const opts = (fields[fieldIndex].options || []).filter((_, i) => i !== optIdx);
    updateField(fieldIndex, { options: opts });
  };

  return (
    <div className="p-4 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-zinc-100 bg-zinc-50/20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-10">
        <div className="space-y-1">
          <h4 className="font-ui font-medium text-xl sm:text-2xl text-zinc-900 leading-tight">
            Construtor Visual
          </h4>
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 font-ui">
            Arraste para reordenar &bull; {fields.length} campo
            {fields.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          type="button"
          onClick={addField}
          size="sm"
          className="rounded-xl font-ui text-[10px] uppercase font-medium tracking-widest px-6 h-12 bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" /> Adicionar Campo
        </Button>
      </header>

      <div className="space-y-2">
        {fields.map((field, idx) => {
          const isDraggingItem = isDragging && dragItem.current === idx;
          const hasOptions = HAS_OPTIONS.includes(field.type);
          const hasPlaceholder = HAS_PLACEHOLDER.includes(field.type);
          const isLayout = IS_LAYOUT.includes(field.type);
          const typeLabel = ALL_TYPES.find((t) => t.value === field.type)?.label ?? field.type;

          return (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white border rounded-2xl shadow-sm transition-all group ${
                isDraggingItem
                  ? "border-primary ring-2 ring-primary/20 scale-[1.01] opacity-80"
                  : "border-zinc-100 hover:border-primary/30"
              }`}
            >
              {/* ── Header ─────────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-2 px-3 sm:px-5 pt-3 sm:pt-5 pb-0">
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 shrink-0 pt-0.5 hidden sm:block">
                  <GripVertical className="size-4" />
                </div>

                {/* Label input */}
                <div className="flex-1 min-w-0" style={{ minWidth: "120px" }}>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(idx, { label: e.target.value })}
                    className="bg-zinc-50 border-none rounded-xl h-10 text-sm font-medium font-ui focus:bg-white"
                    placeholder="Rótulo / Pergunta"
                  />
                </div>

                {/* Type badge + selector */}
                <div className="w-36 sm:w-52 shrink-0">
                  <Select
                    value={field.type}
                    onValueChange={(val) => {
                      if (!val) return;
                      const updates: Partial<FormField> = { type: val };
                      if (HAS_OPTIONS.includes(val) && !field.options?.length) {
                        updates.options = [
                          { label: "Opção 1", value: "opcao_1" },
                          { label: "Opção 2", value: "opcao_2" },
                        ];
                      }
                      updateField(idx, updates);
                    }}
                  >
                    <SelectTrigger className="bg-zinc-50 border-none rounded-xl h-10 text-xs font-medium font-ui focus:ring-0">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-100 font-ui p-2 shadow-xl shadow-black/5 max-h-96">
                      {FIELD_TYPES.map((group) => (
                        <div key={group.group}>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-3 pt-3 pb-1">
                            {group.group}
                          </p>
                          {group.items.map((t) => (
                            <SelectItem
                              key={t.value}
                              value={t.value}
                              className="text-xs py-2 px-3 rounded-xl mb-0.5 cursor-pointer"
                            >
                              {t.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Required toggle */}
                {!isLayout && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui hidden xl:block">
                      Obrigatório
                    </span>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(val) => updateField(idx, { required: val })}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                )}

                {/* Delete */}
                <Button
                  type="button"
                  onClick={() => removeField(field.id)}
                  variant="ghost"
                  className="size-9 text-zinc-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* ── Body ───────────────────────────────────────── */}
              <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-2 sm:pt-4 space-y-2.5 sm:ml-7">
                {/* Placeholder + Help text */}
                {hasPlaceholder && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                        Placeholder
                      </Label>
                      <Input
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                        className="bg-zinc-50 border-none rounded-xl h-9 text-xs font-ui focus:bg-white"
                        placeholder="Texto de guia dentro do campo..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                        Texto de Ajuda
                      </Label>
                      <Input
                        value={field.helpText || ""}
                        onChange={(e) => updateField(idx, { helpText: e.target.value })}
                        className="bg-zinc-50 border-none rounded-xl h-9 text-xs font-ui focus:bg-white"
                        placeholder="Dica exibida abaixo do campo..."
                      />
                    </div>
                  </div>
                )}

                {/* Options editor */}
                {hasOptions && (
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                      Opções
                    </Label>
                    <div className="space-y-1.5 bg-zinc-50 rounded-xl p-3">
                      {(field.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          {/* visual indicator */}
                          {field.type === "checkbox" ? (
                            <div className="w-3.5 h-3.5 shrink-0 rounded border border-zinc-300 bg-white" />
                          ) : (
                            <div className="w-3.5 h-3.5 shrink-0 rounded-full border border-zinc-300 bg-white" />
                          )}
                          <Input
                            value={opt.label}
                            onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                            className="flex-1 bg-white border-none rounded-lg h-8 text-xs font-ui shadow-sm"
                            placeholder={`Opção ${optIdx + 1}`}
                          />
                          <span className="text-[9px] text-zinc-300 font-mono hidden sm:block">
                            {opt.value || "—"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeOption(idx, optIdx)}
                            className="text-zinc-300 hover:text-red-400 transition-colors shrink-0"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(idx)}
                        className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-primary font-medium font-ui uppercase tracking-widest transition-colors pt-1 pl-0.5"
                      >
                        <Plus className="size-3" /> Adicionar opção
                      </button>
                    </div>
                  </div>
                )}

                {/* Description content */}
                {field.type === "description" && (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                      Conteúdo do Texto
                    </Label>
                    <Textarea
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      className="bg-zinc-50 border-none rounded-xl text-xs font-ui focus:bg-white min-h-[80px] resize-none"
                      placeholder="Texto descritivo exibido no formulário..."
                    />
                  </div>
                )}

                {/* Acceptance text */}
                {field.type === "acceptance" && (
                  <div className="space-y-1.5">
                    <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                      Texto do Aceite
                    </Label>
                    <Input
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                      className="bg-zinc-50 border-none rounded-xl h-9 text-xs font-ui focus:bg-white"
                      placeholder="Ex: Li e aceito os termos de uso e política de privacidade"
                    />
                  </div>
                )}

                {/* Validation rules for text fields */}
                {["text", "textarea", "email", "tel", "url"].includes(field.type) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                        Mínimo de Caracteres
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={field.validation?.minLength ?? ""}
                        onChange={(e) =>
                          updateField(idx, {
                            validation: {
                              ...field.validation,
                              minLength: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="bg-zinc-50 border-none rounded-xl h-9 text-xs font-ui focus:bg-white"
                        placeholder="—"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
                        Máximo de Caracteres
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={field.validation?.maxLength ?? ""}
                        onChange={(e) =>
                          updateField(idx, {
                            validation: {
                              ...field.validation,
                              maxLength: e.target.value ? Number(e.target.value) : undefined,
                            },
                          })
                        }
                        className="bg-zinc-50 border-none rounded-xl h-9 text-xs font-ui focus:bg-white"
                        placeholder="—"
                      />
                    </div>
                  </div>
                )}

                {/* Width selector */}
                {!isLayout && field.type !== "separator" && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium font-ui mr-1">
                      Largura:
                    </span>
                    {[
                      { value: "full", label: "Inteiro" },
                      { value: "half", label: "½" },
                      { value: "third", label: "⅓" },
                    ].map((w) => (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => updateField(idx, { width: w.value })}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all font-ui ${
                          (field.width || "full") === w.value
                            ? "bg-primary text-white"
                            : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                    <span className="text-[9px] text-zinc-300 font-ui ml-2">
                      {typeLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="h-40 border-2 border-dashed border-zinc-100 rounded-[2rem] flex flex-col items-center justify-center gap-4">
            <MessageSquare className="size-8 text-zinc-100" />
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium font-ui">
              Nenhum campo definido — clique em "Adicionar Campo"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
