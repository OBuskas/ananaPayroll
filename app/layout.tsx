import type { Metadata } from "next";
import { Geist, Geist_Mono, Jersey_25 } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/footer";
import Header from "@/components/header";
import InstallPrompt from "@/components/install-pwa";
import RegisterSW from "@/components/register-sw";
import Web3AuthWrapper from "@/context/web3auth";
import CTASection from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Ananá Payroll - Web3 Payroll Automation",
  description:
    "Build trust between employers and employees through transparent smart contracts. Automate payments, earn yield, and revolutionize payroll with blockchain technology.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const jersey25 = Jersey_25({
  variable: "--font-jersey25",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} ${geistMono.className} ${jersey25.variable} antialiased`}
      >
        <Web3AuthWrapper>
          <div className="flex min-h-screen flex-col">
            <Header />

            <main className="container mx-auto flex-1 p-6">{children}</main>
            
            <CTASection />

            <Footer />

            <InstallPrompt />
            <RegisterSW />
          </div>
        </Web3AuthWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}
