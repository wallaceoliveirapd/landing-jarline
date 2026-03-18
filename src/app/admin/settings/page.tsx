"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { User, Save, Globe, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

export default function SettingsPage() {
  const brandSettings = useQuery(api.settings.getSetting, { key: "brand" });
  const seoSettings = useQuery(api.settings.getSetting, { key: "seo" });
  const setSetting = useMutation(api.settings.setSetting);

  const [brand, setBrand] = useState({
    name: "Jarline Vieira",
    role: "Arquiteta",
    email: "contato@jarlinevieira.com.br",
    phone: "+55 (XX) XXXXX-XXXX",
    address: "Cidade, Estado - Brasil",
    instagram: "@jarlinevieira.arq"
  });

  const [seo, setSeo] = useState({
    title: "Jarline Vieira — Arquitetura e Interiores",
    description: "Projetos e soluções em arquitetura e interiores.",
    ogImage: ""
  });

  useEffect(() => {
    if (brandSettings?.value) {
      setBrand(brandSettings.value);
    }
  }, [brandSettings]);

  useEffect(() => {
    if (seoSettings?.value) {
      setSeo(seoSettings.value);
    }
  }, [seoSettings]);

  const handleSave = async () => {
    try {
      await setSetting({ key: "brand", value: brand });
      await setSetting({ key: "seo", value: seo });
      toast.success("Informações atualizadas!");
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 py-8 pb-32">
      <div className="flex flex-col gap-4 border-b border-zinc-100 pb-12">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-ui">Configurações Gerais</span>
        </div>
        <h2 className="text-4xl font-medium tracking-tight text-zinc-900 font-display">Perfil da Marca</h2>
        <p className="text-zinc-500 text-sm max-w-md">Gerencie as informações institucionais, dados de contato e presença digital.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <div className="bg-primary p-10 text-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xl">
              <User className="size-7" />
            </div>
            <div>
              <h3 className="text-xl font-medium font-ui leading-tight">Identidade Institucional</h3>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-ui">Dados globais do ecossistema</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nome Oficial</Label>
              <Input
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cargo / especialidade</Label>
              <Input
                value={brand.role}
                onChange={(e) => setBrand({ ...brand, role: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">E-mail Corporativo</Label>
              <Input
                value={brand.email}
                onChange={(e) => setBrand({ ...brand, email: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Telefone / WhatsApp</Label>
              <Input
                value={brand.phone}
                onChange={(e) => setBrand({ ...brand, phone: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Endereço de Atendimento</Label>
              <Input
                value={brand.address}
                onChange={(e) => setBrand({ ...brand, address: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Instagram Handle</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-300" />
                <Input
                  value={brand.instagram}
                  onChange={(e) => setBrand({ ...brand, instagram: e.target.value })}
                  className="bg-zinc-50 border-zinc-100 pl-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
        <div className="bg-primary p-10 text-white flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xl">
              <Search className="size-7" />
            </div>
            <div>
              <h3 className="text-xl font-medium font-ui leading-tight">SEO Global</h3>
              <p className="text-zinc-400 text-[10px] uppercase tracking-widest mt-1 font-ui">Mecanismos de busca e compartilhamento</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Meta Title</Label>
              <Input
                value={seo.title}
                onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                className="bg-zinc-50 border-zinc-100"
              />
              <p className="text-xs text-zinc-400">Idealmente entre 50 e 60 caracteres.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Meta Description</Label>
              <Textarea
                value={seo.description}
                onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                className="bg-zinc-50 border-zinc-100 min-h-[100px]"
              />
              <p className="text-xs text-zinc-400">Idealmente entre 150 e 160 caracteres.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Imagem de Compartilhamento (Open Graph)</Label>
              <div className="max-w-2xl">
                <ImageUpload
                  value={seo.ogImage}
                  onChange={(url) => setSeo({ ...seo, ogImage: url })}
                  label="Fazer upload de imagem OG"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-50">
            <Button variant="premium" size="xl" onClick={handleSave} className="gap-3">
              <Save className="size-5" /> Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
