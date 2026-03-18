"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, FileX } from "lucide-react";

import "./animations.css";

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────

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

// ─── Tiptap content renderer ─────────────────────────────────────────────────

function marksToHtml(text: string, marks: any[] = [], nodeAttrs?: any): string {
  let result = text;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = `<strong style="font-weight: 700">${result}</strong>`;
        break;
      case "italic":
        result = `<em style="font-style: italic">${result}</em>`;
        break;
      case "underline":
        result = `<u style="text-decoration: underline">${result}</u>`;
        break;
      case "strike":
        result = `<s style="text-decoration: line-through">${result}</s>`;
        break;
      case "code":
        result = `<code style="background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; color: #be185d">${result}</code>`;
        break;
      case "link":
        result = `<a href="${mark.attrs?.href || "#"}" target="${mark.attrs?.target || "_blank"}" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; text-underline-offset: 2px">${result}</a>`;
        break;
      case "highlight":
        result = `<mark style="background: ${mark.attrs?.color || "#fef08a"}; padding: 2px 0; border-radius: 2px">${result}</mark>`;
        break;
      case "subscript":
        result = `<sub style="font-size: 0.75em; vertical-align: baseline; position: relative; bottom: -0.25em">${result}</sub>`;
        break;
      case "superscript":
        result = `<sup style="font-size: 0.75em; vertical-align: baseline; position: relative; top: -0.5em">${result}</sup>`;
        break;
      case "textStyle":
        if (mark.attrs?.color) {
          result = `<span style="color: ${mark.attrs.color}">${result}</span>`;
        }
        if (mark.attrs?.fontSize) {
          result = `<span style="font-size: ${mark.attrs.fontSize}">${result}</span>`;
        }
        break;
    }
  }
  return result;
}

function getTextAlignStyle(attrs: any): string {
  if (!attrs?.textAlign) return "";
  return `text-align: ${attrs.textAlign};`;
}

function inlineToHtml(nodes: any[]): string {
  return (nodes || []).map((node) => {
    if (node.type === "text") return marksToHtml(node.text || "", node.marks, node.attrs);
    if (node.type === "hardBreak") return "<br/>";
    if (node.type === "taskItem") {
      const checked = node.attrs?.checked ? "checked" : "";
      const content = nodesToHtml(node.content || []);
      return `<li style="display: flex; align-items: flex-start; gap: 8px; list-style: none">
        <input type="checkbox" ${checked} disabled style="margin-top: 6px; accent-color: #2563eb">
        <span style="${node.attrs?.checked ? "text-decoration: line-through; color: #a1a1aa" : ""}">${content}</span>
      </li>`;
    }
    return "";
  }).join("");
}

function nodesToHtml(nodes: any[]): string {
  return (nodes || []).map((node) => {
    const alignStyle = getTextAlignStyle(node.attrs);
    const styleAttr = alignStyle ? ` style="${alignStyle}"` : "";

    switch (node.type) {
      case "paragraph":
        return `<p style="margin: 12px 0; ${alignStyle}">${inlineToHtml(node.content || [])}</p>`;
      case "heading":
        const level = node.attrs?.level || 1;
        const headingSizes: { [key: number]: string } = {
          1: "font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin: 24px 0 16px; letter-spacing: -0.02em",
          2: "font-size: 2rem; font-weight: 700; line-height: 1.25; margin: 20px 0 14px; letter-spacing: -0.015em",
          3: "font-size: 1.5rem; font-weight: 700; line-height: 1.3; margin: 18px 0 12px",
          4: "font-size: 1.25rem; font-weight: 600; line-height: 1.4; margin: 16px 0 10px",
          5: "font-size: 1.125rem; font-weight: 600; line-height: 1.4; margin: 14px 0 8px",
          6: "font-size: 1rem; font-weight: 600; line-height: 1.5; margin: 12px 0 8px",
        };
        return `<h${level} style="${headingSizes[level] || headingSizes[1]} ${alignStyle}">${inlineToHtml(node.content || [])}</h${level}>`;
      case "bulletList":
        return `<ul style="list-style-type: disc; padding-left: 24px; margin: 12px 0">
          ${(node.content || []).map((li: any) => `<li style="margin: 6px 0">${nodesToHtml(li.content || [])}</li>`).join("")}
        </ul>`;
      case "orderedList":
        return `<ol style="list-style-type: decimal; padding-left: 24px; margin: 12px 0">
          ${(node.content || []).map((li: any) => `<li style="margin: 6px 0">${nodesToHtml(li.content || [])}</li>`).join("")}
        </ol>`;
      case "taskList":
        return `<ul style="list-style: none; padding: 0; margin: 12px 0">
          ${(node.content || []).map((li: any) => {
          const checked = li.attrs?.checked;
          const content = inlineToHtml(li.content || []);
          return `<li style="display: flex; align-items: flex-start; gap: 8px; margin: 6px 0">
              <input type="checkbox" ${checked ? "checked" : ""} disabled style="margin-top: 6px; accent-color: #2563eb; width: 16px; height: 16px">
              <span style="${checked ? "text-decoration: line-through; color: #a1a1aa" : ""}">${content}</span>
            </li>`;
        }).join("")}
        </ul>`;
      case "listItem":
        return `<li style="margin: 6px 0">${nodesToHtml(node.content || [])}</li>`;
      case "blockquote":
        return `<blockquote style="border-left: 4px solid #e4e4e7; padding-left: 20px; margin: 16px 0; font-style: italic; color: #52525b; background: #fafafa; padding: 16px 20px; border-radius: 0 8px 8px 0 ${alignStyle}">${nodesToHtml(node.content || [])}</blockquote>`;
      case "codeBlock":
        return `<pre style="background: #18181b; color: #fafafa; padding: 16px 20px; border-radius: 8px; margin: 16px 0; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.6 ${alignStyle}"><code>${inlineToHtml(node.content || [])}</code></pre>`;
      case "horizontalRule":
        return `<hr style="border: none; border-top: 2px solid #e4e4e7; margin: 24px 0" />`;
      case "image":
        return `<img src="${node.attrs?.src}" alt="${node.attrs?.alt || ""}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0" />`;
      case "table":
        return `<table style="border-collapse: collapse; width: 100%; margin: 16px 0">
          ${nodesToHtml(node.content || [])}
        </table>`;
      case "tableRow":
        return `<tr>${nodesToHtml(node.content || [])}</tr>`;
      case "tableHeader":
        return `<th style="border: 1px solid #e4e4e7; padding: 10px 14px; text-align: left; background: #fafafa; font-weight: 600; vertical-align: top">${nodesToHtml(node.content || [])}</th>`;
      case "tableCell":
        return `<td style="border: 1px solid #e4e4e7; padding: 10px 14px; text-align: left; vertical-align: top">${nodesToHtml(node.content || [])}</td>`;
      default:
        return nodesToHtml(node.content || []);
    }
  }).join("");
}

function renderContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object" && content.type === "doc") {
    return nodesToHtml(content.content || []);
  }
  if (Array.isArray(content)) return "";
  return "";
}

// ─── Cover image helper ──────────────────────────────────────────────────────

function CoverImage({ storageId }: { storageId: string }) {
  const url = useQuery(api.files.getImageUrl, { storageId });
  if (!url) return null;
  return (
    <div className="w-full aspect-[5/1] overflow-hidden bg-[#e2e0d4]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Capa"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// ─── Not found screen ────────────────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <div className="min-h-screen bg-[#f6f5ed] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-[16px] bg-white border border-[rgba(88,89,71,0.15)] flex items-center justify-center mx-auto mb-8">
          <FileX className="size-9 text-[#8a8a80]" />
        </div>
        <h1 className="text-[42px] font-light tracking-[-1.68px] leading-none text-[#585947] font-ui mb-4">
          Página não encontrada
        </h1>
        <p className="text-[#626262] text-base leading-relaxed mb-8">
          Esta página não existe ou não está disponível no momento.
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

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PublicPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const page = useQuery(api.pages.getPageBySlug, { slug });

  if (page === undefined) {
    return (
      <div className="min-h-screen bg-[#f6f5ed] flex items-center justify-center">
        <Loader2 className="size-8 text-[#8a8a80] animate-spin" />
      </div>
    );
  }

  if (!page || page.status !== "published") {
    return <NotFoundScreen />;
  }

  const html = renderContent(page.content);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar strip ─────────────────────────────────── */}
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

            <span className="text-[10px] text-[#8a8a80] uppercase tracking-widest font-ui">
              Jarline Vieira Arquitetura
            </span>
          </div>
        </nav>
      </FadeIn>

      {/* ── Cover image ──────────────────────────────────── */}
      {page.coverImage && (
        <FadeIn delay={100}>
          <CoverImage storageId={page.coverImage} />
        </FadeIn>
      )}

      {/* ── Hero header ──────────────────────────────────── */}
      <div className={`${page.coverImage ? "" : "pt-16"}`}>
        <div className="max-w-[1128px] mx-auto px-6 py-16 border-b border-[rgba(88,89,71,0.1)]">
          <div className="max-w-[720px]">
            <FadeIn delay={200}>
              <p className="text-[11px] font-light uppercase tracking-[1.68px] text-[#8a8a80] font-ui mb-4">
                {new Date(page.publishedAt ?? page.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <h1 className="text-[64px] font-light tracking-[-2.56px] leading-none text-[#585947] font-ui mb-6">
                {page.title}
              </h1>
            </FadeIn>
            {page.description && (
              <FadeIn delay={400}>
                <p className="text-[#626262] text-base leading-relaxed tracking-[-0.64px] max-w-[600px]">
                  {page.description}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {html ? (
        <FadeIn delay={500}>
          <div className="max-w-[1128px] mx-auto px-6 py-16">
            <div
              className="max-w-[1128px] page-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={500}>
          <div className="max-w-[1128px] mx-auto px-6 py-16">
            <p className="text-[#8a8a80] italic text-sm">Nenhum conteúdo publicado ainda.</p>
          </div>
        </FadeIn>
      )}

      {/* ── Footer strip ─────────────────────────────────── */}
      <FadeIn delay={600}>
        <footer className="bg-[#585947] py-10 mt-16">
          <div className="max-w-[1128px] mx-auto px-6 flex items-center justify-between">
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
