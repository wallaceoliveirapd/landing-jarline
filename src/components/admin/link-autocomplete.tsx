"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { FileText, Layout, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LinkAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LinkAutocomplete({ value, onChange, placeholder = "Ex: /sobre ou https://...", className }: LinkAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const projects = useQuery(api.projects.getProjects);
  const pages = useQuery(api.pages.getPages);

  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!projects || !pages) return;

    const allOptions = [
      ...pages.map(p => ({ type: "page", label: p.title, url: `/${p.slug}`, icon: FileText })),
      ...projects.map(p => ({ type: "project", label: p.title, url: `/projetos/${p.slug}`, icon: Layout }))
    ];

    if (!value) {
      setFilteredOptions(allOptions);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = allOptions.filter(opt => 
      opt.label.toLowerCase().includes(lowerValue) || 
      opt.url.toLowerCase().includes(lowerValue)
    );
    setFilteredOptions(filtered);
  }, [value, projects, pages]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-xl rounded-2xl overflow-hidden z-50 max-h-60 overflow-y-auto w-full">
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-[9px] uppercase tracking-widest text-zinc-400 font-bold font-ui">
              Páginas Internas
            </div>
            {filteredOptions.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={`${opt.url}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(opt.url);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 hover:bg-zinc-50 rounded-xl transition-all text-left"
                >
                  <div className="size-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{opt.label}</p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">{opt.url}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Exibir mensagem se não achar nada mas for um custom URL */}
      {isOpen && filteredOptions.length === 0 && value.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-xl rounded-2xl p-4 z-50">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <LinkIcon className="size-4" />
            </div>
            <p>Usar link personalizado: <span className="font-mono text-xs">{value}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
