"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, use, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { phoneMask, cpfMask, cnpjMask, cepMask, dateMask, timeMask, currencyMask } from "@/lib/masks";
import "./animations.css";

// ─── Brand tokens ──────────────────────────────────────────────────────────────

const BRAND = {
  primary: "#585947",
  primaryBorder: "rgba(88, 89, 71, 0.35)",
  cream: "#e2e0d4",
  creamLight: "#f6f5ed",
  white: "#ffffff",
  textBody: "#626262",
  textMuted: "#8a8a80",
  textLight: "#a8a8a0",
};

// ─── Mask helpers ─────────────────────────────────────────────────────────────

function getMaskFunction(fieldType: string): ((v: string) => string) | null {
  const type = fieldType?.toLowerCase() || "";
  
  if (type === "tel" || type === "phone" || type === "celular" || type === "whatsapp") {
    return phoneMask;
  }
  if (type === "cpf") return cpfMask;
  if (type === "cnpj") return cnpjMask;
  if (type === "cep") return cepMask;
  if (type === "date" || type === "data") return dateMask;
  if (type === "time" || type === "hora") return timeMask;
  if (type === "currency" || type === "valor" || type === "preco") return currencyMask;
  
  return null;
}

function getMaxLength(fieldType: string): number | undefined {
  const type = fieldType?.toLowerCase() || "";
  
  const limits: Record<string, number> = {
    tel: 15,
    phone: 15,
    celular: 15,
    whatsapp: 15,
    cpf: 14,
    cnpj: 18,
    cep: 9,
    date: 10,
    data: 10,
    time: 5,
    hora: 5,
    currency: 14,
    valor: 14,
    preco: 14,
  };
  
  return limits[type];
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`fade-in-section ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Field renderer ────────────────────────────────────────────────────────────

interface FieldProps {
  field: any;
  value: any;
  error?: string;
  onChange: (val: any) => void;
  delay?: number;
}

function FormField({ field, value, error, onChange, delay = 0 }: FieldProps) {
  const inputBase = "w-full border rounded-2xl px-5 py-4 text-sm transition-all duration-200 focus:outline-none";
  const maskFn = getMaskFunction(field.type);
  const maxLength = getMaxLength(field.type);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    if (maskFn) {
      newValue = maskFn(newValue);
      e.target.value = newValue;
    }
    
    onChange(newValue);
  }, [onChange, maskFn]);

  switch (field.type) {
    case "title":
      return (
        <FadeIn delay={delay}>
          <div className={`${field.width === "half" ? "col-span-1" : "col-span-2"}`}>
            <h2 
              className="text-[28px] font-light tracking-[-1.12px] text-[#585947]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
            >
              {field.label}
            </h2>
            {field.helpText && (
              <p className="text-sm mt-2" style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
          </div>
        </FadeIn>
      );

    case "separator":
      return (
        <FadeIn delay={delay}>
          <div className="col-span-2">
            <div 
              className="h-px w-full"
              style={{ background: BRAND.primaryBorder }}
            />
          </div>
        </FadeIn>
      );

    case "description":
      return (
        <FadeIn delay={delay}>
          <div className={`${field.width === "half" ? "col-span-1" : "col-span-2"}`}>
            <p 
              className="text-base leading-relaxed"
              style={{ color: BRAND.textBody, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.64px" }}
            >
              {field.placeholder || field.label}
            </p>
          </div>
        </FadeIn>
      );

    case "textarea":
      return (
        <FadeIn delay={delay}>
          <div className={`space-y-2 ${field.width === "half" ? "col-span-1" : "col-span-2"}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px]"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <textarea
              value={value || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={5}
              className={`${inputBase} resize-none ${error ? "border-red-300 bg-red-50/50" : "border-transparent hover:border-[#d4d2c4] focus:border-[#585947] focus:bg-white"}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: BRAND.primary, backgroundColor: BRAND.creamLight }}
            />
            {field.helpText && !error && (
              <p className="text-[11px] tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );

    case "select": {
      const opts: { value: string; label: string }[] = field.options || [];
      return (
        <FadeIn delay={delay}>
          <div className={`space-y-2 ${field.width === "half" || field.width === "third" ? "col-span-1" : "col-span-2"}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px]"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputBase} appearance-none cursor-pointer ${error ? "border-red-300 bg-red-50/50" : "border-transparent hover:border-[#d4d2c4] focus:border-[#585947] focus:bg-white"}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: BRAND.primary, backgroundColor: BRAND.creamLight }}
              >
                <option value="">{field.placeholder || "Selecione uma opção..."}</option>
                {opts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ color: BRAND.textMuted }}>
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {field.helpText && !error && (
              <p className="text-[11px] tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );
    }

    case "radio": {
      const opts: { value: string; label: string }[] = field.options || [];
      return (
        <FadeIn delay={delay}>
          <div className={`space-y-3 ${field.width === "half" || field.width === "third" ? "col-span-1" : "col-span-2"}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px] block"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {opts.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 cursor-pointer group py-2"
                >
                  <div className="relative flex-shrink-0">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      checked={value === opt.value}
                      onChange={() => onChange(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 transition-all"
                      style={{
                        borderColor: value === opt.value ? BRAND.primary : BRAND.cream,
                        backgroundColor: value === opt.value ? BRAND.primary : "transparent"
                      }}
                    >
                      {value === opt.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span 
                    className="text-sm"
                    style={{ color: BRAND.primary, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.56px" }}
                  >
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {field.helpText && !error && (
              <p className="text-[11px] tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );
    }

    case "checkbox": {
      const opts: { value: string; label: string }[] = field.options || [];
      const selected: string[] = Array.isArray(value) ? value : [];
      const toggle = (v: string) => {
        const next = selected.includes(v)
          ? selected.filter((x) => x !== v)
          : [...selected, v];
        onChange(next);
      };
      return (
        <FadeIn delay={delay}>
          <div className={`space-y-3 ${field.width === "half" || field.width === "third" ? "col-span-1" : "col-span-2"}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px] block"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {opts.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-2">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selected.includes(opt.value)}
                      onChange={() => toggle(opt.value)}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
                      style={{
                        borderColor: selected.includes(opt.value) ? BRAND.primary : BRAND.cream,
                        backgroundColor: selected.includes(opt.value) ? BRAND.primary : "transparent"
                      }}
                    >
                      {selected.includes(opt.value) && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span 
                    className="text-sm"
                    style={{ color: BRAND.primary, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.56px" }}
                  >
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {field.helpText && !error && (
              <p className="text-[11px] tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );
    }

    case "acceptance":
      return (
        <FadeIn delay={delay}>
          <div className="col-span-2 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group py-2">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
                  style={{
                    borderColor: value ? BRAND.primary : BRAND.cream,
                    backgroundColor: value ? BRAND.primary : "transparent"
                  }}
                >
                  {value && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span 
                className="text-sm leading-relaxed"
                style={{ color: BRAND.textBody, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.56px" }}
              >
                {field.placeholder || field.label}
              </span>
            </label>
            {error && (
              <p className="text-[11px] text-red-500 pl-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );

    case "file":
      return (
        <FadeIn delay={delay}>
          <div className={`space-y-2 ${field.width === "half" || field.width === "third" ? "col-span-1" : "col-span-2"}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px] block"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div
              className="border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer hover:border-[#585947]/40"
              style={{ borderColor: error ? "#fca5a5" : BRAND.cream, backgroundColor: BRAND.creamLight }}
            >
              <input
                type="file"
                onChange={(e) => onChange(e.target.files?.[0]?.name)}
                className="w-full text-sm text-center cursor-pointer file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-xs file:font-medium file:uppercase file:tracking-wider file:bg-[#585947] file:text-white hover:file:bg-[#585947]/90 transition-colors"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: BRAND.textMuted }}
              />
              {field.helpText && (
                <p className="text-[11px] mt-3 tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {field.helpText}
                </p>
              )}
            </div>
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );

    default: {
      const colSpan =
        field.width === "half" ? "col-span-1" :
        field.width === "third" ? "col-span-1" : "col-span-2";
      
      const getInputType = () => {
        const type = field.type?.toLowerCase() || "";
        if (type === "tel" || type === "phone" || type === "celular" || type === "whatsapp") return "tel";
        if (type === "cpf" || type === "cnpj" || type === "cep" || type === "date" || type === "data") return "text";
        return field.type;
      };

      return (
        <FadeIn delay={delay}>
          <div className={`space-y-2 ${colSpan}`}>
            <label 
              className="text-xs font-medium uppercase tracking-[1.68px] block"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type={getInputType()}
              value={value || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`${inputBase} ${error ? "border-red-300 bg-red-50/50" : "border-transparent hover:border-[#d4d2c4] focus:border-[#585947] focus:bg-white"}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: BRAND.primary, backgroundColor: BRAND.creamLight }}
              minLength={field.validation?.minLength}
              maxLength={maxLength || field.validation?.maxLength}
              pattern={field.validation?.pattern}
              inputMode={maskFn ? "numeric" : undefined}
            />
            {field.helpText && !error && (
              <p className="text-[11px] tracking-wide" style={{ color: BRAND.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>
                {field.helpText}
              </p>
            )}
            {error && (
              <p className="text-[11px] text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {error}
              </p>
            )}
          </div>
        </FadeIn>
      );
    }
  }
}

// ─── Success screen ──────────────────────────────────────────────────────────

function SuccessScreen({ message }: { message: string }) {
  return (
    <FadeIn>
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: BRAND.creamLight }}
      >
        <div 
          className="bg-white rounded-3xl p-12 max-w-lg w-full text-center"
          style={{ 
            boxShadow: `0 25px 50px -12px rgba(88, 89, 71, 0.15)`,
            border: `1px solid ${BRAND.primaryBorder}`
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: `${BRAND.primary}15` }}
          >
            <CheckCircle2 className="size-10" style={{ color: BRAND.primary }} />
          </div>
          <h2 
            className="text-[42px] font-light tracking-[-1.68px] mb-4"
            style={{ color: BRAND.primary, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}
          >
            Enviado!
          </h2>
          <p 
            className="text-base leading-relaxed"
            style={{ color: BRAND.textBody, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.64px" }}
          >
            {message}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Not found / inactive screen ─────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: BRAND.creamLight }}
    >
      <div 
        className="bg-white rounded-3xl p-12 max-w-md w-full text-center"
        style={{ 
          boxShadow: `0 25px 50px -12px rgba(88, 89, 71, 0.15)`,
          border: `1px solid ${BRAND.primaryBorder}`
        }}
      >
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: BRAND.cream }}
        >
          <AlertCircle className="size-10" style={{ color: BRAND.textMuted }} />
        </div>
        <h2 
          className="text-[32px] font-light tracking-[-1.28px] mb-4"
          style={{ color: BRAND.primary, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}
        >
          Formulário indisponível
        </h2>
        <p 
          className="text-sm leading-relaxed"
          style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.56px" }}
        >
          Este formulário não existe ou está temporariamente inativo.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const form = useQuery(api.forms.getFormBySlug, { slug });
  const admins = useQuery(api.auth.listAdmins);
  const createSubmission = useMutation(api.submissions.createSubmission);

  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (form === undefined) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BRAND.creamLight }}
      >
        <Loader2 
          className="size-8 animate-spin" 
          style={{ color: BRAND.textMuted }} 
        />
      </div>
    );
  }

  if (!form || form.status !== "active") {
    return <NotFoundScreen />;
  }

  if (submitted) {
    if (form.redirectUrl) {
      window.location.href = form.redirectUrl;
      return null;
    }
    return (
      <SuccessScreen
        message={
          form.successMessage ||
          "Obrigado! Sua mensagem foi enviada com sucesso. Em breve entraremos em contato."
        }
      />
    );
  }

  const setVal = (id: string, val: any) => {
    setValues((p) => ({ ...p, [id]: val }));
    if (errors[id]) setErrors((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    for (const field of form.fields) {
      if (field.visible === false) continue;
      if (!field.required) continue;

      const val = values[field.id];
      const isEmpty =
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0) ||
        (field.type === "acceptance" && !val);

      if (isEmpty) {
        newErrors[field.id] = "Campo obrigatório";
      }

      if (!isEmpty && field.validation?.minLength && typeof val === "string" && val.length < field.validation.minLength) {
        newErrors[field.id] = `Mínimo de ${field.validation.minLength} caracteres`;
      }
      if (!isEmpty && field.validation?.maxLength && typeof val === "string" && val.length > field.validation.maxLength) {
        newErrors[field.id] = `Máximo de ${field.validation.maxLength} caracteres`;
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      console.log("Creating submission with formId:", form._id, "and data:", values);
      const result = await createSubmission({ formId: form._id, data: values });
      console.log("Submission created:", result);

      const formTitle = form.displayTitle || form.title;

      console.log("Form settings:", {
        sendEmail: form.sendEmail,
        notifyAllAdmins: form.notifyAllAdmins,
        targetEmail: form.targetEmail,
        hasAdmins: admins?.length || 0,
      });

      // Send email notification
      if (form.sendEmail) {
        try {
          // Default to notifyAllAdmins=true if not set
          const shouldNotifyAll = form.notifyAllAdmins !== false;
          
          if (shouldNotifyAll && admins && admins.length > 0) {
            const { formatFormDataForEmail } = await import("@/emails/form-notification");
            const htmlContent = await formatFormDataForEmail(formTitle, values);
            
            const response = await fetch("/api/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: admins.map((admin: any) => ({ email: admin.email, name: admin.name })),
                subject: `Nova submissão: ${formTitle}`,
                htmlContent,
                tags: ["form-submission", "notification", "admin"],
              }),
            });
            const result = await response.json();
            console.log("Email sent to all admins:", result);
          } else if (form.targetEmail) {
            const { formatFormDataForEmail } = await import("@/emails/form-notification");
            const htmlContent = await formatFormDataForEmail(formTitle, values);
            
            const response = await fetch("/api/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: [{ email: form.targetEmail }],
                subject: `Nova submissão: ${formTitle}`,
                htmlContent,
                tags: ["form-submission", "notification"],
              }),
            });
            const result = await response.json();
            console.log("Email sent to specific email:", result);
          }
        } catch (emailError) {
          console.error("Erro ao enviar email de notificação:", emailError);
        }
      }

      // Find email field to send confirmation to user
      const emailField = form.fields.find(
        (f: any) => f.type === "email" && values[f.id]
      );

      if (emailField && values[emailField.id]) {
        try {
          const { formatConfirmationForEmail } = await import("@/emails/form-confirmation");
          const htmlContent = await formatConfirmationForEmail(formTitle);
          
          const response = await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: [{ email: values[emailField.id] }],
              subject: `Mensagem enviada - ${formTitle}`,
              htmlContent,
              tags: ["form-submission", "confirmation", "user"],
            }),
          });
          const result = await response.json();
          console.log("Confirmation email sent to user:", result);
        } catch (emailError) {
          console.error("Erro ao enviar email de confirmação:", emailError);
        }
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Erro ao criar submissão:", error);
      setErrors({ _global: "Erro ao enviar o formulário. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  };

  const visibleFields = form.fields
    .filter((f: any) => f.visible !== false)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: BRAND.creamLight }}
    >
      {/* ── Navbar ─────────────────────────────────────── */}
      <FadeIn delay={0}>
        <nav 
          className="sticky top-0 z-40 h-16 flex items-center backdrop-blur-md"
          style={{ backgroundColor: `${BRAND.white}90`, borderBottom: `1px solid ${BRAND.primaryBorder}` }}
        >
          <div 
            className="max-w-[1128px] mx-auto px-6 w-full flex items-center justify-between"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[1.12px] transition-opacity hover:opacity-70"
              style={{ color: BRAND.primary, fontFamily: "'Instrument Sans', sans-serif" }}
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>
            <span 
              className="text-[10px] uppercase tracking-widest"
              style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Jarline Vieira Arquitetura
            </span>
          </div>
        </nav>
      </FadeIn>

      {/* ── Main content ───────────────────────────────── */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-12 pt-8">
        <div className="w-full max-w-[720px]">
          <form onSubmit={handleSubmit} noValidate>
            <div 
              className="bg-white rounded-3xl overflow-hidden"
              style={{ 
                boxShadow: `0 25px 50px -12px rgba(88, 89, 71, 0.12)`,
                border: `1px solid ${BRAND.primaryBorder}`
              }}
            >
              {/* Header */}
              <FadeIn delay={100}>
                <div 
                  className="px-10 py-12"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  <p 
                    className="text-[10px] uppercase tracking-[1.68px] mb-3"
                    style={{ color: BRAND.cream, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}
                  >
                    Formulário
                  </p>
                  <h1 
                    className="text-[40px] font-light tracking-[-1.6px] text-white leading-none"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {form.displayTitle || form.title}
                  </h1>
                  {form.description && (
                    <p 
                      className="text-sm mt-4 leading-relaxed"
                      style={{ color: BRAND.cream, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.56px", opacity: 0.8 }}
                    >
                      {form.description}
                    </p>
                  )}
                </div>
              </FadeIn>

              {/* Decorative line */}
              <div className="h-1 w-full" style={{ backgroundColor: BRAND.cream }} />

              {/* Fields */}
              <div className="p-10">
                <div className="grid grid-cols-2 gap-6">
                  {visibleFields.map((field: any, index: number) => (
                    <FormField
                      key={field.id}
                      field={field}
                      value={values[field.id]}
                      error={errors[field.id]}
                      onChange={(val) => setVal(field.id, val)}
                      delay={200 + (index * 50)}
                    />
                  ))}
                </div>

                {errors._global && (
                  <FadeIn delay={300}>
                    <div 
                      className="mt-8 p-4 rounded-2xl flex items-center gap-3"
                      style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                    >
                      <AlertCircle className="size-5 shrink-0" style={{ color: "#dc2626" }} />
                      <p 
                        className="text-sm"
                        style={{ color: "#dc2626", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {errors._global}
                      </p>
                    </div>
                  </FadeIn>
                )}
              </div>

              {/* Submit */}
              <FadeIn delay={400} className="form-submit">
                <div className="px-10 pb-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl font-medium text-sm uppercase tracking-[1.12px] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
                    style={{ 
                      backgroundColor: BRAND.primary, 
                      color: BRAND.white, 
                      fontFamily: "'Instrument Sans', sans-serif",
                      boxShadow: `0 10px 25px -5px rgba(88, 89, 71, 0.3)`
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span>Enviar</span>
                        <Send className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </FadeIn>
            </div>
          </form>

          {/* Footer */}
          <FadeIn delay={500}>
            <div className="text-center mt-8">
              <p 
                className="text-xs"
                style={{ color: BRAND.textMuted, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.48px" }}
              >
                Jarline Vieira Arquitetura & Interiores
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
