"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function hashPassword(password: string): string {
  try {
    if (!password || typeof password !== "string") {
      return "";
    }
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(password).digest("hex");
  } catch (error) {
    console.error("Hash error:", error);
    return "";
  }
}

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const passwordHash = hashPassword(password);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordHash }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      toast.success("Login realizado com sucesso!");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      const passwordHash = hashPassword("Edc201706@");
      const res = await fetch("/api/auth/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "wallaceoliveiraux@gmail.com",
          passwordHash,
          name: "Wallace Andrade",
          role: "admin"
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Usuário criado!");
      } else {
        toast.error(data.error || "Erro");
      }
    } catch (error) {
      toast.error("Erro ao criar seed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-medium text-zinc-900  ">
              Jarline Vieira
            </h1>
            <p className="text-sm text-zinc-500 mt-2">Painel Administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white font-ui"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white font-ui"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="premium"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <a href="/" className="block text-xs text-zinc-400 hover:text-zinc-600">
              ← Voltar para o site
            </a>
            <button
              type="button"
              onClick={handleSeed}
              className="text-[10px] text-zinc-300 hover:text-zinc-500 underline"
            >
              Criar usuário seed
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}