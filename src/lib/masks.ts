// ─── Input Masks ───────────────────────────────────────────────────────────────

export interface MaskConfig {
  mask: (value: string) => string;
  pattern?: RegExp;
  maxLength?: number;
}

// ─── Mask Functions ──────────────────────────────────────────────────────────

export function phoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function cpfMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function cnpjMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

export function cepMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function dateMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

export function timeMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function cnpjOrCpfMask(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return cpfMask(value);
  }
  return cnpjMask(value);
}

export function currencyMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  
  if (digits.length === 0) return "";
  
  const cents = digits.slice(-2);
  const reais = digits.slice(0, -2);
  
  const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `R$ ${formattedReais},${cents}`;
}

export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "");
}

export function onlyLetters(value: string): string {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

export function alphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

// ─── Mask Configuration Map ───────────────────────────────────────────────────

export const maskConfigs: Record<string, MaskConfig> = {
  tel: {
    mask: phoneMask,
    pattern: /^\(?\d{2}\)?[\s-]?\d{5}-?\d{4}$/,
    maxLength: 15,
  },
  phone: {
    mask: phoneMask,
    pattern: /^\(?\d{2}\)?[\s-]?\d{5}-?\d{4}$/,
    maxLength: 15,
  },
  celular: {
    mask: phoneMask,
    pattern: /^\(?\d{2}\)?[\s-]?\d{5}-?\d{4}$/,
    maxLength: 15,
  },
  cpf: {
    mask: cpfMask,
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    maxLength: 14,
  },
  cnpj: {
    mask: cnpjMask,
    pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    maxLength: 18,
  },
  cep: {
    mask: cepMask,
    pattern: /^\d{5}-\d{3}$/,
    maxLength: 9,
  },
  date: {
    mask: dateMask,
    pattern: /^\d{2}\/\d{2}\/\d{4}$/,
    maxLength: 10,
  },
  datetime: {
    mask: (v) => {
      const masked = dateMask(v);
      if (masked.length === 10) {
        return masked;
      }
      return masked;
    },
    maxLength: 16,
  },
  time: {
    mask: timeMask,
    pattern: /^\d{2}:\d{2}$/,
    maxLength: 5,
  },
  cpfCnpj: {
    mask: cnpjOrCpfMask,
    maxLength: 18,
  },
  currency: {
    mask: currencyMask,
    maxLength: 14,
  },
  rg: {
    mask: (v) => v.toUpperCase().replace(/[^0-9X]/g, "").slice(0, 12),
    maxLength: 12,
  },
  inscricaoEstadual: {
    mask: (v) => v.toUpperCase().replace(/[^0-9]/g, "").slice(0, 15),
    maxLength: 15,
  },
};

// ─── getMaskForFieldType ────────────────────────────────────────────────────

export function getMaskForFieldType(fieldType: string): MaskConfig | null {
  return maskConfigs[fieldType.toLowerCase()] || null;
}

// ─── applyMask ──────────────────────────────────────────────────────────────

export function applyMask(value: string, maskFn: (v: string) => string): string {
  return maskFn(value);
}

// ─── useInputMask Hook ──────────────────────────────────────────────────────

import { useCallback } from "react";

export function useInputMask(fieldType: string) {
  const config = getMaskForFieldType(fieldType);
  
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, originalOnChange: (val: string) => void) => {
      if (!config) {
        originalOnChange(e.target.value);
        return;
      }
      
      const maskedValue = config.mask(e.target.value);
      originalOnChange(maskedValue);
    },
    [config]
  );
  
  return {
    mask: config?.mask,
    maxLength: config?.maxLength,
    handleChange,
    hasMask: !!config,
  };
}
