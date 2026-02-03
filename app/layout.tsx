import type { Metadata } from "next";
import { Inter, Days_One } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const daysOne = Days_One({ 
  weight: "400",
  subsets: ["latin"], 
  variable: "--font-days-one" 
});

export const metadata: Metadata = {
  title: "Tamani Électroménager - Excellence & Innovation depuis 20 ans",
  description: "Votre partenaire de confiance pour l'électroménager de qualité en Algérie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${daysOne.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}