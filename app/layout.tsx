import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bota Preço",
  description: "Faça uma conta completa e descubra quanto faz sentido cobrar."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
