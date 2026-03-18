"use client";

export const dynamic = 'force-dynamic';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Sparkles, Files, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AdminDashboardPage() {
  const projects = useQuery(api.projects.getProjects);
  const pages = useQuery(api.pages.getPages);
  const aiLeads = useQuery(api.settings.getSetting, { key: "ai_leads" });
  const submissions = useQuery(api.submissions.getSubmissions);

  const activeProjects = projects?.filter(p => p.status === "active").length || 0;
  const activePages = pages?.filter(p => p.status === "published").length || 0;
  const leadsCount = aiLeads?.value?.length || 0;
  const submissionsCount = submissions?.length || 0;

  const stats = [
    { label: "Projetos Ativos", value: activeProjects.toString(), sub: "+2 este mês", icon: FolderKanban, href: "/admin/projects" },
    { label: "Leads da IA", value: leadsCount.toString(), sub: "+14 esta semana", icon: Sparkles, href: "/admin/ai" },
    { label: "Páginas", value: activePages.toString(), sub: "Status: Online", icon: Files, href: "/admin/home" },
    { label: "Submissões", value: submissionsCount.toString(), sub: "Formulários", icon: Layers, href: "/admin/submissions" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 md:space-y-16 py-5 sm:py-8">
      {/* Header Area */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-zinc-900 font-display">
          Visão Geral
        </h2>
        <div className="flex gap-3">
          <div className="h-px flex-1 bg-zinc-100 self-center" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 font-ui px-4">Workspace Jarline</span>
          <div className="h-px flex-1 bg-zinc-100 self-center" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="group">
            <div className="border border-zinc-100 rounded-2xl p-4 sm:p-8 space-y-3 sm:space-y-6 hover:border-primary/20 transition-all duration-500 bg-white hover:shadow-[0_20px_40px_-15px_rgba(88,89,71,0.08)]">
              <div className="flex items-center justify-between">
                <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-zinc-50 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <stat.icon className="size-5 sm:size-6 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <ArrowRight className="size-4 text-zinc-300 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1 hidden sm:block" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-2xl sm:text-3xl font-medium text-zinc-900 tracking-tight font-ui">{stat.value}</p>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 font-ui">{stat.label}</p>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 hidden sm:block">{stat.sub}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Action/Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 pt-2 sm:pt-4">
        <div className="md:col-span-2">
          <div className="p-6 sm:p-12 rounded-2xl bg-primary text-white relative overflow-hidden group">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-medium font-ui leading-tight">Configuração do Ecossistema</h3>
              <p className="text-zinc-400 leading-relaxed text-sm max-w-md">
                Otimize seu fluxo de trabalho gerenciando o conteúdo diretamente. Atualize projetos, refine a comunicação da IA ou altere seções da página inicial com poucos cliques.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/admin/home">
                  <Button variant="secondary" size="lg" className="rounded-lg shadow-xl shadow-black/5">
                    Personalizar Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 sm:p-10 rounded-2xl border border-zinc-100 space-y-6 bg-[#FBFBFA]">
            <h4 className="font-medium text-zinc-900 font-ui text-xl sm:text-2xl">Suporte Técnico</h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Dúvidas sobre o funcionamento do CMS ou deseja implementar novas interações na landing page?
            </p>
            <Link href="mailto:suporte@evoke.agency" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-900 hover:gap-2 transition-all">
              Abrir chamado <ArrowRight className="size-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
