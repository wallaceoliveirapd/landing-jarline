"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon, Image as ImageIconLucide } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (storageId: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

export function ImageUpload({ value, onChange, label, description, aspectRatio = "video" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve storageId to public URL
  const isLocalStorageId = value && !value.startsWith("http");
  const imageUrlQuery = useQuery(api.files.getImageUrl, isLocalStorageId ? { storageId: value } : "skip");
  const imageUrl = isLocalStorageId ? imageUrlQuery : value;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = await result.json();
      onChange(storageId);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar imagem. Verifique sua conexão.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]"
  }[aspectRatio];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</label>}
        {description && <p className="text-[10px] text-zinc-400   font-medium">{description}</p>}
      </div>

      <div className="relative group">
        {value ? (
          <div className={`relative ${aspectRatioClass} rounded-[2.5rem] overflow-hidden border border-zinc-100 bg-zinc-50 shadow-inner group/preview`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Upload preview"
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                <Loader2 className="size-8 animate-spin text-[#585947]/20" />
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-sm">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="rounded-full px-8 h-12 text-[10px] font-bold uppercase tracking-widest bg-white hover:bg-zinc-100 text-zinc-900 border-none shadow-xl scale-90 group-hover/preview:scale-100 transition-all duration-500"
              >
                Substituir
              </Button>
              <Button
                type="button"
                onClick={() => onChange("")}
                variant="destructive"
                className="size-12 rounded-full p-0 flex items-center justify-center shadow-2xl scale-90 group-hover/preview:scale-100 transition-all duration-500"
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Storage ID Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center pointer-events-none opacity-0 group-hover/preview:opacity-100 transition-all duration-700 translate-y-4 group-hover/preview:translate-y-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-[8px] font-mono text-white/60 uppercase tracking-tighter">ID: {value.substring(0, 12)}...</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full ${aspectRatioClass} rounded-[3rem] border-2 border-dashed border-zinc-100 hover:border-[#585947]/30 hover:bg-zinc-50 transition-all duration-500 flex flex-col items-center justify-center gap-6 group/btn relative overflow-hidden`}
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="size-20 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:shadow-2xl group-hover/btn:shadow-[#585947]/10 transition-all duration-700 relative z-10">
              {isUploading ? (
                <Loader2 className="size-8 animate-spin text-[#585947]" />
              ) : (
                <Upload className="size-8 text-[#585947] group-hover/btn:-translate-y-1 transition-transform" />
              )}
            </div>

            <div className="text-center relative z-10 px-12">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-900 mb-2 font-ui">Selecione uma Imagem</h4>
              <p className="text-[10px] text-zinc-400 font-medium tracking-tight leading-relaxed max-w-[240px] mx-auto">
                Arraste seu arquivo para cá ou <span className="text-zinc-900 font-bold decoration-1 underline-offset-4 underline">escolha em seu computador</span>
              </p>
            </div>

            {/* Progress indicator for fake feeling or actual upload */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 h-1 bg-[#585947] animate-[shimmer_2s_infinite] w-full" />
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
