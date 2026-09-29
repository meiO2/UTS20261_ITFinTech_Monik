  import type { Metadata, Viewport } from "next";
  import type { ReactNode } from "react";
  import { Quicksand, Nunito_Sans } from "next/font/google";
  import "./globals.css";
  import { CartProvider } from "../context/CartContext";

  // Quicksand is a rounded, monoline face close to the Gupa wordmark.
  const display = Quicksand({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-display",
  });

  const body = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-body",
  });

  export const metadata: Metadata = {
    title: "Gupa Coffee | Order at your table",
    description: "Order food and drinks from your table at Gupa Coffee.",
  };

  export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#ffffff",
  };

  export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      <html lang="en" className={`${display.variable} ${body.variable}`}>
        <body>
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    );
  }