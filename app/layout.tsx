import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { ptBR } from "@clerk/localizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DuoFinance",
  description: "Gerenciamento financeiro simples para casais",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          localization={ptBR}
          appearance={{
            layout: {
              logoImageUrl: "/logo.png",
              logoPlacement: "inside",
            },
            variables: {
              colorPrimary: "#5E2BFF",
              colorBackground: "#FFFFFF",
              colorText: "#0B032D",
              colorInputBackground: "#F9FAFB",
            },
            elements: {
              card: "shadow-xl border border-gray-100 rounded-3xl",
              formButtonPrimary: "rounded-xl font-bold",
              formFieldInput: "rounded-xl border-gray-200",
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
