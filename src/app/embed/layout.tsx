import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "埋め込みツール | BtoB Marketing Tools",
  description: "STUDIOなどで使えるiframe埋め込み可能なBtoBマーケティングツール",
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
        style={{ 
          background: "transparent",
          minHeight: "auto",
        }}
      >
        {children}
      </body>
    </html>
  );
}

