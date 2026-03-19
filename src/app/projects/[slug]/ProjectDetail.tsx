"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileX,
  ZoomIn,
} from "lucide-react";
import "./animations.css";

// ─── Convex image component — resolves storageId via useQuery ─────────────────

function ConvexImg({
  storageId,
  alt = "",
  className,
  onLoad,
}: {
  storageId: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
}) {
  const isId = !!storageId && !storageId.startsWith("http");
  const url = useQuery(api.files.getImageUrl, isId ? { storageId } : "skip");
  const src = isId ? url : storageId;

  if (!src) {
    return <div className={`${className} bg-[#e2e0d4] animate-pulse`} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onLoad={onLoad} />;
}

// ─── Tiptap content renderer ──────────────────────────────────────────────────

function marksToHtml(text: string, marks: any[] = []): string {
  let r = text;
  for (const m of marks) {
    switch (m.type) {
      case "bold": r = `<strong style="font-weight:700">${r}</strong>`; break;
      case "italic": r = `<em style="font-style:italic">${r}</em>`; break;
      case "underline": r = `<u style="text-decoration:underline">${r}</u>`; break;
      case "strike": r = `<s style="text-decoration:line-through">${r}</s>`; break;
      case "code": r = `<code style="background:#f4f4f5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:.875em;color:#be185d">${r}</code>`; break;
      case "link": r = `<a href="${m.attrs?.href || "#"}" target="${m.attrs?.target || "_blank"}" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline">${r}</a>`; break;
      case "highlight": r = `<mark style="background:${m.attrs?.color || "#fef08a"};padding:2px 0;border-radius:2px">${r}</mark>`; break;
      case "textStyle": if (m.attrs?.color) r = `<span style="color:${m.attrs.color}">${r}</span>`; break;
    }
  }
  return r;
}

function inlineToHtml(nodes: any[]): string {
  return (nodes || []).map((n) => {
    if (n.type === "text") return marksToHtml(n.text || "", n.marks);
    if (n.type === "hardBreak") return "<br/>";
    return "";
  }).join("");
}

function nodesToHtml(nodes: any[]): string {
  return (nodes || []).map((n) => {
    const align = n.attrs?.textAlign ? `text-align:${n.attrs.textAlign};` : "";
    switch (n.type) {
      case "paragraph": return `<p style="margin:12px 0;${align}">${inlineToHtml(n.content || [])}</p>`;
      case "heading": {
        const l = n.attrs?.level || 1;
        const sizes: Record<number, string> = { 1: "font-size:2.5rem;font-weight:800;line-height:1.2;margin:24px 0 16px;letter-spacing:-0.02em", 2: "font-size:2rem;font-weight:700;line-height:1.25;margin:20px 0 14px", 3: "font-size:1.5rem;font-weight:700;line-height:1.3;margin:18px 0 12px", 4: "font-size:1.25rem;font-weight:600;margin:16px 0 10px", 5: "font-size:1.125rem;font-weight:600;margin:14px 0 8px", 6: "font-size:1rem;font-weight:600;margin:12px 0 8px" };
        return `<h${l} style="${sizes[l] || sizes[1]};${align}">${inlineToHtml(n.content || [])}</h${l}>`;
      }
      case "bulletList": return `<ul style="list-style-type:disc;padding-left:24px;margin:12px 0">${(n.content || []).map((li: any) => `<li style="margin:6px 0">${nodesToHtml(li.content || [])}</li>`).join("")}</ul>`;
      case "orderedList": return `<ol style="list-style-type:decimal;padding-left:24px;margin:12px 0">${(n.content || []).map((li: any) => `<li style="margin:6px 0">${nodesToHtml(li.content || [])}</li>`).join("")}</ol>`;
      case "blockquote": return `<blockquote style="border-left:4px solid #e4e4e7;padding:16px 20px;margin:16px 0;font-style:italic;color:#52525b;background:#fafafa;border-radius:0 8px 8px 0">${nodesToHtml(n.content || [])}</blockquote>`;
      case "codeBlock": return `<pre style="background:#18181b;color:#fafafa;padding:16px 20px;border-radius:8px;margin:16px 0;overflow-x:auto;font-family:monospace;font-size:.875rem;line-height:1.6"><code>${inlineToHtml(n.content || [])}</code></pre>`;
      case "horizontalRule": return `<hr style="border:none;border-top:2px solid #e4e4e7;margin:24px 0"/>`;
      case "image": return `<img src="${n.attrs?.src}" alt="${n.attrs?.alt || ""}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0"/>`;
      case "table": return `<table style="border-collapse:collapse;width:100%;margin:16px 0">${nodesToHtml(n.content || [])}</table>`;
      case "tableRow": return `<tr>${nodesToHtml(n.content || [])}</tr>`;
      case "tableHeader": return `<th style="border:1px solid #e4e4e7;padding:10px 14px;text-align:left;background:#fafafa;font-weight:600;vertical-align:top">${nodesToHtml(n.content || [])}</th>`;
      case "tableCell": return `<td style="border:1px solid #e4e4e7;padding:10px 14px;text-align:left;vertical-align:top">${nodesToHtml(n.content || [])}</td>`;
      default: return nodesToHtml(n.content || []);
    }
  }).join("");
}

function renderContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (content?.type === "doc") return nodesToHtml(content.content || []);
  return "";
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={`fade-in-section ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Cover hero with resolved image ──────────────────────────────────────────

function CoverHero({ storageId, title, category }: { storageId: string; title: string; category?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full overflow-hidden bg-[#e2e0d4]" style={{ aspectRatio: "16/7", minHeight: "320px", maxHeight: "600px" }}>
      <ConvexImg
        storageId={storageId}
        alt={title}
        className={`size-full object-cover cover-scale ${loaded ? "loaded" : ""}`}
        onLoad={() => setLoaded(true)}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(88,89,71,0) 30%, rgba(88,89,71,0.75) 100%)" }}
      />
      {category && (
        <div className="absolute bottom-6 left-6">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-[10px] font-medium uppercase tracking-[1.68px] text-white font-ui">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Lightbox image (resolves its own storageId) ──────────────────────────────

function LightboxImg({ storageId, alt, caption }: { storageId: string; alt?: string; caption?: string }) {
  const isId = !!storageId && !storageId.startsWith("http");
  const url = useQuery(api.files.getImageUrl, isId ? { storageId } : "skip");
  const src = isId ? url : storageId;

  return (
    <div className="lightbox-img relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
      ) : (
        <div className="w-48 h-48 rounded-lg bg-white/10 animate-pulse" />
      )}
      {caption && <p className="text-white/60 text-sm text-center font-ui">{caption}</p>}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  items,
  initial,
  onClose,
}: {
  items: { storageId: string; alt?: string; caption?: string }[];
  initial: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initial);
  const prev = useCallback(() => setIdx((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const current = items[idx];

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
      >
        <X className="size-5" />
      </button>

      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[2px] text-white/50 font-ui z-10">
        {idx + 1} / {items.length}
      </span>

      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 sm:left-6 size-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <LightboxImg storageId={current.storageId} alt={current.alt} caption={current.caption} />
      </div>

      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 sm:right-6 size-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronRight className="size-6" />
        </button>
      )}
    </div>
  );
}

// ─── Gallery — Bento Grid ─────────────────────────────────────────────────────

function Gallery({ items }: { items: { url: string; alt?: string; caption?: string; isMain: boolean; order: number }[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Sort: main item first, then by order
  const sorted = [...items].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return a.order - b.order;
  });

  const lightboxItems = sorted.map((item) => ({
    storageId: item.url,
    alt: item.alt,
    caption: item.caption,
  }));

  if (sorted.length === 0) return null;

  const total = sorted.length;

  // Returns Tailwind col/row span classes per position in the bento
  const getSpan = (i: number): string => {
    if (total === 1) return "col-span-3 row-span-2";
    if (total === 2) return i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-2";
    if (total === 3) return i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
    // 4+ — repeating bento pattern
    const patterns = [
      "col-span-2 row-span-2", // hero
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ];
    return patterns[i] ?? "col-span-1 row-span-1";
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 auto-rows-[160px] sm:auto-rows-[210px]">
        {sorted.map((item, i) => (
          <FadeIn
            key={`${item.url}-${i}`}
            delay={300 + i * 50}
            className={getSpan(i)}
          >
            <div
              className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#e2e0d4] group cursor-zoom-in"
              onClick={() => setLightbox(i)}
            >
              <ConvexImg
                storageId={item.url}
                alt={item.alt}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500 flex items-center justify-center">
                <div className="size-10 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-400 scale-75 group-hover:scale-100">
                  <ZoomIn className="size-4 text-[#585947] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white/80 text-xs font-ui leading-snug">{item.caption}</p>
                </div>
              )}
              {/* Main badge */}
              {item.isMain && i === 0 && (
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-[9px] font-bold uppercase tracking-[1.4px] text-white font-ui">
                    Capa
                  </span>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox items={lightboxItems} initial={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f5ed] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-[16px] bg-white border border-[rgba(88,89,71,0.15)] flex items-center justify-center mx-auto mb-8">
          <FileX className="size-9 text-[#8a8a80]" />
        </div>
        <h1 className="text-[28px] sm:text-[42px] font-light tracking-[-1px] sm:tracking-[-1.68px] leading-none text-[#585947] font-ui mb-4">
          Projeto não encontrado
        </h1>
        <p className="text-[#626262] text-base leading-relaxed mb-8">
          Este projeto não existe ou não está disponível no momento.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#585947] text-white px-6 py-3 rounded-[8px] text-sm font-medium font-ui tracking-[1.12px] uppercase transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="size-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = useQuery(api.projects.getProjectBySlug, { slug });

  if (project === undefined) {
    return (
      <div className="min-h-screen bg-[#f6f5ed] flex items-center justify-center">
        <Loader2 className="size-8 text-[#8a8a80] animate-spin" />
      </div>
    );
  }

  if (!project || project.status !== "published") {
    return <NotFound />;
  }

  const html = renderContent(project.content);
  const galleryItems = (project.gallery || []).sort((a, b) => a.order - b.order);
  const hasCover = !!project.coverImage;
  const hasGallery = galleryItems.length > 0;
  const hasContent = !!html;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ────────────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[rgba(88,89,71,0.1)] h-16 flex items-center">
          <div className="max-w-[1128px] mx-auto px-6 w-full flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.12px] text-[#585947] font-ui hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>
            <span className="text-[10px] text-[#8a8a80] uppercase tracking-widest font-ui hidden sm:block">
              Jarline Vieira Arquitetura
            </span>
          </div>
        </nav>
      </FadeIn>

      {/* ── Cover ─────────────────────────────────────────────────── */}
      {hasCover && (
        <CoverHero storageId={project.coverImage!} title={project.title} category={project.category} />
      )}

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className={hasCover ? "" : "pt-10 sm:pt-16"}>
        <div className="max-w-[1128px] mx-auto px-6 py-10 sm:py-16 border-b border-[rgba(88,89,71,0.1)]">
          <div className="max-w-[760px]">

            <FadeIn delay={150}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {project.category && !hasCover && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f6f5ed] border border-[rgba(88,89,71,0.2)] text-[10px] font-medium uppercase tracking-[1.4px] text-[#585947] font-ui">
                    {project.category}
                  </span>
                )}
                <span className="text-[11px] font-light uppercase tracking-[1.68px] text-[#8a8a80] font-ui">
                  {new Date(project.publishedAt ?? project.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={250}>
              <h1 className="text-[38px] sm:text-[64px] font-light tracking-[-1.2px] sm:tracking-[-2.56px] leading-[1.08] sm:leading-none text-[#585947] font-ui mb-4 sm:mb-5">
                {project.title}
              </h1>
            </FadeIn>

            {project.subtitle && (
              <FadeIn delay={350}>
                <p className="text-[18px] sm:text-[22px] font-light tracking-[-0.5px] sm:tracking-[-0.88px] leading-snug text-[#585947]/70 font-ui mb-4">
                  {project.subtitle}
                </p>
              </FadeIn>
            )}

            {project.summary && (
              <FadeIn delay={420}>
                <p className="text-[#626262] text-sm sm:text-base leading-relaxed tracking-[-0.3px] sm:tracking-[-0.64px] max-w-[640px]">
                  {project.summary}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {/* ── Gallery ───────────────────────────────────────────────── */}
      {hasGallery && (
        <div className="max-w-[1128px] mx-auto px-6 py-10 sm:py-16 border-b border-[rgba(88,89,71,0.08)]">
          <FadeIn delay={300}>
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="h-px w-8 bg-[#585947]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[2px] text-[#8a8a80] font-ui">Galeria</span>
            </div>
          </FadeIn>
          <Gallery items={galleryItems} />
        </div>
      )}

      {/* ── Rich text content ─────────────────────────────────────── */}
      {hasContent && (
        <div className="max-w-[1128px] mx-auto px-6 py-10 sm:py-16">
          <FadeIn delay={hasGallery ? 200 : 450}>
            <div className="flex items-center gap-3 mb-8 sm:mb-10">
              <div className="h-px w-8 bg-[#585947]/40" />
              <span className="text-[10px] font-medium uppercase tracking-[2px] text-[#8a8a80] font-ui">Sobre o projeto</span>
            </div>
            <div
              className="max-w-[800px] page-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </FadeIn>
        </div>
      )}

      {!hasGallery && !hasContent && (
        <div className="max-w-[1128px] mx-auto px-6 py-16">
          <FadeIn delay={400}>
            <p className="text-[#8a8a80] italic text-sm">Detalhes do projeto em breve.</p>
          </FadeIn>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────── */}
      <FadeIn delay={0}>
        <footer className="bg-[#585947] py-8 sm:py-10 mt-12 sm:mt-20">
          <div className="max-w-[1128px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <span className="text-[#e2e0d4] text-sm font-ui">
              Jarline Vieira Arquitetura &amp; Interiores
            </span>
            <Link
              href="/"
              className="text-[11px] uppercase tracking-[1.12px] text-[#e2e0d4]/60 font-ui hover:text-[#e2e0d4] transition-colors"
            >
              Voltar ao site →
            </Link>
          </div>
        </footer>
      </FadeIn>
    </div>
  );
}
