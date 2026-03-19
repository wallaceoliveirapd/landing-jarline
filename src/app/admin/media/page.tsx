"use client";

export const dynamic = 'force-dynamic';

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Image as ImageIcon,
  Grid2X2,
  List,
  Trash2,
  Eye,
  Maximize2,
  FileCode,
  FileText,
  Loader2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Resolve storageId to URL via Convex ─────────────────────────────────────

function MediaImg({ storageId, alt, className }: { storageId: string; alt?: string; className?: string }) {
  const url = useQuery(api.files.getImageUrl, storageId ? { storageId } : "skip");
  if (!url) return <div className={`${className} bg-zinc-100 animate-pulse`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt || ""} className={className} />;
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function MediaGridCard({
  item,
  onPreview,
  onDelete,
}: {
  item: any;
  onPreview: () => void;
  onDelete: () => void;
}) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="size-12 text-zinc-900" />;
      case "video": return <FileCode className="size-12 text-zinc-900" />;
      default: return <FileText className="size-12 text-zinc-900" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className="group relative aspect-square rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden hover:border-zinc-200 transition-all cursor-pointer"
      onClick={onPreview}
    >
      {item.type === "image" ? (
        <MediaImg
          storageId={item.storageId}
          alt={item.alt || item.filename}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
          {getFileIcon(item.type)}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-sm border-t border-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-[10px] font-bold text-zinc-900 truncate mb-1">{item.filename}</p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">{formatFileSize(item.size)}</span>
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); onPreview(); }} className="p-1 text-zinc-400 hover:text-zinc-900">
              <Eye className="size-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-zinc-400 hover:text-red-500">
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPreview(); }}
        className="absolute top-4 right-4 size-8 rounded-full bg-white/80 backdrop-blur-md border border-zinc-100 flex items-center justify-center text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-900"
      >
        <Maximize2 className="size-3" />
      </button>
    </div>
  );
}

// ─── List row thumbnail ───────────────────────────────────────────────────────

function MediaListThumb({ item }: { item: any }) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="size-5 text-zinc-300" />;
      case "video": return <FileCode className="size-5 text-zinc-300" />;
      default: return <FileText className="size-5 text-zinc-300" />;
    }
  };

  if (item.type !== "image") {
    return (
      <div className="size-10 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
        {getFileIcon(item.type)}
      </div>
    );
  }

  return (
    <div className="size-10 rounded-lg bg-zinc-50 overflow-hidden shrink-0">
      <MediaImg storageId={item.storageId} alt={item.alt || item.filename} className="w-full h-full object-cover" />
    </div>
  );
}

// ─── Preview dialog image ─────────────────────────────────────────────────────

