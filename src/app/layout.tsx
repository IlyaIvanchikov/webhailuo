import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Generation App",
  description: "Upload images and generate new ones with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} bg-gray-50 min-h-screen`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <main className="container mx-auto px-4 py-8">
            <Navigation />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
