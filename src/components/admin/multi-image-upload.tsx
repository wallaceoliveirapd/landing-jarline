"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (storageIds: string[]) => void;
  label?: string;
  description?: string;
}

export function MultiImageUpload({ value = [], onChange, label, description }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newStorageIds: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} muito grande (max 10MB).`);
          continue;
        }

        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("Upload failed");

        const { storageId } = await result.json();
        newStorageIds.push(storageId);
      }

      onChange([...value, ...newStorageIds]);
      toast.success(`${newStorageIds.length} imagens enviadas à galeria!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro no upload múltiplo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</label>}
          <span className="text-[10px] bg-zinc-100 px-3 py-1 rounded-full text-zinc-500 font-bold uppercase tracking-widest">{value.length} Ativos</span>
        </div>
        {description && <p className="text-[10px] text-zinc-400   font-medium">{description}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {value.map((storageId, index) => (
          <ImagePreviewItem
            key={`${storageId}-${index}`}
            storageId={storageId}
            onRemove={() => removeImage(index)}
          />
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="aspect-square rounded-[2rem] border-2 border-dashed border-zinc-100 hover:border-[#585947]/30 hover:bg-zinc-50 transition-all duration-500 flex flex-col items-center justify-center gap-4 group/add relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:15px_15px]" />

          <div className="size-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover/add:bg-white group-hover/add:shadow-xl group-hover/add:shadow-[#585947]/10 transition-all duration-700 relative z-10">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-[#585947]" />
            ) : (
              <Plus className="size-5 text-[#585947]" />
            )}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover/add:text-[#585947] transition-colors relative z-10">
            {isUploading ? "Enviando..." : "Add Foto"}
          </span>
        </button>
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

function ImagePreviewItem({ storageId, onRemove }: { storageId: string; onRemove: () => void }) {
  const isLocalStorageId = storageId && !storageId.startsWith("http");
  const imageUrlQuery = useQuery(api.files.getImageUrl, isLocalStorageId ? { storageId } : "skip");
  const imageUrl = isLocalStorageId ? imageUrlQuery : storageId;

  return (
    <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-zinc-100 bg-zinc-50 group/item shadow-sm animate-in zoom-in-95 duration-500">
      {imageUrl ? (
        <img src={imageUrl} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="size-5 animate-spin text-zinc-200" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
        <Button
          type="button"
          onClick={onRemove}
          variant="destructive"
          className="size-10 rounded-full p-0 flex items-center justify-center shadow-2xl scale-75 group-hover/item:scale-100 transition-all duration-500"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Index Badge */}
      <div className="absolute top-4 left-4 size-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-500">
        <ImageIcon className="size-3 text-white/60" />
      </div>
    </div>
  );
}
