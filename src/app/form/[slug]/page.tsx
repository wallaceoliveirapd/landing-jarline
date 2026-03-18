"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, use, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { phoneMask, cpfMask, cnpjMask, cepMask, dateMask, timeMask, currencyMask } from "@/lib/masks";
import "./animations.css";

const FORM_LOGO_SVG = `<svg width="140" height="22" viewBox="0 0 196 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.9484 0V12.3487C10.9484 14.1888 10.3103 15.7644 9.10629 16.8994C7.94498 17.997 6.30579 18.6005 4.49308 18.6005C2.76045 18.6005 1.14529 17.9596 0 16.8299L0.525927 16.416C1.60982 17.5323 2.9767 18.1198 4.49308 18.1198C5.86262 18.1198 6.92516 17.746 7.65131 17.0062C8.84466 15.7911 8.80995 13.9618 8.79126 12.979V0H10.9484Z" fill="white"/>
  <path d="M29.2998 18.4296H26.8811L25.6424 15.2463L25.2606 14.3356H14.7474L13.0735 18.427H12.5422L19.6249 0.9347L19.9666 0.0534115H22.073L29.2171 18.224L29.2972 18.427L29.2998 18.4296ZM25.0791 13.8549L20.052 0.998794L15.1932 13.1953L14.9449 13.8576H25.0817L25.0791 13.8549Z" fill="white"/>
  <path d="M43.2383 13.1312L42.8752 13.2995L46.2604 18.4296H43.5293L41.172 14.7202C40.8196 14.1647 40.1895 13.8282 39.5328 13.8416C39.3539 13.8469 39.1751 13.8496 39.0229 13.8496H34.0519V18.4296H31.8495V0.058754H39.0229C43.2704 0.058754 46.9972 3.23139 46.9972 6.84735V7.061C46.9972 9.67549 45.8386 11.7425 43.7322 12.8802C43.4786 13.0164 43.2357 13.1285 43.233 13.1312H43.2383ZM44.7841 7.07168V6.83667C44.7841 2.98837 42.4161 0.301776 39.0256 0.301776H34.0546V13.6039H39.0256C42.4161 13.6039 44.7841 10.9173 44.7841 7.07168Z" fill="white"/>
  <path d="M61.9527 17.9489C61.7925 18.1332 61.6297 18.3175 61.5336 18.4296H50.3343V0.817195L50.3423 0.0240345H51.2606H52.5234V17.9462H61.9527V17.9489Z" fill="white"/>
  <path d="M66.4271 0.0373878V18.4296H64.2139V0.825207L64.2192 0.0373878H66.4297H66.4271Z" fill="white"/>
  <path d="M86.3377 0.0347176V18.4296H85.0722L71.0965 3.40498L71.0911 18.4296H70.6079V0.0347176H71.3581L85.8625 15.5614V0.0347176H86.3377Z" fill="white"/>
  <path d="M92.694 17.8768H102.665L102.249 18.4296H90.5316V0.0427284H102.753L102.276 0.528773H92.6913V7.60846H102.497L102.115 8.08649H92.6967V17.8768H92.694Z" fill="white"/>
  <path d="M131.629 0.0347176L124.487 18.3335L124.453 18.4296H122.245L115.085 0.0347176H117.479L124.295 17.4362L130.692 0.961406L131.065 0.0347176H131.626H131.629Z" fill="white"/>
  <path d="M136.397 0.0373878V18.4296H134.184V0.825207L134.189 0.0373878H136.399H136.397Z" fill="white"/>
  <path d="M142.735 17.8768H152.706L152.29 18.4296H140.572V0.0427284H152.794L152.316 0.528773H142.732V7.60846H152.538L152.156 8.08649H142.737V17.8768H142.735Z" fill="white"/>
  <path d="M157.821 0.0373878V18.4296H155.608V0.825207L155.613 0.0373878H157.824H157.821Z" fill="white"/>
  <path d="M188.554 16.4881L188.987 16.894C186.862 18.2774 184.374 19.0065 181.768 19.0065C175.873 19.0065 171.212 17.0383 168.983 13.6039L168.879 13.4437L164.215 13.449V18.4403H162.055V0.825206V0.0640933H168.393C172.568 0.0667639 176.231 3.16463 176.231 6.69512V6.82331C176.231 9.68617 173.668 11.9882 171.287 12.9149L170.889 13.0698L171.127 13.4276C172.753 15.8846 177.051 17.8261 180.268 18.2854C183.212 18.7074 186.154 18.0664 188.554 16.4881ZM173.965 6.82598V6.68978C173.965 3.03377 171.674 0.480703 168.393 0.480703H164.215V13.0351H168.393C171.674 13.0351 173.965 10.482 173.965 6.82598ZM195.098 18.4136H192.716L191.2 14.6881L191.085 14.349H180.74L179.87 16.432C179.849 16.4828 179.776 16.5362 179.691 16.5255C179.48 16.5068 179.259 16.4774 179.026 16.4374C178.954 16.4267 178.893 16.3866 178.863 16.3332C178.834 16.2798 178.85 16.2397 178.855 16.2264L185.439 0.0400581H187.47L195.004 18.208L195.098 18.4136ZM190.682 13.4944L185.719 1.74121L181.093 13.4944H190.682Z" fill="white"/>
  <path d="M38.9162 30.0211H36.8205L36.4334 31.0893H35.7713L37.5093 26.3063H38.2328L39.9654 31.0893H39.3033L38.9162 30.0211ZM38.7373 29.511L37.867 27.0835L36.9967 29.511H38.7347H38.7373Z" fill="white"/>
  <path d="M44.7735 31.0893L43.6282 29.1238H42.87V31.0893H42.2426V26.2796H43.7937C44.1568 26.2796 44.4638 26.3411 44.7147 26.4666C44.9657 26.5894 45.1526 26.7577 45.278 26.9713C45.4035 27.1823 45.4649 27.4253 45.4649 27.695C45.4649 28.0262 45.3688 28.3173 45.1793 28.571C44.9897 28.8247 44.7014 28.9929 44.3196 29.0757L45.5263 31.0893H44.7735ZM42.87 28.6191H43.7937C44.1327 28.6191 44.389 28.5363 44.5599 28.368C44.7307 28.1998 44.8162 27.9755 44.8162 27.695C44.8162 27.4146 44.7334 27.1903 44.5652 27.0327C44.397 26.8752 44.1407 26.7977 43.7964 26.7977H42.8726V28.6191H42.87Z" fill="white"/>
  <path d="M51.8081 32L50.8497 31.0413C50.6147 31.1054 50.3771 31.1374 50.1315 31.1374C49.6857 31.1374 49.2772 31.0333 48.9115 30.8223C48.543 30.614 48.2521 30.3202 48.0385 29.9463C47.8249 29.5725 47.7181 29.1505 47.7181 28.6805C47.7181 28.2105 47.8249 27.7885 48.0385 27.4146C48.2521 27.0407 48.543 26.747 48.9115 26.5387C49.2799 26.3304 49.6857 26.2236 50.1315 26.2236C50.5773 26.2236 50.9912 26.3277 51.3596 26.5387C51.728 26.747 52.0163 27.0381 52.2299 27.412C52.4408 27.7858 52.5476 28.2078 52.5476 28.6805C52.5476 29.1532 52.4461 29.5538 52.2432 29.9223C52.0403 30.2908 51.7627 30.5793 51.4076 30.7902L52.6223 31.9973H51.8081V32ZM48.5911 29.69C48.7459 29.9784 48.9569 30.2027 49.2265 30.3603C49.4961 30.5178 49.7978 30.5953 50.1342 30.5953C50.4706 30.5953 50.7722 30.5178 51.0419 30.3603C51.3115 30.2054 51.5224 29.981 51.6773 29.69C51.8321 29.4015 51.9095 29.065 51.9095 28.6831C51.9095 28.3013 51.8321 27.9594 51.6773 27.671C51.5224 27.3826 51.3115 27.1609 51.0472 27.006C50.7802 26.8485 50.4759 26.771 50.1369 26.771C49.7978 26.771 49.4935 26.8485 49.2265 27.006C48.9595 27.1636 48.7486 27.3853 48.5964 27.671C48.4416 27.9594 48.3642 28.2959 48.3642 28.6831C48.3642 29.0704 48.4416 29.4015 48.5964 29.69H48.5911Z" fill="white"/>
  <path d="M55.519 26.2823V29.3241C55.519 29.7514 55.6231 30.0692 55.834 30.2775C56.0422 30.4858 56.3332 30.5873 56.707 30.5873C57.0807 30.5873 57.3637 30.4831 57.5719 30.2775C57.7802 30.0718 57.887 29.7541 57.887 29.3241V26.2823H58.5143V29.3187C58.5143 29.7193 58.4343 30.0558 58.2741 30.3309C58.1139 30.606 57.895 30.8089 57.6227 30.9425C57.3504 31.076 57.0434 31.1427 56.7016 31.1427C56.3599 31.1427 56.0556 31.076 55.7806 30.9425C55.5083 30.8089 55.292 30.606 55.1319 30.3309C54.9743 30.0585 54.8943 29.7193 54.8943 29.3187V26.2823H55.5216H55.519Z" fill="white"/>
  <path d="M61.7073 26.2823V31.092H61.0799V26.2823H61.7073Z" fill="white"/>
  <path d="M67.2522 26.2823V26.7924H65.9414V31.092H65.314V26.7924H63.9952V26.2823H67.2522Z" fill="white"/>
  <path d="M70.1701 26.7924V28.4001H71.9214V28.9182H70.1701V30.5739H72.1297V31.092H69.5427V26.2743H72.1297V26.7924H70.1701Z" fill="white"/>
  <path d="M77.5571 26.2823V26.7924H76.2463V31.092H75.6189V26.7924H74.3001V26.2823H77.5571Z" fill="white"/>
  <path d="M80.4617 26.2823V29.3241C80.4617 29.7514 80.5659 30.0692 80.7768 30.2775C80.985 30.4858 81.276 30.5873 81.6498 30.5873C82.0235 30.5873 82.3065 30.4831 82.5147 30.2775C82.723 30.0718 82.8298 29.7541 82.8298 29.3241V26.2823H83.4571V29.3187C83.4571 29.7193 83.377 30.0558 83.2169 30.3309C83.0567 30.606 82.8378 30.8089 82.5655 30.9425C82.2931 31.076 81.9861 31.1427 81.6444 31.1427C81.3027 31.1427 80.9983 31.076 80.7234 30.9425C80.4511 30.8089 80.2348 30.606 80.0746 30.3309C79.9171 30.0585 79.837 29.7193 79.837 29.3187V26.2823H80.4644H80.4617Z" fill="white"/>
  <path d="M88.5536 31.0893L87.4083 29.1238H86.6501V31.0893H86.0227V26.2796H87.5738C87.9369 26.2796 88.2439 26.3411 88.4948 26.4666C88.7458 26.5894 88.9327 26.7577 89.0581 26.9713C89.1836 27.1823 89.245 27.4253 89.245 27.695C89.245 28.0262 89.1489 28.3173 88.9594 28.571C88.7698 28.8247 88.4815 28.9929 88.0997 29.0757L89.3064 31.0893H88.5536ZM86.6501 28.6191H87.5738C87.9128 28.6191 88.1691 28.5363 88.34 28.368C88.5108 28.1998 88.5963 27.9755 88.5963 27.695C88.5963 27.4146 88.5135 27.1903 88.3453 27.0327C88.1771 26.8752 87.9209 26.7977 87.5765 26.7977H86.6527V28.6191H86.6501Z" fill="white"/>
</svg>`;

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
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
        adminsData: admins,
      });

      // Send email notification
      if (form.sendEmail) {
        try {
          // Default to notifyAllAdmins=true if not set
          const shouldNotifyAll = form.notifyAllAdmins !== false;

          console.log("Email conditions:", {
            shouldNotifyAll,
            hasAdmins: !!admins,
            adminsLength: admins?.length,
          });

          if (shouldNotifyAll && admins && admins.length > 0) {
            console.log("Sending to admins:", admins);
            const { formatFormDataForEmail } = await import("@/emails/form-notification");
            const htmlContent = await formatFormDataForEmail(formTitle, values, form.fields);

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
            console.log("Sending to targetEmail:", form.targetEmail);
            const { formatFormDataForEmail } = await import("@/emails/form-notification");
            const htmlContent = await formatFormDataForEmail(formTitle, values, form.fields);

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
          } else {
            console.log("No email recipients configured:", {
              shouldNotifyAll,
              adminsIsUndefined: admins === undefined,
              adminsIsEmpty: admins?.length === 0,
              targetEmail: form.targetEmail,
            });
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
                  <div 
                    className="mb-6"
                    dangerouslySetInnerHTML={{ __html: FORM_LOGO_SVG }}
                  />
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
              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
