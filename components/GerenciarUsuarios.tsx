"use client";

import { useState } from "react";

import { addUsuario, deleteUsuario } from "@/app/actions/usuarios";
import { Trash2, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GerenciarUsuarios({ usuarios }: { usuarios: { id: string, nome: string }[] }) {
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("nome", nome);
      await addUsuario(formData);
      setNome("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário? Os lançamentos vinculados a ele podem ser afetados!")) return;
    
    try {
      setIsLoading(true);
      await deleteUsuario(id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao remover usuário. Ele pode estar vinculado a despesas existentes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-2 text-[#0B032D]">Gestão de Pagantes</h2>
      <p className="text-sm text-gray-500 mb-6">Cadastre as pessoas que dividem as despesas da casa.</p>
      
      <div className="space-y-3 mb-6">
        {usuarios.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">Nenhum pagante cadastrado.</p>
        ) : (
          usuarios.map(u => (
            <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group border border-gray-100">
              <span className="font-medium text-[#0B032D]">{u.nome}</span>
              <button 
                onClick={() => handleDelete(u.id)}
                disabled={isLoading}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-md"
                title="Remover Pagante"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do pagante..." 
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#5E2BFF] focus:border-[#5E2BFF] block w-full p-2.5 outline-none"
          disabled={isLoading}
          required
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#5E2BFF] text-white p-2.5 rounded-xl hover:bg-[#4a22cc] transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
