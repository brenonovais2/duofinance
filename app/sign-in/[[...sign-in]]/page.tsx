import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#F2F5F7]">
      {/* Lado esquerdo (branding) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#0B032D] p-12 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#5E2BFF]/20 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#FDB833]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Image src="/logo.png" alt="DuoFinance Logo" width={200} height={200} className="mb-10 drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-white mb-6 text-center tracking-tight">
            Bem-vindo ao <span className="text-[#FDB833]">DuoFinance</span>
          </h1>
          <p className="text-lg text-[#F2F5F7]/80 text-center max-w-md leading-relaxed">
            Gerencie suas finanças e divida as contas do casal de forma simples, transparente e sem estresse.
          </p>
        </div>
      </div>

      {/* Lado direito (formulário de login) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div className="lg:hidden mb-8">
          <Image src="/logo.png" alt="DuoFinance Logo" width={150} height={150} />
        </div>
        <SignIn />
      </div>
    </div>
  );
}
