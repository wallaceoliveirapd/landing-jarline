"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table as TiptapTable } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Type,
  Palette,
  Highlighter,
  Code,
  Minus,
  CheckSquare,
  RemoveFormatting,
  Table as TableIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
  placeholder?: string;
}

const fontSizes = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
];

const textColors = [
  "#000000", "#333333", "#666666", "#999999",
  "#cc0000", "#e63946", "#d62828",
  "#f77f00", "#fcbf49", "#ffbe0b",
  "#2a9d8f", "#264653", "#1d3557",
  "#7209b7", "#3a0ca3", "#4361ee",
  "#0077b6", "#00b4d8", "#90e0ef",
];

const highlightColors = [
  "#ffff00", "#ffeb3b", "#ffc107",
  "#ff9800", "#ff5722", "#f44336",
  "#e91e63", "#9c27b0", "#673ab7",
  "#3f51b5", "#2196f3", "#00bcd4",
  "#009688", "#4caf50", "#8bc34a",
  "#cddc39", "#ffeb3b", "#ffffff",
];

export function RichTextEditor({ content, onChange, placeholder = "Escreva o conteúdo aqui..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "editor-code-block",
        },
      }),
      Subscript,
      Superscript,
      TiptapTable.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (!editor.state.selection.from) return;
    
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL da Imagem");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setTextColor = (color: string) => {
    if (!editor.state.selection.from) return;
    editor.chain().focus().setColor(color).run();
  };

  const setHighlightColor = (color: string) => {
    if (!editor.state.selection.from) return;
    editor.chain().focus().setHighlight({ color }).run();
  };

  const setFontSize = (size: string) => {
    if (!editor.state.selection.from) return;
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm flex flex-col" style={{ maxHeight: "640px" }}>
      <style jsx global>{`
        .rich-editor-content {
          min-height: 320px;
          padding: 24px;
          outline: none;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: #18181b;
        }

        .rich-editor-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin: 1.5rem 0 1rem;
          color: #09090b;
          letter-spacing: -0.02em;
        }

        .rich-editor-content h2 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.25;
          margin: 1.25rem 0 0.875rem;
          color: #18181b;
          letter-spacing: -0.015em;
        }

        .rich-editor-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 1.125rem 0 0.75rem;
          color: #27272a;
        }

        .rich-editor-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 1rem 0 0.625rem;
          color: #3f3f46;
        }

        .rich-editor-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.875rem 0 0.5rem;
          color: #52525b;
        }

        .rich-editor-content h6 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 0.75rem 0 0.5rem;
          color: #71717a;
        }

        .rich-editor-content p {
          margin: 0.75rem 0;
        }

        .rich-editor-content p:first-child {
          margin-top: 0;
        }

        .rich-editor-content p:last-child {
          margin-bottom: 0;
        }

        .rich-editor-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }

        .rich-editor-content ul li {
          margin: 0.375rem 0;
          padding-left: 0.25rem;
        }

        .rich-editor-content ul ul {
          list-style-type: circle;
          margin: 0.25rem 0;
        }

        .rich-editor-content ul ul ul {
          list-style-type: square;
        }

        .rich-editor-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }

        .rich-editor-content ol li {
          margin: 0.375rem 0;
          padding-left: 0.25rem;
        }

        .rich-editor-content ol ol {
          list-style-type: lower-alpha;
        }

        .rich-editor-content blockquote {
          border-left: 4px solid #e4e4e7;
          padding-left: 1.25rem;
          margin: 1rem 0;
          font-style: italic;
          color: #52525b;
          background: #fafafa;
          padding: 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
        }

        .rich-editor-content code {
          background: #f4f4f5;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.875em;
          color: #be185d;
        }

        .rich-editor-content pre {
          background: #18181b;
          color: #fafafa;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          margin: 1rem 0;
          overflow-x: auto;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .rich-editor-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }

        .rich-editor-content hr {
          border: none;
          border-top: 2px solid #e4e4e7;
          margin: 1.5rem 0;
        }

        .rich-editor-content a,
        .rich-editor-content .editor-link {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.15s;
        }

        .rich-editor-content a:hover {
          color: #1d4ed8;
        }

        .rich-editor-content img,
        .rich-editor-content .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .rich-editor-content mark {
          background: #fef08a;
          color: inherit;
          padding: 0.125rem 0;
          border-radius: 2px;
        }

        .rich-editor-content sub {
          font-size: 0.75em;
          vertical-align: baseline;
          position: relative;
          bottom: -0.25em;
        }

        .rich-editor-content sup {
          font-size: 0.75em;
          vertical-align: baseline;
          position: relative;
          top: -0.5em;
        }

        .rich-editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        .rich-editor-content th,
        .rich-editor-content td {
          border: 1px solid #e4e4e7;
          padding: 0.625rem 0.875rem;
          text-align: left;
        }

        .rich-editor-content th {
          background: #fafafa;
          font-weight: 600;
        }

        .rich-editor-content ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .rich-editor-content ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .rich-editor-content ul[data-type="taskList"] li > label {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .rich-editor-content ul[data-type="taskList"] li > label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .rich-editor-content ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          color: #a1a1aa;
        }

        .rich-editor-content .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a1a1aa;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror-selectednode {
          outline: 2px solid #2563eb;
          border-radius: 4px;
        }

        /* ── Table resize handle ── */
        .ProseMirror .tableWrapper {
          overflow-x: auto;
        }
        .ProseMirror table {
          table-layout: fixed;
        }
        .ProseMirror td, .ProseMirror th {
          position: relative;
        }
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: transparent;
          cursor: col-resize;
          z-index: 20;
          transition: background-color 0.15s;
        }
        .ProseMirror .column-resize-handle:hover {
          background-color: rgba(88, 89, 71, 0.35);
        }
        .ProseMirror.resize-cursor,
        .ProseMirror.resize-cursor * {
          cursor: col-resize !important;
        }
      `}</style>

      <div className="border-b border-zinc-100 bg-zinc-50/50 p-2 shrink-0 sticky top-0 z-10">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Título 1"
            >
              <Heading1 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Título 2"
            >
              <Heading2 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Título 3"
            >
              <Heading3 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive("paragraph") ? "bg-zinc-200 size-8" : "size-8"}
              title="Parágrafo"
            >
              <Type className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Tamanho da fonte"
                >
                  <span className="text-xs font-bold">A</span>
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-white p-2 rounded-lg shadow-lg border border-zinc-200 z-50" sideOffset={5}>
                  <div className="grid grid-cols-3 gap-1 min-w-[160px]">
                    {fontSizes.map((size) => (
                      <button
                        key={size.value}
                        type="button"
                        onClick={() => setFontSize(size.value)}
                        className="px-2 py-1 text-xs hover:bg-zinc-100 rounded transition-colors"
                        style={{ fontSize: size.value }}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Cor do texto"
                >
                  <Palette className="size-4" style={{ color: editor.getAttributes("textStyle").color || "#000" }} />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-white p-3 rounded-lg shadow-lg border border-zinc-200 z-50" sideOffset={5}>
                  <div className="grid grid-cols-5 gap-1.5 min-w-[180px]">
                    <button
                      type="button"
                      onClick={() => setTextColor("#000000")}
                      className="w-7 h-7 rounded border-2 border-zinc-300"
                      style={{ background: "#000000" }}
                      title="Preto"
                    />
                    <button
                      type="button"
                      onClick={() => setTextColor("#ffffff")}
                      className="w-7 h-7 rounded border-2 border-zinc-300"
                      style={{ background: "#ffffff" }}
                      title="Branco"
                    />
                    {textColors.slice(2).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setTextColor(color)}
                        className="w-7 h-7 rounded border border-zinc-200 hover:scale-110 transition-transform"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  title="Cor de destaque"
                >
                  <Highlighter className="size-4" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-white p-3 rounded-lg shadow-lg border border-zinc-200 z-50" sideOffset={5}>
                  <div className="grid grid-cols-6 gap-1.5 min-w-[180px]">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().unsetHighlight().run()}
                      className="w-7 h-7 rounded border-2 border-zinc-300 flex items-center justify-center text-xs"
                      title="Remover destaque"
                    >
                      <RemoveFormatting className="size-3" />
                    </button>
                    {highlightColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setHighlightColor(color)}
                        className="w-7 h-7 rounded border border-zinc-200 hover:scale-110 transition-transform"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-zinc-200 size-8" : "size-8"}
              title="Negrito (Ctrl+B)"
            >
              <Bold className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-zinc-200 size-8" : "size-8"}
              title="Itálico (Ctrl+I)"
            >
              <Italic className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-zinc-200 size-8" : "size-8"}
              title="Sublinhado (Ctrl+U)"
            >
              <UnderlineIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-zinc-200 size-8" : "size-8"}
              title="Tachado"
            >
              <Strikethrough className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "bg-zinc-200 size-8" : "size-8"}
              title="Subscrito"
            >
              <SubscriptIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "bg-zinc-200 size-8" : "size-8"}
              title="Sobrescrito"
            >
              <SuperscriptIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
              className="size-8"
              title="Limpar formatação"
            >
              <RemoveFormatting className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={editor.isActive({ textAlign: "left" }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Alinhar à esquerda"
            >
              <AlignLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={editor.isActive({ textAlign: "center" }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Centralizar"
            >
              <AlignCenter className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={editor.isActive({ textAlign: "right" }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Alinhar à direita"
            >
              <AlignRight className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={editor.isActive({ textAlign: "justify" }) ? "bg-zinc-200 size-8" : "size-8"}
              title="Justificar"
            >
              <AlignJustify className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-zinc-200 size-8" : "size-8"}
              title="Lista não ordenada"
            >
              <List className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-zinc-200 size-8" : "size-8"}
              title="Lista ordenada"
            >
              <ListOrdered className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={editor.isActive("taskList") ? "bg-zinc-200 size-8" : "size-8"}
              title="Lista de tarefas"
            >
              <CheckSquare className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-zinc-200 size-8" : "size-8"}
              title="Citação"
            >
              <Quote className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "bg-zinc-200 size-8" : "size-8"}
              title="Código inline"
            >
              <Code className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "bg-zinc-200 size-8" : "size-8"}
              title="Bloco de código"
            >
              <span className="text-xs font-mono">{"<>"}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="size-8"
              title="Linha horizontal"
            >
              <Minus className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-0.5 border-r border-zinc-200 pr-2 mr-1">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={editor.isActive("link") ? "bg-zinc-200 size-8" : "size-8"}
                  title="Link"
                >
                  <LinkIcon className="size-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white p-3 rounded-lg shadow-lg border border-zinc-200 z-50 min-w-[240px]" sideOffset={5}>
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="Cole a URL do link..."
                      defaultValue={editor.getAttributes("link").href || ""}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const url = (e.target as HTMLInputElement).value;
                          if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                          }
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                          if (input?.value) {
                            editor.chain().focus().setLink({ href: input.value }).run();
                          }
                        }}
                      >
                        Inserir
                      </Button>
                      {editor.isActive("link") && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => editor.chain().focus().unsetLink().run()}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={addImage}
              className="size-8"
              title="Inserir imagem"
            >
              <ImageIcon className="size-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={insertTable}
              className={editor.isActive("table") ? "bg-zinc-200 size-8" : "size-8"}
              title="Inserir tabela"
            >
              <TableIcon className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="size-8"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="size-8"
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <BubbleMenu
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("table")}
      >
        <div className="flex items-center gap-0.5 bg-white border border-zinc-200 rounded-xl shadow-xl shadow-black/10 p-1.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap"
            title="Coluna antes"
          >
            ← Col
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap"
            title="Coluna depois"
          >
            Col →
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap"
            title="Linha antes"
          >
            ↑ Lin
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap"
            title="Linha depois"
          >
            Lin ↓
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Alternar cabeçalho"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Mesclar / Dividir célula"
          >
            ⊞
          </button>
          <div className="w-px h-4 bg-zinc-200 mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-red-400 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
            title="Remover coluna"
          >
            − Col
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-red-400 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
            title="Remover linha"
          >
            − Lin
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium font-ui uppercase tracking-wide text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remover tabela"
          >
            ✕ Tabela
          </button>
        </div>
      </BubbleMenu>

      <div className="bg-white overflow-y-auto flex-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
