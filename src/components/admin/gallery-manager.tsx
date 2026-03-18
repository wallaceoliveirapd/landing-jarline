"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Plus, Image as ImageIcon, GripVertical, Star, Edit3, Check } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface GalleryItem {
  url: string;
  alt?: string;
  caption?: string;
  isMain: boolean;
  order: number;
}

interface GalleryManagerProps {
  value?: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  label?: string;
  description?: string;
}

export function GalleryManager({ value = [], onChange, label, description }: GalleryManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Drag and drop state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const copyListItems = [...value];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);

      // Update order property
      const reordered = copyListItems.map((item, index) => ({ ...item, order: index }));
      onChange(reordered);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newItems: GalleryItem[] = [];

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

        // If there are no items, make the first uploaded one the main item.
        const isFirst = value.length === 0 && i === 0;

        newItems.push({
          url: storageId,
          alt: file.name.split('.')[0] || "",
          caption: "",
          isMain: isFirst,
          order: value.length + i,
        });
      }

      onChange([...value, ...newItems]);
      toast.success(`${newItems.length} imagens enviadas à galeria!`);
    } catch (error) {
      console.error(error);
      toast.error("Erro no upload múltiplo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeItem = (index: number) => {
    const next = [...value];
    const wasMain = next[index].isMain;
    next.splice(index, 1);

    // If we removed the main item, make the first one main
    if (wasMain && next.length > 0) {
      next[0].isMain = true;
    }

    // Re-order
    const reordered = next.map((item, idx) => ({ ...item, order: idx }));

    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    onChange(reordered);
  };

  const updateItem = (index: number, updates: Partial<GalleryItem>) => {
    const next = [...value];

    if (updates.isMain) {
      // Set all others to false
      next.forEach(item => item.isMain = false);
    }

    next[index] = { ...next[index], ...updates };
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

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {value.map((item, index) => (
          <GalleryPreviewItem
            key={`${item.url}-${index}`}
            item={item}
            index={index}
            isEditing={editingIndex === index}
            isDragging={isDragging}
            dragIndex={dragItem.current}
            onToggleEdit={() => setEditingIndex(editingIndex === index ? null : index)}
            onRemove={() => removeItem(index)}
            onUpdate={(updates) => updateItem(index, updates)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
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

interface GalleryPreviewItemProps {
  item: GalleryItem;
  index: number;
  isEditing: boolean;
  isDragging: boolean;
  dragIndex: number | null;
  onToggleEdit: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<GalleryItem>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

function GalleryPreviewItem({
  item,
  index,
  isEditing,
  isDragging,
  dragIndex,
  onToggleEdit,
  onRemove,
  onUpdate,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: GalleryPreviewItemProps) {
  const isDraggingItem = isDragging && dragIndex === index;
  const isLocalStorageId = item.url && !item.url.startsWith("http");
  const imageUrlQuery = useQuery(api.files.getImageUrl, isLocalStorageId ? { storageId: item.url } : "skip");
  const imageUrl = isLocalStorageId ? imageUrlQuery : item.url;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative rounded-[2rem] overflow-hidden border transition-all duration-500 bg-white group/item shadow-sm ${isDraggingItem ? 'ring-2 ring-[#585947]/30 scale-[1.02] opacity-80' : ''} ${item.isMain ? 'border-[#585947] shadow-[#585947]/10' : 'border-zinc-100'}`}
    >
      {/* Image Preview Area */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 flex flex-col">
        {imageUrl ? (
          <img src={imageUrl} alt={item.alt || "Gallery item"} className={`w-full h-full object-cover transition-transform duration-700 ${isEditing ? 'scale-105 opacity-50' : 'group-hover/item:scale-105'}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-zinc-200" />
          </div>
        )}

        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-between p-4 transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <div className="size-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-grab active:cursor-grabbing text-white" title="Arraste para reordenar">
                <GripVertical className="size-4" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onUpdate({ isMain: true })}
                className={`size-8 rounded-full border flex items-center justify-center transition-all ${item.isMain ? 'bg-[#585947] border-[#585947] text-white' : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20'}`}
                title={item.isMain ? "Capa Atual" : "Definir como Capa"}
              >
                <Star className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              className="size-8 rounded-full p-0 flex items-center justify-center"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onToggleEdit}
              className="h-8 px-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold uppercase tracking-widest"
            >
              {isEditing ? (
                <><Check className="size-3 mr-2" />Feito</>
              ) : (
                <><Edit3 className="size-3 mr-2" />Editar Infos</>
              )}
            </Button>
          </div>
        </div>

        {/* Index Badge (Hidden on Hover or Edit) */}
        {!isEditing && (
          <div className="absolute top-4 left-4 size-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm flex items-center justify-center transition-opacity duration-300 group-hover/item:opacity-0 pointer-events-none">
            <span className="text-[10px] font-bold text-white drop-shadow-md">{index + 1}</span>
          </div>
        )}
      </div>

      {/* Details Form (Expandable) */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isEditing ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 space-y-4 border-t border-zinc-50 bg-white">
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Texto Alternativo (SEO)</Label>
            <Input
              value={item.alt || ""}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="h-8 text-xs bg-zinc-50 border-none px-3"
              placeholder="Ex: Sala de estar com sofá..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Legenda / Crédito (Opcional)</Label>
            <Input
              value={item.caption || ""}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              className="h-8 text-xs bg-zinc-50 border-none px-3"
              placeholder="Ex: Foto por João Silva"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
