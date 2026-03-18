"use client";

export const dynamic = 'force-dynamic';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  User,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function UsersPage() {
  const users = useQuery(api.auth.listUsers);
  const deleteUser = useMutation(api.auth.deleteUser);
  const registerUser = useMutation(api.auth.registerUser);
  const updateUser = useMutation(api.auth.updateUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    role: "editor",
  });

  const handleDelete = async (userId: any) => {
    if (confirm("Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.")) {
      try {
        await deleteUser({ userId });
        toast.success("Usuário removido com sucesso.");
      } catch (error) {
        toast.error("Houve um erro ao processar a exclusão.");
      }
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedUser.name || !editedUser.email) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      await updateUser({
        userId: editingUser._id,
        name: editedUser.name,
        email: editedUser.email,
        role: editedUser.role,
      });
      toast.success("Usuário atualizado com sucesso.");
      setEditingUser(null);
    } catch (error) {
      toast.error("Houve um erro ao atualizar o usuário.");
    }
  };

  const openEditUser = (user: any) => {
    setEditingUser(user);
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role || "editor",
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      // Create a super basic hash to match frontend side hashing in use-auth
      // A typical user password hash process happens client side
      const crypto = await import("crypto");
      const passwordHash = crypto.createHash("sha256").update(newUser.password).digest("hex");

      await registerUser({
        name: newUser.name,
        email: newUser.email,
        passwordHash,
        role: newUser.role,
      });

      toast.success("Usuário criado com sucesso!");
      setIsAddingUser(false);
      setNewUser({ name: "", email: "", password: "", role: "editor" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao tentar criar novo usuário");
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 py-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 font-ui">Gestão de Equipe</span>
          </div>
          <h2 className="text-4xl font-medium tracking-tight text-zinc-900 font-display">Usuários do Sistema</h2>
          <p className="text-zinc-500 text-sm max-w-md">Adicione ou remova permissões de novos editores ou administradores.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="premium" size="lg" onClick={() => setIsAddingUser(true)}>
            <Plus className="size-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-10 bg-zinc-50 border-none h-12 text-sm font-ui"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers === undefined ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium font-ui uppercase tracking-widest">Carregando lista...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-zinc-50/50 rounded-3xl border border-zinc-100/50 border-dashed">
          <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-black/5">
            <Users className="size-8 text-zinc-300" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-ui font-medium text-zinc-900">Nenhum usuário encontrado</h3>
            <p className="text-zinc-500 text-sm">Não localizamos nenhum usuário cadastrado no momento.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-black/5 overflow-hidden font-ui">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="border-zinc-100 hover:bg-transparent">
                <TableHead className="font-medium text-[10px] tracking-widest uppercase text-zinc-500 h-14 px-8">Nome / E-mail</TableHead>
                <TableHead className="font-medium text-[10px] tracking-widest uppercase text-zinc-500 h-14 px-8">Tipo de Conta</TableHead>
                <TableHead className="font-medium text-[10px] tracking-widest uppercase text-zinc-500 h-14 px-8 text-right">Cadastrado Em</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: any) => (
                <TableRow key={user._id} className="border-zinc-100/50 group hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {user.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2) || "U"}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm text-zinc-900">{user.name}</span>
                        <span className="text-xs text-zinc-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8">
                    {user.role === "admin" ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary gap-1.5 px-3 h-7 rounded-lg text-[10px] font-bold tracking-widest uppercase">
                        <ShieldCheck className="size-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700 gap-1.5 px-3 h-7 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-none border-none">
                        <User className="size-3" />
                        Editor
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-8 text-right text-xs text-zinc-400 font-medium tracking-wide">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="px-8 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditUser(user)}
                        className="size-10 rounded-xl text-zinc-400 hover:text-primary hover:bg-primary/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(user._id)}
                        className="size-10 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Sheet to ADD Users */}
      <Sheet open={isAddingUser} onOpenChange={setIsAddingUser}>
        <SheetContent side="right" className="w-[450px] sm:max-w-[450px] p-0 border-l border-zinc-100 bg-white overflow-hidden flex flex-col font-ui shadow-2xl">
          <SheetHeader className="p-8 border-b border-zinc-100 bg-zinc-50/50 text-left">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Users className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-ui font-medium text-zinc-900">Novo Usuário</SheetTitle>
                <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium mt-1">Convidar e distribuir acessos</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white to-zinc-50/50">
            <form id="add-user-form" onSubmit={handleAddUser} className="space-y-8">
              
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Nome Completo</Label>
                <Input
                  className="bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm focus:border-primary shadow-sm"
                  placeholder="Nome do membro"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">E-mail Profissional</Label>
                <Input
                  type="email"
                  className="bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm focus:border-primary shadow-sm"
                  placeholder="email@jarlinevieira.com.br"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Permissão Base</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(val) => setNewUser({...newUser, role: val || "editor"})}
                >
                  <SelectTrigger className="w-full bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm font-medium font-ui focus:ring-0 shadow-sm focus:border-primary">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-100 font-ui p-2 shadow-xl shadow-black/5">
                    <SelectItem value="editor" className="text-sm py-3 px-4 rounded-xl mb-1 last:mb-0 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <User className="size-4 text-zinc-400" />
                        <div>
                          <p className="font-semibold text-zinc-900">Editor</p>
                          <p className="text-[10px] text-zinc-400">Gerencia conteúdos do site</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin" className="text-sm py-3 px-4 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold text-zinc-900">Administrador</p>
                          <p className="text-[10px] text-zinc-400">Acesso total ao CMS</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-100">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 flex items-center justify-between">
                  Senha Provisória
                </Label>
                <Input
                  type="password"
                  required
                  className="bg-zinc-100/50 border-zinc-200 rounded-xl h-14 px-6 text-sm focus:border-primary shadow-sm"
                  placeholder="Definir uma senha inicial..."
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <p className="text-[10px] text-zinc-400">Lembre-se de anotar para enviar de forma segura ao usuário.</p>
              </div>

            </form>
          </div>

          <div className="p-8 border-t border-zinc-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setIsAddingUser(false)}
              className="h-14 rounded-xl font-bold uppercase tracking-widest text-[10px] border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="add-user-form"
              variant="premium"
              size="lg"
              className="h-14 rounded-xl"
            >
              Concluir Inserção
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet to EDIT Users */}
      <Sheet open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <SheetContent side="right" className="w-[450px] sm:max-w-[450px] p-0 border-l border-zinc-100 bg-white overflow-hidden flex flex-col font-ui shadow-2xl">
          <SheetHeader className="p-8 border-b border-zinc-100 bg-zinc-50/50 text-left">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-ui font-medium text-zinc-900">Editar Usuário</SheetTitle>
                <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium mt-1">Atualizar informações</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white to-zinc-50/50">
            <form id="edit-user-form" onSubmit={handleUpdateUser} className="space-y-8">
              
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Nome Completo</Label>
                <Input
                  className="bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm focus:border-primary shadow-sm"
                  placeholder="Nome do membro"
                  required
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">E-mail Profissional</Label>
                <Input
                  type="email"
                  className="bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm focus:border-primary shadow-sm"
                  placeholder="email@jarlinevieira.com.br"
                  required
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Permissão</Label>
                <Select
                  value={editedUser.role}
                  onValueChange={(val) => setEditedUser({...editedUser, role: val || "editor"})}
                >
                  <SelectTrigger className="w-full bg-white border-zinc-200 rounded-xl h-14 px-6 text-sm font-medium font-ui focus:ring-0 shadow-sm focus:border-primary">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-100 font-ui p-2 shadow-xl shadow-black/5">
                    <SelectItem value="editor" className="text-sm py-3 px-4 rounded-xl mb-1 last:mb-0 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <User className="size-4 text-zinc-400" />
                        <div>
                          <p className="font-semibold text-zinc-900">Editor</p>
                          <p className="text-[10px] text-zinc-400">Gerencia conteúdos do site</p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin" className="text-sm py-3 px-4 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="size-4 text-primary" />
                        <div>
                          <p className="font-semibold text-zinc-900">Administrador</p>
                          <p className="text-[10px] text-zinc-400">Acesso total ao CMS</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </form>
          </div>

          <div className="p-8 border-t border-zinc-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setEditingUser(null)}
              className="h-14 rounded-xl font-bold uppercase tracking-widest text-[10px] border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="edit-user-form"
              variant="premium"
              size="lg"
              className="h-14 rounded-xl"
            >
              Salvar Alterações
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}