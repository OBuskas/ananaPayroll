import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import Web3AuthWrapper from "@/context/web3auth";

export const metadata: Metadata = {
  title: "Ananá Payroll - Web3 Payroll Automation",
  description:
    "Build trust between employers and employees through transparent smart contracts. Automate payments, earn yield, and revolutionize payroll with blockchain technology.",
  generator: "v0.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"font-sans antialiased"}>
        <Web3AuthWrapper>{children}</Web3AuthWrapper>
      </body>
    </html>
  );
}
