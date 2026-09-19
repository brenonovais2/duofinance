import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F2F5F7] justify-center items-center p-6 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#5E2BFF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FDB833]/10 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-[#0B032D] mb-3 text-center tracking-tight">
          Bem-vindo ao <span className="text-[#5E2BFF]">DuoFinance</span>
        </h1>
        <p className="text-base text-gray-500 text-center leading-relaxed">
          Gerencie suas finanças e divida as contas do casal de forma simples, transparente e sem estresse.
        </p>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <SignIn />
      </div>
    </div>
  );
}
