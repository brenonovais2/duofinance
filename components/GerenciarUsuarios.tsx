"use client";

import { useState } from "react";
import { addUsuario, deleteUsuario } from "@/app/actions/usuarios";
import { Trash2, UserPlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GerenciarUsuarios({ usuarios }: { usuarios: { id: string, nome: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-gray-500 hover:bg-gray-50 hover:text-[#0B032D] w-full"
        title="Gestão de Pagantes"
      >
        <Users className="w-5 h-5" />
        <span className="hidden md:inline">Gestão de Pagantes</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#0B032D]">Gestão de Pagantes</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
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
                        className="text-red-500 opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-md"
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
          </div>
        </div>
      )}
    </>
  );
}
