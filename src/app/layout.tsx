import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import ConditionalHeader from "@/components/ConditionalHeader";
import CartDrawer from "@/components/cart/CartDrawer";
import DynamicFavicon from "@/components/DynamicFavicon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WTREBOL Innovación - Climatización y Refrigeración",
  description: "Soluciones integrales de climatización, refrigeración y servicios técnicos en Colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicFavicon />
        <AuthProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <ConditionalHeader />
              {children}
              <CartDrawer />
            </CartProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