function MediaPreviewImg({ item }: { item: any }) {
  const url = useQuery(api.files.getImageUrl, item?.storageId ? { storageId: item.storageId } : "skip");

  if (!url) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={item.alt || item.filename} className="max-w-full max-h-[60vh] object-contain rounded-lg" />;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MediaLibraryPage() {
  const mediaItems = useQuery(api.media.getMedia);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addMedia = useMutation(api.media.addMedia);
  const deleteMedia = useMutation(api.media.deleteMedia);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = mediaItems?.filter((item: any) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "images" && item.type === "image") ||
      (filterType === "videos" && item.type === "video") ||
      (filterType === "docs" && (item.type === "document" || item.type === "archive"));
    return matchesSearch && matchesType;
  }) || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let uploadedCount = 0;
    let errorCount = 0;

    try {
      for (const file of Array.from(files)) {
        try {
          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!response.ok) throw new Error("Upload failed");

          const { storageId } = await response.json();
          const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";

          await addMedia({
            filename: file.name,
            storageId,
            url: storageId,
            type: fileType,
            mimeType: file.type,
            size: file.size,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            caption: "",
            folder: "uploads",
            tags: [],
          });
          uploadedCount++;
        } catch {
          errorCount++;
        }
      }

      if (uploadedCount > 0) toast.success(`${uploadedCount} arquivo(s) enviado(s) com sucesso`);
      if (errorCount > 0) toast.error(`${errorCount} erro(s) ao enviar arquivo(s)`);
    } catch {
      toast.error("Erro ao fazer upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.filename}"?`)) return;
    try {
      await deleteMedia({ id: item._id });
      toast.success("Arquivo excluído");
      setPreviewItem(null);
    } catch {
      toast.error("Erro ao excluir arquivo");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="size-12 text-zinc-900" />;
      case "video": return <FileCode className="size-12 text-zinc-900" />;
      default: return <FileText className="size-12 text-zinc-900" />;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-12 py-4 sm:py-8 pb-20 sm:pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 border-b border-zinc-100 pb-6 sm:pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Biblioteca de Ativos Digitais</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-display">Mídia</h2>
          <p className="text-zinc-500 text-sm max-w-md hidden sm:block">Gerencie suas imagens, vídeos e documentos utilizados em todo o ecossistema.</p>
        </div>

        <div className="w-full sm:w-auto">
          <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
          <Button variant="premium" size="lg" className="whitespace-nowrap w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <><Loader2 className="size-5 animate-spin mr-2" />Enviando...</> : <><Plus className="size-5" />Fazer Upload</>}
          </Button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          <Tabs value={filterType} onValueChange={setFilterType} className="w-full sm:w-auto">
            <TabsList className="bg-zinc-50 border border-zinc-100 p-1 rounded-2xl h-11">
              <TabsTrigger value="all" className="rounded-lg px-5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Todos</TabsTrigger>
              <TabsTrigger value="images" className="rounded-lg px-5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Imagens</TabsTrigger>
              <TabsTrigger value="videos" className="rounded-lg px-5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Vídeos</TabsTrigger>
              <TabsTrigger value="docs" className="rounded-lg px-5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm">Documentos</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-300" />
              <Input placeholder="Buscar arquivo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12" />
            </div>
            <Button variant={viewMode === "grid" ? "secondary" : "outline"} size="icon-lg" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-zinc-100" : "text-zinc-400"}>
              <Grid2X2 className="size-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "outline"} size="icon-lg" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-zinc-100" : "text-zinc-400"}>
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
              <ImageIcon className="size-8 text-zinc-200" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">Nenhum arquivo encontrado</h3>
            <p className="text-sm text-zinc-500 max-w-md">
              {searchTerm ? "Tente buscar por outro termo" : "Faça upload de imagens, vídeos ou documentos para começar"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
            {filteredItems.map((item: any) => (
              <MediaGridCard
                key={item._id}
                item={item}
                onPreview={() => setPreviewItem(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Arquivo</th>
                  <th className="hidden sm:table-cell text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tipo</th>
                  <th className="text-left px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tamanho</th>
                  <th className="hidden sm:table-cell text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Data</th>
                  <th className="text-right px-4 sm:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredItems.map((item: any) => (
                  <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <MediaListThumb item={item} />
                        <span className="text-sm font-medium text-zinc-900 truncate max-w-[140px] sm:max-w-none">{item.filename}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className="text-xs font-medium text-zinc-500 uppercase">{item.type}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-xs text-zinc-500">{formatFileSize(item.size)}</span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewItem(item)}>
                          <Eye className="size-4 text-zinc-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                          <Trash2 className="size-4 text-zinc-400 hover:text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-lg font-medium">{previewItem?.filename}</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4 flex items-center justify-center bg-zinc-50 min-h-[300px]">
            {previewItem?.type === "image" ? (
              <MediaPreviewImg item={previewItem} />
            ) : (
              <div className="text-center">
                {getFileIcon(previewItem?.type)}
                <p className="mt-4 text-sm text-zinc-500">Preview não disponível</p>
              </div>
            )}
          </div>
          <div className="px-6 pb-6 flex justify-between items-center border-t border-zinc-100 pt-4">
            <span className="text-sm text-zinc-500">{previewItem && formatFileSize(previewItem.size)}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewItem(null)}>Fechar</Button>
              <Button variant="destructive" onClick={() => { handleDelete(previewItem); setPreviewItem(null); }}>
                <Trash2 className="size-4 mr-2" />Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
